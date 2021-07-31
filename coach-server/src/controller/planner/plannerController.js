const moment = require('moment');
const { today, concatDate, firstDayOfWeek, lastDayOfWeek, firstDayOfMonth, lastDayOfMonth } = require('../../../utility');
const { repetitiveTodos } = require('../../resolvers/queries/todoQuery');
const { repetitiveRoutines } = require('../../resolvers/queries/routineQuery');
const { getLastIterationDateTime, setLastIterationDateTime, isEventVisible } = require('../time/repeatController');
const { createRoutineIterations, mapTodoIterations } = require('../../resolvers/mutations/routineMutation');
const { createTodoIterations } = require('../../resolvers/mutations/todo/todoMutation');

let repetitions = {
    daily: { id: 63, text: "Daily" },
    weekly: { id: 68, text: "Weekly" },
    monthly: { id: 69, text: "Monthly" },
    triAnnually: { id: 72, text: "Tri-Annually" },
    yearly: { id: 75, text: "Yearly" },
}

async function refreshRepetitiveEvents(indexDate, indexEnd, timeframe = repetitions.month, context) {
    const todos = await refreshRepetitiveTodos(indexDate, indexEnd, timeframe = repetitions.month, context);
    const routines = await refreshRepetitiveRoutines(indexDate, indexEnd, timeframe = repetitions.month, context);

    let routine_iterations = routines.map(routine => routine.iterations);
    
    routine_iterations = routine_iterations.flat();

    let routineTodo_Iterations = [];
    routine_iterations.forEach(iteration => {
        let todo_iterations = iteration.routineRepeat.todoIterations.filter(_iteration => moment(_iteration.startAt).format() == iteration.startAt);
        
        let ids = todo_iterations.map(todo_iteration => { return { id: todo_iteration.id } });

        let routineTodo_Iteration = {
            idRoutineIteration: iteration.id,
            hasTodoEvent: false,
            todoIterations: {
                connect: [ ...ids ]
            }
        }
        routineTodo_Iterations.push(routineTodo_Iteration);
    })

    let routineTodo_Iterations_updated = []
    for (let i = 0; i < routineTodo_Iterations.length; i++) {
        let routineTodo_Iteration_updated = routineTodo_Iterations[i];
    console.log("")
        routineTodo_Iteration_updated = await mapTodoIterations(null, routineTodo_Iteration_updated, context);
    console.log("")
        routineTodo_Iterations_updated.push(routineTodo_Iteration_updated);
    }
    console.log("")
}

async function refreshRepetitiveTodos(indexDate, indexEnd, timeframe = repetitions.month, context) {
    const todos = await repetitiveTodos(null, null, context, true);
    let todos_updated = [];
    console.log("")
    for (let i = 0; i < todos.length; i++) {
        let todo = todos[i];
        const todoModel_Updated = await createRepetitiveEvents(todo, 'todo', indexDate, indexEnd, timeframe, context);
        todos_updated.push(todoModel_Updated);
    };
    console.log("")

    return todos_updated;
}

async function refreshRepetitiveRoutines(indexDate, indexEnd, timeframe = repetitions.month, context) {
    console.log("")
    const routines = await repetitiveRoutines(null, null, context, true);
    
    console.log("")
    let routines_updated = [];
    for (let i = 0; i < routines.length; i++) {
        let routine = routines[i];
        const routine_updated = await createRepetitiveEvents(routine, 'routine', indexDate, indexEnd, timeframe, context);
        console.log("")
        routines_updated.push(routine_updated);
    };
    console.log("")

    return routines_updated;
}

async function createRepetitiveEvents(item, itemType, indexDate = null, indexEnd = null, timeframe = repetitions.monthly.id, context) {
    indexDate = (indexDate) ? indexDate : today();
    indexEnd = (indexEnd) ? indexEnd : moment(indexDate).add(1, 'month').toDate();

    if (timeframe == repetitions.monthly.id)
        indexEnd = (indexEnd) ? indexEnd : moment(indexDate).add(1, 'month').toDate();
    else if (timeframe == repetitions.triAnnually.id)
        indexEnd = (indexEnd) ? indexEnd : moment(indexDate).add(4, 'month').toDate();
    else if (timeframe == repetitions.yearly.id)
        indexEnd = (indexEnd) ? indexEnd : moment(indexDate).add(1, 'year').toDate();
    
    const iterations = [];
    for (let i = 0; i < item.repeats.length; i++) {
        let repeat = item.repeats[i];
        item = await createRepetition(repeat, item, itemType, indexDate, indexEnd, timeframe, context);
        iterations.push(...item.iterations);
    }
    item.iterations = iterations;

    return item;
}

async function createRepetition(repeat, item, itemType, indexDate = null, indexEnd = null, timeframe = repetitions.monthly.id, context) {
    let lastIterationDateTime = await getLastIterationDateTime(repeat, itemType, item.id, context);
    if (indexDate > indexEnd ||
        repeat.startRepeat == null ||
        new Date(repeat.startRepeat.dateTime) > indexDate ||
        (repeat.endRepeat != null && new Date(repeat.endRepeat.dateTime) <= indexDate) ||
        (lastIterationDateTime && lastIterationDateTime >= indexDate ))
    {
        if (lastIterationDateTime && lastIterationDateTime >= indexDate && lastIterationDateTime < indexEnd) {
            indexDate = moment(lastIterationDateTime).add(1, 'day').toDate();
        } else {
            console.log("Skipping repetition creation for " + itemType);
            item.iterations = [];
            return item;
        }
    }

    // Daily
    if (repeat.timeframe.id == repetitions.daily.id) {
        createDailyRepetitions(item, itemType, indexDate, indexEnd, repeat);
    } else if (repeat.timeframe.id == repetitions.weekly.id) {
        createWeeklyRepetitions(item, itemType, indexDate, indexEnd, repeat);
    } else if (repeat.timeframe.id == repetitions.monthly.id) {
        createMonthlyRepetitions(item, itemType, indexDate, indexEnd, repeat);
    }
    setLastIterationDateTime(repeat, itemType, item.id, indexEnd);

    if (itemType == "todo") {
        return await createTodoIterations(null, { todo: item }, context, null, repeat);
    } else if (itemType == "routine") {
        return await createRoutineIterations(null, { routine: item }, context, null, repeat);
    }
}

function createDailyRepetitions(item, itemType, indexDate, indexEnd, repeat) {
    while (indexDate <= indexEnd) {
        /* Create iteration for day */
        for (let i = 0; i < repeat.frequency; i++) {
            const iteration = {
                text: item.text,
                startAt: indexDate,
                endAt: indexDate,
                isRecommended: (repeat.type.text == "Recommended") ? true : false
            };

            /* Create event */
            let _isEventVisible = isEventVisible(repeat, itemType, item.id)
            if (_isEventVisible && repeat.startIteration) {
                let _event = {
                    text: item.text,
                    startAt: moment(indexDate).hour(0).minute(0).second(0).millisecond(0).toDate(),
                    isEventVisible: _isEventVisible
                }

                _event.startAt = concatDate(new Date(_event.startAt), new Date(repeat.startIteration.dateTime));

                if (repeat.endIteration)
                    _event.endAt = concatDate(iteration.endAt, new Date(repeat.endIteration.dateTime))
                // else if (item.estimatedTime)
                //     _event.endAt = concatDate(iteration.endAt, new Date(())

                iteration.events.push(_event);
            }
            item.iterations.push(iteration);
        }
        indexDate = moment(indexDate).add(repeat.interval, 'day').toDate();
    }
}

function createWeeklyRepetitions(item, itemType, indexDate, indexEnd, repeat) {
    indexDate = firstDayOfWeek(indexDate);

    while (indexDate <= indexEnd) {
        /* Create iteration for week */
        for (let i = 0; i < repeat.frequency; i++) {
            if (indexDate <= getLastIterationDateTime(repeat, itemType, item.id))
                return;
            
            const iteration = {
                text: item.text,
                startAt: indexDate,
                endAt: lastDayOfWeek(indexDate),
                isRecommended: (repeat.type.text == "Recommended") ? true : false
            };

            if (i < repeat.dayIndecies.length) {
                iteration.startAt = moment(iteration.startAt).day(repeat.dayIndecies[i].index).toDate();
                iteration.endAt = iteration.startAt;

                /* Create event */
                let _isEventVisible = isEventVisible(repeat, itemType, item.id)
                if (_isEventVisible && repeat.startIteration) {
                    let _event = {
                        text: item.text,
                        startAt: moment(indexDate).hour(0).minute(0).second(0).millisecond(0).toDate(),
                        isEventVisible: _isEventVisible
                    }

                    _event.startAt = concatDate(new Date(_event.startAt), new Date(repeat.startIteration.dateTime));

                    if (repeat.endIteration)
                        _event.endAt = concatDate(iteration.endAt, new Date(repeat.endIteration.dateTime))
                    // else if (item.estimatedTime)
                    //     _event.endAt = concatDate(iteration.endAt, new Date(())

                    iteration.events.push(_event);
                }
            }
            iteration.startAt = moment(iteration.startAt).format();
            iteration.endAt = moment(iteration.endAt).format();
            item.iterations.push(iteration);
        }
        indexDate = moment(indexDate).add(7 * repeat.interval, 'day').toDate();
    }
}

function createMonthlyRepetitions(item, itemType, indexDate, indexEnd, repeat) {
    indexDate = firstDayOfMonth(indexDate);

    while (indexDate <= indexEnd) {
        /* Create iteration for month */
        for (let i = 0; i < repeat.frequency; i++) {
            if (indexDate <= getLastIterationDateTime(repeat, itemType, item.id))
                return;
            
            const iteration = {
                text: item.text,
                startAt: indexDate,
                endAt: lastDayOfMonth(indexDate),
                isRecommended: (repeat.type.text == "Recommended") ? true : false
            };

            // If frequency is less than day index count, some day indicies will be ignored
            if (i < repeat.dayIndecies.length) {
                iteration.startAt = moment(iteration.startAt).date(repeat.dayIndecies[i].index).toDate();
                iteration.endAt = iteration.startAt;

                /* Create event */
                let _isEventVisible = isEventVisible(repeat, itemType, item.id)
                if (_isEventVisible && repeat.startIteration) {
                    let _event = {
                        text: item.text,
                        startAt: moment(indexDate).hour(0).minute(0).second(0).millisecond(0).toDate(),
                        isEventVisible: _isEventVisible
                    }

                    _event.startAt = concatDate(new Date(_event.startAt), new Date(repeat.startIteration.dateTime));

                    if (repeat.endIteration)
                        _event.endAt = concatDate(iteration.endAt, new Date(repeat.endIteration.dateTime))
                    // else if (item.estimatedTime)
                    //     _event.endAt = concatDate(iteration.endAt, new Date(())

                    iteration.events.push(_event);
                }
            }
            iteration.startAt = moment(iteration.startAt).format();
            iteration.endAt = moment(iteration.endAt).format();
            item.iterations.push(iteration);
        }
        indexDate = moment(indexDate).add(repeat.interval, 'month').toDate();
    }
}

module.exports = {
    refreshRepetitiveEvents
}