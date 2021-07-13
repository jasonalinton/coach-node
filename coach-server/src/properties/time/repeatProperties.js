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
    select: dayIndex
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

const repeat = {
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
}

const select_repeat = {
    select: repeat
}

module.exports = {
    repeat,
    select_repeat
}