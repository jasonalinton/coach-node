import moment from "moment";
import date from 'date-and-time';

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

export function toShortWeekdayString(dateTimeJSON) {
    let datetime = new Date(dateTimeJSON);
    return date.format(datetime, 'ddd, MMM D')
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

export function saturday(dateTime) {
    return moment(dateTime).weekday(6).toDate();
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