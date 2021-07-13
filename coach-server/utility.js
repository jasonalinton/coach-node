function removeItem(item, itemList) {
    var findObject = (object) => object.id == item.id;
    var index = itemList.findIndex(findObject);
    if (index === -1) return false;
    else {
        itemList.splice(index, 1);
        return true;
    }
}

module.exports = {
    removeItem
}