import { updateMetric, onMetricUpdated } from '../../resolvers/metric-resolvers'

let config = {
    itemType: "metric",
    props: [
        {
            id: 1,
            name: 'ID',
            prop: 'id',
            type: 'int',
        },
        {
            id: 2,
            name: 'Name',
            prop: 'text',
            type: 'string'
        },
        {
            id: 3,
            name: 'Description',
            prop: 'description',
            type: 'blurd'
        },
        {
            id: 4,
            name: 'Goals',
            prop: 'goals',
            type: 'objects',
            isItem: true,
            optionsQuery: require('../../graphql/query/QueryGoals.gql'),
        },
        {
            id: 5,
            name: 'Routines',
            prop: 'routines',
            type: 'objects',
            isItem: true,
            optionsQuery: require('../../graphql/query/QueryRoutines.gql')
        },
        {
            id: 6,
            name: 'Todos',
            prop: 'todos',
            type: 'objects',
            isItem: true,
            optionsQuery: require('../../graphql/query/QueryTodos.gql')
        }
    ],
    updateItem: updateMetric,
    itemModel: {
        text: "",
        description: "",
        parents: [],
        children: [],
        goals: [],
        todos: [],
        routines: []
    },
    query: {
        name: "metrics",
        document: require('../../graphql/query/QueryMetrics.gql'),
        variables: {},
    },
    subscriptions: [
        {
            name: 'metricUpdated',
            object: {
                query: require('../../graphql/subscription/metric/MetricUpdated.gql'),
                result({ data }) { onMetricUpdated(this.$apollo.getClient().cache, data.metricUpdated) },
            }
        }
    ]
}

export default config;