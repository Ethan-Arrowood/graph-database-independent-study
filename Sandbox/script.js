const neo4j = require("neo4j-driver").v1;
const data = require("./data.json");
const queries = require("./queries.json");

const driver = neo4j.driver(
  "bolt://localhost",
  neo4j.auth.basic("neo4j", "Thor@2013")
);
const session = driver.session();

async function asyncForEach(array, callback) {
  for (let i = 0; i < array.length; i++) await callback(array[i], i, array);
}

// Don't run this but its good to keep as reference
// const runQueries = async () => {
//   await asyncForEach(queries, async ({query, parameters}) => {
//     try {
//       const result = await session.writeTransaction(tx => tx.run( query, parameters ))
//       console.log(result.records);
//     } catch (err) {
//       console.log(err);
//     }
//   })
//   session.close();
//   driver.close();
// }

// One query does it all
const query = `
UNWIND $data AS data
CREATE (d:Department {name: data.department})
WITH data, d
UNWIND data.tests as rt
MERGE (r:Rank {name: rt.rank})
CREATE (tc:TestCollection {name: d.name + r.name}),
      (tc)-[:DEPARTMENT]->(d),
      (tc)-[:RANK]->(r)
WITH d, rt, tc
UNWIND rt.tests as test
CREATE (t:Test {name: test}),
      (tc)-[:TEST]->(t)
`;
/* 
Iterate over each department entry 
Create a department node with a name property
Pipe the data and department node
Iterate over each rank entry
Merge this entry with existing rank entries
  - So on the first department iteration, all four ranks are created because they don't exist
    But then on every iteration after that they are matched to the 'r' variable so other 
    test collections can set up relationships to it
Create a new test collection with a composite name of department and rank,
  create a DEPARTMENT relationship from the TestCollection and Department
  create a RANK relationship from the TestCollection and Rank
Pipe department, rank entry, and test collection
Iterate over each test in the rank entry
Create a new test node with a name property and create the TEST relationship from the TestCollection and Test
*/

const query_data = require("./query_data.json");

session
  .writeTransaction(tx => tx.run(query, { data: query_data }))
  .then(result => console.log(result.records))
  .catch(err => console.error(err))
  .finally(() => {
    session.close();
    driver.close();
  });
