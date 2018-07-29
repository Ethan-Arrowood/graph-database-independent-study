const fastify = require("fastify")({ logger: { prettyPrint: true } });
const neo4j = require("neo4j-driver").v1;
const driver = neo4j.driver(
  "bolt://localhost",
  neo4j.auth.basic("neo4j", "abc123!"),
  { disableLosslessIntegers: true }
);

fastify.get("/", async (request, reply) => {
  return { hello: "world" };
});

fastify.post("/campers", async (request, reply) => {
  const session = fastify["neo4j-session"];
  const { query, params } = request.body;
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

  try {
    let res = await session.readTransaction(tx =>
      tx.run(
        `MATCH (c:Camper)-[:ATTENDED]->(s:Summer)
          RETURN {name: c.name, soc: collect(s.year)}`
      )
    );
    const campers = res.records.map(record => record.get(0));
    return {
      campers
    };
  } catch (err) {
    return err;
  }
});

fastify.addHook("onRequest", (req, res, next) => {
  try {
    fastify.decorateRequest("n4jSession", driver.session());
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
