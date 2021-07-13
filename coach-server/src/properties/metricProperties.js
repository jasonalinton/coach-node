const metricInclude = {
    goals: {
        where: { isDeleted: false}
    },
    todos: {
        where: { isDeleted: false}
    },
    routines: {
        where: { isDeleted: false}
    },
}

module.exports = {
    metricInclude
}