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
    subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(['EVENT_ADDED'])
};

let eventUpdated = {
    subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(['EVENT_UPDATED'])
};

let eventDeleted = {
    subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(['EVENT_DELETED'])
};

module.exports = {
    iterationAdded,
    iterationUpdated,
    iterationDeleted,
    eventAdded,
    eventUpdated,
    eventDeleted
}