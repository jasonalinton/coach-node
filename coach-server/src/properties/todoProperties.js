let todoInclude = {
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
    routines: {
        where: { isDeleted: false}
    },
}

module.exports = {
    todoInclude
}