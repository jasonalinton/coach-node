import Vue from 'vue'
import VueApollo from 'vue-apollo'
import { createApolloClient, restartWebsockets } from 'vue-cli-plugin-apollo/graphql-client'
import { ApolloLink } from 'apollo-link'
// import { removeItem } from '../utility'

// Install the vue plugin
Vue.use(VueApollo)

// Name of the localStorage item
const AUTH_TOKEN = 'apollo-token'

// Http endpoint
const httpEndpoint = process.env.VUE_APP_GRAPHQL_HTTP || 'http://localhost:4010/graphql'
// Files URL root
export const filesRoot = process.env.VUE_APP_FILES_ROOT || httpEndpoint.substr(0, httpEndpoint.indexOf('/graphql'))

Vue.prototype.$filesRoot = filesRoot

import gql from 'graphql-tag';
// import ApolloClient from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';

// import GOALS from './graphql/query/QueryGoals.gql'

export const typeDefs = gql`
  type Goal {
    id: Int!
    text: String!
    description: String
    isDeleted: Int
    parents: [Goal]
    children: [Goal]
    metrics: [Metric]
    todos: [Todo]
    routines: [Routine]
  }

  input GoalInput {
    id: Int
    text: String
    description: String
    # isDeleted:   Int
    parents: [GoalInput]
    children: [GoalInput]
    metrics: [MetricInput]
    todos: [TodoInput]
    routines: [RoutineInput]
    unmappedItemIDs: UnmappedItemIDs
  }

    type Metric {
    id: Int!
    text: String!
    description: String
    goals: [Goal]
    todos: [Todo]
    routines: [Routine]
  }

  input MetricInput {
    id: Int!
    text: String
    description: String
    goals: [GoalInput]
    todos: [TodoInput]
    routines: [RoutineInput]
    unmappedItemIDs: UnmappedItemIDs
  }

  type Query {
    metrics: [Metric!]!
    goals: [Goal!]!
    todos: [Todo!]!
    routines: [Routine!]!
  }

  type Mutation {
  # Metric
  updateMetric(metric: MetricInput!): Metric!
  # Goal
  addGoal(goal: GoalInput!): Goal!
  updateGoal(goal: GoalInput!): Goal!
  deleteGoal(id: Int!): Goal!
  # Todo
  addTodo(todo: TodoInput!): Todo!
  updateTodo(todo: TodoInput!): Todo!
  deleteTodo(id: Int!): Todo!
  # Routine
  addRoutine(routine: RoutineInput!): Routine!
  updateRoutine(routine: RoutineInput!): Routine!
  deleteRoutine(id: Int!): Routine!
  }

  type Subscription {
  # Metric
  metricUpdated: Metric!
  # Goal
  goalAdded: Goal!
  goalUpdated: Goal!
  goalDeleted: Goal!
  # Todo
  todoAdded: Todo!
  todoUpdated: Todo!
  todoDeleted: Todo!
  # Routine
  routineAdded: Routine!
  routineUpdated: Routine!
  routineDeleted: Routine!
  }

  input UnmappedItemIDs {
  metrics: [Int]
  goals: [Int]
  todos: [Int]
  routines: [Int]
  }
`;

const cache = new InMemoryCache();

// Apollo Link
// Remove __typename before sending to server
// https://stackoverflow.com/questions/47211778/cleaning-unwanted-fields-from-graphql-responses/51380645#51380645
const cleanTypeName = new ApolloLink((operation, forward) => {
  if (operation.variables) {
    const omitTypename = (key, value) => (key === '__typename' ? undefined : value);
    operation.variables = JSON.parse(JSON.stringify(operation.variables), omitTypename);
  }
  // return forward(operation).map(data => data);
  return forward(operation).map((data) => {
    return data;
  });
});

// Config
const defaultOptions = {
  // You can use `https` for secure connection (recommended in production)
  httpEndpoint,
  // You can use `wss` for secure connection (recommended in production)
  // Use `null` to disable subscriptions
  wsEndpoint: 'ws://localhost:4010/graphql',
  // wsEndpoint: process.env.VUE_APP_GRAPHQL_WS || 'ws://localhost:4010/graphql',
  // LocalStorage token
  tokenName: AUTH_TOKEN,
  // Enable Automatic Query persisting with Apollo Engine
  persisting: false,
  // Use websockets for everything (no HTTP)
  // You need to pass a `wsEndpoint` for this to work
  websocketsOnly: false,
  // Is being rendered on the server?
  ssr: false,

  // Override default apollo link
  // note: don't override httpLink here, specify httpLink options in the
  // httpLinkOptions property of defaultOptions.
  link: cleanTypeName,

  // Override default cache
  cache,

  // Override the way the Authorization header is set
  // getAuth: (tokenName) => ...

  // Additional ApolloClient options
  // apollo: { ... }

  // Client local data (see apollo-link-state)
  // clientState: { resolvers: { ... }, defaults: { ... } }
  typeDefs,
  // resolvers: {
  //   Mutation: {
  //     deleteGoalClient: (_, { id }, context) => {
  //       const { goals } = context.cache.readQuery({ query: GOALS });
  //       const goal = goals.find(goal => goal.id == id);
  //       removeItem(goal, goals);
  //       context.cache.writeQuery({
  //         query: GOALS,
  //         data: {goals}
  //       })
  //     }
  //   }
  // },
}



// Call this in the Vue app file
export function createProvider (options = {}) {
  // Create apollo client
  const { apolloClient, wsClient } = createApolloClient({
    ...defaultOptions,
    ...options,
  })
  apolloClient.wsClient = wsClient

  // Create vue apollo provider
  const apolloProvider = new VueApollo({
    defaultClient: apolloClient,
    defaultOptions: {
      $query: {
        fetchPolicy: 'cache-and-network',
      },
    },
    errorHandler (error) {
      // eslint-disable-next-line no-console
      console.log('%cError', 'background: red; color: white; padding: 2px 4px; border-radius: 3px; font-weight: bold;', error.message)
    },
  })

  return apolloProvider
}

// Manually call this when user log in
export async function onLogin (apolloClient, token) {
  if (typeof localStorage !== 'undefined' && token) {
    localStorage.setItem(AUTH_TOKEN, token)
  }
  if (apolloClient.wsClient) restartWebsockets(apolloClient.wsClient)
  try {
    await apolloClient.resetStore()
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('%cError on cache reset (login)', 'color: orange;', e.message)
  }
}

// Manually call this when user log out
export async function onLogout (apolloClient) {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(AUTH_TOKEN)
  }
  if (apolloClient.wsClient) restartWebsockets(apolloClient.wsClient)
  try {
    await apolloClient.resetStore()
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('%cError on cache reset (logout)', 'color: orange;', e.message)
  }
}
