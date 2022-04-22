const { metricInclude } = require('../../properties/metricProperties');
const { goalInclude } = require('../../properties/goalProperties');
const { todoInclude } = require('../../properties/todoProperties');
const { routineInclude } = require('../../properties/routineProperties');

async function items(parent, args, context, info) {
    let items = {};

    if (args.getMetrics) {
        items.metrics = await context.prisma.metric.findMany({
            include: metricInclude,
            orderBy: { id: 'asc'}
        });
    }

    if (args.getGoals) {
        items.goals = await context.prisma.goal.findMany({
            where: { isDeleted: false },
            include: goalInclude,
            orderBy: { id: 'desc'}
        });
    }

    if (args.getTodos) {
        items.todos = await context.prisma.todo.findMany({
            where: { isDeleted: false },
            include: todoInclude,
            orderBy: { id: 'desc'}
        });
    }

    if (args.getRoutines) {
        items.routines = await context.prisma.routine.findMany({
            where: { isDeleted: false },
            include: routineInclude,
            orderBy: { id: 'desc'}
        });
    }

    return items;
}

module.exports = {
    items
}