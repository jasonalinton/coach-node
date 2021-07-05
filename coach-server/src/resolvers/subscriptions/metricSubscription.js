let metricUpdated = {
    subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(['METRIC_UPDATED'])
}

module.exports = {
    metricUpdated
}