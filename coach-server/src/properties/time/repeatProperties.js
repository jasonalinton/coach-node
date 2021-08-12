const type = {
    id: true,
    text: true
}

const select_type = {
    select: type
}

const repeatType = select_type
const timeframe = select_type

const dayIndex = {
    id: true,
    index: true
}

const select_dayIndex = {
    select: dayIndex,
    orderBy: { index: 'asc' }
}

const time = {
    id: true,
    type: select_type,
    endpoint: select_type,
    moment: select_type,
    flexibility: select_type,
    dateTime: true
}

const startRepeat = time;
const endRepeat = time;
const startIteration = time;
const endIteration = time;

const select_startRepeat = {
    select: startRepeat
}

const select_endRepeat = {
    select: endRepeat
}

const select_startIteration = {
    select: startIteration
}

const select_endIteration = {
    select: endIteration
}

const todo_repeat = {
    id: true,
    lastIterationDateTime: true,
    isEventVisible: true,
    todo: {
        select: {
            id: true,
            text: true
        }
    }
}

const select_todo_repeat = {
    select: todo_repeat
}

const routine_repeat = {
    id: true,
    lastIterationDateTime: true,
    isEventVisible: true,
    routine: {
        select: {
            id: true,
            text: true
        }
    }
}

const select_routine_repeat = {
    select: routine_repeat
}

const goal_repeat = {
    id: true,
    lastIterationDateTime: true,
    isEventVisible: true,
    goal: {
        select: {
            id: true,
            text: true
        }
    }
}

const select_goal_repeat = {
    select: goal_repeat
}

const repeat_properties = {
    id: true,
    type: repeatType,
    timeframe,
    startRepeat: select_startRepeat,
    endRepeat: select_endRepeat,
    startIteration: select_startIteration,
    endIteration: select_endIteration,
    interval: true,
    frequency: true,
    dayIndecies: select_dayIndex,
    todo_repeats: select_todo_repeat,
    routine_repeats: select_routine_repeat,
    goal_repeats: select_goal_repeat,
    routines: { select: { id: true } },

    todoIterations: { select: { 
        id: true,
        text: true,
        startAt: true,
     } 
    },
    routineIterations: { select: { 
        id: true,
        text: true,
     } 
    },

    routineRepeat: { 
        select: { 
            id: true ,
            todoRepeats: { select: { id: true } }
        }
     },
    todoRepeats: { 
        select: { 
            id: true,
            todoIterations: { select: { 
                id: true,
                startAt: true,
             } 
            }
        } 
    },
}

const select_repeat = {
    select: repeat_properties
}

module.exports = {
    repeat_properties,
    select_repeat
}