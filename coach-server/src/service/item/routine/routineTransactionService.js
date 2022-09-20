const { goalInclude } = require('../../../properties/goalProperties');
const { todoInclude } = require('../../../properties/todoProperties');
const { routineInclude } = require('../../../properties/routineProperties');
const { clone } = require('../../../../utility');

async function runCreateTransaction(data, context) {
    /* Remove mapped items from data */
    let routineData = configureData(data);

    /* Run transaction to save routine */
    let transaction;
    let routine = await context.prisma.$transaction(async prisma => {
        /* Create routine */
        const routine_Created = await prisma.routine.create({
            data: routineData
        });

        /* Save records for new mapped items */
        transaction = createTransaction(data, routine_Created.id, prisma);
        for (let i = 0; i < transaction.records.length; i++)
            transaction.subscriptions[i].payload = await transaction.records[i];
            
        return routine_Created;
    });

    /* Publish new mappings */
    for (let i = 0; i < transaction.subscriptions.length; i++) {
        let sub = transaction.subscriptions[i];
        let payload = {};
        payload[sub.prop] = sub.payload;
        context.pubsub.publish(sub.name, payload);
    }

    /* Get routine with updated mappings */
    routine = await context.prisma.routine.findFirst({
        where: { id: routine.id },
        include: routineInclude
    });
    context.pubsub.publish("ROUTINE_ADDED", { routineAdded: routine });

    return routine;
}

async function runUpdateTransaction(data, routineID, context) {
    /* Remove mapped items from data */
    let routineData = configureData(data);

    /* Run transaction to save routine */
    let transaction;
    let routine = await context.prisma.$transaction(async prisma => {
        /* Update routine */
        const routine_Updated = await prisma.routine.update({
            where: { id: routineID },
            data: routineData
        });

        /* Save records for new mapped items */
        transaction = await createTransaction(data, routine_Updated.id, prisma);
        for (let i = 0; i < transaction.records.length; i++)
            transaction.subscriptions[i].payload = await transaction.records[i];
        
        return routine_Updated;
    },
    // {
    //     maxWait: 60000, // default: 2000
    //     timeout: 60000, // default: 5000
    //     }
    );

    /* Publish new mappings */
    for (let i = 0; i < transaction.subscriptions.length; i++) {
        let sub = transaction.subscriptions[i];
        let payload = {};
        payload[sub.prop] = sub.payload;
        context.pubsub.publish(sub.name, payload);
    }

    /* Get routine with updated mappings */
    routine = await context.prisma.routine.findFirst({
        where: { id: routine.id },
        include: routineInclude
    });
    context.pubsub.publish("ROUTINE_UPDATED", { routineUpdated: routine });

    return routine;
}

async function createTransaction(data, routineID, prisma) {
    let transaction = {
        records: [],
        subscriptions: []
    };

    await createRecords(data, routineID, routineInclude, 'parents', 'routine', 'ROUTINE_ADDED', 'routineAdded', transaction, prisma);
    await createRecords(data, routineID, routineInclude, 'children', 'routine', 'ROUTINE_ADDED', 'routineAdded', transaction, prisma);
    await createRecords(data, routineID, goalInclude, 'goals', 'goal', 'GOAL_ADDED', 'goalAdded', transaction, prisma);
    
    await createTodoRecords(data, routineID, todoInclude, 'todos', 'todo', 'TODO_ADDED', 'todoAdded', transaction, prisma);
    await createTodoDisconnectRecords(data, routineID, todoInclude, 'todos', 'todo', 'TODO_UPDATE', 'todoUpdated', transaction, prisma);

    return transaction;
}

function createRecords(data, routineID, include, prop, table, subscriptionName, subscriptionProp, transaction, prisma) {
    if (data[prop] && data[prop].create) {
        data[prop].create.forEach(_item => {
            _item.routines = { connect: { id: routineID } }

            transaction.records.push(prisma[table].create({
                data: _item,
                include
            }));
            transaction.subscriptions.push({ 
                name: subscriptionName,
                prop: subscriptionProp
            });
        });
    }
}

/*
Todo records need to be created sepaeratly.
Custom transactions need to be run to map the todo_repeat, because todo ID needs to be created first
*/
async function createTodoRecords(data, routineID, include, prop, table, subscriptionName, subscriptionProp, transaction, prisma) {
    if (data.todos) {
        for (let i = 0; i < data.todos.length; i++) {
            let _item = data.todos[i];

            _item.routines = { connect: { id: routineID } }

            let repeats = [];
            if (_item.repeats && _item.repeats.create)
                repeats = _item.repeats.create;
            delete _item.repeats;

            try {
                let todo;
                if (!_item.id || _item.id < 0) {
                    todo = await prisma[table].create({
                        data: _item,
                        select: { id: true }
                    });
                } else {
                    todo = await prisma[table].update({
                        where: { id: _item.id },
                        data: { routines: { connect: { id: routineID } } },
                        select: { id: true }
                    });
                    todo = { id: _item.id }
                }

                /* Create todo_repeat relationship */
                repeats.forEach(async _repeat => {
                    _repeat.todo_repeats.create.todo.connect.id = todo.id;
                    _repeat.todos = { connect: { id: todo.id } };
                    await prisma.repeat.create({
                        data: _repeat
                    })
                });

                transaction.records.push(prisma[table].findFirst({
                    where: { id: todo.id },
                    include
                }));
                transaction.subscriptions.push({
                    name: subscriptionName,
                    prop: subscriptionProp
                });
            } catch (ex) {
                console.log(ex);
            }
        }
    }
}

// async function createTodoCreateRecords(data, routineID, include, prop, table, subscriptionName, subscriptionProp, transaction, prisma) {
//     if (data.todos && data.todos.create) {
//         for (let i = 0; i < data.todos.create.length; i++) {
//             let _item = data.todos[i];

//             _item.routines = { connect: { id: routineID } }

//             let repeats = [];
//             if (_item.repeats && _item.repeats.create)
//                 repeats = _item.repeats.create;
//             delete _item.repeats;

//             try {
//                 let todo = await prisma[table].create({
//                     data: _item,
//                     select: { id: true }
//                 });

//                 /* Create todo_repeat relationship */
//                 repeats.forEach(async _repeat => {
//                     _repeat.todo_repeats.create.todo.connect.id = todo.id;
//                     _repeat.todos = { connect: { id: todo.id } };
//                     await prisma.repeat.create({
//                         data: _repeat
//                     })
//                 });

//                 transaction.records.push(prisma[table].findFirst({
//                     where: { id: todo.id },
//                     include
//                 }));
//                 transaction.subscriptions.push({
//                     name: subscriptionName,
//                     prop: subscriptionProp
//                 });
//             } catch (ex) {
//                 console.log(ex);
//             }
//         }
//     }
// }

async function createTodoDisconnectRecords(data, routineID, include, prop, table, subscriptionName, subscriptionProp, transaction, prisma) {
    if (data.unmappedIDs && data.unmappedIDs.todos) {
        for (let i = 0; i < data.unmappedIDs.todos.length; i++) {
            let id = data.unmappedIDs.todos[i];

            try {
                /* Get repeats that correspond to routine */
                let todo = await prisma[table].findFirst({
                    where: { id },
                    select: {
                        repeats: {
                            select: {
                                id: true,
                                startRepeat: { select: { id: true } },
                                // endRepeat: { select: { dateTime: true } },
                                todoIterations: {
                                    select: { id: true },
                                    where: { startAt: { lt: new Date() } }
                                },
                                routineRepeat: { select: { id: true } }
                            }
                        }
                    }
                });
                let routine = await prisma.routine.findFirst({
                    where: { id: routineID },
                    select: { repeats: { select: { id: true } } }
                });
                let repeatIDs = routine.repeats.map(repeat => repeat.id);
                let repeats = todo.repeats.filter(repeat => repeatIDs.includes(repeat.routineRepeat.id));

                /* 
                Delete corresponding repeat, if it has no todoIterations.
                Set repeat to end now and remove any todoIterations after current date, if it has todoIterations mapped to it.
                */
                for (let i = 0; i < repeats.length; i++) {
                    let _repeat = repeats[i];
                    if (_repeat.todoIterations && _repeat.todoIterations.length == 0) {
                        await prisma.repeat.update({
                            where: { id: _repeat.id },
                            data: {
                                startRepeat: { delete: true },
                                endRepeat: { delete: true },
                                startIteration: { delete: true },
                                endIteration: { delete: true },
                                todo_repeats: { deleteMany: {} },
                                todoIterations: { deleteMany: { startAt: { gte: new Date() } } }
                            }
                        });
                        await prisma.repeat.delete({
                            where: { id: _repeat.id },
                        });
                    } else if (_repeat.todoIterations && _repeat.todoIterations.length > 0) {
                        await prisma.repeat.update({
                            where: { id: _repeat.id },
                            data: {
                                endRepeat: { update: { dateTime: new Date() } },
                                todoIterations: { deleteMany: { startAt: { gte: new Date() } } }
                            }
                        });
                    }
                }

                todo = prisma[table].update({
                    where: { id },
                    data: { routines: { disconnect: [{ id: routineID }] } },
                    include
                });

                transaction.records.push(todo);
                transaction.subscriptions.push({
                    name: subscriptionName,
                    prop: subscriptionProp
                });
            } catch (ex) {
                console.log(ex);
            }
        }
    }
}

/* Remove mapped items from data */
function configureData(data) {
    let itemData = clone(data);
    
    delete itemData.parents;
    delete itemData.children;
    delete itemData.todos;
    delete itemData.goals;
    delete itemData.unmappedIDs;

    return itemData;
}

module.exports = {
    runCreateTransaction,
    runUpdateTransaction
}