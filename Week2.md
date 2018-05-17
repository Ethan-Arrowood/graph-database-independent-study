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

Resume reading at page 32

## Learning Neo4j Chapter 3

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
