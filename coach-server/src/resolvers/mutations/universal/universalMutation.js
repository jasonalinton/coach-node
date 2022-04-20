async function getTypes(parent, { parentType }, context, info) {
    let types = await context.prisma.type.findMany({
        where: { description: parentType }
    });
    
    return types;
}

async function tempMisc(parent, args, context, info) {
    return true;
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

module.exports = {
    getTypes,
    tempMisc
}