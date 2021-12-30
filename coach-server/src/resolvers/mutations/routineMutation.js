const controller = require('../../controller/itemController');
const { eventInclude } = require('../../properties/event/eventProperties');
const { routineInclude } = require('../../properties/routineProperties');
const { configureRepeatTrans } = require('./time/repeatMutation');
const { configureTimePairTrans } = require('./time/timePairMutation');

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

async function updateRoutine(parent, args, context, info) {
    let id = args.routine.id;
    let data = controller.initData(args.routine);

    let transaction = []
    await configureRepeatTrans(data, transaction, context);
    await configureTimePairTrans(data, transaction, context);

    let routine = context.prisma.routine.update({
        where: { id },
        data,
        include: routineInclude
    });
    transaction.push(routine);

    let result = await context.prisma.$transaction(transaction);
    routine = result.pop();

    context.pubsub.publish("ROUTINE_UPDATED", { routineUpdated: routine });
    
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

        let iteration = await context.prisma.iteration.create({
            data: {
                ..._iteration,
                routines: {
                    connect: [{ id: routine.id }]
                },
                routineRepeat: {
                    connect: { id: repeat.id }
                },
                events: {
                    connect: _events
                }
            }
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
    })

    events = await context.prisma.event.findMany({
        include: eventInclude,
        orderBy: { id: 'desc'}
    });

    iterations.forEach(_iteration => {
        context.pubsub.publish("ITERATION_ADDED", { iterationAdded: _iteration });
    })

    events.forEach(_event => {
        context.pubsub.publish("EVENT_ADDED", { eventAdded: _event });
    });

    context.pubsub.publish("ROUTINE_UPDATED", { routineUpdated: routine_updated });

    return routine_updated;
}

async function mapTodoIterations(parent, routineTodo_Iteration, context, info) {
    // console.log("")
    try {
        
        routineTodo_Iteration = await context.prisma.routineTodo_Iteration.create({
            data: {
                // idRoutineIteration: routineTodo_Iteration.idRoutineIteration,
                hasTodoEvent: routineTodo_Iteration.hasTodoEvent,
                todoIterations: routineTodo_Iteration.todoIterations,
                routineIteration: {
                    connect: { id: routineTodo_Iteration.idRoutineIteration }
                }
            }
        })
    }
    catch (error) {
        // console.log(error);
        return;
    }
    // console.log("")
    
    return routineTodo_Iteration;
}

module.exports = {
    addRoutine,
    updateRoutine,
    deleteRoutine,
    createRoutineIterations,
    mapTodoIterations
}