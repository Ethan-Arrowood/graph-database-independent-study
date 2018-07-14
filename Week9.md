# Week 9

## Learning Neo4j Chapter 6 Use Case Example - Recommndations

A recommendation system consists of two parts.

A pattern discovery system; figures out what would be a useful recommendation for a particular target group. This can be done through 3 methods:

- A business expert who thoroughly understands the domain of the graph database application. This is a person who can make a recommendation based on their own experiences or trends they have witnessed
- A visual discovery of a spefict pattern in the graph representation of the business domain. Often stumbled upon, these patterns can lead to great recommendations not otherwise percievable via algorithms or experience.
- An algorithmic discovery of a pattern in the dataset using machine learning algorithms. This can reveal things undetecatble using business expert or visual discovery.

A pattern application system; after discovering patterns, they must be applied to the data

- Batch-oriented applications: can be inefficient and non time-critical
- Real-time oriented applications: pattern recommendations delivered in real time (usually between a web request and response). Cannot be precalculated. Neo4j is great for this kind of application
