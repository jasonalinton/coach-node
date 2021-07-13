const { removeItem } = require('../../utility')

function configureRepeats(data) {
    let create = createRepeats(data);
    let updates = updateRepeat(data, 'repeats');
    let disconnect = disconnectObjet(data, 'repeats');

    data.repeats = {};
    if (create.length > 0)
        data.repeats.create = create;
    if (updates.length > 0)
        data.repeats.update = updates;
    if (disconnect.length > 0)
        data.repeats.disconnect = disconnect;

    if (!data.repeats.create && !data.repeats.update && !data.repeats.disconnect)
        delete data.repeats;
}

function createRepeats(data) {
    let newRepeats = data.repeats.filter(repeat => !repeat.id || repeat.id < 0);
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
        
        configureDayIndicies(repeat)
        
        delete repeat.id;
        delete repeat.isUpdated;
    })
    return newRepeats;
}

function updateRepeat(data) {
    return data.repeats.filter(_repeat => (_repeat.id && _repeat.id > 0) && _repeat.isUpdated);
}

function updateObject(data, prop) {
    let updates = [];
    let existing = data[prop].filter(object => object.id && object.id > 0);
    existing.forEach(object => {
        let id = object.id;
        delete object.id;
        let update = {
            where: { id },
            data: object
        }
        updates.push(update);
    })
    existing.forEach(object => removeItem(object, data[prop]));
    return updates;
}

function deleteExistingRepeat(data, prop) {
    let deleted = [];
    data[prop].forEach(_object => {
        if (_object.id && _object.id > 0) {
            deleted.push({ id: _object.id });
        }
    })
    return deleted;
}

function deleteExisting(data, prop) {
    let deleted = [];
    data[prop].forEach(_object => {
        if (_object.id && _object.id > 0) {
            deleted.push({ id: _object.id });
        }
    })
    return deleted;
}

function disconnectObjet(data, prop) {
    let disconnect = [];
    if (data.unmappedItemIDs && data.unmappedItemIDs[prop]) {
        data.unmappedItemIDs[prop].forEach(id => disconnect.push({ id }));
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

function configureMappedObjects(data, prop) {
    let returned = {};
    if (data[prop]) {
        if (data[prop].length == 0) {
            delete data[prop]; // Remove property if empty
        } else {
            let create = [];
            let connect = [];

            // Loop through items
            // Connect or create connected item
            data[prop].forEach(item => {
                if (item.id && item.id > 0) {
                    connect.push({ id: item.id });
                } else {
                    delete item.id;
                    create.push(item);
                }
            });
            
            // Mappings
            // data[prop] = {};
            if (connect.length >= 1) {
                returned.connect = connect;
                // data[prop].connect = connect;
            }
            if (create.length >= 1) {
                returned.create = create;
                // data[prop].create = create;
            }
        }
    }
    return returned;
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

function createItemRepeat(data) {
    let item_repeats = [];
    data.repeats.forEach(repeat => {
        item_repeats.push({
            isEventVisible: true,
            repeat
        })
    })
    data.todo_repeats = { create: item_repeats }        
}

module.exports = {
    configureRepeats,
    configureTime,
    configureMapObject
}