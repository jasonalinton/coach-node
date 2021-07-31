const { Property, dataType } = require('../../model/objectModel');
const { getProps } = require('../objectController');
const { mapTypes } = require('../type/typeController');

let props = [
    new Property("type", dataType.type),
    new Property("endpoint", dataType.type),
    new Property("moment", dataType.type),
    new Property("flexibility", dataType.type),
    new Property("datetime", dataType.dateTime),
]

let typeProps = getProps(props, dataType.type);

function configureTime(parentObject, timeProp) {
    let time = parentObject[timeProp];
    if (time)
        mapTypes(time, typeProps);
}

module.exports = {
    configureTime
}
