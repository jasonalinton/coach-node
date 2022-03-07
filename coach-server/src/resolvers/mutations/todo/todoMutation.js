const controller = require('../../../controller/itemController');
const { todoInclude } = require('../../../properties/todoProperties');
const { eventInclude, iterationIncude } = require('../../../properties/event/eventProperties');
const { configureIteration } = require('../../../controller/todoController');
const { configureRepeatTrans } = require('../time/repeatMutation');
const { configureTimePairTrans } = require('../time/timePairMutation');

async function addTodo(parent, args, context, info) {
    let data = controller.initData(args.todo, "todo");

    console.log("");

    let repeats = [];
    if (data.repeats && data.repeats.create)
        repeats = data.repeats.create;
    delete data.repeats;

    let todo = await context.prisma.todo.create({
        data,
        include: todoInclude
    });

    console.log("");

    repeats.forEach(async _repeat => {
        _repeat.todo_repeats.create.todo.connect.id = todo.id;
        _repeat.todos = { connect: { id: todo.id }};
        await context.prisma.repeat.create({
            data: _repeat
        })
    })

    todo = await context.prisma.todo.findFirst({
        where: { id: todo.id },
        include: todoInclude
    });

    console.log("");

    todo = await configureIteration(todo, context);

    context.pubsub.publish("TODO_ADDED", { todoAdded: todo });
    // todo.iterations.forEach(iteration =>
    //     context.pubsub.publish("ITERATION_ADDED", { iterationAdded: iteration }));
    
    return todo;
}

async function updateTodo(parent, args, context, info) {
    let id = args.todo.id;
    let data = controller.initData(args.todo, "todo");

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
    
    updateSubscriptions(todo, context)
    
    return todo;
}

async function deleteTodo(parent, args, context, info) {
    todoInclude.iterations = {
        include: {
            events: {
                include: {
                    iterations: true,
                    type: true
                }
            }
        }
    }

    // console.log("");
    let todo = await context.prisma.todo.update({
        where: { id: args.id },
        data: { isDeleted: true },
        include: todoInclude
    });

    let eventsDelete = [];
    let eventsUpdated = [];

    todo.iterations.forEach(async _iteration => {
        _iteration.events.forEach(_event => {
            if (_event.iterations.length == 1 && _event.type.text.toLowerCase() == 'todo') {
                eventsDelete.push(_event);
            } else {
                eventsUpdated.push(_event);
            }
        })

        await context.prisma.iteration.delete({
            where: { id: _iteration.id }
        });
    })

    eventsDelete.forEach(async _event => {
        await context.prisma.event.delete({
            where: { id: _event.id }
        });
    })

    context.pubsub.publish("TODO_DELETED", { todoDeleted: todo });
    todo.iterations.forEach(iteration =>
        context.pubsub.publish("ITERATION_DELETED", { iterationDeleted: iteration }));
    eventsDelete.forEach(_event =>
        context.pubsub.publish("EVENT_DELETED", { eventDeleted: _event }));
    eventsUpdated.forEach(async _event => {
        let eventt = await context.prisma.event.findFirst({
            where: { id: _event.id },
            include: eventInclude
        });
        context.pubsub.publish("EVENT_UPDATED", { eventUpdated: eventt })
    });
    
    return todo;
}

async function createTodoIterations(parent, { todo }, context, info, repeat) {
    let iterations = [];
    let events = [];

    // Create iterations
    let iterations_new = todo.iterations.filter(_i => !_i.id);
    for (let i = 0; i < iterations_new.length; i++){
        let _iteration = iterations_new[i];
        let _events = [];

        // Create event to be mapped to iteration
        // Note: Prisma doesn't allow to createMany with many-to-many relationships
        if (_iteration.events) {
            for (let j = 0; j < _iteration.events.length; j++) {
                let _event = await context.prisma.event.create({
                    data: {
                        ..._iteration.events[j],
                        type: {
                            connect: { id: 125 }
                        }
                    }
                });
                _events.push({ id: _event.id });
            }
        }
        
        delete _iteration.events;

        console.log(``)

        let iteration = await context.prisma.iteration.create({
            data: {
                ..._iteration,
                todo: {
                    connect: { id: todo.id }
                },
                todoRepeat: {
                    connect: { id: repeat.id }
                },
                events: {
                    connect: _events
                }
            }
        });
        
        iterations.push(iteration);
    }

    // THIS SHOULD BE MOVED TO ITS OWN FUNCTION
    // Update or set lastIterationDateTime in Todo_Repeat.
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

            await context.prisma.todo_Repeat.create({
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
            
            let idTodo = todo_repeat_updated.todo.id;
            delete todo_repeat_updated.todo;
            delete todo_repeat_updated.repeat;
            delete todo_repeat_updated.isUpdated;
            
            await context.prisma.todo_Repeat.update({
                where: { id: todo_repeat_updated.id, },
                data: {
                    ...todo_repeat_updated,
                    idTodo,
                    idRepeat: _repeat.id
                },
            })
        }
    }

    // Get updated todo
    todoInclude.iterations.where = {
        id: { in: iterations.map(_iteration => _iteration.id) }
    }

    let todo_updated = await context.prisma.todo.findFirst({
        where: { id: todo.id },
        include: todoInclude
    })

    events = await context.prisma.event.findMany({
        include: eventInclude,
        orderBy: { id: 'desc'}
    });

    // iterations.forEach(_iteration => {
    //     context.pubsub.publish("ITERATION_ADDED", { iterationAdded: _iteration });
    // });

    // events.forEach(_event => {
    //     context.pubsub.publish("EVENT_ADDED", { eventAdded: _event });
    // });

    // context.pubsub.publish("TODO_UPDATED", { todoUpdated: todo_updated });

    return todo_updated;
}

function updateSubscriptions(todo, context) {
    context.pubsub.publish("TODO_UPDATED", { todoUpdated: todo });
    // todo.iterations.forEach(iteration =>
    //     context.pubsub.publish("ITERATION_UPDATED", { iterationUpdated: iteration }));
}

async function scheduleTodo(parent, { idTodo, startAt, endAt }, context, info) {
    let todo = await context.prisma.todo.findFirst({
        where: { id: idTodo }
    })

    let iteration = await context.prisma.iteration.create({
        data: {
            text: todo.text,
            startAt,
            endAt,
            todo: { connect: { id: idTodo } }
        },
        include: iterationIncude
    });

    todo = context.prisma.todo.findFirst({
        where: { id: idTodo },
        include: todoInclude
    });

    context.pubsub.publish("ITERATION_ADDED", { iterationAdded: iteration });
    context.pubsub.publish("TODO_UPDATED", { todoUpdated: todo });

    return { todo, iteration }
}


async function mapTodoToEvent(parent, { idTodo, idEvent }, context, info) {
    let todo = await context.prisma.todo.findFirst({
        where: { id: idTodo }
    });

    let event = await context.prisma.event.findFirst({
        where: { id: idEvent }
    });

    let iteration = await context.prisma.iteration.create({
        data: {
            text: todo.text,
            startAt: event.startAt,
            endAt: event.endAt,
            todo: { connect: { id: idTodo } },
            events: { connect: [{id: idEvent }] }
        },
        include: iterationIncude
    });

    event = context.prisma.event.findFirst({
        where: { id: idEvent },
        include: eventInclude
    });

    todo = context.prisma.todo.findFirst({
        where: { id: idTodo },
        include: todoInclude
    });

    context.pubsub.publish("ITERATION_ADDED", { iterationAdded: iteration });
    context.pubsub.publish("TODO_UPDATED", { todoUpdated: todo });
    context.pubsub.publish("EVENT_UPDATED", { eventUpdated: event });

    return { todo, iteration, event }
}

module.exports = {
    addTodo,
    updateTodo,
    deleteTodo,
    createTodoIterations,
    scheduleTodo,
    mapTodoToEvent
}