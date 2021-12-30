const { eventInclude, iterationIncude } = require("../../../properties/event/eventProperties");
const { todoIterationIncude } = require('../../../properties/todoProperties');
const { startOfDay, endOfDay, addDay } = require('../../../../utility');
const moment = require('moment');

async function iterations(parent, args, context, info) {
    let iterations = await context.prisma.iteration.findMany({
        where: {
            OR: [
                {
                    todos: {
                        some: {
                            isDeleted: false
                        },
                    }
                },
                {
                    routines: {
                        some: {
                            isDeleted: false
                        },
                    }
                },
            ],
        },
        include: iterationIncude,
        orderBy: { id: 'desc' }
    })

    console.log("Queried iterations")
    
    return iterations;
}

async function events(parent, args, context, info) {
    let events = await context.prisma.event.findMany({
        include: eventInclude,
        orderBy: { id: 'desc'}
    });
    
    return events;
}

async function event(parent, args, context, info) {
    console.log(`Query event, id = ${args.id}`)
    let event = await context.prisma.event.findFirst({
        include: eventInclude,
        where: { id: args.id }
    });
    
    return event;
}

async function eventsAndIterations(parent, args, context, info) {
    let iterations = await context.prisma.iteration.findMany({
        where: {
            AND: [
                {
                    todos: {
                        some: {
                            isDeleted: false
                        },
                    }
                },
                {
                    OR: [
                        {
                            todoRepeat: {
                                isNot: {
                                    routineIterations: {
                                        some: {}
                                    },
                                },
                                is: { routineRepeat: null }
                            }
                        },
                        {
                            todoRepeat: null
                        }
                    ]
                }
            ],
        },
        include: todoIterationIncude,
        orderBy: { id: 'desc' }
    })

    let events = await context.prisma.event.findMany({
        include: eventInclude,
        orderBy: { id: 'desc'}
    });

    console.log("Queried events and iterations")
    
    return { iterations, events };
}

module.exports = {
    iterations,
    events,
    event,
    eventsAndIterations,
}