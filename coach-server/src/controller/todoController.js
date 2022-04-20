const { todoInclude } = require('../properties/todoProperties');
const { select_timePair } = require('../properties/time/timePairProperties')
const { select_repeat } = require('../properties/time/repeatProperties')
const { clone } = require('../../utility')

async function configureIteration(todo, context) {
    await createIterations(todo, context);

    return todo;
}

async function createDefaultIteration(todo, context) {
    let startAt = new Date();

    let startTime = await context.prisma.time.create({
        data: {
            idType: 80,
            idEndpoint: 84,
            idMoment: 89,
            idFlexibility: 25,
            dateTime: startAt
        }
    });

    const where_isDeleted_false = {
        where: {
            isDeleted: false
        }
    }

    todo = await context.prisma.todo.update({
        where: { id: todo.id },
        data: {
            timePairs: {
                create: {
                    idTimeType: 80,
                    idStartTime: startTime.id
                }
            },
            iterations: {
                create: {
                    text: todo.text,
                    startAt: startAt,
                    isRecommended: false
                }
            }
        },
        include: todoInclude
    });

    return todo;
}

async function createIterations(todo, context) {
    let select = clone(select_timePair.select);
    select.iterations = true;

    // Create default iteration if none exists
    if (todo.timePairs) {
        let iterations = [];
        for (let i = 0; i < todo.timePairs.length; i++) {
            let timePair = await context.prisma.todo_TimePair.findFirst({
                select,
                where: { id: todo.timePairs[i].id }
            });

            if (timePair.iterations.length == 0) {
                let iteration = {
                    text: todo.text,
                    startAt: (timePair.startTime) ? timePair.startTime.dateTime : new Date(),
                    endAt: (timePair.endTime) ? timePair.endTime.dateTime : null,
                    isRecommended: false,
                    idTodoTimePair: timePair.id
                };
                iterations.push(iteration);
            }
        }

        if (iterations.length > 0) {
            todo = await context.prisma.todo.update({
                where: { id: todo.id },
                data: { iterations: { create: [ ...iterations ] } },
                include: todoInclude
            });

            todo.iterations.forEach(iteration =>
                context.pubsub.publish("ITERATION_ADDED", { iterationAdded: iteration }));
        }
    }

    return todo;
}



module.exports = {
    configureIteration
}