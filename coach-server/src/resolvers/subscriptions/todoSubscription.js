let todoAdded = {
    subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(['TODO_ADDED'])
}

let todoUpdated = {
    subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(['TODO_UPDATED'])
}

let todoDeleted = {
    subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(['TODO_DELETED'])
}

module.exports = {
    todoAdded,
    todoUpdated,
    todoDeleted
}