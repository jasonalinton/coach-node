const { clone } = require('../../../../utility');
const { goalInclude } = require('../../../properties/goalProperties');

async function getTypes(parent, { parentType }, context, info) {
    let types = await context.prisma.type.findMany({
        where: { description: parentType }
    });
    
    return types;
}

async function tempMisc(parent, args, context, info) {
    setItemPosition(context)
    
    return true;
}

async function setItemPosition(context) {
    let include = clone(goalInclude);

    let goals = await context.prisma.goal.findMany({
        include
    });

    let goals_Updated = [];
    let todos_Updated = [];
    let routines_Updated = [];

    goals.forEach(_goal => {
        let position = (_goal.position) ? _goal.position : "{}";
        position = JSON.parse(position);

        for (let i = 1; i < _goal.todos.length + 1; i++) {
            let _todo = _goal.todos[i-1];
            position[`goal_${_goal.id}`] = i;
            _todo.position = JSON.stringify(position);
            if (!todos_Updated.includes(_ => _.id = _todo.id))
                todos_Updated.push(_todo);
        }
    });

    for (let i = 0; i < todos_Updated.length; i++) {
        let _todo = todos_Updated[i];
        let todo = await context.prisma.todo.update({
            where: { id: _todo.id },
            data: { position: _todo.position }
        })
        console.log(todo.position);
    }
}

/*
Loop through Todo_TimePairs
    Check todo. If it only has one time pair and no repeats, map all iterations to the timepair
*/
async function mapIteraitonsToTodoTimePair(context) {
    let timepairs = await context.prisma.todo_TimePair.findMany({
        include: { 
            todo: {
                include: {
                    iterations: {
                        include: { todoTimePair: true }
                    },
                    repeats: true,
                    timePairs: true
                 },
                //  where: { isDeleted: false }
            },
            iterations: true
        }
    });

    timepairs.forEach(async _timepair => {
        let todo = _timepair.todo;
        if (!todo.isDeleted) {
            if (todo.timePairs.length > 1) {
                console.log(`Todo: ${todo.id} has multiple timepairs`);
            } else if (todo.repeats.length > 0 && todo.timePairs.length > 0) {
                todo.iterations.forEach(_itera => {
                    if (!_itera.idTodoRepeat) {
                        console.log(`Todo: ${todo.id} has at least 1 repeat`);
                    }
                })
            } else if (todo.iterations.length > 0) {
                let ids = todo.iterations.map(_itera => {return { id: _itera.id }});

                // let timepair = await context.prisma.todo_TimePair.update({
                //     data: {
                //         iterations: {
                //             connect: ids
                //         }
                //     },
                //     where: { id: _timepair.id },
                // })
            }
        }
    })

    return true;
}

async function fixTimes(context) {

}

module.exports = {
    getTypes,
    tempMisc
}