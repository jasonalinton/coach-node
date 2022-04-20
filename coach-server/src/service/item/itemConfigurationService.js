const { clone } = require('../../../utility');
const { CONFIGURATION_TYPES } = require('../../../constant');

function configureMapObject(data, prop, configItem, configurationType = CONFIGURATION_TYPES.UPDATE) {
    let object = data[prop];
    if (object) {
        let create = undefined;
        let connect = undefined;

        if (object.id && object.id > 0) {
            connect = { id: object.id };
        } else {
            delete object.id;
            create = clone(object);
        }
        
        configItem[prop] = {};
        if (connect) configItem[prop].connect = connect;
        if (create) configItem[prop].create = create;
    } else {
        if (configurationType == CONFIGURATION_TYPES.CREATE) {
            delete configItem[prop];
        } else if (configurationType == CONFIGURATION_TYPES.UPDATE) {
            configItem[prop] = { disconnect: true };
        }
    }
}

function configureMappedObject(data, prop, configItem) {
    if (data[prop]) {
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
        configItem[prop] = {};
        if (connect.length >= 1) {
            configItem[prop].connect = connect;
        }
        if (create.length >= 1) {
            configItem[prop].create = create;
        }
    }

    // Disconnect items
    let disconnect = [];
    if (data.unmappedIDs && data.unmappedIDs[prop]) {
        data.unmappedIDs[prop].forEach(id => disconnect.push({ id }));

        if (disconnect.length >= 1) {
            if (!configItem[prop]) configItem[prop] = {};
            configItem[prop].disconnect = disconnect;
        }
    }
}

module.exports = {
    configureMapObject,
    configureMappedObject
}