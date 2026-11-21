<template>
    <div class="rethink-notes-feed d-flex flex-column">
        <template v-for="section in sections" :key="section.key">
            <component :is="section.collapsible ? 'button' : 'div'" v-if="section.label"
                       class="section-header d-flex align-items-center" :class="{ accent: section.accent }"
                       @click="section.collapsible && toggleSection(section)">
                <span class="section-label">{{ section.label }}</span>
                <span class="section-count">{{ section.count }}</span>
                <span class="hairline flex-grow-1"></span>
                <span v-if="section.collapsible" class="section-toggle">{{ section.collapsed ? 'Show ›' : 'Hide' }}</span>
            </component>
            <template v-if="!section.collapsed">
                <RethinkNote v-for="note in section.notes" :key="note.id" :note="note" :goalStore="goalStore"
                             :time="noteTime(note)" showFiled />
                <RethinkDayGroup v-for="day in section.days" :key="day.key" :date="day.date" :notes="day.notes"
                                 :goalStore="goalStore" :noteTime="noteTime" :cap="section.cap" />
            </template>
        </template>
        <span v-if="sections.length == 0" class="empty">No notes yet.</span>
    </div>
</template>

<script>
import moment from 'moment';
import RethinkNote from './RethinkNote.vue';
import RethinkDayGroup from './RethinkDayGroup.vue';
import { TIMEFRAME } from '../../../../../model/constants';
import { getTimeframeEndpoints, startOfDay, endOfDay } from '../../../../../../utility/timeUtility';

const TIMEFRAMES = [ TIMEFRAME.DAY, TIMEFRAME.WEEK, TIMEFRAME.MONTH, TIMEFRAME.YEAR ];

// Day tab: notes filed under the longer timeframes that contain the day
const ALSO_LABELS = {
    [TIMEFRAME.WEEK]: 'Also filed this week',
    [TIMEFRAME.MONTH]: 'This month',
    [TIMEFRAME.YEAR]: 'This year',
};

// Longer tabs: notes filed under the selected timeframe itself, pinned on top
const PINNED_LABELS = {
    [TIMEFRAME.WEEK]: 'For the week',
    [TIMEFRAME.MONTH]: 'For the month',
    [TIMEFRAME.YEAR]: 'For the year',
};

// Month and Year tabs only show this many notes per day until "Show N more"
const DAY_NOTE_CAP = 2;

export default {
    name: 'RethinkNotesFeed',
    components: { RethinkNote, RethinkDayGroup },
    props: {
        // Briefing notes from every timeframe
        notes: Array,
        idTimeframe: Number,
        date: Date,
        newestFirst: { type: Boolean, default: true },
        goalStore: Object,
    },
    data: function () {
        return {
            // Sections the user opened or closed, against their default
            toggledSections: [],
        }
    },
    computed: {
        sections() {
            let sections = (this.idTimeframe == TIMEFRAME.DAY) ? this.daySections() : this.periodSections();
            return sections
                .map(section => ({ ...section, count: section.notes.length + section.days.reduce((count, day) => count + day.notes.length, 0) }))
                .filter(section => section.count > 0)
                .map(section => ({ ...section, collapsed: this.isCollapsed(section) }));
        },
    },
    methods: {
        // Day tab: the day's notes, then notes filed under each longer timeframe containing the day
        daySections() {
            let start = startOfDay(this.date), end = endOfDay(this.date);
            let sections = [ this.section('day', undefined, this.filedIn([ TIMEFRAME.DAY ], start, end)) ];
            TIMEFRAMES.slice(1).forEach(idTimeframe => {
                let period = getTimeframeEndpoints(idTimeframe, this.date);
                sections.push(this.section(`also-${idTimeframe}`, ALSO_LABELS[idTimeframe], this.filedIn([ idTimeframe ], period.start, period.end)));
            });
            return sections;
        },
        // Week, Month and Year tabs: notes filed under the timeframe, then its days (Week)
        // or its weeks (Month) / months (Year), each with their own notes and days
        periodSections() {
            let { start, end } = getTimeframeEndpoints(this.idTimeframe, this.date);
            let pinned = this.section('pinned', PINNED_LABELS[this.idTimeframe], this.filedIn([ this.idTimeframe ], start, end));

            if (this.idTimeframe == TIMEFRAME.WEEK) {
                let byDay = this.section('days', 'By day', [], this.dayGroups(start, end));
                return [ pinned, byDay ];
            }

            // Timeframes between Day and the selected one, e.g. Week notes inside a month
            let between = TIMEFRAMES.slice(1, TIMEFRAMES.indexOf(this.idTimeframe));
            let periods = this.subPeriods(start, end);
            let selected = periods.findIndex(period => +this.date >= +period.start && +this.date <= +period.end);
            let subSections = periods.map((period, index) => ({
                ...this.section(period.key, period.label, this.filedIn(between, period.start, period.end), this.dayGroups(period.start, period.end)),
                accent: period.isCurrent,
                collapsible: true,
                // The selected date's week/month and the one before it start open
                defaultCollapsed: !(index == selected || index == selected - 1),
                cap: DAY_NOTE_CAP,
            }));
            return [ pinned, ...this.order(subSections) ];
        },
        section(key, label, notes, days = []) {
            return { key, label, notes, days, accent: false, collapsible: false, defaultCollapsed: false, cap: 0 };
        },
        filedIn(timeframeIDs, start, end) {
            return this.order(this.notes
                .filter(x => timeframeIDs.includes(x.idTimeframe))
                .filter(x => {
                    let datetime = +new Date(x.datetime);
                    return datetime >= +start && datetime <= +end;
                })
                .sort((a, b) => +new Date(a.datetime) - +new Date(b.datetime) || a.id - b.id));
        },
        dayGroups(start, end) {
            let groups = [];
            this.filedIn([ TIMEFRAME.DAY ], start, end).forEach(note => {
                let key = moment(note.datetime).format('YYYY-MM-DD');
                let group = groups.find(x => x.key == key);
                if (!group) {
                    group = { key, date: moment(note.datetime).startOf('day').toDate(), notes: [] };
                    groups.push(group);
                }
                group.notes.push(note);
            });
            // Notes are already in display order, so the groups are too
            return groups;
        },
        // The weeks of a month (clipped to the month) or the months of a year, oldest first
        subPeriods(start, end) {
            let isMonth = this.idTimeframe == TIMEFRAME.MONTH;
            let unit = isMonth ? 'week' : 'month';
            let periods = [];
            for (let cursor = moment(start).startOf(unit); cursor.isSameOrBefore(end); cursor.add(1, unit)) {
                let periodStart = moment.max(cursor.clone(), moment(start)).toDate();
                let periodEnd = moment.min(cursor.clone().endOf(unit), moment(end)).toDate();
                let isCurrent = moment().isBetween(periodStart, periodEnd, undefined, '[]');
                let label = isMonth ? this.weekLabel(periodStart, periodEnd) : moment(periodStart).format('MMMM');
                if (isCurrent) label += isMonth ? ' · This week' : ' · This month';
                periods.push({ key: `${unit}-${+periodStart}`, start: periodStart, end: periodEnd, label, isCurrent });
            }
            return periods;
        },
        weekLabel(start, end) {
            if (moment(start).isSame(end, 'day')) return moment(start).format('MMM D');
            return `${moment(start).format('MMM D')} – ${moment(end).format('D')}`;
        },
        order(items) {
            return this.newestFirst ? [...items].reverse() : items;
        },
        isCollapsed(section) {
            if (!section.collapsible) return false;
            let toggled = this.toggledSections.includes(section.key);
            return section.defaultCollapsed != toggled;
        },
        toggleSection(section) {
            let index = this.toggledSections.indexOf(section.key);
            if (index > -1) this.toggledSections.splice(index, 1);
            else this.toggledSections.push(section.key);
        },
        // Day notes show the time; longer-timeframe notes also show the day.
        // Notes saved before times were kept are at midnight, so they show no time.
        noteTime(note) {
            let datetime = moment(note.datetime);
            let hasTime = !datetime.isSame(datetime.clone().startOf('day'));
            let time = hasTime ? datetime.format('h:mm A') : '';
            if (note.idTimeframe == TIMEFRAME.DAY) return time;
            if (note.idTimeframe == TIMEFRAME.WEEK) return [ datetime.format('ddd'), time ].filter(Boolean).join(' ');
            return [ datetime.format('MMM D'), time ].filter(Boolean).join(' · ');
        },
    },
    watch: {
        idTimeframe() {
            this.toggledSections = [];
        },
        date() {
            this.toggledSections = [];
        },
    },
}
</script>

<style scoped>
.rethink-notes-feed {
    gap: 10px;
}

.section-header {
    gap: 6px;
    padding: 6px 0 0 0;
    border: none;
    background: none;
    text-align: left;
}

.section-label {
    font-size: 11px;
    font-weight: 600;
    line-height: 14px;
    letter-spacing: .06em;
    text-transform: uppercase;
    color: var(--rt-text-muted);
    white-space: nowrap;
}

.section-header.accent .section-label {
    color: var(--rt-accent);
}

.section-count {
    font-size: 11px;
    line-height: 14px;
    color: #C2B9AD;
}

.hairline {
    height: 1px;
    background-color: var(--rt-border);
}

.section-toggle {
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    color: var(--rt-accent);
}

.empty {
    font-size: 13px;
    color: var(--rt-text-muted);
}
</style>
