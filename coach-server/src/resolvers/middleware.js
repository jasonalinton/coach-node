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
            if (Array.isArray(result)) result.forEach(_result => fixDateFormat(_result));
            else if (result) fixDateFormat(result)
        }
        if (params.model == "Iteration") {
            if (Array.isArray(result)) result.forEach(_result => fixIterationDateFormat(_result));
            else if (result) fixIterationDateFormat(result);
        }
        if (params.model == "Event") {
            if (Array.isArray(result)) result.forEach(_result => fixEventDateFormat(_result));
            else if (result) fixEventDateFormat(result);
        }
        if (params.model == "RoutineTodo_Iteration") {
            if (Array.isArray(result)) result.forEach(_result => fixRoutineTodoIterationDateFormat(_result));
            else if (result) fixRoutineTodoIterationDateFormat(result);
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
    if (result.timePairs) {
        result.timePairs.forEach(timePair => {
            ['startTime', 'endTime'].forEach(timeProp => {
                if (timePair[timeProp])
                    timePair[timeProp].dateTime = moment(timePair[timeProp].dateTime).format();
            })
        })
    }
    if (result.iterations) {
        result.iterations.forEach(iteration => {
            ['startAt', 'endAt', 'attemptedAt', 'completedAt'].forEach(timeProp => {
                if (iteration[timeProp])
                    iteration[timeProp] = moment(iteration[timeProp]).format();
            })
        })
    }
    if (result.events) {
        result.events.forEach(_event => {
            ['startAt', 'endAt'].forEach(timeProp => {
                if (_event[timeProp])
                _event[timeProp] = moment(_event[timeProp]).format();
            })
        })
    }
}

function fixIterationDateFormat(iteration) {
    ['startAt', 'endAt', 'attemptedAt', 'completedAt'].forEach(timeProp => {
        if (iteration[timeProp])
            iteration[timeProp] = moment(iteration[timeProp]).format();
    })
}

function fixEventDateFormat(_event) {
    ['startAt', 'endAt'].forEach(timeProp => {
        if (_event[timeProp])
        _event[timeProp] = moment(_event[timeProp]).format();
    })

    if (_event.iterations) {
        _event.iterations.forEach(_iteration => {
            fixIterationDateFormat(_iteration)
        })
    }
}

function fixRoutineTodoIterationDateFormat(iteration) {
    if (iteration.routineIteration) {
        if (iteration.routineIteration.startAt)
            iteration.routineIteration.startAt = moment(iteration.routineIteration.startAt).format();

        if (iteration.routineIteration.endAt)
            iteration.routineIteration.endAt = moment(iteration.routineIteration.endAt).format();
    }

    if (iteration.todoIterations) {
        iteration.todoIterations.forEach(todoIteration => {
            if (todoIteration.startAt)
                todoIteration.startAt = moment(todoIteration.startAt).format();
            if (todoIteration.endAt)
                todoIteration.endAt = moment(todoIteration.endAt).format();
        })
    }
}

module.exports = initMiddleware;