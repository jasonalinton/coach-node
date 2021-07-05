const { todoInclude } = require('../../properties/todoProperties');

async function todos(parent, args, context, info) {
    let todos = await context.prisma.todo.findMany({
        where: { isDeleted: false },
        include: todoInclude,
        orderBy: { id: 'desc'}
    });
    
    return todos;
}

module.exports = {
    todos
}