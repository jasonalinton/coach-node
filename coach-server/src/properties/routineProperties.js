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
        },
        routineRepeat: select_repeat
    }
}

const routineInclude = {
    metrics: true,
    parents: where_isDeleted_false,
    children: where_isDeleted_false,
    goals: where_isDeleted_false,
    todos: where_isDeleted_false,
    repeats: select_repeat,
    iterations: iterationInclude,
    // timePairs: select_timePair,
}

module.exports = {
    routineInclude
}