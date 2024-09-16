import { addTodo } from '../../resolvers/todo-resolvers';
import { today, formatDate } from '../../../utility/timeUtility'

let config = {
    itemType: "todo",
    itemName: "Todo", // Capitalized version of item type
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
            text: "Time",
            position: 4,
            isSelected: true
        },
        {
            id: 4,
            text: "Repeat",
            position: 5,
            isSelected: true
        },
        {
            id: 5,
            text: "Type",
            position: 6,
            isSelected: false
        },
        {
            id: 6,
            text: "Parents",
            position: 7,
            isSelected: true
        },
        {
            id: 7,
            text: "Children",
            position: 8,
            isSelected: true
        },
        {
            id: 8,
            text: "Metrics",
            position: 9,
            isSelected: true
        },
        {
            id: 9,
            text: "Goals",
            position: 10,
            isSelected: true
        },
        {
            id: 11,
            position: 12,
            text: "Routines",
            isSelected: true
        },
        {
            id: 12,
            position: 13,
            text: "Iterations",
            isSelected: false
        },
        {
            id: 13,
            text: "Events",
            position: 14,
            isSelected: false
        },
    ],
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
            name: 'Repeats',
            prop: 'repeats',
            queryField: 'repeats',
            type: 'length',
            isColumn: true,
        },
        {
            id: 5,
            name: 'Parents',
            prop: 'parents',
            queryField: 'todos',
            type: 'objects',
            isItem: true,
            isColumn: true,
            optionsQuery: require('../../graphql/query/todo/QueryTodos.gql'),
            icon: '/icon/parent-icon.png',
        },
        {
            id: 6,
            name: 'Children',
            prop: 'children',
            queryField: 'todos',
            type: 'objects',
            isItem: true,
            isColumn: true,
            optionsQuery: require('../../graphql/query/todo/QueryTodos.gql'),
            icon: '/icon/child-icon.png',
        },
        {
            id: 7,
            name: 'Metrics',
            prop: 'metrics',
            queryField: 'metrics',
            type: 'objects',
            isItem: true,
            isColumn: true,
            optionsQuery: require('../../graphql/query/QueryMetrics.gql'),
        },
        {
            id: 8,
            name: 'Goals',
            prop: 'goals',
            queryField: 'goals',
            type: 'objects',
            isItem: true,
            isColumn: true,
            optionsQuery: require('../../graphql/query/goal/QueryGoals.gql'),
            icon: '/icon/goal-icon.png',
        },
        {
            id: 9,
            name: 'Routines',
            prop: 'routines',
            queryField: 'routines',
            type: 'objects',
            isItem: true,
            isColumn: true,
            optionsQuery: require('../../graphql/query/routine/QueryRoutines.gql'),
            icon: '/icon/routine-icon.png',
        },
        {
            id: 10,
            name: 'Repeats',
            prop: 'repeats',
            queryField: 'repeats',
            type: 'objects',
            isItem: false,
            isColumn: false,
        },
        {
            id: 11,
            name: 'TimePairs',
            prop: 'timePairs',
            queryField: 'timePairs',
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
        routines: [],
        timePairs: [
            {
                id: -1,
                timeType: { id: 80 },
                startTime: {
                    id: -1,
                    type: { id: 80 },
                    endpoint: { id: 84 },
                    moment: { id: 87, text: "Date" },
                    flexibility: { id: 25 },
                    dateTime: formatDate(today()),
                },
                endTime: null,
            }
        ],
        repeats: [],
        iterations: [],
    },
    addItem: addTodo,
    query: {
        name: "todos",
        document: require('../../graphql/query/todo/QueryTodos.gql'),
        variables: {},
    }
}

export default config;