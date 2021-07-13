const { configureRepeats } = require('./timeController');

function initData(data) {
    data = (data) ? data : {};

    if (data.id || data.id >= 0) delete data.id; // Remove unnecessary ID

    configureRepeats(data);
    delete data.timePairs;
    initItems(data);
    
    delete data.unmappedItemIDs;

    // delete data.repeats;
    return data;
}

function initItems(data) {
    let itemTypes = ['metrics', 'parents', 'children', 'goals', 'todos', 'routines'];
    itemTypes.forEach(prop => configureMappedObject(data, prop))
}

// function initItems(data) {
//     data = (data) ? data : {};

//     if (data.id || data.id >= 0) delete data.id; // Remove unnecessary ID

//     // Loop through item types
//     let itemTypes = ['metrics', 'parents', 'children', 'goals', 'todos', 'routines', 'timePairs', 'repeats'];
//     itemTypes.forEach(items => {
//         if (data[items]) {
//             if (data[items].length == 0) {
//                 delete data[items]; // Remove property if empty
//             } else {
//                 let create = [];
//                 let connect = [];

//                 // Loop through items
//                 // Connect or create connected item
//                 data[items].forEach(item => {
//                     if (item.id && item.id > 0) {
//                         connect.push({ id: item.id });
//                     } else {
//                         delete item.id;
//                         create.push(item);
//                     }
//                 });
                
//                 // Mappings
//                 data[items] = {};
//                 if (connect.length >= 1) {
//                     data[items].connect = connect;
//                 }
//                 if (create.length >= 1) {
//                     data[items].create = create;
//                 }
//             } 
            
//         }

//         {
//             // Disconnect items
//             let disconnect = [];
//             if (data.unmappedItemIDs && data.unmappedItemIDs[items]) {
//                 data.unmappedItemIDs[items].forEach(id => disconnect.push({ id }));

//                 if (disconnect.length >= 1) {
//                     if (!data[items]) data[items] = {};
//                     data[items].disconnect = disconnect;
//                 }
//             }
//         }
//     });

//     delete data.unmappedItemIDs;

//     return data;
// }

function configureMappedObject(data, prop) {
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
    if (data.unmappedItemIDs && data.unmappedItemIDs[prop]) {
        data.unmappedItemIDs[prop].forEach(id => disconnect.push({ id }));

        if (disconnect.length >= 1) {
            if (!data[prop]) data[prop] = {};
            data[prop].disconnect = disconnect;
        }
    }
}

module.exports = {
    initData
}