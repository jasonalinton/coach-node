import {
    addGoal, updateGoal, deleteGoal
} from '../../resolvers/goal-resolvers'

let config = {
    itemType: "goal",
    properties: [
        {
            id: 0,
            text: "Order",
            position: 1,
            isSelected: true
        },
        {
            id: 1,
            text: "ID",
            position: 2,
            isSelected: true
        },
        {
            id: 2,
            text: "Text",
            position: 3,
            isSelected: true
        },
        {
            id: 3,
            text: "Description",
            position: 4,
            isSelected: true
        },
        {
            id: 4,
            text: "Time",
            position: 5,
            isSelected: true
        },
        {
            id: 5,
            text: "Repeat",
            position: 6,
            isSelected: true
        },
        {
            id: 6,
            text: "Type",
            position: 7,
            isSelected: false
        },
        {
            id: 7,
            text: "Parents",
            position: 8,
            isSelected: true
        },
        {
            id: 8,
            text: "Children",
            position: 9,
            isSelected: true
        },
        {
            id: 9,
            text: "Metrics",
            position: 10,
            isSelected: true
        },
        {
            id: 10,
            text: "Goals",
            position: 11,
            isSelected: false
        },
        {
            id: 11,
            text: "Todos",
            position: 12,
            isSelected: true
        },
        {
            id: 12,
            position: 13,
            text: "Routines",
            isSelected: true
        },
        {
            id: 13,
            position: 14,
            text: "Iterations",
            isSelected: false
        },
        {
            id: 14,
            text: "Events",
            position: 15,
            isSelected: false
        },
    ],
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
            optionsQuery: require('../../graphql/query/goal/QueryGoals.gql'),
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
            optionsQuery: require('../../graphql/query/goal/QueryGoals.gql'),
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
        __typename: "Goal",
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
        document: require('../../graphql/query/goal/QueryGoals.gql'),
        variables: {},
    }
}

export default config;