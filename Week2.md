# Week 2 Notes 👨‍🔬

## Graph Database Chapter 3 Data Modeling with Graphs

Use models to bring a _thing_ into a space where it can structured and manipulated. Of course one cannot truly represent the natural world in the way that it "really is" but with abstractions and simplifications one may come very close and can produce a very useful model.

Graphs have a close affinity between logical and physical models. Think about how a graph model is 'whiteboard friendly'. Humans already use graphical structures to communicate ideas and processes; this makes modeling with graph databases significantly easier.

### Cypher
An expressive graph database query language. There are other QL options such as SPARQL and Gremlin.

Cypher is designed to be easy to read and understood by all parties; developers, database professionals, and even business stakeholders. It matches the manor in which one already describes graphs. 

![simple graph pattern diagram](/images/week2/graphDiagram.png)

Equivalent ASCII art representation using Cypher:

```cypher
(emil)<-[:KNOWS]-(jim)-[:KNOWS]->(ian)-[:KNOWS]->(emil)
```

This pattern describes a _path_ from _node_ **jim** to two other _nodes_ **ian** and **emil**. It also connects nodes **ian** and **emil** together. This example shows how easy it is to represent graph diagrams using Cypher.

In order to bind a Cypher query to actual data; one must specify property values and node labels.

```cypher
(emil:Person {name:'Emil'})
  <-[:KNOWS]-(jim:Person {name:'Jim'})
  -[:KNOWS]->(ian:Person {name:'Ian'})
  -[:KNOWs]->(emil)
```

Each node is bound to its identifies using the `name` _property_ and `Person` _label_. Binding data like this is common practice in Cypher.

Like most query languages, Cypher has _clauses_ as well. Simplest example being `MATCH` followed by a `RETURN`. Here is how to find the mutual friends of a user named `Jim`:

```cypher
MATCH (a:Person {name:'Jim'})-[:KNOWS]->(b)-[:KNOWS]->(c),
      (a)-[:KNOWS]->(c)
RETURN b, c
```

### MATCH

MATCH is considered the heart of most Cypher queries embodying the _specification by example_. Using dashes `-` and greater/less-than signs `< >` to draw relationships. The `<` and `>` signs indicate relationship direction. Between dashes are square brackets `[ ]` and the relationship name prefixed by a `:` colon. Node and relationship property key-value pairs are specified within `{ }` curly braces using a JavaScrip Object notation.

The previous example displays a very common `mutual friend` query; here is how it looks without the `Jim` identifier: `(a)-[:KNOWS]->(b)-[:KNOWS]->(c), (a)-[:KNOWS]->(c)`.

In a larger dataset this pattern could happen thousands of times. In order to localize the query and return only what we want it to return we can anchor an identifier to one of the anchor points `a, b, c`. This can be accomplished inline like it was in the example, or one may use the `WHERE` clause.

```cypher
MATCH (a:Person)-[:KNOWS]->(b)-[:KNOWS]->(c), (a)-[:KNOWS]->(c)
WHERE a.name = 'Jim'
RETURN b, c
```

### RETURN

This clause specifies what to be returned to the client. It can return nodes, relationships, or properties. In the previous example, every matching node is lazily bound to the anchor points `b, c` and returned to the client each iteration.

### Other Cypher Clauses

(This section is copied and pasted from page 31 and provides a simple glimpse at the common Cypher clauses available)

- `WHERE`
  provides criteria for filtering pattern matching results
- `CREATE` and `CREATE UNIQUE`
  Creates nodes and relationships
- `MERGE`
  Ensures that the supplied pattern exists in the graph, either by reusing existing nodes and relationships that match the supplied predicates, o rby creating new nodes and relationships.
- `DELETE`
  Removes nodes, relationships, and properties
- `SET`
  Sets property values
- `FOREACH`
  Performs an updating action for each element in a list
- `UNION`
  Merges results from two or more queries
- `WITH`
  Chains subsequent query parts and forwards results from one to the next. Similar to piping commands in Unix.
- `START`
  Specifies one or more explicit starting points--nodes or relationships--in the graph. (START is deprecated in favor of specifying anchor points in a MATCH clause.)

### Comparing Relational and Graph DBM systems

> Despite being graphs, E-R diagrams immediately demonstrate the shortcomings of the relational model for capturing a rich domain. Although they allow relationships to be named (something that graph databases fully embrace, but which relational stores do not), E-R diagrams allow only single, undirected, named relationships between entities. In this respect, the relational model is a poor fit for real-world domains where relationships between entities are both numerous and semantically rich and diverse. (Page 34)

Another pit fall of the relational model is that it uses foreign keys to relate nodes. This adds a level of complexity to the database design that is only their to serve `join` operations during queries.

RDBMS can quickly become obsolete. As each model is tailored to the current problem and business requirements, making changes requires complex overhead and in some extreme cases, entire database redesigns.

Structural changes in a database is referred to as _migration_. Database refactoring is slow, risky, and expensive.

> Relational databases—with their rigid schemas and complex modeling characteristics—are not an especially good tool for supporting rapid change. (Page 38)

#### Graph Modeling

Early stages are quite similar; whiteboard sketching and domain design. Following that, transform the domain into a graph-like model. This model can now be enriched to meet business needs; add labels, properties, and define relationships. 

The domain model is very close to the graph model so by ensuring the correctness of the domain model, the corresponding graph model generally improves. _What you sketch on the whiteboard is typically what you store in the database_.

When designing a graph model one should also consider the queries they will be running on the graph. This is called a _design for queryability_ mindset. This requires an understanding of the end-user goals.

For an in depth example of a GDBMS refer to pages ~40-45.

When instantiating a Graph Database it is important to use one large CREATE statement. If any node or relationship fails, nothing will be added. When you add new data to the graph it is good to use MERGE as it will ensure that a particular subgraph structure is in place once the command has executed.

> In practice, we tend to use CREATE when we’re adding to the graph and don’t mind duplication, and MERGE when duplication is not permitted by the domain.

### Indexes

(in short)

Cypher allows the user to create indexes per label and property combinations. For unique props, one can also specify constraints to ensure uniqueness. Indexes are populated in the background and become available once they are built. Look ups don't require indexes but indexes can improve lookup.

### Constraining Matches

Constrain graph matches using the WHERE clause. It allows for the elimination of matched subgraphs from the results by:

- certain paths that must be present (or absent) in the matched subgraphs.
- nodes must have certain labels or relationships with certain names.
- specific properties on matched nodes and relationships must be present (or absent), irrespective of their values.
- certain properties on matched nodes and relationships must have specific values.
- other predicates must be satisfied

Example:

```cypher
MATCH   (theater:Venue {name:'Theatre Royal'}),
        (newcastle:City {name:'Newcastle'}),
        (bard:Author {lastname:'Shakespeare'}),
        (newcastle)<-[:STREET|CITY*1..2]-(theater)
          <-[:VENUE]-()-[:PERFORMANCE_OF]->()
          -[:PRODUCTION_OF]->(play)<-[w:WROTE_PLAY]-(bard)
WHERE w.year > 1608
RETURN DISTINCT play.title AS play
```

This query returns all plays from the Theatre Royal that occurred during Shakespeare's _final period_.

### RETURN clause

The return clause allows for further processing before returning the data to the user. For example the clause `DISTINCT` can be used to only return unique results. `count()` also exists to return the number of something (nodes/relationships).

### Identifying Nodes and Relationships

Modeling process designed for queryability:

1. Describe the client or end-user goals that motivate our model.
2. Rewrite these goals as questions to ask of our domain.
3. Identify the entities and the relationship that appear in these questions.
4. Translate these entities and the relationships into Cypher path expressions.
5. Express the questions we want to ask of our domain as graph patterns using path expression similar to the ones we used to model the domain.

Pay attention to the language used when describing the domain. Nouns become labels, verbs become relationships, proper nouns refer to instances.

## Learning Neo4j Chapter 3

Neo4j was built from the ground up to support graph data. It started a _graph library_ for dealing with connected data but soon developed into what it is today.

It is ACID-compliant:

- Atomicity:
  Transactions are all or nothing. If one part fails then the entire transaction needs to be rolled back.
- Consistency:
  Only valid data is saved. This is similar to how relational models use _schemas_. In Neo4j this prohibits dangling relationships or invalid data.
- Isolation:
  Transactions do not affect each other. This boils down to the sequential order of operations. If something is being written to the db at the same time its being read; an **isolated** database should return the _old_ data for the read operation until the write operation completes.
- Durability:
  Written data will not be lost. Persisted storage and transaction commit logs are always written to disk.

Neo4j is built for **online transaction processing**. Queries need to resolved in milliseconds--not seconds or minutes. 

### OLTP vs OLAP

The following table is copied from page 47.

Online Transaction Process (OLTP) & Online Analytical Processing (OLAP)

|  | **Online Transaction Processing** (Operational System) | **Online Analytical Processing** (Analytical System, aka data warehouse) |
| -- | -- | -- |
| Source of data | Operational data; are the original source of the data | Consolidation data; OLAP data comes from various OLTP dbs |
| Purpose of data | Control and run fundamental business tasks | Help with planning, problem solving, and decision support |
| What the data provides | Reveals a snapshot of ongoing business processes | Multidimensional views of various kinds of business activities |
| Inserts and updates | Short and fast inserts and updates initiated by end users | Periodic long-running batch jobs refresh the data |
| Queries | Relatively standarized and simple queries returning relatively few records | Often complex queries involving aggregations |
| Processing speed | Very fast | Depends on amnt of data involved; batch data refreshes and complex queries may take many hours |
| Space requirements | relatively small if historical data is archived | larger due the existence of aggregation structures and historical data. |
| Database design | Highly normalized with many tables | typically de-normalized with fewer tables; uses star/snowflake schemas |
| Backup and recovery | backs up religiously; operational data is critical to run the business. Data loss can be catastrophic. | Some systems simply reload OLTP data instead of backing up |

Neo4j is currently on the OLTP side; but can be repurposed for certain OLAP tasks.

### Scalability

Neo4j is designed to scale. The Enterprise edition even has a clustering solution that has been proven to support even the most challenging workloads.

It allows for both **horizontal** and **vertical** scalability.

- Horizontal:
  Adding more machines to the cluster and distributing the load over the cluster members
- Vertical:
  Adding more horsepower (CPU, memory, disks, etc.) to the machines that are cluster members

### Cypher

Declarative, pattern-matching query language that makes graph database management systems understandable and workable for any user.

It declarative nature allows the user to state exactly what they are looking for using patterns that are easy to understand. In an imperative language one would have to _tell_ the database instead of just request.

Cypher was designed to be easy to use and supply a _should just be there_ ideology for data.

### Sweet spot use cases

- Complex, Join-Intensive Queries
  (This has already been discussed)
- Path Finding queries
  See whether a path actually exists, look for optimal paths, variability of paths, alternate routes, number of connections

  Considered "Graph Local" and are performed "in the clickstream", therefore performed in near-real-time data.

### Committed to Open Source ✨

Why is Neo4j committed to providing its open source database?

- Lower chance of vendor lock-in: since the code is readily available, software developers can read and edit (extend, fix, audit, etc.) the code at will.
- Better security: as the code is consistently under public scrutiny it is intrinsically more secure.
- Easier support and troubleshooting: as every party has full access to code it is easier to produce logs and pinpoint runtime issues
- More innovation through extensibility: by exposing source code more developers can get their hands on the software and potentially fix bugs or issues that the main developers have overlooked.
- Supporting research: OSS allows researchers to use the software for free
- Cheaper: With a "fair" licensing model, users are only required to pay for the software if they plan on using it without contributing back. This allows business to start small with a limited investment and grow gradually as the use cases expand.

### Test Questions:

1. True, Neo4j is an ACID-compliant database
2. The Enterprise edition is available
3. False, Neo4j is available for windows as well as Linux/Unix/OS X systems

## Learning Neo4j Chapter 4

## Additional reading

### Index free adjacency [blog post](https://medium.com/@dmccreary/how-to-explain-index-free-adjacency-to-your-manager-1a8e68ec664a)

This blog post explains how index free adjacency works using an easy to follow example called "direct neighbor walk" metaphor.

Native graph databases use direct physical RAM addresses to traverse from node to neighboring nodes. It does not need to use any additional data structures or indexes to go from node to neighboring node. When the graph is designed, the developer explicitly adds links between logically related nodes--these links contain fixed addresses and is what makes up _index free adjacency_.

Related nodes are sometimes stored next to each other in memory which maximizes the chance the data is already in the CPU cache. This can enable the database to hop between roughly 1mil nodes / second per server core. 

The blog post lists some example server architecture based off of the graph500 SSSP benchmark:

| Server | Cores | Hops |
|--------|-------|------|
| Typical | 16 | 16 million |
| Amazon x1e.32xlarge | 128 | 128 million |
| Cray Graph Engine | 8192 | 12.8 billion |
