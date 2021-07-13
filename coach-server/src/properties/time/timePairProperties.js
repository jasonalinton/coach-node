const type = {
    id: true,
    text: true
}

const select_type = {
    select: type
}

const time = {
    id: true,
    type: select_type,
    endpoint: select_type,
    moment: select_type,
    flexibility: select_type,
    dateTime: true
}

const startTime = time;
const endTime = time;

const select_timeType = select_type;

const select_startTime = {
    select: startTime
}

const select_endTime = {
    select: endTime
}

const timePair = {
    timeType: select_timeType,
    startTime: select_startTime,
    endTime: select_endTime
}

const select_timePair = {
    select: timePair
}

module.exports = {
    timePair,
    select_timePair
}