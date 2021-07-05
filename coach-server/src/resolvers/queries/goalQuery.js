const { goalInclude } = require('../../properties/goalProperties');

async function goals(parent, args, context, info) {
    let goals = await context.prisma.goal.findMany({
        where: { isDeleted: false },
        include: goalInclude,
        orderBy: { id: 'desc'}
    });
    
    return goals;
}

module.exports = {
    goals
}