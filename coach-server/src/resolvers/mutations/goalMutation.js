const { goalInclude } = require('../../properties/goalProperties');
const { configurGoal } = require("../../service/item/goal/goalConfigurationService");
const { runCreateTransaction, runUpdateTransaction } = require('../../service/item/goal/goalTransactionService');
const { CONFIGURATION_TYPES } = require("../../../constant");

async function addGoal(parent, args, context, info) {
    let data = configurGoal(args.goal, CONFIGURATION_TYPES.CREATE);
    let goal = await runCreateTransaction(data, context);
    
    return goal;
}

async function updateGoal(parent, args, context, info) {
    let data = configurGoal(args.goal, CONFIGURATION_TYPES.UPDATE);
    let goal = await runUpdateTransaction(data, args.goal.id, context);
    
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

/*
- Refresh child positions
*/

async function saveGoalPositions(parent, { goalPositions }, context, info) {
    let trans = [];
    for (let i = 0; i < goalPositions.length; i++) {
        let _gp = goalPositions[i];

        if (!_gp.todoPositions) return;

        for (let j = 0; j < _gp.todoPositions.length; j++) {
            let _ip = _gp.todoPositions[j];
            let todo = await context.prisma.todo.findFirst({
                where: { id: _ip.idChild },
                select: { position: true }
            });

            let position = (todo.position) ? todo.position : "{}";
            position = JSON.parse(position);

            position[`goal_${_gp.idParent}`] = _ip.position;
            todo.position = JSON.stringify(position);

            todo = context.prisma.todo.update({
                data: todo,
                where: { id: _ip.idChild },
            });
            trans.push(todo);
        }
    }

    let results = await context.prisma.$transaction(trans);
    return true;
}

module.exports = {
    addGoal,
    updateGoal,
    deleteGoal,
    saveGoalPositions
}