const { dataType } = require('../model/objectModel');

function configureObject(data, objectType, configureCreate, configureUpdate, configureDisconnect_in = configureDisconnect, configureDelete) {
    let prop = `${objectType}s`;

    let updates = configureUpdate(data, prop);
    let disconnect = configureDisconnect_in(data, prop);
    let create = configureCreate(data, prop); // Must be last

    data[prop] = {};
    if (create.length > 0)
        data[prop].create = create;
    if (updates.length > 0)
        data[prop].update = updates;
    if (disconnect.length > 0)
        data[prop].disconnect = disconnect;
    
    if (configureDelete) {
        let deleteMany = configureDelete(data, prop);
        if (deleteMany.length > 0)
            data[prop].deleteMany = deleteMany;
    }

    if (!data[prop].create && !data[prop].update && !data[prop].disconnect && !data[prop].deleteMany)
        delete data[prop];
}

function configureUpdate(parentObject, objectType) {
    return getUpdatedObjects(parentObject, objectType);
}

function configureDisconnect(parentObject, objectType) {
    return getDisconnectObjects(parentObject, objectType);
}

function getNewObjects(parentObject, objectType) {
    let id_condition = (_object) => !_object.id || _object.id < 0;

    let newObjects = parentObject[objectType].filter(_object =>
        id_condition(_object));
    
    return newObjects;
}

function getUpdatedObjects(parentObject, objectType) {
    let id_condition = (_object) => _object.id && _object.id > 0;
    let update_condition = (_object) => _object.isUpdated;

    let updatedObjects = parentObject[objectType].filter(_object =>
        id_condition(_object) &&
        update_condition(_object));
    
    return updatedObjects;
}

function isUpdated(object) {
    if (!object) return false;

    let id_condition = (_object) => _object.id && _object.id > 0;
    let update_condition = (_object) => _object.isUpdated;
    
    return id_condition(object) && update_condition(object);
}

function getDisconnectObjects(parentObject, prop) {
    let disconnect = [];
    if (parentObject.unmappedIDs && parentObject.unmappedIDs[prop])
        parentObject.unmappedIDs[prop].forEach(id => disconnect.push({ id }));
    return disconnect;
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
        delete object.isUpdated;
        
        object = {};
        if (connect) object.connect = connect;
        if (create) object.create = create;
        data[prop] = object;
    } else {
        delete data[prop];
    }
}

function getProps(props, prop) {
    let props_out = [];
    props.forEach(_prop => {
        if (_prop.dataType == prop)
            props_out.push(_prop.text);    
    });
    return props_out;
}

module.exports = {
    configureObject,
    getNewObjects,
    configureMapObject,
    getProps,
    isUpdated,
}