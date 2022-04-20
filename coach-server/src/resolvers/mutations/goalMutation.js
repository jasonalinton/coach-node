const controller = require('../../controller/itemController');
const { goalInclude } = require('../../properties/goalProperties');
const { configurGoal } = require("../../service/item/goal/goalConfigurationService");
const { CONFIGURATION_TYPES } = require("../../../constant")

async function addGoal(parent, args, context, info) {
    let data = configurGoal(args.goal, CONFIGURATION_TYPES.CREATE);

    let goal = await context.prisma.goal.create({
        data,
        include: goalInclude
    });

    context.pubsub.publish("GOAL_ADDED", { goalAdded: goal });
    
    return goal;
}

async function updateGoal(parent, args, context, info) {
    let id = args.goal.id;
    let data = configurGoal(args.goal, CONFIGURATION_TYPES.UPDATE);

    let goal = await context.prisma.goal.update({
        where: { id },
        data,
        include: goalInclude
    });

    context.pubsub.publish("GOAL_UPDATED", { goalUpdated: goal });
    
    return goal;
}

async function deleteGoal(parent, args, context, info) {
    let goal = await context.prisma.goal.update({
        where: { id: args.id },
        data: { isDeleted: true },
        include: goalInclude
    });

    context.pubsub.publish("GOAL_DELETED", { goalDeleted: goal });
    
    return goal;
}

module.exports = {
    addGoal,
    updateGoal,
    deleteGoal
}