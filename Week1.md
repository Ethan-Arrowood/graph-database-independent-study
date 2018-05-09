# Week 1 Notes

## Graph Databases Chapter 1 Introduction

**Graph** - a collection of _vertices_ and _edges_, or a set of _nodes_ and _relationships_.

Entities are stored as _nodes_ and the relations between nodes, including additional metadata is stored within the _relationships_.

Social networks, road planning, supply chain, medical history can all be represented using graphs.

### Labeled Property Graph

one of the most common graph model forms.

- contains nodes and relationships
- nodes contain properties (key-value pairs)
- nodes can be labeled with one or more labels
- relationships are named and directed. Always have a start and end node.
- relationships can also contain properties in the form of key-value pairs.

### Graph Space

Two parts:

1. Tech used primarily for transactional online graph persistence, typically accessed directly in real time from an application.
  This is in simple terms a `Graph Database`. Equivalent of the normal online transactional processing databases (OLTP) in the relational world (such as MySQL).
2. Tech used primarily for offline graph analytics, typically performed as a series of batch steps.
  AKA `Graph Compute Engines`. Exist in the same space as other bulk data analysis technologies. For example: data mining and online analytical processing (OLAP).

### Graph Databases

> A graph database management system (henceforth, a graph database) is an online database management system with Create, Read, Update, and Delete (CRUD) meth‐ ods that expose a graph data model.
> ~ Page 5

Two main properties of graph databases:

1. Underlying Storage
  Most use a native graph storage optimized and designed for storing and managing graphs. Other GDB tech serialize graph data into a relational database, object-oriented database, or some other gen-purpose data store.

  The data store directly affects how fast data can be created, read, updated, and deleted in a GDB.
2. Processing Engine
  Some definitions require gdb to utilize _index-free adjacency_ meaning that the _nodes_ physically point to each other in the db. But this book uses a broader view where as long as the db acts like a gdb it qualifies as one.

  There is serious performance advantages to using index-free adjacency and this book uses the term **native graph processing** to describe graph databases that leverage it.

> Relationships are first-class citizens of the graph data model. ~ Page 6

Graph databases are best used when you are trying to represent multiple or complex relationships in your data. Other more traditional options focus on the entities themselves and less so on the relationships which are usually inferred via foreign keys or map-reduce processing (out-of-band)

### Graph Compute Engines

> enables global graph computational algorithms to be run against large datasets. ~ Page 7

Useful when trying to analyze an entire set of data or very large chunks of it. One example given in the text is: "how many relationships, on average, does everyone in a social network have?"

Operate in a 'batch process' manner similar to that of other OLAP and Data Mining services. Some example GCE include `Cassovary, Pegasus, and Giraph`. Most are based on the _Pregel white paper_ by Google (it describes the graph compute engineer they use to rank pages).

### Power of Graph Databases

Why use a graph database? The most straight forward answer is this: use a graph database when a data pattern performance improves by one or more orders of magnitude when implemented in a graph. One could argue that all scenarios can be represented by traditional relational databases, but Graph databases offer a flexible data model that is unmatched in performance in certain key scenarios. It is also very aligned with today's 'agile' software delivery practices.

#### Performance

In relational databases (MySQL), join-intensive query performance is extremely poor with large datasets. In a graph database the performance tends to remain constant even as the dataset grows.

#### Flexibility

Graph databases are organized in a very intuitive manner. The book states that it "accommodates business needs in a way that enables IT to move at the speed of business." I find this to be a very valuable aspect because as a piece of software expands and new features are added, a graph database allows for theoretical infinite expansion with very little historical inconsistencies.

> we don’t have to model our domain in exhaustive detail ahead of time ~ page 9

I've struggled with this exact issue when thinking about projects. Without a graph database businesses have to perform complete data migrations after they redesign their database. This can add multiple levels of complexity to a project and development timeline when trying to add a new feature.

#### Agility

Schema free graph databases allow for "frictionless development and graceful systems maintenance". Due to the schema free nature, some may argue this can be risky but the book states that it simply calls forth a "far more visible and actionable kind of governance." Test driven development, well articulated data models and queries, and assertive business rules can help produce a powerful graph database.

## Graph Databases Chapter 2 Options for Storing Connected Data

Relational databases were initially designed to codify paper forms and tabular structures--they struggle when attempting to model multi-relational 'real world' structures.

Favorite quote:
> Ironically, relational databases deal poorly with relationships.

As outlier data multiples, relational database model struggles with large join tables, sparsely populated rows, and null-checking logic. Increase in connectedness translates to increased joins (which negatively decrease performance and make it difficult to expand existing databases to changing business needs).

All in all relational databases experience incredible performance degradation when trying to model recursive relations. Modeling a 'real' situation requires lots of flexibility. The schema rigidness of relational databases strips away this flexibility and make coding a challenge. Graph databases solve all of these issues.

NOSQL databases (key-value, document, or column-oriented) store set of disconnected documents/values/columns. Makes it very to difficult to use them for connected data and graphs.

One strategy for emulating relations in disconnected data is to essentially use foreign keys. But this requires joining data at the application level and can quickly become expensive (especially when running on mobile devices, micro controllers, or old machines).

One major pitfall in this strategy is that identifies point one way only. They are **not** reflexive. This limits the types of queries we can run on our data.

Also aggregate stores do not maintain data connectivity automatically. So if something is deleted, it will remain referenced in other entries.

> On top of that, traversing the links remains expensive, because each hop requires an index lookup. This is because aggregates have no notion of locality, unlike graph databases, which naturally provide index-free adjacency through real—not reified—relationships ~ page 18

### Comparing Relation Database to Neo4j (Graph DB)

|Depth | RDBMS exec t | Neo4j exec t | Records returned|
|------|--------------|--------------|-----------------|
| 2    | 0.016        | 0.01         | ~2500           |
| 3    | 30.267       | 0.168        | ~110000         |
| 4    | 1543.505     | 1.359        | ~600000         |
| 5    | Unfinished   | 2.132        | ~800000         |

This table comes from **`Partner and Vukotic's`** experiment in their book _`Neo4j in Action`_. It represents the look up time on databases modeling 1,000,000 users with approximately 50 friends each.

Graphs are this powerful because of **index-free adjacency** to traverse connected data rapidly.
