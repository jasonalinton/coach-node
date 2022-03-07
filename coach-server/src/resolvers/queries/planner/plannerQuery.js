const { eventInclude, iterationIncude } = require("../../../properties/event/eventProperties");
const { todoIterationIncude, todoInclude } = require('../../../properties/todoProperties');
const { routineInclude,  } = require('../../../properties/routineProperties');
const { startOfDay, endOfDay, addDay } = require('../../../../utility');
const moment = require('moment');

async function iterations(parent, { type, start, end }, context, info) {
    console.log("")
    let OR = [];
    if (type == 'todo' || type == 'all') {
        OR.push(
            {
                todo: { isDeleted: false }
            }
        )
    } 
    if (type == 'routne' || type == 'all') {
        OR.push(
            {
                routine: { isDeleted: false }
            }
        )
    }

    let AND = [];
    if (start) {
        AND.push({ 
            startAt: { gte: new Date(start) }
        })
    }
    if (end) {
        AND.push({ 
            startAt: { lte: new Date(end) }
        })
    }

    console.log("")

    let iterations = await context.prisma.iteration.findMany({
        where: {
            OR,
            AND
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

    console.log(`Query event, id = ${args.id}`)
    
    return event;
}

async function updateTodoMappings(context) {
    console.log(``)

    let _todos = await context.prisma.todo.findMany({
        include: todoInclude,
        orderBy: { id: 'desc' }
    })

    console.log(``)


    _todos.forEach(async _todo => {
        if (_todo.iterations.length > 0) {
            console.log(``)

            let connect = _todo.iterations.map(_iteration => {
                return { id: _iteration.id }
            })

            let out = await context.prisma.todo.update({
                data: {
                    iterations2: {
                        connect: connect
                    }
                },
                where: { id: _todo.id },
                include: todoInclude,
            })
            console.log(``)
    }
    })
}

async function updateRoutineMappings(context) {
    let _routines = await context.prisma.routine.findMany({
        include: routineInclude,
        orderBy: { id: 'desc' }
    })

    console.log(``)


    _routines.forEach(async _routine => {
        if (_routine.iterations.length > 0) {
            console.log(``)

            let connect = _routine.iterations.map(_iteration => {
                return { id: _iteration.id }
            })

            let out = await context.prisma.routine.update({
                data: {
                    iterations2: {
                        connect: connect
                    }
                },
                where: { id: _routine.id },
                include: routineInclude,
            })
            console.log(``)
    }
    })
}

async function updateIterationMappings(context) {
    console.log(``)

    let _iterations = await context.prisma.iteration.findMany({
        include: { todos: true},
        orderBy: { id: 'desc' }
    })

    console.log(``)

    _iterations.forEach(async _iteration => {
        console.log(``)

        if (_iteration.todos.length > 1)
            console.log(`Iterations-${_iteration.id} has multiple todos mapped to it`)
        else if (_iteration.todos.length == 1) {
            try {
                let out = await context.prisma.iteration.update({
                    data: {
                        todo: { connect: { id: _iteration.todos[0].id }}
                    },
                    where: { id: _iteration.id },
                    include: iterationIncude,
                })

                console.log()
            }
            catch (ex) {

                console.log(ex)

            }
            
        }
    })

    // _iterations.forEach(async _iteration => {
    //     console.log(``)

    //     if (_iteration.routines.length > 1)
    //         console.log(`Iterations-${_iteration.id} has multiple routines mapped to it`)
    //     else if (_iteration.routines.length == 1) {
    //         console.log()
    //         try {
    //             let out = await context.prisma.iteration.update({
    //                 data: {
    //                     routine: { connect: { id: _iteration.routines[0].id }}
    //                 },
    //                 where: { id: _iteration.id },
    //                 include: iterationIncude,
    //             })

    //             console.log()
    //         }
    //         catch (ex) {

    //             console.log(ex)

    //         }
            
    //     }
    // })
}

async function updateTodoIterationMappings(context) {
    console.log(``)

    let _todos = await context.prisma.todo.findMany({
        include: todoInclude,
        orderBy: { id: 'desc' }
    })

    console.log(``)


    _todos.forEach(async _todo => {

        console.log(``)

        try {
            let _iterations = await context.prisma.iteration.updateMany({
                data: { 
                    idTodo: _todo.id,
                    // todo: {
                    //     connect: { id: _todo.id }
                    // }
                },
                // include: { todo: true },
                where: { text: _todo.text }
            })
        }
        catch (err) {
            console.log(err);
        }
        
        console.log(``)
    })
}

async function updateRoutineIterationMappings(context) {
    console.log(``)

    let _routines = await context.prisma.routine.findMany({
        include: routineInclude,
        orderBy: { id: 'desc' }
    })

    console.log(``)


    _routines.forEach(async _routine => {

        console.log(``)

        try {
            let _iterations = await context.prisma.iteration.updateMany({
                data: { 
                    idRoutine: _routine.id,
                    // todo: {
                    //     connect: { id: _routine.id }
                    // }
                },
                // include: { todo: true },
                where: { text: _routine.text }
            })
        }
        catch (err) {
            console.log(err);
        }
        
        console.log(``)
    })
}

async function eventsAndIterations(parent, args, context, info) {
    // await updateTodoIterationMappings(context)
    // await updateRoutineIterationMappings(context)
    // await updateIterationMappings(context);
    // await updateTodoMappings(context);
    // await updateRoutineMappings(context);

    let iterations = await context.prisma.iteration.findMany({
        where: {
            AND: [
                {
                    todo: {
                        is: {
                            // text: "Bathe Bentley"
                            isDeleted: false
                        },
                    }
                },
                {
                    OR: [
                        // {
                        //     todoRepeat: {
                        //         isNot: {
                        //             routineIterations: {
                        //                 some: {}
                        //             },
                        //         },
                        //         is: { routineRepeat: null }
                        //     }
                        // },
                        // {
                        //     todoRepeat: null
                        // }
                        {
                            routineIteration: null
                        }
                    ]
                }
            ],
        },
        include: iterationIncude,
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
                    todo: {
                        is: {
                            isDeleted: false
                        },
                    }
                },
                {
                    routine: {
                        is: {
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
    // iterations2,
    events,
    event,
    eventsAndIterations,
    iterationCompletions
}