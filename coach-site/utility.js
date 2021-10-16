import moment from "moment";
import date from 'date-and-time';

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

export function toTimezoneOffset(dateTimeJSON) {
    return dateTimeJSON.slice(19, 25);
}

export function today(dateTime) {
    return moment(dateTime).startOf('day').toDate();
}

export function startOfDay(dateTime) {
    return moment(dateTime).hour(0).minute(0).second(0).millisecond(0).toDate();
}

export function firstDayOfWeek(dateTime) {
    return moment(dateTime).startOf('week').toDate();
}

export function lastDayOfWeek(dateTime) {
    return moment(dateTime).endOf('week').toDate();
}

export function firstDayOfMonth(dateTime) {
    return moment(dateTime).startOf('month').toDate();
}

export function lastDayOfMonth(dateTime) {
    return moment(dateTime).endOf('month').toDate();
}

export function sunday(dateTime) {
    return moment(dateTime).weekday(0).toDate();
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