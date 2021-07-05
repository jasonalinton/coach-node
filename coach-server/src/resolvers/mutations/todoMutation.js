const controller = require('../../controller/itemController');
const { todoInclude } = require('../../properties/todoProperties');

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

    let todo = await context.prisma.todo.update({
        where: { id },
        data,
        include: todoInclude
    });

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