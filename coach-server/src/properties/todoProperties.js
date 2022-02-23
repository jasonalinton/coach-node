const { select_timePair } = require('./time/timePairProperties')
const { select_repeat } = require('./time/repeatProperties')

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

const todoIterationIncude = {
    todo: {
        select: {
            id: true,
            text: true,
            metrics: {
                select: {
                    id: true,
                    text: true
                }
            },
            goals: {
                select: {
                    id: true,
                    text: true
                }
            },
            routines: {
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

const todoInclude = {
    metrics: true,
    parents: where_isDeleted_false,
    children: where_isDeleted_false,
    goals: where_isDeleted_false,
    routines: where_isDeleted_false,
    timePairs: select_timePair,
    repeats: select_repeat,
    iterations: { include: todoIterationIncude },
    // todo_repeats: false,
}

module.exports = {
    todoInclude,
    todoIterationIncude
}