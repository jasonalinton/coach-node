const { todoInclude } = require('../properties/todoProperties');
const { select_timePair } = require('../properties/time/timePairProperties')
const { select_repeat } = require('../properties/time/repeatProperties')

async function configureIteration(todo, context) {
    // console.log('wtf')
    // // Create default iteration if none exists
    // if (todo.iterations && todo.iterations.length == 0 &&
    //     (!todo.timePairs || (todo.timePairs && todo.timePairs.length == 0)) &&
    //     (!todo.repeats || (todo.repeats && todo.repeats.length == 0))) {

    //     todo = await createDefaultIteration(todo, context);
    // } else
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
    // Create default iteration if none exists
    if (todo.iterations && todo.iterations.length == 0 &&
        todo.timePairs && (todo.timePairs && todo.timePairs.length > 0)) {

        // THIS WILL CREATE WRONG ITERATIONS FOR TIME AND DATE MOMENTS
        let iterations = []
        todo.timePairs.forEach(timePair => {
            let iteration = {
                text: todo.text,
                startAt: (timePair.startTime) ? timePair.startTime.dateTime : new Date(),
                isRecommended: false
            };
            if (timePair.endTime)
                iteration.endAt = timePair.endTime.dateTime;
            
            iterations.push(iteration);
        })

        todo = await context.prisma.todo.update({
            where: { id: todo.id },
            data: {
                iterations: {
                    create: [ ...iterations ]
                }
            },
            include: todoInclude
        });

        todo.iterations.forEach(iteration =>
            context.pubsub.publish("ITERATION_ADDED", { iterationAdded: iteration }));
    }

    return todo;
}



module.exports = {
    configureIteration
}