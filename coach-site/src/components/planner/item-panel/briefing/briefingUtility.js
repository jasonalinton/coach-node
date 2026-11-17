import moment from 'moment';
import { BLURBTYPE, METRIC, TIMEFRAME } from '../../../../model/constants';
import { getTimeframeEndpoints } from '../../../../../utility/timeUtility';
import { extractPlainText } from '../../../../../utility/editorjsUtility';
import { sortAsc } from '../../../../../utility';

// Metric tags in the order the rethink composer lists them (Figma: Rethink / Metric Tag)
export const METRIC_TAGS = [
    { id: METRIC.PHYSICAL, text: 'Physical', color: '#3E7C59' },
    { id: METRIC.EMOTIONAL, text: 'Emotional', color: '#7A5AA6' },
    { id: METRIC.MENTAL, text: 'Mental', color: '#C2702E' },
    { id: METRIC.SOCIAL, text: 'Social', color: '#C0504D' },
    { id: METRIC.FINANCIAL, text: 'Financial', color: '#3A6EA5' },
];

export function getMetricTag(idMetric) {
    return METRIC_TAGS.find(x => x.id == idMetric);
}

// A blurb's display text: its editor blocks when present, otherwise the legacy text
export function blurbText(blurb) {
    if (!blurb) return '';
    if (blurb.json) {
        try {
            let text = extractPlainText(JSON.parse(blurb.json));
            if (text) return text;
        } catch (e) { /* fall back to text */ }
    }
    return blurb.text ?? '';
}

// Goals in the selected timeframe are shown along with goals in every longer timeframe
export const GOAL_TIMEFRAMES = [ TIMEFRAME.DAY, TIMEFRAME.WEEK, TIMEFRAME.MONTH, TIMEFRAME.YEAR ];

const MOMENT_UNITS = {
    [TIMEFRAME.DAY]: 'day',
    [TIMEFRAME.WEEK]: 'week',
    [TIMEFRAME.MONTH]: 'month',
    [TIMEFRAME.YEAR]: 'year',
};

export function timeframeUnit(idTimeframe) {
    return MOMENT_UNITS[idTimeframe] ?? 'week';
}

/*
 * Goal IDs grouped by timeframe, starting at idTimeframe and going up (day -> week -> month -> year).
 * A goal in more than one timeframe is only shown in the shortest one.
 */
export function getGoalGroups(goalStore, idTimeframe, date) {
    if (!goalStore) return [];

    let index = GOAL_TIMEFRAMES.indexOf(idTimeframe);
    let timeframeIDs = GOAL_TIMEFRAMES.slice((index > -1) ? index : 0);

    let shownIDs = [];
    let groups = timeframeIDs.map(id => {
        let goalIDs = goalStore.getGoalsInTimeframe(id, date)
            .map(x => x.id)
            .filter(goalID => !shownIDs.includes(goalID));
        shownIDs.push(...goalIDs);
        return { idTimeframe: id, goalIDs };
    });
    return groups.filter(x => x.goalIDs.length > 0);
}

/*
 * The goal's REASON blurbs that apply on the given date, ordered closest-timeframe first:
 * reasons tied to an active time pair of the given timeframe, then reasons tied to an active
 * time pair of a longer timeframe, then reasons with no time pair. Within each, by position.
 */
export function getGoalReasons(goal, universalStore, idTimeframe, date) {
    if (!goal || !universalStore) return [];

    let blurbs = [];
    sortAsc([...(goal.blurbs ?? [])], "position").forEach(_blurb => {
        let blurb = universalStore.getBlurb(_blurb.id);
        if (blurb && blurb.idType == BLURBTYPE.REASON) {
            blurbs.push(blurb);
        }
    });

    // Rank of each active time pair: 0 for the requested timeframe, higher for longer ones
    let startIndex = Math.max(GOAL_TIMEFRAMES.indexOf(idTimeframe), 0);
    let timePairRanks = {};
    (goal.timePairs ?? []).forEach(timePair => {
        let index = GOAL_TIMEFRAMES.indexOf(timePair.idTimeframe);
        if (index < startIndex) return;

        let start = (timePair.startTime) ? new Date(timePair.startTime.dateTime) : undefined;
        let end = (timePair.endTime) ? new Date(timePair.endTime.dateTime) : undefined;
        if (start && +start <= +date && end && +end >= +date) {
            timePairRanks[timePair.id] = index - startIndex;
        }
    });

    let NO_TIMEPAIR_RANK = GOAL_TIMEFRAMES.length;
    let ranked = [];
    blurbs.forEach((blurb, position) => {
        let goalTimePairs = blurb.goalTimePairs ?? [];
        if (goalTimePairs.length == 0) {
            ranked.push({ blurb, rank: NO_TIMEPAIR_RANK, position });
            return;
        }
        let ranks = goalTimePairs.map(gtp => timePairRanks[gtp.id]).filter(x => x != undefined);
        if (ranks.length > 0) {
            ranked.push({ blurb, rank: Math.min(...ranks), position });
        }
    });

    return ranked
        .sort((a, b) => (a.rank - b.rank) || (a.position - b.position))
        .map(x => x.blurb);
}

/*
 * The last `count` periods of the timeframe, ending with the one containing `date`.
 * Oldest first: [{ start, end, label, isCurrent }]
 */
export function getPeriods(idTimeframe, date, count = 4) {
    let unit = timeframeUnit(idTimeframe);
    let periods = [];
    for (let i = count - 1; i >= 0; i--) {
        let periodDate = moment(date).subtract(i, unit).toDate();
        let { start, end } = getTimeframeEndpoints(idTimeframe, moment(periodDate).startOf('day').toDate());
        periods.push({ start, end, label: periodLabel(idTimeframe, start), isCurrent: i == 0 });
    }
    return periods;
}

function periodLabel(idTimeframe, start) {
    if (idTimeframe == TIMEFRAME.MONTH) return moment(start).format('MMM');
    if (idTimeframe == TIMEFRAME.YEAR) return moment(start).format('YYYY');
    return moment(start).format('M/D');
}

/*
 * Pace comparison: points from the start of the current period up to `now`, versus points
 * from the start of the previous period up to the same elapsed offset.
 */
export function getPaceRanges(idTimeframe, now) {
    let unit = timeframeUnit(idTimeframe);
    // Same wall-clock point one period back (not a fixed ms offset, which drifts across DST)
    let previousNow = moment(now).subtract(1, unit);
    return {
        current: { start: moment(now).startOf(unit).toDate(), end: moment(now).toDate() },
        previous: { start: moment(previousNow).startOf(unit).toDate(), end: previousNow.toDate() },
    };
}
