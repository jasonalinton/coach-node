const { withFilter } = require('apollo-server');

let iterationAdded = {
    subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(['ITERATION_ADDED'])
};

let iterationUpdated = {
    subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(['ITERATION_UPDATED'])
};

let iterationDeleted = {
    subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(['ITERATION_DELETED'])
};

let eventAdded = {
    subscribe: withFilter(
        (_, __, { pubsub }) => pubsub.asyncIterator(['EVENT_ADDED']),
        (payload, variables) => {
            return isEventValid(payload, variables, 'eventAdded')
    })
};

let eventUpdated = {
    subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(['EVENT_UPDATED'])
};

let eventDeleted = {
    subscribe: withFilter(
        (_, __, { pubsub }) => pubsub.asyncIterator(['EVENT_DELETED']),
        (payload, variables) => {
            return isEventValid(payload, variables, 'eventDeleted')
    })
};

function isEventValid(payload, variables, prop) {
    if (variables.startAt) {
        let eventStart = (new Date(payload[prop].startAt)).getTime();
        let variableStart = (new Date(variables.startAt)).getTime();
        if (eventStart < variableStart)
            return false;
    }
    if (variables.endAt) {
        let eventEnd = (new Date(payload[prop].endAt)).getTime();
        let variableEnd = (new Date(variables.endAt)).getTime();
        if (eventEnd > variableEnd) 
            return false;
    }
    return true
}

module.exports = {
    iterationAdded,
    iterationUpdated,
    iterationDeleted,
    eventAdded,
    eventUpdated,
    eventDeleted
}