import {
    addRoutine, updateRoutine, deleteRoutine,
    onRoutineAdded, onRoutineUpdated, onRoutineDeleted
} from '../../resolvers/routine-resolvers'

let config = {
    itemType: "routine",
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
            name: 'Metrics',
            prop: 'metrics',
            type: 'objects',
            isItem: true,
            optionsQuery: require('../../graphql/query/QueryMetrics.gql'),
        },
        {
            id: 5,
            name: 'Goals',
            prop: 'goals',
            type: 'objects',
            isItem: true,
            optionsQuery: require('../../graphql/query/QueryGoals.gql'),
        },
        {
            id: 6,
            name: 'Todos',
            prop: 'todos',
            type: 'objects',
            isItem: true,
            optionsQuery: require('../../graphql/query/QueryTodos.gql'),
        },
    ],
    itemModel: {
        text: "",
        description: null,
        parents: [],
        children: [],
        metrics: [],
        goals: [],
        todos: []
    },
    addItem: addRoutine,
    updateItem: updateRoutine,
    deleteItem: deleteRoutine,
    query: {
        name: "routines",
        document: require('../../graphql/query/QueryRoutines.gql'),
        variables: {},
    },
    subscriptions: [
        {
            name: 'routineAdded',
            object: {
                query: require('../../graphql/subscription/routine/RoutineAdded.gql'),
                result({ data }) { onRoutineAdded(this.$apollo.getClient().cache, data.routineAdded) },
            }
        },
        {
            name: 'routineUpdated',
            object: {
                query: require('../../graphql/subscription/routine/RoutineUpdated.gql'),
                result({ data }) { onRoutineUpdated(this.$apollo.getClient().cache, data.routineUpdated) },
            }
        },
        {
            name: 'routineDeleted',
            object: {
                query: require('../../graphql/subscription/routine/RoutineDeleted.gql'),
                result({ data }) { onRoutineDeleted(this.$apollo.getClient().cache, data.routineDeleted) },
            }
        }
    ]
}

export default config;