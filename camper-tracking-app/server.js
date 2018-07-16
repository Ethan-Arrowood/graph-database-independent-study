const fastify = require("fastify")({ logger: true });
const neo4j = require("neo4j-driver").v1;
const driver = neo4j.driver(
  "bolt://localhost",
  neo4j.auth.basic("neo4j", "abc123!")
);
const session = driver.session();

fastify.get("/", async (request, reply) => {
  return { hello: "world" };
});

fastify.post("/create-camper", async (request, reply) => {
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

fastify.addHook("onClose", (instance, done) => {
  session.close();
  driver.close();
  done();
});

const start = async () => {
  try {
    await fastify.listen(3001);
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
