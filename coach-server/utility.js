const moment = require('moment');

function percent(number, decimalPlaces = 0) {
    return new Intl.NumberFormat([ ], { style: 'percent', minimumFractionDigits: decimalPlaces }).format(number);
}

function removeItem(item, itemList) {
    var findObject = (object) => object.id == item.id;
    var index = itemList.findIndex(findObject);
    if (index === -1) return false;
    else {
        itemList.splice(index, 1);
        return true;
    }
}

function JSONDate(datetime) {
    return moment(datetime).format();
}

function today() {
    return moment().hour(0).minute(0).second(0).millisecond(0).toDate();
}

function concatDate(date, time) {
    return new Date(date.toDateString() + " " + time.toTimeString());
}

function addDay(dateTime = new Date(), days = 1) {
    return moment(dateTime).add( days, 'day').toDate();   
}

function subtractDay(dateTime = new Date(), days = 1) {
    return moment(dateTime).add( -days, 'day').toDate();   
}

function startOfDay(dateTime) {
    return moment(dateTime).hour(0).minute(0).second(0).millisecond(0).toDate();
}

function endOfDay(dateTime) {
    return moment(dateTime).hour(23).minute(59).second(0).millisecond(0).toDate();
}

function firstDayOfWeek(dateTime) {
    return moment(dateTime).startOf('week').toDate();
}

function lastDayOfWeek(dateTime) {
    return moment(dateTime).endOf('week').toDate();
}

function firstDayOfMonth(dateTime) {
    return moment(dateTime).startOf('month').toDate();
}

function lastDayOfMonth(dateTime) {
    return moment(dateTime).endOf('month').toDate();
}

module.exports = {
    percent,
    removeItem,
    today,
    concatDate,
    addDay,
    subtractDay,
    startOfDay,
    endOfDay,
    firstDayOfWeek,
    lastDayOfWeek,
    firstDayOfMonth,
    lastDayOfMonth,
    JSONDate
}