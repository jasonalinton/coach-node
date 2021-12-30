const { select_repeat } = require('../time/repeatProperties');

const routineTodoIterationIncude = {
    include: {
        routineIteration: true,
        todoIterations: {
            include: { todos: true },
            orderBy: { id: 'desc'}
        }
    }
};

const iterationIncude = {
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
    todoRepeat: true,
    routineRepeat: select_repeat,
    routineIteration: routineTodoIterationIncude
}

const eventInclude = {
    type: true,
    iterations: { include: iterationIncude },
}

module.exports = {
    iterationIncude,
    eventInclude,
    routineTodoIterationIncude
}