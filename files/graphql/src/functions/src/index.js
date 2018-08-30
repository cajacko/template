const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const admin = require('firebase-admin');

admin.initializeApp();

const graphql = (request, response) => {
  // Construct a schema, using GraphQL schema language
  const typeDefs = gql`
    type Query {
      hello: String
    }
  `;

  // Provide resolver functions for your schema fields
  const resolvers = {
    Query: {
      hello: () =>
        admin
          .database()
          .ref('/posts/1234')
          .set({ yeah: 'baby' })
          .then((...args) =>
            admin
              .database()
              .ref('/posts/1234')
              .once('value')
              .then(snapshot => 'Success'))
          .catch(() => 'Failure'),
    },
  };

  const server = new ApolloServer({ typeDefs, resolvers });

  const app = express();

  server.applyMiddleware({ app });

  return app(request, response);
};

module.exports = graphql;
