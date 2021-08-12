async function deleteIterations(parent, { after, from }, context, info) {
    let where;
    if (after)
        where = { startAt: { gt: new Date(after) } }
    else if (from)
        where = { startAt: { gte: new Date(from) } };


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

module.exports = {
    iterations,
    deleteIterations
}