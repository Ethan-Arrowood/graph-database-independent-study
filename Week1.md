# Week 1 Notes

Graph Databases Ch. 1 & 2

**Graph** - a collection of _vertices_ and _edges_, or a set of _nodes_ and _relationships_. 

Entities are stored as _nodes_ and the relations between nodes, including additional metadata is stored within the _relationships_. 

Social networks, road planning, supply chain, medical history can all be represented using graphs. 

## Labeled Property Graph
one of the most common graph model forms.
- contains nodes and relationships
- nodes contain properties (key-value pairs)
- nodes can be labeled with one or more labels
- relationships are named and directed. Always have a start and end node.
- relationships can also contain properties in the form of key-value pairs.

## Graph Space
Two parts: 
1. Tech used primarily for transactional online graph persistence, typically accessed directly in real time from an application.
  This is in simple terms a `Graph Database`. Equivalent of the normal online transactional processing databased (OLTP) in the relational world (such as MySQL).
2. Tech used primarily for offline graph analytics, typically performed as a series of batch steps. 
  AKA `Graph Comput Engines`. Exist in the same space as other bulk data analysis technologies. For example: data mining and online analytical processing (OLAP).

## Graph Databases
> A graph database management system (henceforth, a graph database) is an online database management system with Create, Read, Update, and Delete (CRUD) meth‐ ods that expose a graph data model.
> ~ Page 5

Two main properties of graph databases:
1. Underlying Storage 
  Most use a native graph storage optimized and designed for storing and managing graphs. Other GDB tech serialize graph data into a relational database, object-oriented database, or some other gen-purpose data store.
  
  The data store directly affects how fast data can be created, read, updated, and deleted in a GDB.
2. Processing Engine
  Some definitions require gdb to utilize _index-free adjacency_ meaning that the _nodes_ physically point to each other in the db. But this book uses a broader view where as long as the db acts like a gdb it qualifies as one. 

  There is serious performance advantages to using index-free adjacency and this book uses the term **native graph processing** to describe gdbs that leverage it. 

> Relationships are first-class citizens of the graph data model.

Graph databases are best used when you are trying to represent multiple or complex relationships in your data. Other more traditional options focus on the entities themselves and less so on the relationships which are usually inferred via foreign keys or map-reduce processing (out-of-band)

