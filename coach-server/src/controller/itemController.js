const { configureRepeats } = require('./time/repeatController');
const { configureTimePairs } = require('./time/timePairController');

function initData(data = {}, type = "") {
    
    if ((data.repeats && data.repeats.length > 0) || (data.unmappedIDs && data.unmappedIDs.repeats && data.unmappedIDs.repeats.length > 0 )) 
    configureRepeats(data, type);
    else delete data.repeats;
    
    if (data.id || data.id >= 0) delete data.id; // Remove unnecessary ID
    
    if (data.timePairs && data.timePairs.length > 0) configureTimePairs(data);
    else delete data.timePairs;

    //if (data.iterations && data.iterations.length == 0)
        delete data.iterations;

    initItems(data);
    
    delete data.unmappedIDs;

    return data;
}

function initItems(data) {
    let itemTypes = ['metrics', 'parents', 'children', 'goals', 'todos', 'routines'];
    itemTypes.forEach(prop => configureMappedObjects(data, prop))
}

function configureMappedObjects(data, prop) {
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
            data[prop] = {};
            if (connect.length >= 1) {
                data[prop].connect = connect;
            }
            if (create.length >= 1) {
                data[prop].create = create;
            }
        }
    }

    // Disconnect items
    let disconnect = [];
    if (data.unmappedIDs && data.unmappedIDs[prop]) {
        data.unmappedIDs[prop].forEach(id => disconnect.push({ id }));

        if (disconnect.length >= 1) {
            if (!data[prop]) data[prop] = {};
            data[prop].disconnect = disconnect;
        }
    }
}

module.exports = {
    initData
}