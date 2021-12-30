const { todoInclude, todoIterationIncude } = require('../../properties/todoProperties');
const { select_repeat } = require('../../properties/time/repeatProperties');

async function todos(parent, args, context, info) {
    let todos = await context.prisma.todo.findMany({
        where: { isDeleted: false },
        include: todoInclude,
        orderBy: { id: 'desc'}
    });
    
    return todos;
}

async function repetitiveTodos(parent, args, context, info) {
    let todos = await context.prisma.todo.findMany({
        where: {
            isDeleted: false,
            repeats: {
                some: {
                    // routines: { none: {} }
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

    // console.log("")
    
    return iterations;
}

async function routineIterations(parent, args, context, info) {
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