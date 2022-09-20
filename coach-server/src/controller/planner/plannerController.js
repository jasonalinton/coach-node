const moment = require('moment');
const { today, concatDate, firstDayOfWeek, lastDayOfWeek, firstDayOfMonth, lastDayOfMonth, JSONDate } = require('../../../utility');
const { repetitiveTodos } = require('../../resolvers/queries/todoQuery');
const { repetitiveRoutines } = require('../../resolvers/queries/routineQuery');
const { getLastIterationDateTime, setLastIterationDateTime, isEventVisible } = require('../time/repeatController');
const { createRoutineIterations, mapTodoIterations, deleteFutureIterations } = require('../../resolvers/mutations/routineMutation');
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

    return { todos, routines };
}

async function refreshRepetitiveTodos(indexDate, indexEnd, timeframe = repetitions.month, context) {
    const todos = await repetitiveTodos(null, null, context, true);

    let todos_updated = [];
    for (let i = 0; i < todos.length; i++) {
        let todo = todos[i];
        const todoModel_Updated = await createRepetitiveEvents(todo, 'todo', indexDate, indexEnd, timeframe, context);
        todos_updated.push(todoModel_Updated);
    };

    return todos_updated;
}

async function refreshRepetitiveRoutines(indexDate, indexEnd, timeframe = repetitions.month, context) {
    const routines = await repetitiveRoutines(null, null, context, true);

    let routines_updated = [];
    for (let i = 0; i < routines.length; i++) {
        let routine = routines[i];

        let repeatIDs_Routine = routine.repeats.map(_repeat => _repeat.id);

        routine.todos.forEach(async _todo => {
            /* Remove any todo repeats that are not shared by routine */
            let repeats = [];
            _todo.repeats.forEach(_repeat => {
                /* This probably isn't a thing. I don't think todos share repeats with routines. They make clones instead */
                if (repeatIDs_Routine.includes(_repeat.id))
                    repeats.push(_repeat);
                if (_repeat.routineRepeat && repeatIDs_Routine.includes(_repeat.routineRepeat.id))
                    repeats.push(_repeat);
            })
            _todo.repeats = repeats;
            await createRepetitiveEvents(_todo, 'todo', indexDate, indexEnd, timeframe, context);
        })

        const routine_updated = await createRepetitiveEvents(routine, 'routine', indexDate, indexEnd, timeframe, context);
        routines_updated.push(routine_updated);
    };
    
    mapRoutineIterationsToTodoIterations(routines_updated, context);

    return routines_updated;
}

async function refreshRepetitiveRoutine(routine, indexDate, indexEnd, timeframe = repetitions.month, context) {
    await deleteFutureIterations(null, { idRoutine: routine.id }, context, null);

    let repeatIDs_Routine = routine.repeats.map(_repeat => _repeat.id);
    routine.todos.forEach(async _todo => {
        /* Remove any todo repeats that are not shared by routine */
        let repeats = [];
        _todo.repeats.forEach(_repeat => {
            /* This probably isn't a thing. I don't think todos share repeats with routines. They make clones instead */
            if (repeatIDs_Routine.includes(_repeat.id))
                repeats.push(_repeat);
            if (_repeat.routineRepeat && repeatIDs_Routine.includes(_repeat.routineRepeat.id))
                repeats.push(_repeat);
        })
        _todo.repeats = repeats;
        await createRepetitiveEvents(_todo, 'todo', indexDate, indexEnd, timeframe, context);
    })

    routine = await createRepetitiveEvents(routine, 'routine', indexDate, indexEnd, timeframe, context);
    
    mapRoutineIterationsToTodoIterations([routine], context);

    return routine;
}

async function createRepetitiveEvents(item, itemType, indexDate = null, indexEnd = null, timeframe = repetitions.monthly.id, context) {
    indexDate = (indexDate) ? indexDate : today();
    indexEnd = (indexEnd) ? indexEnd : moment(indexDate).add(2, 'month').toDate();

    if (timeframe == repetitions.monthly.id)
        indexEnd = (indexEnd) ? indexEnd : moment(indexDate).add(3, 'month').toDate();
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
    let props = { repeat, item, itemType, indexDate, indexEnd, lastIterationDateTime, context };
    let isValid = validateDates(lastIterationDateTime, props);
    console.log(`Create repetition for ${item.text} ${indexDate.toJSON()}`);
    if (!isValid) return item;


    // Daily
    if (repeat.timeframe.id == repetitions.daily.id) {
        createDailyRepetitions(props);
    } else if (repeat.timeframe.id == repetitions.weekly.id) {
        createWeeklyRepetitions(props);
    } else if (repeat.timeframe.id == repetitions.monthly.id) {
        createMonthlyRepetitions(props);
    }
    setLastIterationDateTime(repeat, itemType, item.id, props.indexEnd);

    if (itemType == "todo") {
        return await createTodoIterations(null, { todo: item }, context, null, repeat);
    } else if (itemType == "routine") {
        return await createRoutineIterations(null, { routine: item }, context, null, repeat);
    }
}

function createDailyRepetitions({item, itemType, indexDate, indexEnd, repeat}) {
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
                    startAt: moment(indexDate).hour(0).minute(0).second(0).millisecond(0).toDate()
                }

                _event.startAt = concatDate(new Date(_event.startAt), new Date(repeat.startIteration.dateTime));

                if (repeat.endIteration)
                    _event.endAt = concatDate(iteration.endAt, new Date(repeat.endIteration.dateTime))
                // else if (item.estimatedTime)
                //     _event.endAt = concatDate(iteration.endAt, new Date(())

                // /* If IsGroup & IsEventVisible, add child todos to the event */
                // if (item.children & item.children.length > 0) {
                //     let iterations = [];
                //     item.children.forEach(_child => {
                //         iterations.push({
                //             text: _child.text,
                //             startAt: indexDate,
                //             endAt: indexDate,
                //             isRecommended: (repeat.type.text == "Recommended") ? true : false
                //         });
                //     });
                //     _event.iterations = { craeteMany: { date: iterations } };
                //     // TODO: Connect iteratons to parent todos
                // }


                if (!iteration.events) iteration.events = [];
                iteration.events.push(_event);
            }
            item.iterations.push(iteration);
        }
        indexDate = moment(indexDate).add(repeat.interval, 'day').toDate();
    }
}

function createWeeklyRepetitions({item, itemType, indexDate, indexEnd, repeat, context, lastIterationDateTime}) {
    indexDate = firstDayOfWeek(indexDate);

    while (indexDate <= indexEnd) {
        /* Create iteration for week */
        for (let i = 0; i < repeat.frequency; i++) {
            if (indexDate <= getLastIterationDateTime(repeat, itemType, item.id, context))
                return;
            
            const iteration = {
                text: item.text,
                startAt: indexDate,
                endAt: lastDayOfWeek(indexDate),
                isRecommended: (repeat.type.text == "Recommended") ? true : false
            };

            if (i < repeat.dayIndecies.length) {
                iteration.startAt = moment(iteration.startAt).day(repeat.dayIndecies[i].index - 1).toDate();
                if (iteration.startAt.getTime() < (new Date(lastIterationDateTime)).getTime()) continue;
                iteration.endAt = iteration.startAt;

                /* Create event */
                let _isEventVisible = isEventVisible(repeat, itemType, item.id)
                if (_isEventVisible && repeat.startIteration) {
                    let _event = {
                        text: item.text,
                        startAt: moment(indexDate).hour(0).minute(0).second(0).millisecond(0).toDate()
                    }

                    _event.startAt = concatDate(iteration.startAt, new Date(repeat.startIteration.dateTime));

                    if (repeat.endIteration)
                        _event.endAt = concatDate(iteration.endAt, new Date(repeat.endIteration.dateTime))
                    // else if (item.estimatedTime)
                    //     _event.endAt = concatDate(iteration.endAt, new Date(())

                    if (!iteration.events) iteration.events = [];
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

function createMonthlyRepetitions({item, itemType, indexDate, indexEnd, repeat, context}) {
    indexDate = firstDayOfMonth(indexDate);

    while (indexDate <= indexEnd) {
        /* Create iteration for month */
        for (let i = 0; i < repeat.frequency; i++) {
            if (indexDate <= getLastIterationDateTime(repeat, itemType, item.id, context))
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
                        startAt: moment(indexDate).hour(0).minute(0).second(0).millisecond(0).toDate()
                    }

                    _event.startAt = concatDate(iteration.startAt, new Date(repeat.startIteration.dateTime));

                    if (repeat.endIteration)
                        _event.endAt = concatDate(iteration.endAt, new Date(repeat.endIteration.dateTime))
                    // else if (item.estimatedTime)
                    //     _event.endAt = concatDate(iteration.endAt, new Date(())

                    if (!iteration.events) iteration.events = [];
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

function validateDates(lastIterationDateTime, props) {
    lastIterationDateTime = (lastIterationDateTime)? lastIterationDateTime : today();
    props.indexEnd = (props.repeat.endRepeat) ? new Date(props.repeat.endRepeat.dateTime) : props.indexEnd;

    console.log(`Last iteration datetime was ${JSONDate(lastIterationDateTime)}`);

    let errorMes = `Skipping repetition creation for ${props.itemType}-${props.item.text}.`
    if (lastIterationDateTime >= props.indexEnd) {
        console.log(`${errorMes} IndexEnd is before the last iteration datetime`);
        return false;
    } else 
    if (props.indexDate > props.indexEnd) {
        console.log(`${errorMes} IndexDate is after than indexEnd`);
        return false;
    } else if (props.repeat.startRepeat == null) {
        console.log(`${errorMes} Repeat start is null`);
        return false;
    } else if (props.repeat.endRepeat != null && new Date(props.repeat.endRepeat.dateTime) <= props.indexDate) {
        console.log(`${errorMes} Repeat end is before indexDate`);
        return false;
    } 
    // else if (lastIterationDateTime) {
    //     console.log(`${errorMes}`);
    //     props.item.iterations = [];
    // }
    
    if (lastIterationDateTime >= props.indexDate && lastIterationDateTime < props.indexEnd) {
        props.indexDate = moment(lastIterationDateTime).hour(0).minute(0).second(0).millisecond(0).add(1, 'day').toDate();
    }

    if (new Date(props.repeat.startRepeat.dateTime) > props.indexDate) {
        props.indexDate = new Date(props.repeat.startRepeat.dateTime);
    }

    return true
}

async function mapRoutineIterationsToTodoIterations(routines, context) {
    let routine_iterations = routines.map(routine => routine.iterations);
    
    routine_iterations = routine_iterations.flat();

    let routineTodo_Iterations = [];
    routine_iterations.forEach(iteration => {
        if (!iteration.routineRepeat || !iteration.routineRepeat.todoIterations) return;

        /* ID's of todo iterations mapped to same repeat as routine */
        let todo_iterations = iteration.routineRepeat.todoIterations.filter(_iteration => moment(_iteration.startAt).format() == iteration.startAt);
        let ids = todo_iterations.map(todo_iteration => { return { id: todo_iteration.id } });

        /* ID's of todo iterations that have custom repeat */
        let todoIterations = iteration.routineRepeat.todoRepeats.map(tr => tr.todoIterations).flat();
        todoIterations.forEach(_iteration => {
            if (moment(_iteration.startAt).format() == iteration.startAt)
                ids.push({ id: _iteration.id }) 
        });

        let routineTodo_Iteration = {
            idRoutineIteration: iteration.id,
            hasTodoEvent: false,
            todoIterations: {
                connect: [ ...ids ]
            }
        }
        routineTodo_Iterations.push(routineTodo_Iteration);
        
    })

    for (let i = 0; i < routineTodo_Iterations.length; i++)
        await mapTodoIterations(null, routineTodo_Iterations[i], context);
}

module.exports = {
    refreshRepetitiveEvents,
    createRepetitiveEvents,
    refreshRepetitiveRoutine
}