# Camper Tracker App Local Set Up

1.  Run `npm install` to install server dependencies
2.  Run `cd client` then `npm install` to install client dependencies
3.  Open `server.js` and edit line 3 to include the correct username and password for your local Neo4j database. You will most likely only need to edit the `password` argument (2nd argument in `neo4j.auth.basic` method).
4.  Open Neo4j Desktop and launch a new graph database session.
5.  Run the cypher scripts contained in the `cypher` directory. These scripts contain a set of `:params` that must be loaded inorder for the following queries to work. If you run into errors I recommend running the parameters first then the generating queries.
6.  Move back into the project root with `cd ..` and run `npm run start`. This will start up both the server and client.
7.  Now the app should be running locally on your machine.
