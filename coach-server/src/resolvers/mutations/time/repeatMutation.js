async function configureRepeatTrans(data, transaction = [], context) {
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
    return transaction;
}

async function updateRepeat(context, repeat, useTransaction = false) {
    let transaction = [];

    let times = ['startRepeat', 'endRepeat', 'startIteration', 'endIteration'];
    for (let i = 0; i < times.length; i++) {
        let time = repeat[times[i]];
        if (time && time.isUpdated) {
            try {
                if (time.id > 0) {
                    await createTimeUpdateTransactions(time, context, transaction);
                } else if (time.id < 0) {
                    await createTimeCreateTransactions(repeat, times[i], context, transaction);
                }
            } catch (err) {
                console.log(err)
            }
            
        }
        delete repeat[times[i]];
    }

    await createRepeatTransaction(repeat, context, transaction);

    if (useTransaction)
        return transaction;
    else
        await context.prisma.$transaction(transaction);
}

async function createTimeUpdateTransactions(time, context, transaction) {
    let existingTime = await context.prisma.time.findFirst({
        where: { id: time.id }
    })

    delete time.id;
    delete time.isUpdated;

    let props = [
        { id: 'idEndpoint', name: 'endpoint' },
        { id: 'idMoment', name: 'moment' },
        { id: 'idFlexibility', name: 'flexibility' },
        { id: 'idType', name: 'type' }
    ];

    props.forEach(prop => {
        let type = time[prop.name]
        if (existingTime[prop.id] != type.id) {
            time[prop.name] = {
                connect: { id: type.id }
            }
        } else
            delete time[prop.name];
    })

    transaction.push(context.prisma.time.update({
        where: { id: existingTime.id },
        data: time
    }))
}

async function createTimeCreateTransactions(repeat, prop, context, transaction) {
    let time = repeat[prop];
    let connect = { connect: { id: repeat.id } }

    if (prop == 'startRepeat') {
        time.repeat_StartTimes = connect;
    } else if (prop == 'endRepeat') {
        time.repeat_EndTimes = connect;
    } else if (prop == 'startIteration') {
        time.repeatIteration_StartTimes = connect;
    } else if (prop == 'endIteration') {
        time.repeatIteration_EndTimes = connect;
    }

    configureTime(repeat, prop);
    configureMapObject(repeat, prop);

    delete time.id;

    transaction.push(context.prisma.time.create({
        data: time
    }))
}

async function createRepeatTransaction(repeat, context, transaction) {
    let existingRepeat = await context.prisma.repeat.findFirst({
        where: { id: repeat.id },
        include: { dayIndecies: true }
    });

    let props = [
        { id: 'idType', name: 'type' },
        { id: 'idTimeframe', name: 'timeframe' },
    ];
    props.forEach(prop => {
        let type = repeat[prop.name]
        if (existingRepeat[prop.id] == type.id) {
            delete repeat[prop.name];
        } else {
            repeat[prop.name] = {
                connect: { id: type.id }
            }
        }
    });

    createDayIndexTransactions(repeat, existingRepeat, context, transaction);

    delete repeat.id;
    delete repeat.isUpdated;
    delete repeat.routine_repeats;
    delete repeat.routines;

    transaction.push(context.prisma.repeat.update({
        where: { id: existingRepeat.id },
        data: repeat
    }))
}

function createDayIndexTransactions(repeat_in, existingRepeat, context, transaction) {
    let newIndicies = [];
    let existingIndicies = existingRepeat.dayIndecies.map(_index => _index.index);
    repeat_in.dayIndecies.forEach(dayIndex => {
        if (!existingIndicies.includes(dayIndex.index)) {
            newIndicies.push({ index: dayIndex.index });
        }
    });

    let removedIndicies = [];
    let indicies_In = repeat_in.dayIndecies.map(_index => _index.index);
    existingRepeat.dayIndecies.forEach(_existingIndex => {
        if (!indicies_In.includes(_existingIndex.index)) {
            removedIndicies.push({ id: _existingIndex.id });
        }
    });

    repeat_in.dayIndecies = {};
    if (newIndicies.length > 0)
        repeat_in.dayIndecies.create = newIndicies;
    if (removedIndicies.length > 0)
        repeat_in.dayIndecies.deleteMany = removedIndicies;
    if (!repeat_in.dayIndecies.create && !repeat_in.dayIndecies.deleteMany)
        delete repeat_in.dayIndecies;
    
}

async function getRoutineRepeat(parent, { idRepeat, idRoutine }, context, info) {
    console.log("")
    let routine_repeat = await context.prisma.routine_Repeat.findFirst({
        where: {
            idRoutine,
            idRepeat
        }
    })
    
    return routine_repeat;
}

async function getTodoRepeat(parent, { idTodo, idRepeat }, context, info) {
    console.log("")
    let todo_repeat = await context.prisma.todo_Repeat.findFirst({
        where: {
            idTodo,
            idRepeat
        }
    })
    
    return todo_repeat;
}

function configureTime(data, prop) {
    let time = data[prop];
    if (time) {
        configureType(time, 'endpoint');
        configureType(time, 'moment');
        configureType(time, 'flexibility');
        configureType(time, 'type');

        delete time.isUpdated;
    }
}

function configureType(data, prop) {
    if (data[prop]) {
        data[prop] = {
            connect: { id: data[prop].id }
        }
    } else {
        delete data[prop];
    }
}

function configureMapObject(data, prop) {
    let object = data[prop];
    if (object) {
        let create = undefined;
        let connect = undefined;

        if (object.id && object.id > 0) {
            connect = { id: object.id };
        } else {
            delete object.id;
            create = object;
        }
        
        object = {};
        if (connect) object.connect = connect;
        if (create) object.create = create;
        data[prop] = object;
    } else {
        delete data[prop];
    }
}

module.exports = {
    configureRepeatTrans,
    getRoutineRepeat,
    getTodoRepeat
}