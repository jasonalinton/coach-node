let routineInclude = {
    parents: {
        where: { isDeleted: false}
    },
    children: {
        where: { isDeleted: false}
    },
    metrics: true,
    goals: {
        where: { isDeleted: false}
    },
    todos: {
        where: { isDeleted: false}
    },
}

module.exports = {
    routineInclude
}