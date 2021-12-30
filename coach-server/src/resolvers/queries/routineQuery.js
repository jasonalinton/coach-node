const { routineInclude } = require('../../properties/routineProperties');
const { select_repeat } = require('../../properties/time/repeatProperties');
// const { select } = require('../../properties/todoProperties');


async function routines(parent, args, context, info) {
    let routines = await context.prisma.routine.findMany({
        where: { isDeleted: false },
        include: routineInclude,
        orderBy: { id: 'desc'}
    });
    
    return routines;
}

async function repetitiveRoutines(parent, args, context, info, ignoreRoutines = true) {
    let routines = await context.prisma.routine.findMany({
        where: {
            isDeleted: false,
            repeats: { some: { } }
        },
        include: {
            todos: {
                include: { iterations: true }
            },
            iterations: { 
                include: { routineRepeat: select_repeat }
            },
            repeats: select_repeat,
        },
        orderBy: { id: 'desc'}
    });
    
    return routines;
}

// async function routineIterations(parent, args, context, info, ignoreRoutines = true) {
//     let routines = await context.prisma.routine.findMany({
//         where: {
//             isDeleted: false,
//             repeats: { some: { } }
//         },
//         include: {
//             todos: {
//                 include: { iterations: true }
//             },
//             iterations: {
//                 include: {
//                     routineIteration: {
//                         include: {
                            
//                         }
//                     },
//                 }
//             },
//             repeats: select_repeat
//         },
//         orderBy: { id: 'desc'}
//     });

//     return routines;
// }

async function routineIterations(parent, args, context, info) {
    let routinesTodo_Iterations = await context.prisma.routineTodo_Iteration.findMany({
        include: {
            routineIteration: true,
            todoIterations: {
                include: { todos: true },
                orderBy: { id: 'desc'}
            }
        },
        orderBy: { id: 'asc'}
    });
    
    return routinesTodo_Iterations;
}

module.exports = {
    routines,
    repetitiveRoutines,
    routineIterations
}