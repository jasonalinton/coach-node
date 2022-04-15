const { select_timePair } = require('./time/timePairProperties')
const { select_repeat } = require('./time/repeatProperties')
const { iterationIncude } = require('./event/eventProperties')

const where_isDeleted_false = {
    where: {
        isDeleted: false
    }
}

const routineTodoIterationIncude = {
    include: {
        routineIteration: true,
        todoIterations: {
            include: { 
                todo: {
                    include: {
                        metrics: true,
                        goals: true,
                        // parents: true,
                        // children: true
                    }
                },
                routineIteration: { select: { id: true } }
            },
            orderBy: { id: 'desc'}
        }
    }
};

const todoInclude = {
    metrics: true,
    parents: where_isDeleted_false,
    children: where_isDeleted_false,
    goals: where_isDeleted_false,
    routines: where_isDeleted_false,
    timePairs: select_timePair,
    repeats: select_repeat,
    iterations: { include: iterationIncude },
    // todo_repeats: false,
}

module.exports = {
    todoInclude
}