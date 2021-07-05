// import { replaceItem, removeItem } from '../../../utility';
import { addGoal, updateGoal, deleteGoal } from '../../resolvers/goal/goal-resolvers'
import { onGoalAdded, onGoalUpdated, onGoalDeleted } from '../../resolvers/goal/goal-resolvers'

let config = {
    name: "Goal",
    itemType: "goal",
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
    getSubscriptions,
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
                query: require('../../graphql/subscription/GoalAdded.gql'),
                result({ data }) { onGoalAdded(this.$apollo.getClient().cache, data.goalAdded) },
            }
        },
        {
            name: 'goalUpdated',
            object: {
                query: require('../../graphql/subscription/GoalUpdated.gql'),
                result({ data }) { onGoalUpdated(this.$apollo.getClient().cache, data.goalUpdated) },
            }
        },
        {
            name: 'goalDeleted',
            object: {
                query: require('../../graphql/subscription/GoalDeleted.gql'),
                result({ data }) { onGoalDeleted(this.$apollo.getClient().cache, data.goalDeleted) },
            }
        }
    ]
}

function getSubscriptions() {
    let subscribe = {};
    let subscriptions = [];

    config.props.forEach(prop => {
        if (prop.subscriptions) {
            subscriptions.push(...prop.subscriptions);
        }
    });

    Object.assign(subscribe, subscriptions);

    return subscriptions;
}

// function updateSubscription( _this, data, resultName, thisTypes, itemTypes) {
//     let id = data[resultName].id;
//     let updatedItem = data[resultName];

//     _this.items.forEach(item => {
//         let existingItem = item[itemTypes].find(existingItem => existingItem.id == updatedItem.id);
//         if (existingItem) {
//             if (!updatedItem[thisTypes].find(hmm => hmm.id == item.id)) {
//                 removeItem(existingItem, item[itemTypes]);
//                 return;
//             }
//         }
//     })

//     updatedItem[thisTypes].forEach(item => {
//         let itemWith = _this.items.find(itemWith => itemWith.id == item.id);
//         let existingItem = itemWith[itemTypes].find(item => item.id == id)
//         if (existingItem) {
//             replaceItem(updatedItem, itemWith[itemTypes]);
//         } else {
//             itemWith[itemTypes].push(updatedItem);
//         }
//     })
// }

export default config;