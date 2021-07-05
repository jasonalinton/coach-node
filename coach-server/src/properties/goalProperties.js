let goalInclude = {
    parents: {
        where: { isDeleted: false}
    },
    children: {
        where: { isDeleted: false}
    },
    metrics: true,
    todos: {
        where: { isDeleted: false}
    },
    routines: {
        where: { isDeleted: false}
    },
}

module.exports = {
    goalInclude
}