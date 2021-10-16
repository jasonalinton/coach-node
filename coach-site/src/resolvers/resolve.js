import { removeItem } from '../../utility'

export function addPropertyToCache(item, itemType, properties, previousResult) {
    // THIS DOESN'T HANDLE MAPPED ITEMS THAT WERE CREATED AT THE SAME TIME
        // YOU WILL NEED TO PUBLISH THOSE NEW ITEMS ON THE SERVER
    properties.forEach(propertyType => {
        previousResult.items[propertyType].forEach(prop => {
            let isMapped = item[propertyType].some(_prop => _prop.id == prop.id);
            if (isMapped) {
                prop[itemType].push(item);
            }
        })
    })
}

export function updatePropertyInCache(item, itemType, properties, previousResult) {
    // THIS DOESN'T HANDLE MAPPED ITEMS THAT WERE CREATED AT THE SAME TIME
        // YOU WILL NEED TO PUBLISH THOSE NEW ITEMS ON THE SERVER
    properties.forEach(propertyType => {
        previousResult.items[propertyType].forEach(prop => {
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
        });
    })
}

export function deletePropertyInCache(item, itemType, properties, previousResult) {
    properties.forEach(propertyType => {
        previousResult.items[propertyType].forEach(prop => {
            let mappedItem = prop[itemType].find(_mappedItem => _mappedItem.id == item.id);
            if (mappedItem) {
                removeItem(mappedItem, prop[itemType]);
            }
        })
    })

}

// Ten bucks says this causes a probalem in the future JL: 7/4/21
function replaceProperties(newObject, oldObject) {
    for (let prop in newObject) {
        oldObject[prop] = newObject[prop];
    }
}

// function formatRepeatDates(item) {
//     if (item.repeats) {
//         item.repeats.forEach(repeat => {
//             ['startRepeat', 'endRepeat', 'startIteration', 'endIteration'].forEach(timeProp => {
//                 if (repeat[timeProp]) {
//                     repeat[timeProp].dateTime = new Date(repeat[timeProp].dateTime);
//                 }
//             })
//         })
//     }
// }