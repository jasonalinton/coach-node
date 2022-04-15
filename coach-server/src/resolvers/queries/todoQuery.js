const { todoInclude } = require('../../properties/todoProperties');
const { iterationIncude } = require('../../properties/event/eventProperties');
const { select_repeat } = require('../../properties/time/repeatProperties');

async function todos(parent, args, context, info) {
    let todos = await context.prisma.todo.findMany({
        where: { isDeleted: false },
        include: todoInclude,
        orderBy: { id: 'desc'}
    });
    
    return todos;
}

/* Get todos with repeats (where the repeat is not mapped to a routine) */
async function repetitiveTodos(parent, args, context, info) {
    let todos = await context.prisma.todo.findMany({
        where: {
            isDeleted: false,
            repeats: {
                some: {
                    routineRepeat: null
                },
                none: {
                    routine_repeats: {
                        some: {}
                    }
                }
            }
        },
        include: {
            iterations: true,
            repeats: select_repeat
        },
        orderBy: { id: 'desc'}
    });
    
    return todos;
}

async function todoIterations(parent, args, context, info) {
    let iterations = await context.prisma.iteration.findMany({
        where: {
            AND: [
                {
                    todo: { isDeleted: false }
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
        include: iterationIncude,
        orderBy: { id: 'desc' }
    })

    // console.log("")
    
    return iterations;
}

async function routineIterations(parent, args, context, info) {
    let iterations = await context.prisma.iteration.findMany({
        where: {
            AND: [
                {
                    todo: { isDeleted: false }
                },
                {
                    todoRepeat: {
                        is: {
                            routineIterations: {
                                some: {}
                            }
                        }
                    }
                }
            ]
        },
        include: {
            todos: {
                select: {
                    id: true,
                    text: true,
                    metrics: {
                        select: {
                            id: true,
                            text: true
                        }
                    },
                    // timePairs: {
                    //     select: {

                    //     }
                    // }
                }
            },
            repeat: {
                include: {
                    routineIterations: true
                }
            }
        },
        orderBy: { id: 'desc' }
    })

    console.log("")
    
    return iterations;
}

module.exports = {
    todos,
    todoIterations,
    repetitiveTodos,
}