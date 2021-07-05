import { addTodo, updateTodo, deleteTodo } from '../../resolvers/todo/todo-resolvers'
import { onTodoAdded, onTodoUpdated, onTodoDeleted } from '../../resolvers/todo/todo-resolvers'

let config = {
    name: "Todo",
    itemType: "todo",
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
            name: 'Todos',
            prop: 'todos',
            type: 'objects',
            isItem: true,
            optionsQuery: require('../../graphql/query/QueryTodos.gql'),
        },
        {
            id: 6,
            name: 'Routines',
            prop: 'routines',
            type: 'objects',
            isItem: true,
            optionsQuery: require('../../graphql/query/QueryRoutines.gql'),
        },
    ],
    itemModel: {
        text: "",
        description: null,
        parents: [],
        children: [],
        metrics: [],
        todos: [],
        routines: []
    },
    getSubscriptions,
    addItem: addTodo,
    updateItem: updateTodo,
    deleteItem: deleteTodo,
    query: {
        name: "todos",
        document: require('../../graphql/query/QueryTodos.gql'),
        variables: {},
    },
    subscriptions: [
        {
            name: 'todoAdded',
            object: {
                query: require('../../graphql/subscription/TodoAdded.gql'),
                result({ data }) { onTodoAdded(this.$apollo.getClient().cache, data.todoAdded) },
            }
        },
        {
            name: 'todoUpdated',
            object: {
                query: require('../../graphql/subscription/TodoUpdated.gql'),
                result({ data }) { onTodoUpdated(this.$apollo.getClient().cache, data.todoUpdated) },
            }
        },
        {
            name: 'todoDeleted',
            object: {
                query: require('../../graphql/subscription/TodoDeleted.gql'),
                result({ data }) { onTodoDeleted(this.$apollo.getClient().cache, data.todoDeleted) },
            }
        }
    ]
}

export default config;