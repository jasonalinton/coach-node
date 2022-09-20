function configureRepeats(data, type = "") {
    let create = createRepeats(data, type);
    let updates = updateRepeat(data, type);
    let disconnect = disconnectObjet(data, 'repeats');
    // let connect = connectRepeat(data, 'repeats', type);

    data.repeats = {};
    if (create.length > 0)
        data.repeats.create = create;
    if (updates.length > 0)
        data.repeats.update = updates;
    if (disconnect.length > 0)
        data.repeats.disconnect = disconnect;
    // if (connect.length > 0)
    //     data.repeats.connect = connect;

    if (!data.repeats.create && !data.repeats.update && !data.repeats.disconnect && !data.repeats.connect)
        delete data.repeats;
}

function createRepeats(data, type = "") {
    if (!data.repeats) return [];
    let newRepeats = data.repeats.filter(repeat => (!repeat.id || repeat.id < 0) || repeat.isConnected);
    newRepeats.forEach(repeat => {
        configureTime(repeat, 'startRepeat');
        configureMapObject(repeat, 'startRepeat');
        
        configureTime(repeat, 'endRepeat');
        configureMapObject(repeat, 'endRepeat');
        
        configureTime(repeat, 'startIteration');
        configureMapObject(repeat, 'startIteration');
        
        configureTime(repeat, 'endIteration');
        configureMapObject(repeat, 'endIteration');
        
        configureType(repeat, 'timeframe');
        configureType(repeat, 'type');
        
        configureDayIndicies(repeat);

        // configureMapObject(repeat, 'routineRepeat');

        if (type == "todo")
            createTodoRepeats(data, repeat)
        
        delete repeat.id;
        delete repeat.isUpdated;
        delete repeat.isEventVisible;
        delete repeat.routine_repeats;
        delete repeat.routines
    })
    return newRepeats;
}

function updateRepeat(data, type) {
    // Todo_repeats currently can't be updated
    if (type == "todo" )
        data.repeats.forEach(_repeat => {
            if (_repeat.isUpdated)
                delete _repeat.todo_repeats
        })

    return data.repeats.filter(_repeat => (_repeat.id && _repeat.id > 0) && _repeat.isUpdated);
}

function disconnectObjet(data, prop) {
    let disconnect = [];
    if (data.unmappedIDs && data.unmappedIDs[prop]) {
        data.unmappedIDs[prop].forEach(id => disconnect.push({ id }));
    }
    return disconnect;
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

function configureType(data, prop) {
    if (data[prop]) {
        data[prop] = {
            connect: { id: data[prop].id }
        }
    } else {
        delete data[prop];
    }
}

function configureDayIndicies(repeat) {
    let create = [];
    repeat.dayIndecies.forEach(dayIndex => {
        create.push({ index: dayIndex.index });
    })
    if (repeat.dayIndecies.length > 0)
        repeat.dayIndecies = { create };
    else
        delete repeat.dayIndecies;
}

function createTodoRepeats(data, repeat) {
    repeat.todo_repeats = {
        create: {
            isEventVisible: (!repeat.isEventVisible) ? false : repeat.isEventVisible,
            todo: {
                // ID will be undifined if todo is in creation process
                // This property will need to be updated in the transaction that creates to todo
                connect: { id: data.id }
            }
        }
    }
    if (repeat.routineRepeat) {
        repeat.routineRepeat = {
            connect: { id: repeat.routineRepeat.id }
        }
    }

    delete repeat.isEventVisible;  
}

module.exports = {
    configureRepeats
}