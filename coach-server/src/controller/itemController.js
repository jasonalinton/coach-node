function initData(data) {
    data = (data) ? data : {};

    if (data.id || data.id >= 0) delete data.id; // Remove unnecessary ID

    // Loop through item types
    let itemTypes = ['metrics', 'goals', 'todos', 'routines', 'parents', 'children'];
    itemTypes.forEach(items => {
        if (data[items]) {
            if (data[items].length == 0) {
                delete data[items]; // Remove property if empty
            } else {
                let create = [];
                let connect = [];

                // Loop through items
                // Connect or create connected item
                data[items].forEach(item => {
                    if (item.id) {
                        connect.push({ id: item.id });
                    } else {
                        create.push(item);
                    }
                });
                
                // Mappings
                data[items] = {};
                if (connect.length >= 1) {
                    data[items].connect = connect;
                }
                if (create.length >= 1) {
                    data[items].create = create;
                }
            } 
            
        }

        {
            // Disconnect items
            let disconnect = [];
            if (data.unmappedItemIDs && data.unmappedItemIDs[items]) {
                data.unmappedItemIDs[items].forEach(id => disconnect.push({ id }));

                if (disconnect.length >= 1) {
                    if (!data[items]) data[items] = {};
                    data[items].disconnect = disconnect;
                }
            }
        }
    });

    delete data.unmappedItemIDs;

    return data;
}

module.exports = {
    initData
}