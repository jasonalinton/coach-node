const { routineInclude } = require('../../properties/routineProperties');

async function routines(parent, args, context, info) {
    let routines = await context.prisma.routine.findMany({
        where: { isDeleted: false },
        include: routineInclude,
        orderBy: { id: 'desc'}
    });
    
    return routines;
}

module.exports = {
    routines
}