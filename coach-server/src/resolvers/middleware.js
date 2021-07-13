const moment = require('moment');

function initMiddleware(prisma) {
    initDateFormatMiddleware(prisma)
}

// Date objects are returned as a millisecond string
// Formatting makes it easier to read and convert
async function initDateFormatMiddleware(prisma) {
    prisma.$use(async (params, next) => {
        const result = await next(params);
        if (['Goal', 'Todo', 'Routine'].includes(params.model)) {
            if (Array.isArray(result))
                result.forEach(_result => fixDateFormat(_result));
            else
                fixDateFormat(result)
        }
        return result
    })
}

function fixDateFormat(result) {
    if (result.repeats) {
        result.repeats.forEach(repeat => {
            ['startRepeat', 'endRepeat', 'startIteration', 'endIteration'].forEach(timeProp => {
                if (repeat[timeProp])
                    repeat[timeProp].dateTime = moment(repeat[timeProp].dateTime).format();
            })
        })
    }
}

module.exports = initMiddleware;