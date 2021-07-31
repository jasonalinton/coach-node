const { ApolloServer, PubSub } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');
const requestLogger = require('../shared/lib/requestLogger');
const initMiddleware = require('./resolvers/middleware')
// const moment = require('moment');

const { typeDefs } = require('./schemas/typeDefs');

// TODO: Dynamically load modules
// https://stackoverflow.com/questions/10914751/loading-node-js-modules-dynamically-based-on-route

const MetricQuery = require('./resolvers/queries/metricQuery');
const GoalQuery = require('./resolvers/queries/goalQuery');
const TodoQuery = require('./resolvers/queries/todoQuery');
const RoutineQuery = require('./resolvers/queries/routineQuery');

const MetricMutation = require('./resolvers/mutations/metricMutation');
const GoalMutation = require('./resolvers/mutations/goalMutation');
const TodoMutation = require('./resolvers/mutations/todo/todoMutation');
const TodoIterationMutation = require('./resolvers/mutations/todo/todoIterationMutation');
const RoutineMutation = require('./resolvers/mutations/routineMutation');

const MetricSubscription = require('./resolvers/subscriptions/metricSubscription');
const GoalSubscription = require('./resolvers/subscriptions/goalSubscription');
const TodoSubscription = require('./resolvers/subscriptions/todoSubscription');
const RoutineSubscription = require('./resolvers/subscriptions/routineSubscription');
const PlannerSubscription = require('./resolvers/subscriptions/plannerSubscription');

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
  ...TodoIterationMutation,
  ...RoutineMutation
}
const Subscription = {
    ...MetricSubscription,
    ...GoalSubscription,
    ...TodoSubscription,
    ...RoutineSubscription,
    ...PlannerSubscription
}

const resolvers = {
    Query,
    Mutation,
    Subscription
}

const prisma = new PrismaClient();
const pubsub = new PubSub();

const PORT = 4010;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      pubsub
    };
  }
});

initMiddleware(prisma);
// Date.prototype.toJSON = function(){ return moment(this).format(); }


server.listen({ port: PORT }, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
});
