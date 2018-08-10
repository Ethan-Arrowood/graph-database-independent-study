const fastify = require("fastify")({ logger: { prettyPrint: true } });
const neo4j = require("neo4j-driver").v1;
const driver = neo4j.driver(
  "bolt://localhost",
  neo4j.auth.basic("neo4j", "abc123!"),
  {
    disableLosslessIntegers: true
  }
);

fastify.get("/", async (request, reply) => {
  return { hello: "world" };
});

fastify.post("/campers", async (request, reply) => {
  const session = request["n4jSession"];

  const query = `
  CREATE (c:Camper {name: $name})
  WITH c
  UNWIND $sac as summer
  MERGE (c)-[:ATTENDED]->(s:Summer {year: summer.year})
  RETURN c.name as name, collect(s.year) as sac
  `;

  const params = {
    name: request.body.name,
    sac: request.body.sac
  };

  try {
    let res = await session.writeTransaction(tx => tx.run(query, params));

    return {
      name: res.records[0].get("name"),
      sac: res.records[0].get("sac")
    };
  } catch (err) {
    return err;
  }
});

fastify.get("/campers", async (request, reply) => {
  const session = request["n4jSession"];

  let query;
  if (request.query.sac) {
    query = "MATCH (c:Camper)-[:ATTENDED]->(s:Summer)";
    if (request.query.search)
      query += `WHERE c.name =~ '(?i).*${request.query.search}.*'`; //sanitize
    query +=
      "RETURN {name: c.name, sac: collect(s.year)} as campers\nORDER BY campers.name";
  } else query = "MATCH (c:Camper)\nRETURN collect(c.name) as names";

  try {
    let res = await session.readTransaction(tx => tx.run(query));
    const campers = request.query.sac
      ? res.records.map(record => record.get(0))
      : res.records[0].get("names");
    return { campers };
  } catch (err) {
    return err;
  }
});

fastify.post("/check-off-tests", async (request, reply) => {
  const session = request["n4jSession"];
  const { camperID, department, rank, tests } = request.body;

  const query = `
    MATCH (camper:Camper)
    WHERE ID(camper) = ${camperID}
    MATCH (tests:Test)<-[:TEST]-(:TestCollection {name:${department + rank}})
    WHERE tests.name IN ${tests}
    MERGE (camper)-[c:COMPLETED]->(tests)
    RETURN camper.name as Name, size(collect(tests)) as TestsCompleted 
  `;

  let res = await session.writeTransaction(tx => tx.run(query));

  return res.records.get(0);
});

fastify.addHook("onRequest", (req, res, next) => {
  try {
    if (fastify.hasRequestDecorator("n4jSession")) {
      req.n4jSession = driver.session();
    } else {
      fastify.decorateRequest("n4jSession", driver.session());
    }
  } catch (err) {
    fastify.log.error(err);
  }
  next();
});
fastify.addHook("onSend", (req, res, payload, next) => {
  try {
    req.n4jSession.close();
  } catch (err) {
    fastify.log.error(err);
  }
  next();
});
fastify.addHook("onClose", (instance, done) => {
  driver.close();
  done();
});

const start = async () => {
  try {
    await fastify.listen(3001);
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
    fastify.log.info(`\n ${fastify.printRoutes()}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
