const express = require('express');

// import apollo server class
const { ApolloServer } = require('apollo-server-express');
const path = require('path');

// import parts of the graphQL schema
const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require("./utils/auth");
const db = require('./config/connection');
const PORT = process.env.PORT || 3001;

// define apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// create new instance of apollo server with graphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}`)
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });

}

// Call the async function to start the server
startApolloServer(typeDefs, resolvers);