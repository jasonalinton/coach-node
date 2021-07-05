import { replaceItem, removeItem } from '../../../utility';

let config = {
    name: "Metric",
    itemType: "metric",
    query: {
        name: "metrics",
        document: require('../../graphql/query/QueryMetrics.gql'),
        variables: {},
    },
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
            name: 'Goals',
            prop: 'goals',
            type: 'objects',
            isItem: true,
            optionsQuery: require('../../graphql/query/QueryGoals.gql'),
            subscriptions: {
                goalUpdated: {
                    query: require('../../graphql/subscription/GoalUpdated.gql'),
                    result: function ({ data }) {
                        let goal = data.goalUpdated;
                        let id = goal.id;

                        goal.metrics.forEach(_metric => {
                            let metric = this.metrics.find(metric => metric.id == _metric.id);
                            let existingGoal = metric.goals.find(_metric => _metric.id == id)
                            if (existingGoal) {
                                replaceItem(goal, metric.goals)
                            } else {
                                metric.goals.push(goal);
                            }
                        })
                    },
                },
                goalDeleted: {
                    query: require('../../graphql/subscription/GoalDeleted.gql'),
                    result: function ({ data }) {
                        let id = data.goalDeleted.id
                        this.items.forEach(item => {
                            let goal = item.goals.find(goal => goal.id == id);
                            if (goal != undefined) {
                                removeItem(goal, item.goals);
                            }
                        })
                    }
                }
            }
        },
        {
            id: 5,
            name: 'Routines',
            prop: 'routines',
            type: 'objects',
            isItem: true,
            optionsQuery: require('../../graphql/query/QueryRoutines.gql')
        },
        {
            id: 6,
            name: 'Todos',
            prop: 'todos',
            type: 'objects',
            isItem: true,
            optionsQuery: require('../../graphql/query/QueryTodos.gql')
        }
    ],
    deleteItem: () => { },
    itemModel: {
        text: "",
        description: "",
        parents: [],
        children: [],
        goals: [],
        todos: [],
        routines: []
    },
    getSubscriptions,
    getSubscriptions2,
    subscriptions: []
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

function getSubscriptions2() {
    let subscribe = {};
    let subscriptions = [];

    this.config.props.forEach(prop => {
        if (prop.subscriptions2) {
            subscriptions.push(prop.subscriptions2);
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

// function deleteSubscription(_this, data, resultName, itemTypes) {
//     let id = data[resultName].id
//     _this.items.forEach(item => {
//         let itemWith = item[itemTypes].find(itemWith => itemWith.id == id);
//         if (itemWith != undefined) {
//             removeItem(itemWith, item[itemTypes]);
//         }
//     })
// }

export default config;