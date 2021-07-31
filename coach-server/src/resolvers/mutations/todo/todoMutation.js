const controller = require('../../../controller/itemController');
const { todoInclude } = require('../../../properties/todoProperties');
const { configureIteration } = require('../../../controller/todoController');
const { configureRepeatTrans } = require('../time/repeatMutation');
const { configureTimePairTrans } = require('../time/timePairMutation');

async function addTodo(parent, args, context, info) {
    let data = controller.initData(args.todo);

    let todo = await context.prisma.todo.create({
        data,
        include: todoInclude
    });

    console.log("")

    todo = await configureIteration(todo, context);

    context.pubsub.publish("TODO_ADDED", { todoAdded: todo });
    todo.iterations.forEach(iteration =>
        context.pubsub.publish("ITERATION_ADDED", { iterationAdded: iteration }));
    
    return todo;
}

async function updateTodo(parent, args, context, info) {
    let id = args.todo.id;
    let data = controller.initData(args.todo);

    let transaction = []
    await configureRepeatTrans(data, transaction, context);
    await configureTimePairTrans(data, transaction, context);

    let todo = context.prisma.todo.update({
        where: { id },
        data,
        include: todoInclude
    });
    transaction.push(todo);

    let result = await context.prisma.$transaction(transaction);
    todo = result.pop();

    todo = await configureIteration(todo, context);
    
    updateSubscriptions(todo, sub)
    
    return todo;
}

async function deleteTodo(parent, args, context, info) {
    console.log("");
    let todo = await context.prisma.todo.update({
        where: { id: args.id },
        data: { isDeleted: true },
        include: todoInclude
    });

    context.pubsub.publish("TODO_DELETED", { todoDeleted: todo });
    todo.iterations.forEach(iteration =>
        context.pubsub.publish("ITERATION_DELETED", { iterationDeleted: iteration }));
    
    return todo;
}

async function createTodoIterations(parent, { todo }, context, info, repeat) {
    let iterations = [];

    // Create iterations
    let iterations_new = todo.iterations.filter(_i => !_i.id);
    for (let i = 0; i < iterations_new.length; i++){
        let _iteration = iterations_new[i];
        let iteration = await context.prisma.iteration.create({
            data: {
                ..._iteration,
                todos: {
                    connect: [{ id: todo.id }]
                }
            }
        });
        iterations.push(iteration);
    }

    // Upsert todo_repeats
    let repeats_updated = todo.repeats.filter(_repeat => _repeat.isUpdated);
    for (let i = 0; i < repeats_updated.length; i++) {
        let _repeat = repeats_updated[i];
        
        // Create todo_repeat
        let todo_repeats_new = _repeat.todo_repeats.filter(_todo_repeat => !_todo_repeat.id);
        for (let i = 0; i < todo_repeats_new.length; i++) {
            let todo_repeat_new = todo_repeats_new[i];

            let idTodo = todo_repeat_new.todo.id;
            delete todo_repeat_new.todo
            delete todo_repeat_new.repeat

            let newone = await context.prisma.todo_Repeat.create({
                data: {
                    ...todo_repeat_new,
                    idTodo,
                    idRepeat: _repeat.id
                },
            })
        }

        // Update todo_repeat
        let todo_repeats_updated = _repeat.todo_repeats.filter(_todo_repeat => _todo_repeat.isUpdated);
        for (let i = 0; i < todo_repeats_updated.length; i++) {
            let todo_repeat_updated = todo_repeats_updated[i];
            
            let idTodo = todo_repeats_updated.todo.id;
            delete todo_repeats_updated.todo
            delete todo_repeats_updated.repeat
            let newone = await context.prisma.todo_Repeat.update({
                where: { id: todo_repeat_updated.id, },
                data: {
                    ...todo_repeats_updated,
                    idTodo,
                    idRepeat: _repeat.id
                },
            })
        }

        // Map new iterations to repeat
        let repeat_out = await context.prisma.repeat.update({
            where: { id: repeat.id },
            data: {
                todoIterations: {
                    connect: iterations.map(_iteration => { return { id: _iteration.id } })
                }
            },
            include: { iterations: true }
        })
    }

    // Get updated todo
    todoInclude.iterations.where = {
        id: { in: iterations.map(_iteration => _iteration.id) }
    }

    let todo_updated = await context.prisma.todo.findFirst({
        where: { id: todo.id },
        include: todoInclude
    })

    iterations.forEach(_iteration => {
        context.pubsub.publish("ITERATION_ADDED", { iterationAdded: _iteration });
    })

    context.pubsub.publish("TODO_UPDATED", { todoUpdated: todo_updated });

    return todo_updated;
}

function updateSubscriptions(todo, context) {
    context.pubsub.publish("TODO_UPDATED", { todoUpdated: todo });
    todo.iterations.forEach(iteration =>
        context.pubsub.publish("ITERATION_UPDATED", { iterationUpdated: iteration }));
}

module.exports = {
    addTodo,
    updateTodo,
    deleteTodo,
    createTodoIterations
}