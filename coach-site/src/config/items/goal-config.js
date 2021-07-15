import {
    addGoal, updateGoal, deleteGoal,
    onGoalAdded, onGoalUpdated, onGoalDeleted
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
            optionsQuery: require('../../graphql/query/QueryTodos.gql'),
        },
        {
            id: 8,
            name: 'Routines',
            prop: 'routines',
            queryField: 'routines',
            type: 'objects',
            isItem: true,
            isColumn: true,
            optionsQuery: require('../../graphql/query/QueryRoutines.gql'),
        },
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
    },
    subscriptions: [
        {
            name: 'goalAdded',
            object: {
                query: require('../../graphql/subscription/goal/GoalAdded.gql'),
                result({ data }) { onGoalAdded(this.$apollo.getClient().cache, data.goalAdded) },
            }
        },
        {
            name: 'goalUpdated',
            object: {
                query: require('../../graphql/subscription/goal/GoalUpdated.gql'),
                result({ data }) { onGoalUpdated(this.$apollo.getClient().cache, data.goalUpdated) },
            }
        },
        {
            name: 'goalDeleted',
            object: {
                query: require('../../graphql/subscription/goal/GoalDeleted.gql'),
                result({ data }) { onGoalDeleted(this.$apollo.getClient().cache, data.goalDeleted) },
            }
        }
    ]
}

export default config;