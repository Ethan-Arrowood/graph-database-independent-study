# Week 3

This week focuses more on practicing building models and starting to familiarize myself with Cypher. There is some additional reading in a blog post on representing facts as nodes. This process makes for clearer models and is used in one of my examples.

## Key Attributes of Cypher

Created by Neo4j and Andres Taylor. Specifically for dealing with graph data structures in Neo4j. Has 4 unique attributes not found in any other query language.

### Delarative

The user declares what they want in the query. Instead of an _imperative_ language where one would tell the database how to retrieve the data, Cypher just wants to know what the user wants. This is similar to the **Structured Query Language**.

### Expressive

Cypher syntax is very similar to that of ASCII art. Due to this it is very easy to read Cypher queries and understand what they are retrieving. 

### Pattern Matching

Cypher is a pattern matching language. Similar to the previous point on expressivness, this aspect allows the user to be straightforward in their queries. Many beginner users appreciate this characteristic.

### Idempotent

When the user operates a function (executes a query) changes in the data should only happen on the first execution. Multiple executions of the same function over the same data should have no effect. Cypher and Neo4j implement this _functional language_ aspect.

## Key operative words in Cypher

This table is copied from the book. Following it is a link to the official Cypher Cheatsheat

| Keyword | Function | Example |
| ------- | -------- | ------- |
| MATCH | Describes a pattern that the database should math. Always starts queries | `MATCH (me:Person-[:KNOWS]->(friend)` |
| WHERE | Filters results that are found in the match for specific criteria | `WHERE me.name = "Ethan" AND me.age > 18` |
| RETURN | Returns results; paths, nodes, relationships, or properties | `RETURN me.name, collect(friend), count(*) as friends` |
| WITH | Passes results from one query part to the next. Similar to RETURN but instead of including data in the result set, it passes data to the follow part of the query. Transforms and aggregates results. Separates READ and UPDATE statements | |
| ORDER BY SKIP LIMIT | Sorts and paginates results | `ORDER BY friends DESC SKIP 10 LIMIT 10` |
| CREATE | Creates nodes and relationships with properties | `CREATE (p:Person), (p)-[:KNOWS {since:2010}]-> (me:Person{name:"Ethan"})` |
| CREATE UNIQUE | Creates structures only if they do not yet exist | |
| MERGE | Matches or creates semantics by using indexes and locks. Specify different operations in case of a MATCH (part of pattern already existed) or on CREATE (pattern did not yet exist) | `MERGE (me:Person {name:"Ethan"}) ON MATCH me SET me.accessed = timestamp() ON CREATE me SET me.age = 42` |
| SET, REMOVE | Updates properties and labels on nodes and/or relationships | `SET me.age = 42, SET me.Employee, REMOVE me.first_name, REMOVE me:Contractor` |
| DELETE | Deletes nodes and relationships | `MATCH (me), OPTIONAL MATCH (me)-[r]-() DELETE me, r` |

Here is an example of using Cypher to model a diagram:

![Example diagram](/images/week3/diagram.png)
```cypher
MATCH (p:Person {name:"Rik"})-[r:OWNS]->(d:Device {brand:"LIFX"})
RETURN a, r, b;
```

You can find the ref card [here](https://neo4j.com/docs/cypher-refcard/current/)

## Facts as Nodes blog article

> When two or more domain entities interact for a period of time, a fact emerges. We represent a fact as a separate node with connections to each of the entities engaged in that fact. Modeling an action in terms of its product—that is, in terms of the thing that results from the action—produces a similar structure: an intermediate node that represents the outcome of an interaction between two or more entities. 

In a graph database the power is inside the relationships; however, sometimes those relationships can have a lot of meta data. So, by extrapolating a relationship into a node itself one can decrease the complexity of their database. Furthermore, when a ternary relationship exists, it is best to use a _fact_ node to relate the 3 entities. See the following example where I apply this methodology to a model I'm working on.

![Figure 1](/images/week3/e1.png)

The above image is modeling a summer camp activity manager. **Campers** can complete **tests** for rewards. Keeping a digital log of all _completed_ tests is important as campers retain their progress summer to summer. In this basic example there are 2 camper nodes and a test node. In a full data model there would be approximately 200 test nodes and thousands of camper nodes. 

Consider the following query:
```cypher
MATCH (c:Camper)-[r:COMPLETED]->(t:Test {name: 'Fire building'})
WHERE r.when < 1325376000
RETURN c, r
```
In a full set example the database would need to check every single `COMPLETED` relationship coming from the `Fire Building` test node. This would require a dramatic amount of indexing.

I can reduce the complexity here by adding two new labels: **Summer** and **CompletedTest**. This transforms the model like so:

![Figure 2](/images/week3/e2.png)

This may seem more complex, but now the model is a lot more flexible to answering various questions. I can rewrite the Cypher query to the following:

```cypher
MATCH (c:Camper)-[:COMPLETED]->(completedTest)-[:TEST]->(t:TEST {name: 'Fire building'}),
      (completedTest)-[:WHEN]->(summer)
WHERE summer.year < 2014
RETURN c.name as camperName, completedTest.withCounselor as counselorName
```

Now, even though the cypher query is slightly more complex, it can tell us so much more about the data. This new model also allows for the expansion to other nodes and relationships. For example I can add an `ATTENDED_BY` relationship between the Summer and Camper nodes. 

I've completed a more verbose model. There is still some additional properties I'd like to add, but this is a good start to the model.

![Full Model](/images/week3/fullModel.png) 