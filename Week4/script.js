const neo4j = require('neo4j-driver').v1;
const data = require('./data.json');
const queries = require('./queries.json');

const driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "Thor@2013"));
const session = driver.session();

async function asyncForEach(array, callback) {
  for (let i = 0; i < array.length; i++)
    await callback(array[i], i, array)
}

const runQueries = async () => {
  await asyncForEach(queries, async ({query, parameters}) => {
    try {
      const result = await session.writeTransaction(tx => tx.run( query, parameters ))
      console.log(result.records);
    } catch (err) {
      console.log(err);
    }
  })
  session.close();
  driver.close();
}

runQueries();