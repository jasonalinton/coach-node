const { select_timePair } = require('./time/timePairProperties')
const { select_repeat } = require('./time/repeatProperties')

const where_isDeleted_false = {
    where: {
        isDeleted: false
    }
}

const todoIterationIncude = {
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