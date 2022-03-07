

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

// function configureMappedObject(property) {
//     let create = [];
//     let connect = [];

//     // Loop through items
//     // Connect or create connected item
//     property.forEach(item => {
//         if (item.id && item.id > 0) {
//             connect.push({ id: item.id });
//         } else {
//             delete item.id;
//             create.push(item);
//         }
//     });
    
//     // Mappings
//     let property_out = {};
//     if (connect.length >= 1)
//         property_out.connect = connect;
//     if (create.length >= 1)
//         property_out.create = create;

//     // Disconnect items
//     let disconnect = [];
//     if (data.unmappedIDs && data.unmappedIDs[prop]) {
//         data.unmappedIDs[prop].forEach(id => disconnect.push({ id }));

//         if (disconnect.length >= 1) {
//             if (!data[prop]) data[prop] = {};
//             data[prop].disconnect = disconnect;
//         }
//     }
// }

module.exports = {
    configureMappedObject
}