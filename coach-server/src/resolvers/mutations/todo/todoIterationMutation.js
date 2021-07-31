const { todoInclude, todoIterationIncude } = require('../../../properties/todoProperties');
const { deleteTodo } = require('./todoMutation');
const { refreshRepetitiveEvents } = require('../../../controller/planner/plannerController');

/* Create default task with only title and recommended start time */
/* Create iteration. Set completion */
async function createDefaultTask(parent, { iteration }, context, info) {
    let scheduledType = await context.prisma.type.findFirst({
        where: { text: 'Scheduled' }
    });

    console.log("");

    let startTime = await context.prisma.time.create({
        data: {
            idType: 81,
            idEndpoint: 84,
            idMoment: 89,
            idFlexibility: 25,
            dateTime: iteration.startAt
        }
    })

    console.log("");
    
    let todo = await context.prisma.todo.create({
        data: {
            text: iteration.text,
            timePairs: {
                create: {
                    idTimeType: scheduledType.id,
                    idStartTime: startTime.id
                }
            },
            iterations: {
                create: {
                    text: iteration.text,
                    startAt: iteration.startAt,
                    attemptedAt: iteration.attemptedAt,
                    completedAt: iteration.completedAt,
                    isRecommended: (iteration.isRecommended) ? iteration.isRecommended : false
                }
            }
        },
        include: todoInclude
    });

    iteration = await context.prisma.iteration.findFirst({
        where: { id: todo.iterations[0].id },
        include: todoIterationIncude
    })

    context.pubsub.publish("TODO_ADDED", { todoAdded: todo });
    context.pubsub.publish("ITERATION_ADDED", { iterationAdded: iteration });
    
    return todo;
}

async function toggleCompletion(parent, { iteration }, context, info) {
    iteration = await context.prisma.iteration.update({
        where: { id: iteration.id },
        data: {
            attemptedAt: iteration.attemptedAt,
            completedAt: iteration.completedAt
        },
        include: todoIterationIncude
    });

    context.pubsub.publish("ITERATION_UPDATED", { iterationUpdated: iteration });

    return iteration;
}

/* Delete iteraiton
 * If only iteration mapped to todo. Mark todo deleted */
async function deleteIteration(parent, { id }, context, info) {
    console.log("Get iteration to delete")
    let iteration = await context.prisma.iteration.findFirst({
        where: { id: id },
        include: {
            todos: {
                select: {
                    id: true,
                    text: true,
                    iterations: { select: { id: true } }
                }
            }
        }
    });

    console.log("Check if iteration has siblings")
    if (iteration.todos[0].iterations.length == 1) {
        await deleteTodo(parent, iteration.todos[0], context, info)
    } else {
        iteration = await context.prisma.iteration.delete({
            where: { id: iteration.id }
        });
        console.log("No siblings")
        context.pubsub.publish("ITERATION_DELETED", { iterationDeleted: iteration });
    }
    console.log("Done")

    return iteration;
}

async function refreshRepetitive(parent, args, context, info) {
    return await refreshRepetitiveEvents(null, null, null, context)
}

module.exports = {
    createDefaultTask,
    toggleCompletion,
    deleteIteration,
    refreshRepetitive,
}