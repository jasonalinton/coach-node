let goalAdded = {
    subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(['GOAL_ADDED'])
}

let goalUpdated = {
    subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(['GOAL_UPDATED'])
}

let goalDeleted = {
    subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(['GOAL_DELETED'])
}

module.exports = {
    goalAdded,
    goalUpdated,
    goalDeleted
}