import {
    addTodo, updateTodo, deleteTodo,
    onTodoAdded, onTodoUpdated, onTodoDeleted
} from '../../resolvers/todo-resolvers'

let config = {
    itemType: "todo",
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
            queryField: 'todos',
            type: 'objects',
            isItem: true,
            isColumn: true,
            optionsQuery: require('../../graphql/query/todo/QueryTodos.gql'),
            icon: '/icon/parent-icon.png',
        },
        {
            id: 5,
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
            id: 9,
            name: 'Repeats',
            prop: 'repeats',
            queryField: 'repeats',
            type: 'objects',
            isItem: false,
            isColumn: false,
        },
        {
            id: 10,
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
        timePairs: [],
        repeats: [],
        iterations: [],
    },
    addItem: addTodo,
    updateItem: updateTodo,
    deleteItem: deleteTodo,
    query: {
        name: "todos",
        document: require('../../graphql/query/todo/QueryTodos.gql'),
        variables: {},
    },
    subscriptions: [
        {
            name: 'todoAdded',
            object: {
                query: require('../../graphql/subscription/todo/TodoAdded.gql'),
                result({ data }) { onTodoAdded(this.$apollo.getClient().cache, data.todoAdded) },
            }
        },
        {
            name: 'todoUpdated',
            object: {
                query: require('../../graphql/subscription/todo/TodoUpdated.gql'),
                result({ data }) { onTodoUpdated(this.$apollo.getClient().cache, data.todoUpdated) },
            }
        },
        {
            name: 'todoDeleted',
            object: {
                query: require('../../graphql/subscription/todo/TodoDeleted.gql'),
                result({ data }) { onTodoDeleted(this.$apollo.getClient().cache, data.todoDeleted) },
            }
        }
    ]
}

export default config;