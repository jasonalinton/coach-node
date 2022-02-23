const { removeItem } = require('../../../utility');
const { getTodoRepeat, getRoutineRepeat } = require('../../resolvers/mutations/time/repeatMutation');
const { routines } = require('../../resolvers/queries/routineQuery');

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

        configureMapObject(repeat, 'routineRepeat');

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
    if (data.unmappedIDs && data.unmappedIDs[prop]) {
        data.unmappedIDs[prop].forEach(id => disconnect.push({ id }));
    }
    return disconnect;
}

function connectRepeat(data, prop, type) {
    let connected = [];
    let list = data[prop].filter(repeat => repeat.isConnected);
    connected = list.map(repeat => {
        return { id: repeat.id };
    });

    // // THIS IS TEMPORARY AND WILL EVENTUALLY CAUSE PROBLEMS
    // if (type == "todo")
    //     createTodoRepeats(data);

    return connected;
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

function createTodoRepeats(data) {
    data.repeats.forEach(repeat => {
        repeat.todo_repeats = {
            create: {
                isEventVisible: (!repeat.isEventVisible) ? false : repeat.isEventVisible,
                todo: {
                    connect: { id: data.id }
                }
            }
        }
        if (repeat.isConnected) {
            repeat.routineRepeat = {
                connect: { id: repeat.id }
            }
            delete repeat.isConnected;
        }

        delete repeat.isEventVisible;
    })       
}

// function createTodoRepeats(data) {
//     let item_repeats = [];
//     data.repeats.forEach(repeat => {
//         repeat.todo_repeats = {
//             create: {
//                 isEventVisible: (!repeat.isEventVisible) ? false : repeat.isEventVisible,
//                 todo: {
//                     connect: { id: data.id }
//                 }
//             }
//         }
         

//         // item_repeats.push({
//         //     isEventVisible: (!repeat.isEventVisible) ? false : repeat.isEventVisible,
//         //     todo: {
//         //         connect: { id: data.id }
//         //     }
//         // })

//         delete repeat.isEventVisible;
//     })
//     data.todo_repeats = { create: item_repeats }        
// }

async function getLastIterationDateTime(repeat, itemType, itemID, context) {
    let item_repeat;

    try {
        if (itemType == 'todo') {
            item_repeat = await getTodoRepeat(null, { idTodo: itemID, idRepeat: repeat.id }, context);
        } else if (itemType == 'routine') {
            item_repeat = await getRoutineRepeat(null, { idRoutine: itemID, idRepeat: repeat.id }, context);
        }
    } catch (error) {
        console.log(error)
    }
    
    return (item_repeat) ? item_repeat.lastIterationDateTime : null;
}

async function getLastIterationDateTime2(repeat, itemType, itemID, context) {
    let item_repeat;

    try {
        if (itemType == 'todo') {
            item_repeat = await getTodoRepeat(null, { idTodo: itemID, idRepeat: repeat.id }, context);
        } else if (itemType == 'routine') {
            item_repeat = await getRoutineRepeat(null, { idRoutine: itemID, idRepeat: repeat.id }, context);
        }
    } catch (error) {
        console.log(error)
    }
    
    return (item_repeat) ? item_repeat.lastIterationDateTime : null;
}

function setLastIterationDateTime(repeat, itemType, itemID, dateTime) {
    let item_repeat = repeat[`${itemType}_repeats`].find(_item_repeat => _item_repeat[itemType].id == itemID);
    if (item_repeat) {
        item_repeat.lastIterationDateTime = dateTime;
        item_repeat.isUpdated = true;
    } else {
        let new_item_repeat = {
            lastIterationDateTime: dateTime,
            isEventVisible: true,
        }
        new_item_repeat[itemType] = { id: itemID };
        repeat[`${itemType}_repeats`].push(new_item_repeat);
    }
    repeat.isUpdated = true;
}

function isEventVisible(repeat, itemType, itemID) {
    let item_repeat = repeat[`${itemType}_repeats`].find(_item_repeat => _item_repeat[itemType].id == itemID);
    return (item_repeat) ? item_repeat.isEventVisible : true;
}

module.exports = {
    configureRepeats,
    configureTime,
    configureMapObject,
    getLastIterationDateTime,
    setLastIterationDateTime,
    isEventVisible
}