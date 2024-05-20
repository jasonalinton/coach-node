import moment from "moment";
import date from 'date-and-time';

export function currency(number) {
    return new Intl.NumberFormat([ ], { style: 'currency', currency: 'USD', currencyDisplay: 'narrowSymbol' }).format(number);
}

export function percent(number, decimalPlaces = 0) {
    return new Intl.NumberFormat([ ], { style: 'percent', minimumFractionDigits: decimalPlaces }).format(number);
}

export function float(number, decimalPlaces = 2) {
    return (Math.round(number * 100) / 100).toFixed(decimalPlaces);
}

export function floatString(number, decimalPlaces = 2) {
    return new Intl.NumberFormat([], 
        { minimumFractionDigits: decimalPlaces, maximumFractionDigits: decimalPlaces })
        .format(number);
}

export function sortAsc(array, prop) {
    prop = prop || 'id';

    return array.sort((a, b) => a[prop] - b[prop]);
}

export function sortDesc(array, prop) {
    prop = prop || 'id';

    return array.sort((a, b) => b[prop] - a[prop]);
}

export function sortDateAsc(array, dateProp) {
    return array.toSorted((a, b) => new Date(a[dateProp]) - new Date(b[dateProp]));
}

export function sortDateDesc(array, dateProp) {
    return array.toSorted((a, b) => new Date(b[dateProp]) - new Date(a[dateProp]));
}

export function sortAlphaAsc(array, prop) {
    if (prop) {
        return array.sort((a, b) => {
            if (a[prop].toLowerCase() < b[prop].toLowerCase()) {
                return -1;
            } 
            if (a[prop].toLowerCase() > b[prop].toLowerCase()) {
                return 1;
            }
            return 0;
        });
    } else {
        return array.sort((a, b) => {
            if (a.toLowerCase() < b.toLowerCase()) {
                return -1;
            } 
            if (a.toLowerCase() > b.toLowerCase()) {
                return 1;
            }
            return 0;
        });
    }
}

export function sortAlphaDesc(array, prop) {
    if (prop) {
        return array.sort((a, b) => {
            if (b[prop].toLowerCase() < a[prop].toLowerCase()) {
                return -1;
            } 
            if (b[prop].toLowerCase() > a[prop].toLowerCase()) {
                return 1;
            }
            return 0;
        });
    } else {
        return array.sort((a, b) => {
            if (b.toLowerCase() < a.toLowerCase()) {
                return -1;
            } 
            if (b.toLowerCase() > a.toLowerCase()) {
                return 1;
            }
            return 0;
        });
    }
}

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

export function sortItems(items, parentType, parentID) {
    var _items = items.sort((a, b) => {
        let positionA = a.positions
            .find(x => x.parentType == parentType && x.parentID == parentID).position;
        let positionB = b.positions
            .find(x => x.parentType == parentType && x.parentID == parentID).position;
        return  positionA - positionB;
    })
    return _items;
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

export function removeItemByID(id, itemList) {
    var findObject = (object) => object.id == id;
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

export function replaceOrAddItem(item, itemList) {
    var findObject = (object) => object.id == item.id;
    var index = itemList.findIndex(findObject);
    if (index === -1) {
        itemList.push(item);
        return false;
    } else {
        itemList.splice(index, 1, item);
        return true;
    }
}

export function addOrReplaceItem(item, itemList) {
    var findObject = (object) => object.id == item.id;
    var index = itemList.findIndex(findObject);
    if (index === -1) {
        itemList.push(item);
        return false;
    } else {
        itemList.splice(index, 1, item);
        return true;
    }
}

// Ten bucks says this causes a probalem in the future JL: 7/4/21
export function replaceProperties(newObject, oldObject) {
    for (let prop in newObject) {
        oldObject[prop] = newObject[prop];
    }
}

export function unmapItem(item, removedItem, property) {
    if (item.unmappedIDs) {
        if (item.unmappedIDs[property]) {
            item.unmappedIDs[property].push(removedItem.id);
        } else {
            item.unmappedIDs[property] = [ removedItem.id ];
        } 
    } else {
        item.unmappedIDs = { };
        item.unmappedIDs[property] = [ removedItem.id ];
    }

    removeItem(removedItem, item[property]);
}

export let getIDs =
    (objects) => objects.map(object => object.id);

export function clone(item) {
  return JSON.parse(JSON.stringify(item));
}

export function toCamelCase(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}

export function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

export function toDateString(dateTimeJSON) {
    let dateTimeArray = dateTimeJSON.split("T");
    let dateArray = dateTimeArray[0].split("-");

    return `${dateArray[0]}-${dateArray[1]}-${dateArray[2]}`;
}

export function toTimeString(dateTimeJSON) {
    let dateTimeArray = dateTimeJSON.split("T");
    let timeArray = dateTimeArray[1].split(":");

    return `${timeArray[0]}:${timeArray[1]}`;
}

export function toDateTimeString(dateTimeJSON) {
    let dateTimeArray = dateTimeJSON.split("T");

    let dateArray = dateTimeArray[0].split("-");
    let timeArray = dateTimeArray[1].split(":");

    return `${dateArray[0]}-${dateArray[1]}-${dateArray[2]} ${timeArray[0]}:${timeArray[1]}`;
}

export function timeModelToString(model) {
    let date = new Date(model.dateTime);

    if (model.idMoment == 87) { // Date
        return moment(date).format("LL");
    } else if (model.idMoment == 88) { // Time
        return moment(date).format("LT");
    } else if (model.idMoment == 89) { // Date-Time
        return moment(date).format("LLL");
    }
}

export function toTimezoneOffset(dateTimeJSON) {
    return dateTimeJSON.slice(19, 25);
}

export function today(dateTime) {
    return moment(dateTime).startOf('day').toDate();
}

export function startOfDay(dateTime) {
    return moment(dateTime).hour(0).minute(0).second(0).millisecond(0).toDate();
}

export function endOfDay(dateTime) {
    return moment(dateTime).endOf('day').millisecond(0).toDate();
}

export function firstDayOfWeek(dateTime) {
    return moment(dateTime).startOf('week').toDate();
}

export function lastDayOfWeek(dateTime) {
    return moment(dateTime).endOf('week').millisecond(0).toDate();
}

export function firstDayOfMonth(dateTime) {
    return moment(dateTime).startOf('month').toDate();
}

export function lastDayOfMonth(dateTime) {
    return moment(dateTime).endOf('month').millisecond(0).toDate();
}

export function year(dateTime = new Date()) {
    return date.format(dateTime, 'YYYY');   
}

export function year_long(dateTime = new Date()) {
    return date.format(dateTime, 'YYYY');   
}

export function month(dateTime = new Date()) {
    return date.format(dateTime, 'MMMM');   
}

export function month_long(dateTime = new Date()) {
    return date.format(dateTime, 'MMMM');   
}

export function month_short(dateTime = new Date()) {
    return date.format(dateTime, 'MMM');   
}

export function addDay(dateTime = new Date(), days = 1) {
    return moment(dateTime).add( days, 'day').toDate();   
}

export function subtractDay(dateTime = new Date(), days = 1) {
    return moment(dateTime).add( -days, 'day').toDate();   
}

export function addMonth(dateTime = new Date(), months = 1) {
    return moment(dateTime).add( months, 'month').toDate();   
}

export function subtractMonth(dateTime = new Date(), months = 1) {
    return moment(dateTime).add( -months, 'month').toDate();   
}

export function Percent(numberator, denominator) {
    return new Intl.NumberFormat([ ], { style: 'decimal', maximumFractionDigits: 0 }).format(numberator / denominator * 100);
}