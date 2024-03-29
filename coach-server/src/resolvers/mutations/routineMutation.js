const { clone } = require('../../../utility');
const controller = require('../../controller/itemController');
const { eventInclude } = require('../../properties/event/eventProperties');
const { routineInclude } = require('../../properties/routineProperties');
const { configureRepeatTrans } = require('./time/repeatMutation');
const { configureTimePairTrans } = require('./time/timePairMutation');

const { configureRoutine } = require("../../service/item/routine/routineConfigurationService");
const { runCreateTransaction, runUpdateTransaction } = require('../../service/item/routine/routineTransactionService');
const { CONFIGURATION_TYPES } = require("../../../constant");


async function addRoutine(parent, args, context, info) {
    let data = controller.initData(args.routine);

    console.log("Add routine");

    let routine = await context.prisma.routine.create({
        data,
        include: routineInclude
    });

    context.pubsub.publish("ROUTINE_ADDED", { routineAdded: routine });
    
    return routine;
}

// async function updateRoutine(parent, args, context, info) {
//     let id = args.routine.id;
//     let data = controller.initData(args.routine);

//     let transaction = []
//     await configureRepeatTrans(data, transaction, context);
//     await configureTimePairTrans(data, transaction, context);

//     let routine = context.prisma.routine.update({
//         where: { id },
//         data,
//         include: routineInclude
//     });
//     transaction.push(routine);

//     let result = await context.prisma.$transaction(transaction);
//     routine = result.pop();

//     context.pubsub.publish("ROUTINE_UPDATED", { routineUpdated: routine });
    
//     return routine;
// }

async function updateRoutine(parent, args, context, info) {
    let data = configureRoutine(args.routine, CONFIGURATION_TYPES.UPDATE);
    let routine = await runUpdateTransaction(data, args.routine.id, context);
    
    return routine;
}

async function deleteRoutine(parent, args, context, info) {
    let routine = await context.prisma.routine.update({
        where: { id: args.id },
        data: { isDeleted: true },
        include: routineInclude
    });

    context.pubsub.publish("ROUTINE_DELETED", { routineDeleted: routine });
    
    return routine;
}

async function createRoutineIterations(parent, { routine }, context, info, repeat) {
    let iterations = [];
    let events = [];

    // Create iterations
    let iterations_new = routine.iterations.filter(_i => !_i.id);
    for (let i = 0; i < iterations_new.length; i++){
        let _iteration = iterations_new[i];
        let _events = [];

        // Create event to be mapped to iteration
        // Note: Prisma doesn't allow to createMany with many-to-many relationships
        if (_iteration.events) {
            for (let j = 0; j < _iteration.events.length; j++) {
                let _event = await context.prisma.event.create({
                    data: {
                        ..._iteration.events[j],
                        type: {
                            connect: { id: 127 }
                        }
                    }
                });
                _events.push({ id: _event.id });
            }
        }
        
        delete _iteration.events;

        console.log(``)

        let iteration = await context.prisma.iteration.create({
            data: {
                ..._iteration,
                routine: {
                    connect: { id: routine.id }
                },
                routineRepeat: {
                    connect: { id: repeat.id }
                },
                events: {
                    connect: _events
                }
            },
            include: { events: { include: eventInclude } }
        });
        iterations.push(iteration);
    }

    // Upsert routine_repeats
    let repeats_updated = routine.repeats.filter(_repeat => _repeat.isUpdated);
    for (let i = 0; i < repeats_updated.length; i++) {
        let _repeat = repeats_updated[i];
        
        // Create routine_repeat
        let routine_repeats_new = _repeat.routine_repeats.filter(_routine_repeat => !_routine_repeat.id);
        for (let i = 0; i < routine_repeats_new.length; i++) {
            let routine_repeat_new = routine_repeats_new[i];

            let idRoutine = routine_repeat_new.routine.id;
            delete routine_repeat_new.routine;
            delete routine_repeat_new.repeat;

            await context.prisma.routine_Repeat.create({
                data: {
                    ...routine_repeat_new,
                    idRoutine,
                    idRepeat: _repeat.id
                },
            })
        }

        // Update routine_repeat
        let routine_repeats_updated = _repeat.routine_repeats.filter(_routine_repeat => _routine_repeat.isUpdated);
        for (let i = 0; i < routine_repeats_updated.length; i++) {
            let routine_repeat_updated = routine_repeats_updated[i];
            
            let idRoutine = routine_repeat_updated.routine.id;
            delete routine_repeat_updated.routine;
            delete routine_repeat_updated.repeat;
            delete routine_repeat_updated.isUpdated;

            await context.prisma.routine_Repeat.update({
                where: { id: routine_repeat_updated.id, },
                data: {
                    ...routine_repeat_updated,
                    idRoutine,
                    idRepeat: _repeat.id
                },
            })
        }
    }
    // Get updated routine
    routineInclude.iterations.where = {
        id: { in: iterations.map(_iteration => _iteration.id) }
    }

    let routine_updated = await context.prisma.routine.findFirst({
        where: { id: routine.id },
        include: routineInclude
    });

    events = iterations.flatMap(_iteration => _iteration.events);

    // THESE ARE COMMENTED OUT BECAUSE THEY DO TO MUCH PUBLISHING
    // PUBLISHING SHOULD BE DONE IN BATCHES NOT INDIVIDUALLY!
    // iterations.forEach(_iteration => {
    //     context.pubsub.publish("ITERATION_ADDED", { iterationAdded: _iteration });
    // })

    // events.forEach(_event => {
    //     context.pubsub.publish("EVENT_ADDED", { eventAdded: _event });
    // });

    // context.pubsub.publish("ROUTINE_UPDATED", { routineUpdated: routine_updated });

    return routine_updated;
}

async function mapTodoIterations(parent, routineTodo_Iteration, context, info) {
    try {
        routineTodo_Iteration = await context.prisma.routineTodo_Iteration.create({
            data: {
                hasTodoEvent: routineTodo_Iteration.hasTodoEvent,
                todoIterations: routineTodo_Iteration.todoIterations,
                routineIteration: { connect: { id: routineTodo_Iteration.idRoutineIteration } }
            },
            include: {
                routineIteration: { include: { events: { select: { id: true }} } },
                todoIterations: { select: { id: true }}
            }
        })

        if (routineTodo_Iteration.routineIteration.events[0]) {
            let eventID = routineTodo_Iteration.routineIteration.events[0].id;
            routineTodo_Iteration.todoIterations.forEach(async _todoIteration => {
                let iteration_updated = await context.prisma.iteration.update({
                    data: { events: { connect: { id: eventID } } },
                    where: { id: _todoIteration.id }
                })
            })
        }
    }
    catch (error) {
        // console.log(error);
        return;
    }
    
    return routineTodo_Iteration;
}

// Delete routine iterations
    // Delete events mapped to iteration
    // Update last iterations datetime
// Delete todo iterations
    // Update last iterations datetime
async function deleteFutureRoutineIterations(parent, { idRoutine, datetime }, context, info) {
    datetime = (datetime) ? datetime : new Date();
    let deletedIterations = [];

    let include = {};
    include.repeats = clone(routineInclude.repeats);
    include.repeats.select.routineIterations.where = {
        startAt: { gte: datetime }
    }
    include.repeats.select.todoIterations.where = {
        startAt: { gte: datetime }
    }
    include.repeats.select.todoRepeats.select.todo_repeats = { select: { id: true } }

    
    await context.prisma.$transaction(async prisma => {
        let routine = await context.prisma.routine.findFirst({
            where: { id: idRoutine },
            include
        });

        for (let i = 0; i < routine.repeats.length; i++) {
            let _repeat = routine.repeats[i];
            for (let j = 0; j < _repeat.routineIterations.length; j++) {
                let _routineIteration = _repeat.routineIterations[j];
                await prisma.iteration.update({
                    data: {
                        events: { deleteMany: { startAt: { gte: datetime } } },
                        routineIteration: { delete: true }
                    },
                    where: { id: _routineIteration.id }
                });
                await prisma.iteration.delete({
                    where: { id: _routineIteration.id }
                });
                deletedIterations.push({ id: _routineIteration });
            }

            await prisma.routine_Repeat.updateMany({
                data: { lastIterationDateTime: datetime },
                where: { idRoutine, idRepeat: _repeat.id }
            });

            for (let j = 0; j < _repeat.todoRepeats.length; j++) {
                let _todoRepeat = _repeat.todoRepeats[j];
                for (let k = 0; k < _todoRepeat.todoIterations.length; k++) {
                    let _todoIteration = _todoRepeat.todoIterations[k];
                    // await prisma.iteration.update({
                    //     data: { todoIteration: { delete: true } },
                    //     where: { id: _todoIteration.id },
                    // });
                    await prisma.iteration.delete({
                        where: { id: _todoIteration.id },
                    });
                    deletedIterations.push({ id: _todoIteration });
                }

                for (let k = 0; k < _todoRepeat.todo_repeats.length; k++) {
                    let _todo_repeat = _todoRepeat.todo_repeats[k];
                    await prisma.todo_Repeat.update({
                        data: { lastIterationDateTime: datetime },
                        where: { id: _todo_repeat.id }
                    })
                }
            }

        }
        return routine;
    })

    return true;
}

module.exports = {
    addRoutine,
    updateRoutine,
    deleteRoutine,
    createRoutineIterations,
    mapTodoIterations,
    deleteFutureRoutineIterations
}