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
            queryField: 'id',
            type: 'int',
            isColumn: true,
        },
        {
            id: 2,
            name: 'Name',
            prop: 'text',
            queryField: 'text',
            type: 'string',
            isColumn: true,
        },
        {
            id: 3,
            name: 'Description',
            prop: 'description',
            queryField: 'description',
            type: 'blurd',
            isColumn: true,
        },
        {
            id: 4,
            name: 'Parents',
            prop: 'parents',
            queryField: 'routines',
            type: 'objects',
            isItem: true,
            isColumn: true,
            optionsQuery: require('../../graphql/query/routine/QueryRoutines.gql'),
            icon: '/icon/parent-icon.png',
        },
        {
            id: 5,
            name: 'Children',
            prop: 'children',
            queryField: 'rouitnes',
            type: 'objects',
            isItem: true,
            isColumn: true,
            optionsQuery: require('../../graphql/query/routine/QueryRoutines.gql'),
            icon: '/icon/child-icon.png',
        },
        {
            id: 6,
            name: 'Metrics',
            prop: 'metrics',
            queryField: 'metrics',
            type: 'objects',
            isItem: true,
            isColumn: true,
            optionsQuery: require('../../graphql/query/QueryMetrics.gql'),
        },
        {
            id: 7,
            name: 'Goals',
            prop: 'goals',
            queryField: 'goals',
            type: 'objects',
            isItem: true,
            isColumn: true,
            optionsQuery: require('../../graphql/query/QueryGoals.gql'),
            icon: '/icon/goal-icon.png',
        },
        {
            id: 8,
            name: 'Todos',
            prop: 'todos',
            queryField: 'todos',
            type: 'objects',
            isItem: true,
            isColumn: true,
            optionsQuery: require('../../graphql/query/todo/QueryTodos.gql'),
            icon: '/icon/task-icon.png',
        },
        {
            id: 9,
            name: 'Repeats',
            prop: 'repeats',
            queryField: 'repeats',
            type: 'objects',
            isItem: false,
            isColumn: false,
        },
    ],
    itemModel: {
        text: "",
        description: null,
        parents: [],
        children: [],
        metrics: [],
        goals: [],
        todos: [],
        repeats: [],
    },
    addItem: addRoutine,
    updateItem: updateRoutine,
    deleteItem: deleteRoutine,
    query: {
        name: "routines",
        document: require('../../graphql/query/routine/QueryRoutines.gql'),
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