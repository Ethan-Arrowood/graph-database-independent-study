// Create camper example
CREATE (c:Camper {name: 'Ethan'})
WITH c
UNWIND [2000, 2001, 2002] AS summer
MERGE (c)-[:ATTENDED]->(s:Summer {year: summer})
RETURN c, s