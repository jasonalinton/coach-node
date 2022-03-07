async function iterations(parent, args, context, info) {
    let iterations = await context.prisma.iteration.findMany({
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
            },
            todoRepeat: true
        },
        orderBy: { id: 'desc' }
    });
    
    return iterations;
}

async function deleteIterations(parent, { after, from }, context, info) {
    let date;
    if (after)
        date = new Date(after);
    else if (from)
        date = new Date(from);

    let where = { startAt: { gte: date } };

    let iterations = await context.prisma.iteration.findMany({
        where,
    });
    // console.log(`About to delete ${iterations.length} iterations`)

    let rtWhere = { idRoutineIteration: 
        { in: iterations.map(i => i.id)}
    }
    let routineTodoIterations = await context.prisma.routineTodo_Iteration.findMany({
        where: rtWhere,
    });
    console.log(`About to delete ${routineTodoIterations.length} routineTodoIterations`);

    // let goalRepeatPayload = context.prisma.todo_Repeat.updateMany({
    //     data: {
    //         lastIterationDateTime: 
    //     }
    // })

    let rtPayload = await context.prisma.routineTodo_Iteration.deleteMany({
        where: rtWhere,
    });

    let iPayload = await context.prisma.iteration.deleteMany({
        where,
    });

    iterations.forEach(iteration =>
        context.pubsub.publish("ITERATION_DELETED", { iterationDeleted: iteration }));
    
    return iPayload.count;
}

module.exports = {
    iterations,
    deleteIterations
}