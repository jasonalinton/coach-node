import {
    addGoal, updateGoal, deleteGoal
} from '../../resolvers/goal-resolvers'

let config = {
    itemType: "goal",
    props: [
        {
            id: 1,
            name: 'ID',
            prop: 'id',
            type: 'int',
            isColumn: true,
        },
        {
            id: 2,
            name: 'Name',
            prop: 'text',
            type: 'string',
            isColumn: true,
        },
        {
            id: 3,
            name: 'Description',
            prop: 'description',
            type: 'blurd',
            isColumn: true,
        },
        {
            id: 4,
            name: 'Parents',
            prop: 'parents',
            queryField: 'goals',
            type: 'objects',
            isItem: true,
            isColumn: true,
            optionsQuery: require('../../graphql/query/QueryGoals.gql'),
            icon: '/icon/parent-icon.png',
        },
        {
            id: 5,
            name: 'Children',
            prop: 'children',
            queryField: 'goals',
            type: 'objects',
            isItem: true,
            isColumn: true,
            optionsQuery: require('../../graphql/query/QueryGoals.gql'),
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
            id: 8,
            name: 'Routines',
            prop: 'routines',
            queryField: 'routines',
            type: 'objects',
            isItem: true,
            isColumn: true,
            optionsQuery: require('../../graphql/query/routine/QueryRoutines.gql'),
            icon: '/icon/routine-icon.png',
        },
        // {
        //     id: 9,
        //     name: 'TimePairs',
        //     prop: 'timePairs',
        //     queryField: 'timePairs',
        //     type: 'objects',
        //     isItem: false,
        //     isColumn: false,
        // },
    ],
    addItem: addGoal,
    updateItem: updateGoal,
    deleteItem: deleteGoal,
    itemModel: {
        text: "",
        description: null,
        parents: [],
        children: [],
        metrics: [],
        todos: [],
        routines: []
    },
    query: {
        name: "goals",
        document: require('../../graphql/query/QueryGoals.gql'),
        variables: {},
    }
}

export default config;