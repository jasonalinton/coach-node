const { eventInclude, iterationIncude } = require("../../../properties/event/eventProperties");
const { todoInclude } = require('../../../properties/todoProperties');
const { routineInclude,  } = require('../../../properties/routineProperties');
const { startOfDay, endOfDay, addDay } = require('../../../../utility');
const moment = require('moment');

async function mapRoutineEventsToIterations(context) {
    let iterations1 = await context.prisma.iteration.findMany({
        include: iterationIncude,
        orderBy: { id: 'desc' }
    })

    // iterations1.forEach(_iter => {
    for (let j = 0; j < iterations1.length; j++) {
        let _iter = iterations1[j];
        if (_iter.events.length > 1) {
            console.log(`${_iter.text}-${_iter.id} - ${_iter.startAt}`)
            // console.log(_iter)
            console.log("MUTIPLE EVENTS!");
        }

        if (_iter.routineIteration && _iter.events.length > 0) {
            let eventID = _iter.events[0].id;
            // _iter.routineIteration.todoIterations.forEach(async _todoIter => {
            for (let i = 0; i < _iter.routineIteration.todoIterations.length; i++) {
                let _todoIter = _iter.routineIteration.todoIterations[i];
                let iteration = await context.prisma.iteration.update({
                    data: {
                        events: { connect: {id: eventID}}
                    },
                    where: { id: _todoIter.id },
                    include: iterationIncude
                })
                console.log(iteration.events.length);

            }
        }
    }
}

async function iterations(parent, { type, startAt, endAt }, context, info) {
    let AND = [];
    if (type == 'todo' || type == 'all') AND.push({ todo: { isDeleted: false } })
    if (type == 'routne' || type == 'all') AND.push({ routine: { isDeleted: false } })

    if (startAt) AND.push({ startAt: { gte: startAt } })
    if (endAt) AND.push({ startAt: { lte: endAt } })

    let iterations = await context.prisma.iteration.findMany({
        where: { AND },
        include: iterationIncude,
        orderBy: { id: 'desc' }
    });
    
    return iterations;
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
    eventsAndIterations,
    iterationCompletions
}