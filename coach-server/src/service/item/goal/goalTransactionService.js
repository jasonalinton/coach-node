const { goalInclude } = require('../../../properties/goalProperties');
const { todoInclude } = require('../../../properties/todoProperties');
const { routineInclude } = require('../../../properties/routineProperties');
const { clone } = require('../../../../utility');

async function runCreateTransaction(data, context) {
    /* Remove mapped items from data */
    let goalData = configureData(data);

    /* Run transaction to save goal */
    let transaction;
    let goal = await context.prisma.$transaction(async prisma => {
        /* Create goal */
        const goal_Created = await prisma.goal.create({
            data: goalData
        });

        /* Save records for new mapped items */
        transaction = createTransaction(data, goal_Created.id, prisma);
        for (let i = 0; i < transaction.records.length; i++)
            transaction.subscriptions[i].payload = await transaction.records[i];
            
        return goal_Created;
    });

    /* Publish new mappings */
    for (let i = 0; i < transaction.subscriptions.length; i++) {
        let sub = transaction.subscriptions[i];
        let payload = {};
        payload[sub.prop] = sub.payload;
        context.pubsub.publish(sub.name, payload);
    }

    /* Get goal with updated mappings */
    goal = await context.prisma.goal.findFirst({
        where: { id: goal.id },
        include: goalInclude
    });
    context.pubsub.publish("GOAL_ADDED", { goalAdded: goal });

    return goal;
}

async function runUpdateTransaction(data, goalID, context) {
    /* Remove mapped items from data */
    let goalData = configureData(data);

    /* Run transaction to save goal */
    let transaction;
    let goal = await context.prisma.$transaction(async prisma => {
        /* Update goal */
        const goal_Updated = await prisma.goal.update({
            where: { id: goalID },
            data: goalData
        });

        /* Save records for new mapped items */
        transaction = createTransaction(data, goal_Updated.id, prisma);
        for (let i = 0; i < transaction.records.length; i++)
            transaction.subscriptions[i].payload = await transaction.records[i];
            
        return goal_Updated;
    });

    /* Publish new mappings */
    for (let i = 0; i < transaction.subscriptions.length; i++) {
        let sub = transaction.subscriptions[i];
        let payload = {};
        payload[sub.prop] = sub.payload;
        context.pubsub.publish(sub.name, payload);
    }

    /* Get goal with updated mappings */
    goal = await context.prisma.goal.findFirst({
        where: { id: goal.id },
        include: goalInclude
    });
    context.pubsub.publish("GOAL_UPDATED", { goalUpdated: goal });

    return goal;
}

function createTransaction(data, goalID, prisma) {
    let transaction = {
        records: [],
        subscriptions: []
    };

    createRecords(data, goalID, goalInclude, 'parents', 'goal', 'GOAL_ADDED', 'goalAdded', transaction, prisma);
    createRecords(data, goalID, goalInclude, 'children', 'goal', 'GOAL_ADDED', 'goalAdded', transaction, prisma);
    createRecords(data, goalID, todoInclude, 'todos', 'todo', 'TODO_ADDED', 'todoAdded', transaction, prisma);
    createRecords(data, goalID, routineInclude, 'routines', 'routine', 'ROUTINE_ADDED', 'routineAdded', transaction, prisma);

    return transaction;
}

function createRecords(data, goalID, include, prop, table, subscriptionName, subscriptionProp, transaction, prisma) {
    if (data[prop] && data[prop].create) {
        data[prop].create.forEach(_item => {
            _item.goals = { connect: { id: goalID } }

            transaction.records.push(prisma[table].create({
                data: _item,
                include
            }));
            transaction.subscriptions.push({ 
                name: subscriptionName,
                prop: subscriptionProp
            });
        });
        data[prop]
    }
}

/* Remove mapped items from data */
function configureData(data) {
    let goalData = clone(data);
    
    delete goalData.parents.create;
    delete goalData.children.create;
    delete goalData.todos.create;
    delete goalData.routines.create;

    return goalData;
}

module.exports = {
    runCreateTransaction,
    runUpdateTransaction
}