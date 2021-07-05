const controller = require('../../controller/itemController');
const { routineInclude } = require('../../properties/routineProperties');

async function addRoutine(parent, args, context, info) {
    let data = controller.initData(args.routine);

    let routine = await context.prisma.routine.create({
        data,
        include: routineInclude
    });

    context.pubsub.publish("ROUTINE_ADDED", { routineAdded: routine });
    
    return routine;
}

async function updateRoutine(parent, args, context, info) {
    let id = args.routine.id;
    let data = controller.initData(args.routine);

    let routine = await context.prisma.routine.update({
        where: { id },
        data,
        include: routineInclude
    });

    context.pubsub.publish("ROUTINE_UPDATED", { routineUpdated: routine });
    
    return routine;
}

async function deleteRoutine(parent, args, context, info) {
    let routine = await context.prisma.routine.update({
        where: { id: args.id },
        data: { isDeleted: true },
        include: routineInclude
    });

    context.pubsub.publish("ROUTINE_DELETED", { routineDeleted: routine });
    
    return routine;
}

module.exports = {
    addRoutine,
    updateRoutine,
    deleteRoutine
}