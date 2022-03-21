const { eventInclude, iterationIncude } = require("../../../properties/event/eventProperties");
const { todoInclude } = require("../../../properties/todoProperties");
const { routineInclude } = require("../../../properties/routineProperties");
const plannerController = require('../../../controller/planner/plannerController');

async function addEvent(parent, { text, startAt, endAt }, context, info) {
    let event = await context.prisma.event.create({
        data: { text, startAt, endAt },
        include: eventInclude
    });

    context.pubsub.publish("EVENT_ADDED", { eventAdded: event });

    return event;
}

async function mapIterationToEvent(parent, { iterationID, eventID }, context, info) {
    let event = await context.prisma.event.update({
        data: { iterations: { connect: { id: iterationID } } },
        where: { id: eventID },
    });

    let iteration = await context.prisma.iteration.update({
        data: { 
            startAt: event.startAt,
            endAt: event.endAt
        },
        where: { id: iterationID },
        include: iterationIncude
    });

    event = await context.prisma.event.update({
        data: { iterations: { connect: { id: iterationID } } },
        where: { id: eventID },
        include: eventInclude
    });

    
    context.pubsub.publish("ITERATION_UPDATED", { iterationUpdated: iteration });

    return { event, iteration };
}

async function unmapTaskFromRoutineEvent(parent, { iterationID, eventID, startAt, endAt, newEventID }, context, info) {
    console.log(`Unmap task from routine event`);
    
    let iteration = await context.prisma.iteration.findFirst({
        where: { id: iterationID },
        include: {
            todoIteration: true,
        }
    });

    let trans = [];
    
    /* Iterations can be mapped to routine event without being mapped to iteration */
    if (iteration.idRoutineIteration) {
        let routineTodoIteration = context.prisma.routineTodo_Iteration.update({
            data: { todoIterations: { disconnect: { id: iterationID} } },
            where: { id: iteration.idRoutineIteration }
        });
        trans.push(routineTodoIteration);
    }
    
    let event_old = context.prisma.event.update({
        data: { iterations: { disconnect: [{ id: iterationID }] } },
        where: { id: eventID },
    });
    trans.push(event_old);
    
    if (newEventID) {
        let event_new = context.prisma.event.update({
            data: { iterations: { connect: [{ id: iterationID }] } },
            where: { id: newEventID },
        });
        trans.push(event_new);
    }
    
    let updatedIteration = context.prisma.iteration.update({
        data: { startAt, endAt },
        where: { id: iterationID },
    });
    trans.push(updatedIteration);

    await context.prisma.$transaction(trans);
    
    event_old = await context.prisma.event.findFirst({
        where: { id: eventID },
        include: eventInclude
    });
    context.pubsub.publish("EVENT_UPDATED", { eventUpdated: event_old });
    
    if (newEventID) {
        event_new = context.prisma.event.findFirst({
            where: { id: newEventID },
            include: eventInclude
        });
        context.pubsub.publish("EVENT_UPDATED", { eventUpdated: event_new });
    }
    
    updatedIteration = context.prisma.iteration.findFirst({
        where: { id: iterationID },
        include: iterationIncude
    });
    context.pubsub.publish("ITERATION_UPDATED", { iterationUpdated: updatedIteration });

    return { event: event_old, iteration };
}

async function refreshRepetitiveTodo(parent, { idTodo }, context, info) {
    let todo = await context.prisma.todo.findFirst({
        where: { id: idTodo },
        include: todoInclude
    });

    todo.repeats = todo.repeats.filter(_repeat => _repeat.routineRepeat == null && 
                                                 (_repeat.routine_repeats && _repeat.routine_repeats.length == 0));

    return await plannerController.createRepetitiveEvents(todo, 'todo', null, null, null, context);
}

async function refreshRepetitiveRoutine(parent, { idRoutine }, context, info) {
    let include = { ...routineInclude };
    include.todos = { include: todoInclude };
    
    let routine = await context.prisma.routine.findFirst({
        where: { id: idRoutine },
        include
    });

    plannerController.refreshRepetitiveRoutine(routine, null, null, null, context)
}

module.exports = {
    addEvent,
    mapIterationToEvent,
    unmapTaskFromRoutineEvent,
    refreshRepetitiveTodo,
    refreshRepetitiveRoutine
}