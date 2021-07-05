let routineAdded = {
    subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(['ROUTINE_ADDED'])
}

let routineUpdated = {
    subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(['ROUTINE_UPDATED'])
}

let routineDeleted = {
    subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(['ROUTINE_DELETED'])
}

module.exports = {
    routineAdded,
    routineUpdated,
    routineDeleted
}