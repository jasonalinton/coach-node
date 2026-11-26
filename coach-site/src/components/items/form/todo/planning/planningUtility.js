import moment from 'moment'
import { repetitions, timeframes } from '../../../../../model/types'

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const STATUS = {
    DONE: "done",
    ATTEMPTED: "attempted",
    MISSED: "missed",
    UPCOMING: "upcoming"
};

export const STATUS_TEXT = {
    done: "Done",
    attempted: "Attempted",
    missed: "Missed",
    upcoming: "Upcoming"
};

export function toDate(value) {
    if (!value) return undefined;
    return (value instanceof Date) ? value : value.toDate();
}

export function dayKey(date) {
    return moment(date).format("YYYY-MM-DD");
}

/** Done/attempted come from the iteration; otherwise it's missed once its window has passed */
export function iterationStatus(iteration, now = new Date()) {
    if (iteration.completedAt) return STATUS.DONE;
    if (iteration.attemptedAt) return STATUS.ATTEMPTED;
    let end = toDate(iteration.endAt) || toDate(iteration.startAt);
    return (end && moment(end).endOf('day').isBefore(now)) ? STATUS.MISSED : STATUS.UPCOMING;
}

export function iterationPoints(iteration, todo) {
    return Number(iteration.points ?? todo?.points ?? 1) || 0;
}

export function repeatIDOf(iteration) {
    return iteration.repeatID ?? iteration.todoRepeatID;
}

/** Whether the iteration was planned by the given repeat / time pair ({ type, id }) */
export function isFromSource(iteration, source) {
    if (!source) return false;
    if (source.type == "repeat") return repeatIDOf(iteration) == source.id;
    return iteration.idTodoTimePair == source.id;
}

export function repeatTimeframe(repeat) {
    // Repeat timeframes use repetition ids, not timeframe ids (see RepeatControl2)
    return repetitions.find(x => x.id == repeat.idTimeframe)?.unit || "";
}

export function repeatLines(repeat) {
    let timeframe = repeatTimeframe(repeat);
    let interval = (repeat.interval > 1) ? `${repeat.interval} ${timeframe}s` : timeframe;
    let lines = [`Every ${interval}`];
    if (repeat.frequency) {
        lines.push(`${(repeat.frequency == 1) ? "Once" : `${repeat.frequency} times`} a ${timeframe}`);
    }
    if (repeat.idTimeframe == 68 && repeat.dayIndecies?.length) {
        lines.push(`On ${repeat.dayIndecies.map(x => daysOfWeek[x - 1]).join(", ")}`);
    }
    return lines;
}

/** Whether the repeat runs at any point between start and end (startDate/endDate are date-only) */
export function repeatOverlaps(repeat, start, end) {
    let startsBy = !repeat.startDate || moment(repeat.startDate, "YYYY-MM-DD").isSameOrBefore(end, 'day');
    let endsAfter = !repeat.endDate || moment(repeat.endDate, "YYYY-MM-DD").isSameOrAfter(start, 'day');
    return startsBy && endsAfter;
}

/** Tells apart repeats that otherwise read the same, e.g. "Since Oct 4, 2026" */
export function repeatDates(repeat) {
    let format = date => moment(date, "YYYY-MM-DD").format("MMM D, YYYY");
    if (repeat.startDate && repeat.endDate) return `${format(repeat.startDate)} – ${format(repeat.endDate)}`;
    if (repeat.startDate) return `Since ${format(repeat.startDate)}`;
    if (repeat.endDate) return `Until ${format(repeat.endDate)}`;
    return null;
}

export function timePairTimeframe(timePair) {
    return timeframes.find(x => x.id == timePair.idTimeframe)?.text || "Time";
}

export function repeatLabel(repeat) {
    return `Repeat · ${repeatLines(repeat)[0]}`;
}

export function timePairLabel(timePair) {
    return `Time pair · ${timePairTimeframe(timePair)}`;
}

export function formatPlanned(date) {
    return date ? moment(date).format("ddd MMM D") : "—";
}

export function formatWindow(startAt, endAt) {
    if (!startAt) return "—";
    let start = moment(startAt);
    if (!endAt || start.isSame(endAt, 'day')) return start.format("MMM D");
    let end = moment(endAt);
    return `${start.format("MMM D")} – ${end.format(start.isSame(end, 'month') ? "D" : "MMM D")}`;
}

export function formatDateTime(date) {
    return date ? moment(date).format("MMM D, h:mm A") : "—";
}

/** Values for <input type="date"> / <input type="datetime-local"> */
export function toDateInput(date) {
    return date ? moment(date).format("YYYY-MM-DD") : "";
}

export function toDateTimeInput(date) {
    return date ? moment(date).format("YYYY-MM-DDTHH:mm") : "";
}

/** Puts a date input's day onto the original date, keeping its time of day */
export function withDay(original, dateInput) {
    if (!dateInput) return original;
    let day = moment(dateInput, "YYYY-MM-DD");
    let result = original ? moment(original) : moment(day).startOf('day');
    result.year(day.year()).month(day.month()).date(day.date());
    return result.toDate();
}

/** Sunday-first weeks covering the month */
export function monthWeeks(month) {
    let start = moment(month).startOf('month').startOf('week');
    let end = moment(month).endOf('month').endOf('week');
    let weeks = [];
    for (let day = start.clone(); day.isBefore(end); day.add(1, 'week')) {
        weeks.push(Array.from({ length: 7 }, (_, i) => day.clone().add(i, 'day').toDate()));
    }
    return weeks;
}
