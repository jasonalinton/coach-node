const { select_timePair } = require('./time/timePairProperties')
const { select_repeat } = require('./time/repeatProperties')

const where_isDeleted_false = {
    where: {
        isDeleted: false
    }
}

const type = {
    id: true,
    text: true
}

const select_type = {
    select: type
}

const goalInclude = {
    type: select_type,
    metrics: true,
    parents: where_isDeleted_false,
    children: where_isDeleted_false,
    todos: where_isDeleted_false,
    routines: where_isDeleted_false,
    repeats: select_repeat,
    timePairs: select_timePair,
}

module.exports = {
    goalInclude
}