const controller = require('../../controller/itemController');
const { todoInclude } = require('../../properties/todoProperties');
const { updateRepeat } = require('./repeatMutation')

async function addTodo(parent, args, context, info) {
    let data = controller.initData(args.todo);

    let todo = await context.prisma.todo.create({
        data,
        include: todoInclude
    });

    context.pubsub.publish("TODO_ADDED", { todoAdded: todo });
    
    return todo;
}

async function updateTodo(parent, args, context, info) {
    let id = args.todo.id;
    let data = controller.initData(args.todo);

    let transaction = [];
    if (data.repeats && data.repeats.update) {
        for (let i = 0; i < data.repeats.update.length; i++) {
            let _transaction = await updateRepeat(context, data.repeats.update[i], true);
            _transaction.forEach(tran => transaction.push(tran));
        }
        delete data.repeats.update;
        if (!data.repeats.create && !data.repeats.disconnect) {
            delete data.repeats;
        }
    }

    let todo = context.prisma.todo.update({
        where: { id },
        data,
        include: todoInclude
    });
    transaction.push(todo);

    let result = await context.prisma.$transaction(transaction);
    todo = result.pop();
    
    context.pubsub.publish("TODO_UPDATED", { todoUpdated: todo });
    
    return todo;
}

async function deleteTodo(parent, args, context, info) {
    let todo = await context.prisma.todo.update({
        where: { id: args.id },
        data: { isDeleted: true },
        include: todoInclude
    });

    context.pubsub.publish("TODO_DELETED", { todoDeleted: todo });
    
    return todo;
}

module.exports = {
    addTodo,
    updateTodo,
    deleteTodo
}