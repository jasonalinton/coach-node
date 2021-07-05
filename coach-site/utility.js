export function listToString(objectArray, property) {
    let string = "";
    let index = 0;
    objectArray.forEach(object => {
        if (index++ !== 0)
            string += ", ";

        string += object[property];
    });
    return string;
}

export function removeItem(item, itemList) {
    var findObject = (object) => object.id == item.id;
    var index = itemList.findIndex(findObject);
    if (index === -1) return false;
    else {
        itemList.splice(index, 1);
        return true;
    }
}

export function replaceItem(item, itemList) {
    var findObject = (object) => object.id == item.id;
    var index = itemList.findIndex(findObject);
    if (index === -1) return false;
    else {
        itemList.splice(index, 1, item);
        return true;
    }
}

export function unmapItem(item, removedItem, property) {
    if (item.unmappedItemIDs) {
        if (item.unmappedItemIDs[property]) {
            item.unmappedItemIDs[property].push(removedItem.id);
        } else {
            item.unmappedItemIDs[property] = [ removedItem.id ];
        } 
    } else {
        item.unmappedItemIDs = { };
        item.unmappedItemIDs[property] = [ removedItem.id ];
    }

    removeItem(removedItem, item[property]);
}

export let getIDs =
    (objects) => objects.map(object => object.id)

export function clone(item) {
  return JSON.parse(JSON.stringify(item));
}