export default {
    itemType: "metric",
    query: {
        name: "metrics",
        document: require('../../../graphql/query/QueryMetrics.gql'),
        variables: {},
    },
    table: {
        columns: [
            {
                id: 1,
                name: 'ID',
                prop: 'id',
                type: 'int'
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
                type: 'objects'
            },
            {
                id: 5,
                name: 'Routines',
                prop: 'routines',
                type: 'objects'
            },
            {
                id: 6,
                name: 'Todos',
                prop: 'todos',
                type: 'objects'
            },
        ]
    },
    deleteItem: () => { },
    itemModel: {
        text: "",
        description: "",
        parents: [],
        children: [],
        goals: [],
        todos: [],
        routines: []
    }
}