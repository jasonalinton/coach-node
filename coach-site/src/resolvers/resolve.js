import { removeItem } from '../../utility'

export function addItemToCache(cache, QUERY, itemType, item) {
    let cacheData = cache.readQuery({ query: QUERY });
    cacheData[itemType].splice(0, 0, item);
    cache.writeQuery({
        query: QUERY,
        data: cacheData
    });
}

export function addPropertyToCache(cache, QUERY, propertyType, itemType, item) {
    let cacheData = cache.readQuery({ query: QUERY });
    cacheData[propertyType].forEach(prop => {
        let isMapped = item[propertyType].some(_prop => _prop.id == prop.id);
        if (isMapped) {
            prop[itemType].push(item);
        }
    })
    cache.writeQuery({
        query: QUERY,
        data: cacheData
    });
}

export function updateItemInCache(cache, QUERY, itemType, item) {
    let cacheData = cache.readQuery({ query: QUERY });
    let prevItem = cacheData[itemType].find(_item => _item.id == item.id);
    replaceProperties(item, prevItem);
    cache.writeQuery({
        query: QUERY,
        data: cacheData
    });
}

export function updatePropertyInCache(cache, QUERY, propertyType, itemType, item) {
    let cacheData = cache.readQuery({ query: QUERY });
    cacheData[propertyType].forEach(prop => {
        let isMapped = item[propertyType].some(_prop => _prop.id == prop.id);
        let mappedItem = prop[itemType].find(_mappedItem => _mappedItem.id == item.id);

        // If mapping should exist & there's no previously mappping
        if (isMapped && !mappedItem) {
            prop[itemType].push(item);
        } else if (isMapped && mappedItem) {
            // If mapping should exist & there is a previous mapping
            replaceProperties(item, mappedItem);
        } else if (!isMapped && mappedItem) {
            // If mapping shouldn't exist & there is a previous mapping
            removeItem(mappedItem, prop[itemType]);
        }
    })
    cache.writeQuery({
        query: QUERY,
        data: cacheData,
        broadcast: true
    });
    // cache.readQuery({ query: QUERY });
}

export function deleteItemInCache(cache, QUERY, itemType, item) {
    let cacheData = cache.readQuery({ query: QUERY });
    removeItem(item, cacheData[itemType]);
    cache.writeQuery({
        query: QUERY,
        data: cacheData
    });
}

export function deletePropertyInCache(cache, QUERY, propertyType, itemType, item) {
    let cacheData = cache.readQuery({ query: QUERY });
    cacheData[propertyType].forEach(prop => {
        let mappedItem = prop[itemType].find(_mappedItem => _mappedItem.id == item.id);
        if (mappedItem) {
            removeItem(mappedItem, prop[itemType]);
        }
    })
    cache.writeQuery({
        query: QUERY,
        data: cacheData
    });
}

// Ten bucks says this causes a probalem in the future JL: 7/4/21
function replaceProperties(newObject, oldObject) {
    for (let prop in newObject) {
        oldObject[prop] = newObject[prop];
    }
}

export default {
    addItemToCache,
    addPropertyToCache,
    updateItemInCache,
    updatePropertyInCache,
    deleteItemInCache,
    deletePropertyInCache
}