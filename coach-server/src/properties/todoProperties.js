const { select_timePair } = require('./time/timePairProperties')
const { select_repeat } = require('./time/repeatProperties')

const where_isDeleted_false = {
    where: {
        isDeleted: false
    }
}

const iterationInclude = {
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
                }
            }
        }
    }
}

const todoInclude = {
    metrics: true,
    parents: where_isDeleted_false,
    children: where_isDeleted_false,
    goals: where_isDeleted_false,
    routines: where_isDeleted_false,
    timePairs: select_timePair,
    repeats: select_repeat,
    iterations: iterationInclude,
    // todo_repeats: false,
}

module.exports = {
    todoInclude
}