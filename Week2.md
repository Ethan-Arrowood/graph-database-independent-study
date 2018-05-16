# Week 2 Notes 👨‍🔬

## Graph Database Chapter 3

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



