import Vue from 'vue'
import VueApollo from 'vue-apollo'
import { createApolloClient, restartWebsockets } from 'vue-cli-plugin-apollo/graphql-client'
import { ApolloLink } from 'apollo-link'
// import { removeItem } from '../utility'

// Install the vue plugin
Vue.use(VueApollo)

// Name of the localStorage item
const AUTH_TOKEN = 'apollo-token'

const PORT = 4013
// Http endpoint
const httpEndpoint = process.env.VUE_APP_GRAPHQL_HTTP || 'http://localhost:' + PORT +'/graphql'
// const httpEndpoint = process.env.VUE_APP_GRAPHQL_HTTP || 'http://192.168.1.71:' + PORT +'/graphql'
// Files URL root
export const filesRoot = process.env.VUE_APP_FILES_ROOT || httpEndpoint.substr(0, httpEndpoint.indexOf('/graphql'))

Vue.prototype.$filesRoot = filesRoot

// import ApolloClient from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';

// import GOALS from './graphql/query/QueryGoals.gql'


import { typeDefs } from './schemas/typeDefs'

const cache = new InMemoryCache({
  // addTypename: false,
  typePolicies: {
    Todo: {
      keyFields: ["text"],
      fields: {
        text: {
          read(text) {
            return text;
          }
        }
      }
    },
    Time: {
      fields: {
        dateTime: {
          read(dateTime) {
            // Return the cached name, transformed to upper case
            let timestamp = Number(dateTime);
            dateTime = new Date(timestamp);
            return dateTime;
          }
        }
      },
    },
  },
});

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
  // wsEndpoint: 'ws://192.168.1.71:' + PORT +'/graphql',
  wsEndpoint: process.env.VUE_APP_GRAPHQL_WS || 'ws://localhost:' + PORT +'/graphql',
  // LocalStorage token
  tokenName: AUTH_TOKEN,
  // Enable Automatic Query persisting with Apollo Engine
  persisting: true,
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
      // $watchQuery: {
      //   fetchPolicy: 'cache-and-network',
      // },
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
