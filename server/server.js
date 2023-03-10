const express = require("express");
const path = require("path");
const db = require("./config/connection");
const routes = require('./routes');


const { ApolloServer } = require("apollo-server-express");
const { authMiddleware } = require("./utils/auth");


// import our typeDefs and resolvers
const { typeDefs, resolvers } = require("./schemas");

const PORT = process.env.PORT || 3001;
const app = express();
// create a new Apollo server and pass in our schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context:authMiddleware
});

const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });};


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(routes);


if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, 'build','index.html'));
});

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    // log where we can go to test our GQL API
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});


startApolloServer(typeDefs, resolvers);