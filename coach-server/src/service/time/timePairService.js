const { Property, dataType } = require('../../model/objectModel');
const { configureObject, getNewObjects, configureMapObject, getProps, isUpdated } = require('../universal/objectService');
const { mapType } = require('../universal/typeService');
const { configureTime } = require('../time/timeService');

let objectType = 'timePair';

let props = [
    new Property("timeType", dataType.type),
    new Property("startTime", dataType.time),
    new Property("endTime", dataType.time),
];

let typeProps = getProps(props, dataType.type);
let timeProps = getProps(props, dataType.time);

function configureTimePairs(data) {
    configureObject(data, objectType, configureCreate, configureUpdate, configureDisconnect, configureDelete);
}

function configureCreate(parentObject, objectType) {
    let newTimePairs = getNewObjects(parentObject, objectType);
    newTimePairs.forEach(timePair => {
        // Map types
        typeProps.forEach(_typeProp => mapType(timePair, _typeProp));
        // Configure time
        timeProps.forEach(_timeProp => {
            configureTime(timePair, _timeProp);
            configureMapObject(timePair, _timeProp);
        });
        
        delete timePair.id;
        delete timePair.isUpdated;
    });
    return newTimePairs;
}

function configureUpdate(parentObject, objectType) {
    let updatedTimePairs = [];

    let timePairs = parentObject[objectType];
    timePairs.forEach(_timePair => {
        if (isUpdated(_timePair) || isUpdated(_timePair.startTime) || isUpdated(_timePair.endTime))
            updatedTimePairs.push(_timePair);
    });
    
    return updatedTimePairs;
}

function configureDisconnect(parentObject, prop) {
    let disconnect = [];
    if (prop == 'timePairs') return disconnect; // Relation contraint requires deletion

    if (parentObject.unmappedIDs && parentObject.unmappedIDs[prop])
        parentObject.unmappedIDs[prop].forEach(id => disconnect.push({ id }));
    return disconnect;
}

function configureDelete(parentObject, prop) {
    let deletes = [];
    if (prop == 'timePairs') {
        if (parentObject.unmappedIDs && parentObject.unmappedIDs[prop])
            parentObject.unmappedIDs[prop].forEach(id => deletes.push({ id }));
    } // Relation contraint requires deletion

    return deletes;
}



module.exports = {
    configureTimePairs,
}