# Week 6

## Graph Database Internals

_Index-free adjacency_ - each node maintains direct references to its adjacent nodes. Each node acts as a microindex to other nearby nodes. Much cheaper than using global indexes. Query times are independent from the total size of the graph; instead proportional to the amount of the graph searched.

Index-free adjacency allows for bidirectional joins as a default behavior. The stored _relationships_ between nodes can be traveresed in either direction. 

Index lookups used by non-native models work for small networks, and with the increase in computer processing capacity even larger networks can be handeled somewhat responsively. But to always ensure high-performance traversals, index-free adjanceny is a must have.

**Native graph storage** formate supports extremely rapid traversals for arbitrary graph algorithms. Neo4j uses this as well.

### Neo4j Architecture
- Traversal API
- Core API
- Cypher
- Lock Manager
- Page Cache
- Transaction Management
- Record Files
- Transaction Log
- Disks

Stores graph data in multiple _store files_. Each file contains the data for a specific part of the graph. Nodes, relationships, labels, and properties each get their own separate store.

Every node created in the user-level graph ends up in the node store. Fixed-size record store; each records is **9 bytes** in length. Because of the fixed-size formate, the DB can directly compute a record's location at a cost of O(1) (instead of the standard look up of O(log n)).

#### Node Record

- 1 byte is the _in-use_ flag. Tells the db if the record is currently being used to store a node or if it can be reclaimed on behalf of a new node. 
- 4 bytes represent the ID of the first relationship connected to the node
- 4 bytes represent the ID of the first property for the node. 
- 5 bytes for labels
- 1 byte for flags (one example is a flag for densely connected nodes)
- remaining bytes are reserved for future use

A node record is essentially made up of pointers to lists of relationships, labels, and properties.

#### Relationship Reord

Similar to node record are stored in a fixed-size records. Contains the IDs of the nodes at the start and end of a relationship. Pointer to the relationship type and pointers for the next and previous relationship records for each of the start and end nodes. Also a remaining available _flag_ for indicating if the current record is the first in a _relationship chain_.

> The node and relationship stores are concerned only with the structure of the graph, not its property data. Both stores use fixed- sized records so that any individual record’s location within a store file can be rapidly computed given its ID. These are critical design decisions that underline Neo4j’s commitment to high-performance traversals.

To read a node's properties, the db follows the singly linked list structure beginning with the pointer to the first property. This is similar to how the db finds a node's relationship. 

**Fixed-sized** records and pointer-like record IDs allow for traversals to be implemented by chasing pointers around the data structure. Can be performed at very high speeds. To traverse a particular relationship from one node to another, the db performs very cheap ID computations. These computations are much less than searching global indexes.

SSDs are far better than HDs for running Neo4j. But the path between CPU and disk is still more latent than the path to L2 cache or main memory. Neo4j likes to exist in the memory and thus uses a 'LRU-K page cache'.

### Programmatic APIs

#### Kernel API
Lowest level of the apis. Transaction event handlers. allow user code to listen to transactions as they flow through the kernel allowing them to react or not based on the data content and lifecycle stage of the transaction.

A great use of kernel event handlers is instead of permitting the db to delete a node, have it simply mark it as stale or move it 'back in time' for archival purposes.

#### Core API
Written in Java. Exposes the graph primitives (nodes, relationships, properties, and labels) to the user. Allows for lazily reading data from the DB. Can also be used to write and does implement the atomic, consisten, isolated persistence characteristic to Neo4j.

#### Traversal API 
Also written in Java. Allows the developer to dictate how the graph is traversed. They can use breadth first search or depth first search. Can also prohibit certain sections from being accessed. 

Can be used in conjucntion with the Core API to perform declarative operations over the DB.

### Core API, Traversal Framework, or Cypher?
- Core API - allows developers to fine-tune queries. When written correctly can reach faster performance than other options. Downside is that they are more verbose and complicated. When the graph structure changes these queries tend to break because of how dependent they are on the underlying graph structure. 
- Traversal Frameowrk - loosely coupled with the Core API. When independent can be easier to implement than a Core API query. Less performant than Core API 
- Both are used for edge cases. Cypher works for everyday queries and will usually suffice for web app use cases. 

### Nonfunctional Characteristics

Neo4j is ACID complient. This shows its dependability that can be achieved by a graph database. This parallels to the enterprise-class relational database management systems.

**Transactions** in Neo4j are semantically identical to traditional db transactions. Writes occur within a transaction context. Write lock are taken for consistency purposes and on successful completion the changes are flushed to disk and write locks released. 

Writes are isolated and multiple transaction attepmts on the same element are serialized and run one after another.

Recovery is handled by the DB automatically fetching the transaction logs and rerunning any transactions. Because they are idempotent, running a transaction already completed will do nothing. Neo4j also recommends the use of database clusters for redundency recovery.

In clusters, Neo4j can implement a write-master, read-slave set up. It can also implement a write-through-slave topology which can increase throughput. 

Idiomatic queries are predictable and can utilize the cache of the DB system for increased performance. Unidiomatic queries (essentially random lookups) are slower and uncharacteristic to Neo4j's methodology.