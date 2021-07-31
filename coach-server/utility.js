const moment = require('moment');

function removeItem(item, itemList) {
    var findObject = (object) => object.id == item.id;
    var index = itemList.findIndex(findObject);
    if (index === -1) return false;
    else {
        itemList.splice(index, 1);
        return true;
    }
}

function today() {
    return moment().hour(0).minute(0).second(0).millisecond(0).toDate();
}

function concatDate(date, time) {
    return new Date(date.toDateString() + " " + time.toTimeString());
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
    removeItem,
    today,
    concatDate,
    firstDayOfWeek,
    lastDayOfWeek,
    firstDayOfMonth,
    lastDayOfMonth
}