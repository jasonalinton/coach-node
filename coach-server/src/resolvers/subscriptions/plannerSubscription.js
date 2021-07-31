let iterationAdded = {
    subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(['ITERATION_ADDED'])
}

let iterationUpdated = {
    subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(['ITERATION_UPDATED'])
}

let iterationDeleted = {
    subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(['ITERATION_DELETED'])
}

module.exports = {
    iterationAdded,
    iterationUpdated,
    iterationDeleted
}