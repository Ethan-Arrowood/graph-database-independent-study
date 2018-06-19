UNWIND $data AS data 
MERGE (d:Department {name: data.department}) 
WITH data, d
UNWIND data.tests as rt 
MERGE (r:Rank {name: rt.rank}),
      (tc:TestCollection {name: d.name + r.name}), 
      (tc)-[:DEPARTMENT]->(d), 
      (tc)-[:RANK]->(r) 
WITH d, rt, tc 
UNWIND rt.tests as test 
MERGE (t:Test {name: test}), 
      (t)-[:DEPARTMENT]->(d), 
      (tc)-[:TEST]->(t)


