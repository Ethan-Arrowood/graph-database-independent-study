# Week 4

## What is Cypher

Declarative. Focus on the domain instead of db access. Suitable for both developers and operations professionals. Queries are self-explanatory.

Queries are made out of clauses such as `MATCH`, `WHERE`, `WITH`, and `RETURN`.

Basic example:
```cypher
MATCH (john {name:'John'})-[:friend]->()-[:friend]->(fof)
RETURN john.name, fof.name
```
This returns all friends-of-friends of John.

```cypher
MATCH (user)-[:friend]->(follower)
WHERE user.name IN ['Joe', 'John', 'Sara', 'Maria', 'Steve'] AND follower.name =~ 'S.*'
RETURN user.name, follower.name
```
Now this query finds users with a friend thats name starts with 'S'.

Some additional querie clauses for updating the graph: `CREATE`, `DELETE`, `SET`, `REMOVE`, and `MERGE`.

## Update Queries

A Cypher query part can't match and update the graph at the same time. If a query reads and then updates the graph the query implicitly has two parts (first reaing, second writing). Parts are separated using `WITH`. 

An example: filter aggregated data
```cypher
MATCH (n {name: 'John'})-[:FRIEND]-(friend)
WITH n, count(friend) AS friendsCount
WHERE friendsCount > 3
RETURN n, friendsCount
```
Now an update query:
```cypher
MATCH (n {name: 'John'})-[:FRIEND]-(friend)
WITH n, count(friend) AS friendsCount
SET n.friendsCount = friendsCount
RETURN n.friendsCount
```

Any query can return data. Queries that only read must return data; otherwise they are useless. Update queries don't have to return anything, but can.

## Transactions

Any query that updates the graph will run in a transaction. An updating query will always fully succeed or not succeed at all. A query holds changes in memory until the whole query has finished executing; as a result large queries consequently need a jVM with lots of heap space.

## Syntax

### Values and types
Cypher provides first class support for a number of data types. Split into 3 subsections: Property types, Structural types, and Composite types.

#### Property types
- Can be returned from Cypher queries
- Can be used as parameters
- Can be stored as properties
- Can be constructe with Cypher literals

Comprises of:
- Number (Integer and Float)
- String
- Boolean
- Spatial type Point
- Temporal types Data, Time, LocalTime, DataTime, LocalDataTime, and Duration

Homogeneous lists of simple types can also be stored as properties, although lists in general (see Composite types) cannot be stored.

Cypher alos allows pass-through support for byte arrays, can be stored as property values. Not considered first-class data type so do not have a literal representation.

#### Structural Types
- Can be returned from Cypher quereis
- Cannot be used as parameters
- Cannot be stored as properties
- Cannot be constructed with Cypher literals

Comprises of:
- Nodes:
  - Id
  - Label(s)
  - Map (of properties)
- Relationships:
  - Id
  - Type
  - Map (of properties)
  - Id of the start and end nodes
- Paths:
  - Alternating sequence of nodes and relationships

#### Composite Types
- Can be returned from Cypher quereis
- Can be used as parameters
- Cannot be stored as properties
- Can be constructed with Cypher literals

Comprises of:
- Lists are heterogeneous, ordered collections of values, each of which has any property, structural or composite type.
- Maps are heterogeneous, unordered collections of (key, value) pairs where:
  - Key is a string
  - Value has any property, structural, or composite type

Composite values can also contain `null`.

Summary:
| Type | Property | Structural | Composite |
| ---- | -------- | ---------- | --------- |
| Can be returned from Cypher Queries | ✅ | ✅ | ✅ | 
| Can be used as properties | ✅ | ❌ | ✅ |
| Can be stored as properties | ✅ | ❌ | ❌ |
| Can be constructed with Cypher Literals | ✅ | ❌ | ✅ |

### Naming Rules and Recommendations
Rules and recommendations for naming node labels, relationship types, property names, and variables.

#### Naming Rules
- Must being with an alphabetic letter
  - if a non-alphabetic character is required, use backticks for escaping; e.g. `` `^n` ``
- Can contain numbers, but not as the first character
- Cannot contain symbols
  - One exception are underscores `my_var`
  - Use backticks if a leading symbole character is required
- Can be very long, up to 65535 characters
- Are case-sensitive
- Whitespace characters are removed automatically
  - Backtick to escape this behavior: `hello world variable`

#### Scoping and namespace rules
- Technically this query is valid: `CREATE (a:a {a: 'a'})-[r:a]→(b:a {a: 'a'})`
- Node labels, relationship types, and property names may re-use names.
- Variables for nodes and relationships must not re-use names within the same query scope
  - This is invalid: `CREATE (a)-[a]->(b)`

#### Recommendations
| What | Recommendation | Example |
|--- | --- | --- |
| Node labels | Camel case, beginning with an upper-case character | `:VehicleOwner` |
| Relationships types | Upper case, using udnerscore to separated words | `:OWNS_VEHICLE` |

### Expressions
An expression in Cypher can be (many things):
- A decimal literal: `13`, `-4000`, `3.14`, `6.022E23`
- A hexadecimal integer literal (start with 0x): `0x13ZF`, `0xFC3A9`
- An octal integer literal (start with 0): `01372`, `02127`, `-05671`
- A string literal: `'Hello'`, `"World"`
- boolean literal: `true`, `false`, `TRUE`, `FALSE`
- variable: `n`, `x`, `rel`, `myFancyVar`, `` `A var with spaces and chars!` ``
- property: `n.prop`, `x.prop`. `rel.thisProp`, `` myFancyVariable.`(weird prop name)` ``
- dynamic property: `n["prop"]`, `rel[n.city + n.zip]`, `map[coll[0]]`
- parameter: `$param`, `$0`
- list of expressions: `['a', 'b']`, `[1, 2, 3]`, `[ ]`, `['a', 2, n.prop, $param]`
- function call: `length(p)`, `nodes(p)`
- aggregate function: `avg(x.prop)`, `count(*)`
- path pattern: `(a)-->()<--(b)`
- operator application: `1 + 2`, `3 < 4`
- predicate expression: `a.prop = 'Hello'`, `length(p) > 10`, `exists(a.name)`
- regular expression: `a.name =~ 'Tob.*'`
- case sensitive string matching expression: `a.surname STARTS WITH 'Sven'`, `a.surname ENDS WITH 'son'`, `a.surname CONTAINS 'son'`
- a `CASE` expression

String Literals can contain the following escape sequences:

| Escape Sequence | Character |
| - | - |
| \t | Tab |
| \b | Backspace |
| \n | Newline |
| \r | Carriage return |
| \f | Form feed |
| \' | Single quote |
| \" | Double quote |
| \\ | Backslash |
| \uxxxx | Unicode UTF-16 code point |
| \Uxxxxxxxx | Unicode UTF-32 code point |

[Reserved keywords](https://neo4j.com/docs/developer-manual/current/cypher/syntax/reserved/)

### Parameters
Cypher supports querying with paramters. Developers don't have to resort to string building to create a query. Additionally parameters make caching of execution plans much easier for Cypher, thus leaing to faster query execution times. 

Can be used for: literals and expressions, node and relationship ids, for explicit indexes only: index values and queries. 

Cannot be used for: property keys, relationship types, labels

Simple example:
Parameters
```javascript
{
  "name": "Ethan"
}
```
Query
```cypher
MATCH (n:Person {name: $name})
RETURN n
```

Cool example: Create multiple nodes with properties:
```javascript
{
  "props": [ {
    "awesome": true,
    "name": "Ethan",
    "position": "Developer"
  }, {
    "children": 3,
    "name": "Andres",
    "position": "Developer"
  } ]
}
```
Query
```cypher
UNWIND $props AS properties
CREATE (n:Person)
SET n = properties
RETURN n
```
### Operators

Basics
| Operator Type | Example |
| - | - |
| General | `DISTINCT`, `.` for property access, `[]` for dynamic property access |
| Mathematical | `+`, `-`, `*`, `/`, `%` `^` |
| Comparison | `=`, `<>`, `<`, `>`, `<=`, `>=`, `IS NULL`, `IS NOT NULL` |
| String-Specific Comparison | `STARTS WITH`, `ENDS WITH`, `CONTAINS` |
| Boolean | `AND`, `OR`, `XOR`, `NOT` |
| String | `+` for concatenation, `=~` for regex matching |
| Temporal | `+` and `-` for operation between durations and temporal instants/durations, `*` and `/` for operations between durations and numbers |
| List | `+` for concatentation, `IN` to check existence of an element in a list, `[]` for accessing element(s) |

`DISTINCT` removes duplicate values:
```cypher
CREATE (a:Person { name: 'Anne', eyeColor: 'blue' }),(b:Person { name: 'Bill', eyeColor: 'brown' }),(c:Person { name: 'Carol', eyeColor: 'blue' })
WITH [a, b, c] AS ps
UNWIND ps AS p
RETURN DISTINCT p.eyeColor
```
Even though both Anne and Carol have blue eyes, 'blue' is only returned once in the output. 

`DISTINCT` is commonly used in conjunction with aggregating functions

### Comments

` // ` double slashes all the way