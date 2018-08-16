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

  const params = {
    name: request.body.name,
    sac: request.body.sac
  };

  const { name, sac } = request.body;

  const query = `
  CREATE (c:Camper {name: '${name}'})
  WITH c
  UNWIND [${sac}] as summer
  MATCH (s:Summer {year: summer})
  WITH c, s
  MERGE (c)-[:ATTENDED]->(s)
  RETURN c.name as name, collect(s.year) as sac
  `;

  console.log(query);

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

  if (!request.query.sac && !request.query.search && request.query.tests) {
    query = `
      MATCH (c:Camper)
      OPTIONAL MATCH (c)-[:COMPLETED]->(t:Test)
      WITH c, collect(t.name) as tests
      RETURN {name: c.name, id: ID(c), tests: tests } as campers
      ORDER BY campers.name
    `;
  } else if (
    !request.query.sac &&
    request.query.search &&
    request.query.tests
  ) {
    query = `
      MATCH (c:Camper)
      WHERE c.name =~ '(?i).*${request.query.search.toString()}.*'
      OPTIONAL MATCH (c)-[:COMPLETED]->(t:Test)
      WITH c, collect(t) as tests
      RETURN {name: c.name, id: ID(c), tests: tests }
    `;
  } else if (
    request.query.sac &&
    request.query.search &&
    !request.query.tests
  ) {
    query = `
      MATCH (c:Camper)-[:ATTENDED]->(s:Summer)
      WHERE c.name =~ '(?i).*${request.query.search.toString()}.*'
      RETURN {name: c.name, sac: collect(s.year), id: ID(c)}
    `;
  } else if (
    request.query.sac &&
    !request.query.search &&
    !request.query.tests
  ) {
    query = `
      MATCH (c:Camper)-[:ATTENDED]->(s:Summer)
      RETURN {name: c.name, sac: collect(s.year), id: ID(c)} as campers
      ORDER BY campers.name
    `;
  } else if (
    !request.query.sac &&
    request.query.search &&
    !request.query.tests
  ) {
    query = `
      MATCH (c:Camper)
      WHERE c.name =~ '(?i).*${request.query.search.toString()}.*'
      RETURN {name: c.name, id: ID(c)} as campers
    `;
  } else if (
    !request.query.sac &&
    !request.query.search &&
    !request.query.tests
  ) {
    query = `
      MATCH (c:Camper)
      RETURN {name: c.name, id: ID(c)} as campers
      ORDER BY campers.name
    `;
  }

  console.log(query);

  try {
    let res = await session.readTransaction(tx => tx.run(query));
    return { campers: res.records.map(record => record.get(0)) };
  } catch (err) {
    return err;
  }
});

fastify.get("/tests", async (request, reply) => {
  const session = request["n4jSession"];
  const { department, rank } = request.query;

  const query = `
    MATCH (:TestCollection {name: '${department.concat(
      rank
    )}'})-[:TEST]->(t:Test)
    RETURN collect(t.name) as tests
  `;

  let res = await session.readTransaction(tx => tx.run(query));

  return res.records[0].get("tests");
});

fastify.post("/check-off-tests", async (request, reply) => {
  const session = request["n4jSession"];
  const {
    camperID,
    department,
    rank,
    completeTests,
    incompleteTests
  } = request.body;
  const testCollection = department + rank;

  console.log(completeTests);
  console.log(typeof completeTests);

  const query1 = `
    MATCH (camper:Camper)
    WHERE ID(camper) = ${camperID}
    MATCH (tests:Test)<-[:TEST]-(:TestCollection {name:'${testCollection}'})
    WHERE tests.name IN ${JSON.stringify(completeTests)}
    MERGE (camper)-[c:COMPLETED]->(tests)
    RETURN camper.name as Name, size(collect(tests)) as TestsCompleted 
  `;

  const query2 = `
    MATCH (camper:Camper)
    WHERE ID(camper) = ${camperID}
    MATCH (tests:Test)<-[:TEST]-(:TestCollection {name:'${testCollection}'})
    WHERE tests.name IN ${JSON.stringify(incompleteTests)}
    MATCH (camper)-[c:COMPLETED]->(tests)
    DELETE c
    RETURN camper
  `;

  try {
    let res1 = await session.writeTransaction(tx => tx.run(query1));
    let res2 = await session.writeTransaction(tx => tx.run(query2));
    return { results: [res1, res2] };
  } catch (err) {
    return err;
  }
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
