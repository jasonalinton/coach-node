const { select_timePair } = require('./time/timePairProperties')
const { select_repeat } = require('./time/repeatProperties')

const where_isDeleted_false = {
    where: {
        isDeleted: false
    }
}

const goalInclude = {
    metrics: true,
    parents: where_isDeleted_false,
    children: where_isDeleted_false,
    todos: where_isDeleted_false,
    routines: where_isDeleted_false,
    // timePairs: select_timePair,
    // repeats: select_repeat,
    
}

module.exports = {
    goalInclude
}