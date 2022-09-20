const { clone, addHour } = require('../../../../utility');
const { goalInclude } = require('../../../properties/goalProperties');

async function getTypes(parent, { parentType }, context, info) {
    let types = await context.prisma.type.findMany({
        where: { description: parentType }
    });
    
    return types;
}

async function tempMisc(parent, args, context, info) {
    await fixTimes(context);
    
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
    let daylight1 = new Date(2021, 10, 7, 2, 0, 0);
    let daylight2 = new Date(2022, 2, 13, 2, 0, 0);

    let periods = [{
            expression: { gte: daylight2 },
            hours: 4
        },
        {
            expression: { gte: daylight1, lt: daylight2 },
            hours: 5
        },
        {
            expression: { lt: daylight1 },
            hours: 4
        },
        
    ]

    let tables = [
        {
            name: 'event',
            columns: [
                'createdAt',
                'updatedAt',
                'startAt',
                'endAt'
            ],
            records: []
        },
        {
            name: 'goal',
            columns: [
                'createdAt',
                'updatedAt'
            ],
            records: []
        },
        {
            name: 'goal_TimePair',
            columns: [
                'createdAt',
                'updatedAt'
            ],
            records: []
        },
        {
            name: 'iteration',
            columns: [
                'createdAt',
                'updatedAt',
                'startAt',
                'endAt',
                'completedAt',
                'attemptedAt'
            ],
            records: []
        },
        {
            name: 'metric',
            columns: [
                'createdAt',
                'updatedAt'
            ],
            records: []
        },
        {
            name: 'repeat',
            columns: [
                'createdAt',
                'updatedAt'
            ],
            records: []
        },
        {
            name: 'repeat_DayIndex',
            columns: [
                'createdAt',
                'updatedAt'
            ],
            records: []
        },
        {
            name: 'routine',
            columns: [
                'createdAt',
                'updatedAt'
            ],
            records: []
        },
        {
            name: 'routine_Repeat',
            columns: [
                'createdAt',
                'updatedAt',
                'lastIterationDateTime'
            ],
            records: []
        },
        {
            name: 'time',
            columns: [
                'createdAt',
                'updatedAt',
                'dateTime'
            ],
            records: []
        },
        {
            name: 'todo',
            columns: [
                'createdAt',
                'updatedAt'
            ],
            records: []
        },
        {
            name: 'todo_Repeat',
            columns: [
                'createdAt',
                'updatedAt',
                'lastIterationDateTime'
            ],
            records: []
        },
        {
            name: 'todo_TimePair',
            columns: [
                'createdAt',
                'updatedAt'
            ],
            records: []
        },
        {
            name: 'type',
            columns: [
                'createdAt',
                'updatedAt'
            ],
            records: []
        },
    ];

    await context.prisma.$transaction(async prisma => {
        for (let i = 0; i < tables.length; i++) {
            let _table = tables[i];
            console.log(_table);
            for (let j = 0; j < _table.columns.length; j++) {
                let _column = _table.columns[j];
                console.log(_column);

                for (let k = 0; k < periods.length; k++) {
                    let _period = periods[k];

                    let where = {};
                    where[_column] = _period.expression;

                    let select = { id: true };
                    select[_column] = true;

                    let records = await prisma[_table.name].findMany({
                        where,
                        select
                    });

                    for (let l = 0; l < records.length; l++) {
                        let original = records[l];

                        let date_original = original[_column];
                        let date_updated = addHour(date_original, _period.hours);
                        let date_updated1 = addHour(date_original, 0);

                        let data = {};
                        data[_column] = date_updated;

                        let updated = await prisma[_table.name].update({
                            where: { id: original.id },
                            data,
                            select
                        });

                        let record = { original, updated };
                        _table.records.push(record);

                        // console.log(record);
                    }
                }
            }
        }

        return true;
    },
    {
        maxWait: 360000, // default: 2000
        timeout: 360000, // default: 5000
    });
    
    return true;
}

module.exports = {
    getTypes,
    tempMisc
}