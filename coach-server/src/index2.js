const express = require('express');
const { ApolloServer, applyMiddleware, makeExecutableSchema, graphiqlExpress } = require('apollo-server-express');
const { PrismaClient } = require('@prisma/client');
const { createServer } = require('http');
const { execute, subscribe } = require('graphql');
const { PubSub } = require('apollo-server');
const requestLogger = require('../shared/lib/requestLogger');
const { SubscriptionServer } = require('subscriptions-transport-ws');

const fs = require('fs');
const path = require('path');

// TODO: Dynamically load modules
// https://stackoverflow.com/questions/10914751/loading-node-js-modules-dynamically-based-on-route

const MetricQuery = require('./resolvers/queries/metricQuery');
const GoalQuery = require('./resolvers/queries/goalQuery');
const TodoQuery = require('./resolvers/queries/todoQuery');
const RoutineQuery = require('./resolvers/queries/routineQuery');

const MetricMutation = require('./resolvers/mutations/metricMutation');
const GoalMutation = require('./resolvers/mutations/goalMutation');
const TodoMutation = require('./resolvers/mutations/todoMutation');
const RoutineMutation = require('./resolvers/mutations/routineMutation');

const GoalSubscription = require('./resolvers/subscriptions/goalSubscription');
const TodoSubscription = require('./resolvers/subscriptions/todoSubscription');
const RoutineSubscription = require('./resolvers/subscriptions/routineSubscription');

const Query = {
    ...MetricQuery,
    ...GoalQuery,
    ...TodoQuery,
    ...RoutineQuery
}
const Mutation = {
    ...MetricMutation,
    ...GoalMutation,
    ...TodoMutation,
    ...RoutineMutation
}
const Subscription = {
    ...GoalSubscription,
    ...TodoSubscription,
    ...RoutineSubscription
}

const resolvers = {
    Query,
    Mutation,
    Subscription
}

const prisma = new PrismaClient();
const pubsub = new PubSub();

let typeDefs = "";
typeDefs += fs.readFileSync(path.join(__dirname, '/schemas/schema.graphql'), 'utf8');
typeDefs += fs.readFileSync(path.join(__dirname, '/schemas/metric.graphql'), 'utf8');
typeDefs += fs.readFileSync(path.join(__dirname, '/schemas/goal.graphql'), 'utf8');
typeDefs += fs.readFileSync(path.join(__dirname, '/schemas/todo.graphql'), 'utf8');
typeDefs += fs.readFileSync(path.join(__dirname, '/schemas/routine.graphql'), 'utf8');

const PORT = 4010;

async function start() {
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    subscriptions: `ws://localhost:${PORT}/graphql`,
    context: ({ req }) => {
      return {
        ...req,
        prisma,
        pubsub
      };
    }
  });
  await server.start();

  const app = express();

  app.use(requestLogger);

  server.applyMiddleware({ app });

  app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
    subscriptionsEndpoint: `ws://localhost:4000/subscriptions`
  }));


  await app.listen({ port: PORT }, () => {
    new SubscriptionServer({
      execute,
      subscribe,
      schema,
    }, {
      server: server,
      path: '/subscriptions',
    });
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  });

  return { server, app };
}

let data = start();
let server = data.server;
let app = data.app;
