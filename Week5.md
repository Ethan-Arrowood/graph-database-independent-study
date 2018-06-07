# Week 5

Importing Data into Neo4j

## Alternative approaches to importing data into Neo4j
Importing unconnected data is difficult. The nodes are easy, but relationships are not as there is usually no external entity that makes it simple.

Every import is different so there is no 1 way to do this. But if one can simplify the problem it can be a lot easier to do. 

Couple options:
  - Spreadsheets ( Manual cypher queries )
  - Neo4j-shell
  - Neo4j Browser
  - Command Line
  - ETL tools (Talend, MuleSoft)
  - Custom Software (via Java/REST/Spring APIs)

## Importing small(ish) datasets

Few hundred to a few hundred thousand nodes and relatinonships. 

### Spreadsheets
1. Format you data in spreadsheet
2. Generate cypher statements with (spreadsheet) formulas
3. execute cypher statements in Neo4j

Works in most common spreadsheet solutions (Excel, Sheets, Numbers, Calc). Works on the basis of string concatentation based on cell values to compose a query statement.

### Neo4j-Shell
1. Format data in CSV files
2. Create import cypher commands for neo4j-shell-tools
3. Execute commands from neo4j-shell

Neo4j-shell-tools supports csv, geoff, and graphml formats. Can even be scaled to import millions of nodes/relationships.

### Import statement
Why this is an improvement on Neo4j-shell-tools
- embedded into cypher
- .csv files can be loaded from anywhere
- accessible from the neo4j browser tool

1. Format data in csv files
2. Create "Load CSV" commands
3. Execute command from neo4j-shell or browser
4. Additional "cleanup" step for labels and RelTypes

One catch is that labels are not supported so additional cypher queries are required to apply labels to nodes.

### Batch Import
1. Format data in TSV files
2. Execute batch import command
3. Copy store files to Neo4j Server directory
4. Start Neo4j server with generated store files

This utility will maintain Neo4j's all or nothing component transaction for giant queries (billions of nodes).

## Chapter 8 Visualizations for Neo4j

Interacting with data visually has massive benefits for developers. 'Visual interaction' allows others not necessarily as familiar with the data set. It can even allow non-developers to completely understand underlying systems.

People can extract key information at just a glance. 'A picture says more than a thousand words' -- its true. pictures are easier to understand and remember than a bunch of text.

Patterns are easier to discern and it allows developers to leverage our innate pattern recognition abilities. 

Furthermore, visualizing data allows us to notice things queries can't always tell us (at least if we are not looking for it). For example density of relationships can be hard to detect using code alone. Visualization makes it a lot easier to recognize thme.

Graph visualizations aspects:
- **Graph**: items related to each other should gravitate towards each other in a visualization. Usually based on characteristics of the nodes/relationships.
- **Charge**: in the same aspect of gravity, there needs to be an aspect that keeps items unrelated, further away from each other.
- **Springs**: visualizations should be dynamic and feel 'fluid' like when displayed. This greatly improves the user experience.

Some libraries:

- **D3.js**: Javascript library for visualizing data. Uses HTML, SVG, and CSS.
- **Graphviz**: One of the oldest visualization softwares.
- **Sigma.js**: Another JS Library utilizes Canvas and WebGL though so predominantly works in modern browsers.
- **Vivagraph.js**: js lib using webgl, svg, and css.