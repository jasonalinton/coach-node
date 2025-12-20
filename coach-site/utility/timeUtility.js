import moment from "moment";
import date from 'date-and-time';
import { TIMEFRAME } from "../src/model/constants";

export function dateOnly(datetime) {
    let dateTimeJSON = datetime.toJSON();
    let dateTimeArray = dateTimeJSON.split("T");
    let dateArray = dateTimeArray[0].split("-");

    return `${dateArray[0]}-${dateArray[1]}-${dateArray[2]}`;
}

export function timeOnly(datetime) {
    let dateTimeJSON = datetime.toJSON();
    let dateTimeArray = dateTimeJSON.split("T");
    let timeArray = dateTimeArray[1].split(":");

    return `${timeArray[0]}:${timeArray[1]}`;
}

export function formatInputDateTime(date = new Date()) {
    let datetimeString = date.toJSON();
    let dateTimeArray = datetimeString.split("T");
    let dateArray = dateTimeArray[0].split("-");
    let timeArray = dateTimeArray[1].split(":");
    return `${dateArray[0]}-${dateArray[1]}-${dateArray[2]} ${timeArray[0]}:${timeArray[1]}`;
}

export function getTimeString(datetime) {
    return datetime.toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'});
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

export function toShortWeekdayString(dateTimeJSON, withoutComma) {
    let datetime = new Date(dateTimeJSON);
    if (withoutComma) {
        return date.format(datetime, 'ddd MMM D') // Ex Tue Jul 2
    } else {
        return date.format(datetime, 'ddd, MMM D') // Ex Tue, Jul 2
    }
}

// Ex. January 24, 1988
export function toLongDateString(dateTimeJSON) {
    let date = new Date(dateTimeJSON);
    return moment(date).format("LL");
}

export function toShortTimeString(dateTimeJSON) {
    let datetime = new Date(dateTimeJSON);
    return date.format(datetime, 'h:mm A') // Ex. 7:50 AM
}

export function toUTCTimestamp(dateTimeJSON) {
    let datetime = new Date(dateTimeJSON);
    return moment(datetime).unix();
}

export function timezoneTimestamp(datetime) {
    datetime = new Date(datetime.getTime() - datetime.getTimezoneOffset() * 60000);
    return datetime.getTime() / 1000;
}

/* Get hour portion of date */
export function getHour(dateTimeJSON) {
    let date = new Date(dateTimeJSON);
    return date.getHours();
}

export function toDateTimeString(dateTimeJSON) {
    let dateTimeArray = dateTimeJSON.split("T");

    let dateArray = dateTimeArray[0].split("-");
    let timeArray = dateTimeArray[1].split(":");

    return `${dateArray[0]}-${dateArray[1]}-${dateArray[2]} ${timeArray[0]}:${timeArray[1]}`;
}

export function timeModelToString(model) {
    if (!model) return "";
    let date = new Date(model.dateTime);

    if (model.idMoment == 87) { // Date 
        return moment(date).format("LL"); // Ex. January 24, 1988
    } else if (model.idMoment == 88) { // Time
        return moment(date).format("LT"); // Ex. 7:50 AM
    } else if (model.idMoment == 89) { // Date-Time
        return moment(date).format("LLL"); // Ex. January 24, 1988 7:50 AM
    }
}

export function jsonToDateTimeString(jsonDateTime) {
    let date = new Date(jsonDateTime);
    return moment(date).format("M/D/YY h:mm A"); // Ex. 1/24/88 7:50 AM
}

export function jsonToLongDateTimeString(jsonDateTime) {
    let date = new Date(jsonDateTime);
    return moment(date).format("LLL"); // Ex. January 24, 1988 7:50 AM
}

export function jsonToShortDateTimeString(jsonDateTime) {
    let date = new Date(jsonDateTime);
    return moment(date).format("MMM D, h:mm A"); // Ex. Jan 24, 7:50 AM
}

export function timeSince(dateTime, now) {
    now = now || Date.now();

    let difference = now - dateTime.getTime();
    let hours = difference/1000/60/60;
    let hours_floor = Math.floor(hours);
    let minutes = (hours - hours_floor) * 60;
    let minutes_floor = Math.floor(minutes);
    let seconds_floor = Math.floor((minutes - minutes_floor) * 60);
    let secondsString = (seconds_floor)
        .toLocaleString(undefined, {minimumIntegerDigits: 2, useGrouping:false});

    return `${hours_floor}:${minutes_floor}:${secondsString}`;
}

export function dow(dateTime) {
   return date.format(dateTime, "ddd");
}

export function dateNumber(dateTime) {
   return date.format(dateTime, "ddd");
}

export function formatDate(dateTime) {
    return moment(dateTime).format();
}

export function toTimezoneOffset(dateTimeJSON) {
    return dateTimeJSON.slice(19, 25);
}

export function isToday(dateTime) {
    return +today(new Date()) == +moment(dateTime).startOf('day').toDate();
}

export function isSameDate(date1, date2) {
    return +moment(date1).startOf('day').toDate() == +moment(date2).startOf('day').toDate();
}

// Is the nextDate on the same day as the date?
export function isNextDay(date, nextDate) {
    let hum = moment(date).startOf('day').add(1, 'day').toDate();
    let him = moment(nextDate).startOf('day').toDate();
    let huh = +hum == +him;
    return huh;
}

export function today(dateTime) {
    return moment(dateTime).startOf('day').toDate();
}

export function startOfDay(dateTime) {
    // return moment(dateTime).hour(0).minute(0).second(0).millisecond(0).toDate();
    return moment(dateTime).startOf('day').toDate();
}

export function endOfDay(dateTime) {
    return moment(dateTime).endOf('day').millisecond(0).toDate();
}

export function endOfWeek(dateTime) {
    return moment(dateTime).endOf('week').endOf('day').millisecond(0).toDate();
}

export function endOfYear(dateTime) {
    return moment(dateTime).endOf('year').endOf('day').millisecond(0).toDate();
}

export function firstDayOfWeek(dateTime) {
    return moment(dateTime).startOf('week').toDate();
}

export function firstDayOfMonth(dateTime) {
    return moment(dateTime).startOf('month').toDate();
}

export function firstDayOfYear(dateTime) {
    return moment(dateTime).startOf('year').toDate();
}

export function lastDayOfWeek(dateTime) {
    return moment(dateTime).endOf('week').toDate();
}

export function lastDayOfMonth(dateTime) {
    return moment(dateTime).endOf('month').toDate();
}

export function lastDayOfYear(dateTime) {
    return moment(dateTime).endOf('year').toDate();
}

export function getTimeframeEndpoints(idTimeframe, datetime) {
    let start;
    let end;
    if (idTimeframe == TIMEFRAME.DAY) {
        start = datetime;
        end = datetime;
    }
    if (idTimeframe == TIMEFRAME.WEEK) {
        start = firstDayOfWeek(datetime);
        end = lastDayOfWeek(datetime);
    }
    if (idTimeframe == TIMEFRAME.MONTH) {
        start = firstDayOfMonth(datetime);
        end = lastDayOfMonth(datetime);
    }

    return { start, end };
}

export function sunday(dateTime) {
    return moment(dateTime).weekday(0).toDate();
}

export function saturday(dateTime) {
    return moment(dateTime).weekday(6).toDate();
}

// Ex. 2, 31
export function getDate(dateTime = new Date()) {
    return date.format(dateTime, 'D');   
}

// Ex. Fri, Sun
export function getDayOfWeekShort(dateTime = new Date()) {
    return date.format(dateTime, 'ddd');   
}

// Ex. Friday, Sunday
export function getDayOfWeekLong(dateTime = new Date()) {
    return date.format(dateTime, 'dddd');   
}

// Ex. Sep, Oct
export function getMonthShort(dateTime = new Date()) {
    return date.format(dateTime, 'MMM');   
}

export function getMonthDateYearShort(datetime = new Date(), withoutComma) {
    if (withoutComma) {
        return date.format(datetime, 'ddd MMM D, YYYY') // Ex Tue Jul 2
    } else {
        return date.format(datetime, 'ddd, MMM D, YYYY') // Ex Tue, Jul 2
    }
}

// Ex. Jan 24, 1988 7:50 AM
export function getShortDateString(date = new Date()) {
    return moment(date).format("MMM D, h:mm A");
}

// Ex. January 24, 1988 7:50 AM
export function getLongDateTimeString(date = new Date()) {
    return moment(date).format("LLL");
}

// Ex. January 24, 1988
export function getLongDateString(date = new Date()) {
    return moment(date).format("LL");
}

// Ex. 1/24/88
export function getNumberDateString(date = new Date()) {
    return moment(date).format("l");
}

// Ex. 7:50 AM
export function getShortTimeString(datetime = new Date()) {
    return date.format(datetime, 'h:mm A');
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

export function addMinutes(minutes = 1, dateTime = new Date()) {
    return moment(dateTime).add( minutes, 'minute').toDate();   
}

export function subtractMinutes(minutes = 1, dateTime = new Date()) {
    return moment(dateTime).add( -minutes, 'minute').toDate();   
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

export function getDurationInMilliseconds(startAt, endAt) {
    return date.subtract(endAt, startAt).toMilliseconds();   
}

export function getDurationInSeconds(startAt, endAt) {
    return date.subtract(endAt, startAt).toSeconds();   
}

export function getDurationInMinutes(startAt, endAt) {
    let minutes = date.subtract(endAt, startAt).toMinutes();
    return minutes;   
}

export function getDurationInHours(startAt, endAt) {
    return date.subtract(endAt, startAt).toHours();   
}

export function getDurationInDays(startAt, endAt) {
    return date.subtract(endAt, startAt).toDays();   
}

export function setTimeFromDate(date, timeDate) {
    date.setHours(timeDate.getHours(), timeDate.getMinutes(), timeDate.getSeconds());
}