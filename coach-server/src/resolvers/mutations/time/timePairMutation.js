const { configureTime } = require('../../../controller/time/timeController')
const { configureMapObject } = require('../../../controller/objectController')

async function configureTimePairTrans(data, transaction = [], context) {
    if (data.timePairs) {
        if (data.timePairs.update) {
            for (let i = 0; i < data.timePairs.update.length; i++) {
                let _transaction = await updateTimePair(context, data.timePairs.update[i], true);
                _transaction.forEach(tran => transaction.push(tran));
            }
            delete data.timePairs.update;
        }
        if (!data.timePairs.create && !data.timePairs.disconnect && !data.timePairs.deleteMany) {
            delete data.timePairs;
        }
    }
    return transaction;
}

async function updateTimePair(context, timePair, useTransaction = false) {
    let transaction = [];

    let times = ['startTime', 'endTime'];
    for (let i = 0; i < times.length; i++) {
        let time = timePair[times[i]];
        if (time) {
            if (time.id > 0) await createTimeUpdateTransactions(time, context, transaction);
            else await createTimeCreateTransactions(timePair, times[i], context, transaction);
            
            delete timePair[times[i]];
        } else
            // timePair[times[i]] = { delete: true };
            await configureDelete(timePair, times[i], context);
    }

    await createTimePairTransaction(timePair, context, transaction);

    if (useTransaction)
        return transaction;
    else
        await prisma.$transaction(transaction);
}

async function createTimeUpdateTransactions(time, context, transaction) {
    let existingTime = await context.prisma.time.findFirst({
        where: { id: time.id }
    })

    delete time.id;
    delete time.isUpdated;

    let props = [
        { id: 'idType', name: 'type' },
        { id: 'idEndpoint', name: 'endpoint' },
        { id: 'idMoment', name: 'moment' },
        { id: 'idFlexibility', name: 'flexibility' },
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

async function createTimeCreateTransactions(timePair, prop, context, transaction) {
    let time = timePair[prop];
    let connect = { connect: { id: timePair.id } }

    if (prop == 'startTime') {
        time.todo_StartTimes = connect;
    } else if (prop == 'endTime') {
        time.todo_EndTimes = connect;
    }

    configureTime(timePair, prop);
    configureMapObject(timePair, prop);

    delete time.id;

    transaction.push(context.prisma.time.create({
        data: time
    }))
}

async function configureDelete(timePair, prop, context) {
    let existingTimePair = await context.prisma.todo_TimePair.findFirst({
        where: { id: timePair.id },
        select: {
            startTime: true,
            endTime: true
        }
    })

    if (existingTimePair[prop])
        timePair[prop] = { delete: true };
    else
        delete timePair[prop];
}

async function createTimePairTransaction(timePair, context, transaction) {
    let existingTimePair = await context.prisma.todo_TimePair.findFirst({
        where: { id: timePair.id },
    });

    let props = [
        { id: 'idType', name: 'timeType' },
    ];
    props.forEach(prop => {
        let type = timePair[prop.name]
        if (existingTimePair[prop.id] == type.id) {
            delete timePair[prop.name];
        } else {
            timePair[prop.name] = {
                connect: { id: type.id }
            }
        }
    });
    delete timePair.id;
    delete timePair.isUpdated;

    transaction.push(context.prisma.todo_TimePair.update({
        where: { id: existingTimePair.id },
        data: timePair
    }))
}

module.exports = {
    configureTimePairTrans,
}