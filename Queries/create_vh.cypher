// Create departments, tests, and ranks
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