
let config = {
    itemType: "metric",
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
            name: 'Goals',
            prop: 'goals',
            queryField: 'goals',
            type: 'objects',
            isItem: true,
            isColumn: true,
            icon: '/icon/goal-icon.png',
        },
        {
            id: 5,
            name: 'Routines',
            prop: 'routines',
            queryField: 'routines',
            type: 'objects',
            isItem: true,
            isColumn: true,
            icon: '/icon/routine-icon.png',
        },
        {
            id: 6,
            name: 'Todos',
            prop: 'todos',
            queryField: 'todos',
            type: 'objects',
            isItem: true,
            isColumn: true,
            icon: '/icon/task-icon.png',
        }
    ],
    itemModel: {
        text: "",
        description: "",
        parents: [],
        children: [],
        goals: [],
        todos: [],
        routines: []
    },
}

export default config;