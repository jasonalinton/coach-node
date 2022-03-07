const { todoInclude, todoIterationIncude } = require('../../../properties/todoProperties');
const { eventInclude } = require('../../../properties/event/eventProperties');
const { deleteTodo } = require('./todoMutation');
const { refreshRepetitiveEvents } = require('../../../controller/planner/plannerController');
const moment = require('moment');

/* Create default task with only title and recommended start time */
/* Create iteration. Set completion */
async function createDefaultTask(parent, { iteration }, context, info) {
    let scheduledType = await context.prisma.type.findFirst({
        where: { text: 'Scheduled' }
    });

     console.log("Create default task");

    let startTime = await context.prisma.time.create({
        data: {
            idType: 81,
            idEndpoint: 84,
            idMoment: 89,
            idFlexibility: 25,
            dateTime: iteration.startAt
        }
    })
    
    let connectedEvents = []
    if (iteration.events) {
        iteration.events.forEach(_event => connectedEvents.push({ id: _event.id }));
    }
    
    console.log("Connect events");

    let todo = await context.prisma.todo.create({
        data: {
            text: iteration.text,
            timePairs: {
                create: {
                    idTimeType: scheduledType.id,
                    idStartTime: startTime.id
                }
            },
            iterations: {
                create: {
                    text: iteration.text,
                    startAt: iteration.startAt,
                    attemptedAt: iteration.attemptedAt,
                    completedAt: iteration.completedAt,
                    isRecommended: (iteration.isRecommended) ? iteration.isRecommended : false,
                    events: { connect: connectedEvents }
                }
            }
        },
        include: todoInclude
    });

    // console.log("Created default task");

    iteration = await context.prisma.iteration.findFirst({
        where: { id: todo.iterations[0].id },
        include: todoIterationIncude
    })

    context.pubsub.publish("TODO_ADDED", { todoAdded: todo });
    context.pubsub.publish("ITERATION_ADDED", { iterationAdded: iteration });

    /* Iterations can automatically be created into events */
    if (connectedEvents.length > 0) {
        let eventIDs = connectedEvents.map(_event => _event.id);
        let _events = await context.prisma.event.findMany({
            where: { id: { in: eventIDs } },
            include: eventInclude
        })

        console.log("Created default task");
        _events.forEach(_event => {
            context.pubsub.publish("EVENT_UPDATED", { eventUpdated: _event });
        })
    }
    return todo;
}

// TODO: You might want to change this name. 
// Technically it's just setting the value. Not necessarily toggling
async function toggleCompletion(parent, { iteration }, context, info) {
    console.log("Toggle completion");
    iteration = await context.prisma.iteration.update({
        where: { id: iteration.id },
        data: {
            attemptedAt: iteration.attemptedAt,
            completedAt: iteration.completedAt
        },
        include: todoIterationIncude
    });

    context.pubsub.publish("ITERATION_UPDATED", { iterationUpdated: iteration });

    return iteration;
}

async function rescheduleIteration(parent, { id, startAt }, context, info) {
    console.log(`Reschedule iteration`);
    
    let iteration = await context.prisma.iteration.update({
        where: { id },
        data: { startAt },
        include: todoIterationIncude
    });

    context.pubsub.publish("ITERATION_UPDATED", { iterationUpdated: iteration });

    return iteration;
}

async function rescheduleIterationFromParent(parent, { id, startAt, parentType, parentID }, context, info) {
    console.log(`Reschedule iteration`);

    let transactions = [];

    if (parentType && parentType == 'routineEvent') {
        let iteration = await context.prisma.iteration.findFirst({
            where: { id },
            include: todoIterationIncude
        });

        let event = context.prisma.event.update({
            data: { iterations: { disconnect: [{ id: parentID }] } },
            where: { id: parentID },
            include: eventInclude
        });
        transactions.push(event);

        let routineTodoIteration = context.prisma.routineTodo_Iteration.update({
            data: { todoIterations: { disconnect: id } },
            where: { idRoutineIteration: iteration.idRoutineIteration }
        });
        transactions.push(routineTodoIteration);
    }
    
    let iteration = await context.prisma.iteration.update({
        where: { id },
        data: { startAt },
        include: todoIterationIncude
    });

    context.pubsub.publish("ITERATION_UPDATED", { iterationUpdated: iteration });

    return iteration;
}

async function attemptIteration(parent, { id, attemptedAt }, context, info) {
    console.log(`Attempt iteration`);

    let include = { ...todoIterationIncude };
    include.repeat = { select: { id: true } }
    include.todoRepeat = { select: { id: true } }
    include.routineRepeat = { select: { id: true } }
    
    let iteration_orig = await context.prisma.iteration.findFirst({
        where: { id },
        include
    });
    
    let iteration_updated = context.prisma.iteration.update({
        where: { id },
        data: {
            text: `[Attempted] ${iteration_orig.text}`,
            attemptedAt
        },
        include: todoIterationIncude
    });

    console.log(`updated iteration`);
    
    let data = {
        text: iteration_orig.text,
        startAt: moment(iteration_orig.startAt).add(1, 'day').toDate(),
        isRecommended: (iteration_orig.isRecommended) ? iteration.isRecommended : false,
        todo: { connect: { id: iteration_orig.todo.id } }
    }
    
    if (iteration_orig.repeat)
        data.repeat = { connect: { id: iteration_orig.repeat.id } }
    if (iteration_orig.todoRepeat)
        data.todoRepeat = { connect: { id: iteration_orig.todoRepeat.id } }
    if (iteration_orig.routineRepeat)
        data.routineRepeat = { connect: { id: iteration_orig.routineRepeat.id } }
    
    let iteration_new = context.prisma.iteration.create({
        data,
        include: todoIterationIncude
    });

    let result = await context.prisma.$transaction([iteration_updated, iteration_new]);
    iteration_updated = result[0];
    iteration_new = result[1];

    context.pubsub.publish("ITERATION_UPDATED", { iterationUpdated: iteration_updated });
    context.pubsub.publish("ITERATION_ADDED", { iterationAdded: iteration_new });

    return iteration_updated;
}

/* Delete iteraiton
 * If only iteration mapped to todo. Mark todo deleted */
async function deleteIteration(parent, { id }, context, info) {
    console.log("Get iteration to delete")
    let iteration = await context.prisma.iteration.findFirst({
        where: { id: id },
        include: {
            todo: {
                select: {
                    id: true,
                    text: true,
                    iterations: { select: { id: true } },
                    children: { select: { id: true } },
                }
            }
        }
    });

    console.log("Check if iteration has siblings")
    if (iteration.todo.iterations.length == 1 && iteration.todo.children.length == 0) {
        await deleteTodo(parent, iteration.todo, context, info)
    } else {
        iteration = await context.prisma.iteration.delete({
            where: { id: iteration.id }
        });
        console.log("No siblings")
        context.pubsub.publish("ITERATION_DELETED", { iterationDeleted: iteration });
    }
    console.log("Done")

    return iteration;
}

async function refreshRepetitive(parent, args, context, info) {
    return await refreshRepetitiveEvents(null, null, null, context)
}

module.exports = {
    createDefaultTask,
    toggleCompletion,
    rescheduleIteration,
    attemptIteration,
    deleteIteration,
    refreshRepetitive,
}