# Week 8

## Building a Graph Database Application

Graph Databases Chapter 4

The questions we need to ask of the data help identify entities and relationships. Agile user stories can help formulate these.

> **AS A** reader who **likes** a book, **I WANT** to know which books other readers who like the same book have liked, **SO THAT** i can find other books to read

From this user story we can extrapolate that there is some context between the a reader and a book; also recognize the **LIKES** relationship. Lets try to write a mock query for this story

```
MATCH (:Reader {name:'Ethan'})-[:LIKES]->(:Book {title:'Curious George'})<-[:LIKES]-(:Reader)-[:LIKES]->(books:Book)
RETURN books.title
```

And just like that a cypher query is formed for use within our application.

#### Nodes for Things, Relationships for Structure

- use **Nodes** to represent entities - the _things_ in the domain that are of interest to us. Can be labeled and grouped.
- use **Relationships** to express the _connections_ between entities and to establish semantic context for each entity
- use **relationship** direction to further clarify relationship semantics. Many are asymmetrical which is why that are always direced. For bidirectional relationships, queries should ignore direction, rather than use two different relationships.
- use **node** properties to represent entity attributes and meta data
- use **relationship** properties to express the strength, weight, or quality of a relationships (also metadata like time, date, version)

### Model Facts as Nodes

When two or more domain entites interact a fact emerges. Represent the fact as a separate node with connections to each of the entities engaged. Model an action in terms of its product -- the thing that results from the action. This produces an intermediate node that represents the interaction outcome between two or more entites.

A great example of this is a database recording emails. The sender may send an email to multiple recipients. The person nodes can have unique relationships to the email node such as 'SENT', 'TO', 'CC', 'BCC', 'FORWARD'

### Complex Data Types

Use a time tree or linked list to represent complex interactions between entities. Some examples include Episodes in a season of a tv show, software versioning (consider a multi branch project getting merged for a release).

### Embedded

Neo4j can be run in the same process as the application it is serving. Some of the benefits to doing this include:

1.  Low Latency
2.  Choice of APIs
3.  Explicit transactions (directly executed Java)
4.  JVM only
5.  Garbage collection behaviors
6.  Database life cycle

### Server Mode

Benefits include:

1.  REST API
2.  Platform independence
3.  Scaling independence
4.  Isolation from application garbage collection
5.  Network overhead
6.  Transaction state

### Test Driven Development

Neo4j can be tested using standard unit testing frameworks. Its best to run unit tests in a clone of the main database as to not accidentally manipulate crucial data.

## Chapter 5 Graphs in the Real World

Some use cases:

- Social (media); connecting users via 'friends' or 'follows'
- Recommendation systems (user and item based classification)
- Geo; geospatial data is best represented as a network of nodes and relationships. Graphs are briliant for this model and have allowed for some incredible advances in geo technology (like GPS)
- Data & Hardware management; graphs are great for device management systems as the relationships can easily represent 'live' interactions between service entities.
