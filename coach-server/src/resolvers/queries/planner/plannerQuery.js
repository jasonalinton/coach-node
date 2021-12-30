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

async function iterationCompletions(parent, args, context, info) {
    let start = startOfDay(new Date(args.start)) ;
    let end = endOfDay(new Date(args.end));

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
            AND: [
                { 
                    startAt: { gte: start }
                },
                { 
                    startAt: { lte: end }
                },
                // {
                //     routineIteration: { none: {} }
                // }
            ]
        },
        orderBy: { id: 'desc' },
        include: { routineIteration: true }
    })

    console.log("Queried iteration completion percentages");

    let iterationCompletions = [];

    let date = new Date(start);
    while (date.getTime() <= end.getTime()) {
        let _iterations = iterations.filter(_iteration => _iteration.routineIteration == null && (new Date(_iteration.startAt)).toDateString() == date.toDateString());

        let complete = _iterations.filter(_iteration => _iteration.attemptedAt).length;
        let pending = _iterations.filter(_iteration => !_iteration.attemptedAt).length;
        let total = _iterations.length;

        iterationCompletions.push({
            datetime: moment(date).format(),
            complete,
            pending,
            total,
            percentComplete: (total > 0) ? parseInt(complete / total * 100) : 100
        });

        // console.log("");

        date = addDay(date);
    }

    // console.log("");
    
    return iterationCompletions;
}

module.exports = {
    iterations,
    events,
    event,
    eventsAndIterations,
    iterationCompletions
}