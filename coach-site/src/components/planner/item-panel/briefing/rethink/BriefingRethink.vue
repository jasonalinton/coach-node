<template>
    <div class="briefing-rethink d-flex flex-column flex-grow-1 overflow-scroll">
        <!-- Header -->
        <div class="header d-flex flex-column">
            <span class="date">{{ dateText }}</span>
            <span class="subtitle">{{ subtitle }}</span>
        </div>

        <!-- Timeframe tabs -->
        <div class="tabs d-flex">
            <button v-for="tab in TABS" :key="tab.id" class="tab d-flex flex-column align-items-center"
                    :class="{ active: tab.id == idTimeframe }" @click="selectTimeframe(tab.id)">
                <span>{{ tab.text }}</span>
                <span class="indicator"></span>
            </button>
        </div>

        <!-- In focus -->
        <div class="label-row d-flex align-items-center justify-content-between">
            <span class="label">IN FOCUS</span>
            <label class="points-window d-flex align-items-center" title="Points window">
                <select v-model.number="idPointsTimeframe">
                    <option v-for="tab in TABS" :key="tab.id" :value="tab.id">{{ tab.text }}</option>
                </select>
                <span>{{ pointsTimeframeText }} ▾</span>
            </label>
        </div>
        <div class="goal-cards d-flex flex-column">
            <RethinkGoalCard v-for="goal in inFocusGoals" :key="goal.id" v-bind="goalCardProps(goal)"
                             @toggle="toggleGoal(goal.id)" />
            <span v-if="inFocusGoals.length == 0" class="empty">No goals in this timeframe.</span>
        </div>

        <!-- Also tracking: goals from longer timeframes; a chip opens the goal inline -->
        <!-- Collapsed by default; the label toggles the chips -->
        <div v-if="alsoTrackingGoals.length" class="also-tracking d-flex flex-wrap align-items-center">
            <button class="also-label d-flex align-items-center" :aria-expanded="alsoTrackingOpen"
                    @click="toggleAlsoTracking">
                <span>Also tracking</span>
                <span v-if="!alsoTrackingOpen" class="also-count">{{ alsoTrackingGoals.length }}</span>
                <span class="also-toggle">{{ alsoTrackingOpen ? 'Hide' : 'Show ›' }}</span>
            </button>
            <button v-for="goal in (alsoTrackingOpen ? alsoTrackingGoals : [])" :key="goal.id" class="chip d-flex"
                    :class="{ open: goal.id == openGoalID }" @click="toggleGoal(goal.id)">
                <span class="chip-text">{{ goal.text }}</span>
                <span v-if="showPoints" class="chip-points">{{ currentPoints(goal.id) }}</span>
            </button>
        </div>
        <RethinkGoalCard v-if="openAlsoTrackingGoal" v-bind="goalCardProps(openAlsoTrackingGoal)"
                         @toggle="toggleGoal(openAlsoTrackingGoal.id)" />

        <!-- Notes -->
        <div class="label-row d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center notes-title">
                <span class="label">NOTES</span>
                <span class="label-count">{{ notes.length }}</span>
            </div>
            <button class="sort-toggle d-flex align-items-center" @click="toggleSort">
                <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                    <path :d="newestFirst ? 'M5 1.5V8.5M2 5.5L5 8.5L8 5.5' : 'M5 8.5V1.5M2 4.5L5 1.5L8 4.5'"
                          stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                {{ newestFirst ? 'Newest first' : 'Oldest first' }}
            </button>
        </div>
        <RethinkNoteComposer variant="main" :goals="linkableGoals" :save="saveNote"
                             :placeholder="`What matters ${PERIOD_LABELS[idTimeframe]}?`" />
        <RethinkNotesFeed ref="feed" :notes="filteredNotes" :idTimeframe="idTimeframe" :date="selectedDate"
                          :newestFirst="newestFirst" :goalStore="goalStore" />
    </div>
</template>

<script>
import moment from 'moment';
import RethinkGoalCard from './RethinkGoalCard.vue';
import RethinkNoteComposer from './RethinkNoteComposer.vue';
import RethinkNotesFeed from './RethinkNotesFeed.vue';
import { GOAL_TIMEFRAMES, getGoalGroups, getGoalReasons, getPeriods, getPaceRanges, timeframeUnit, isNoteInRange } from '../briefingUtility';
import { getPoints } from '../../../../../../utility/pointsUtility';
import { BLURBTYPE, BLURB_MAPPING_TYPE, TIMEFRAME } from '../../../../../model/constants';
import { today, isToday, startOfDay, endOfDay, getTimeframeEndpoints } from '../../../../../../utility/timeUtility';

const TABS = [
    { id: TIMEFRAME.DAY, text: 'Day' },
    { id: TIMEFRAME.WEEK, text: 'Week' },
    { id: TIMEFRAME.MONTH, text: 'Month' },
    { id: TIMEFRAME.YEAR, text: 'Year' },
];

const PERIOD_LABELS = {
    [TIMEFRAME.DAY]: 'today',
    [TIMEFRAME.WEEK]: 'this week',
    [TIMEFRAME.MONTH]: 'this month',
    [TIMEFRAME.YEAR]: 'this year',
};

export default {
    name: 'BriefingRethink',
    components: { RethinkGoalCard, RethinkNoteComposer, RethinkNotesFeed },
    data: function () {
        return {
            TABS,
            PERIOD_LABELS,
            appStore: undefined,
            goalStore: undefined,
            plannerStore: undefined,
            universalStore: undefined,
            iterationStore: undefined,
            todoStore: undefined,
            // Which goals and notes are in view
            idTimeframe: TIMEFRAME.DAY,
            // Which period the scores and bars use (the "Week ▾" dropdown)
            idPointsTimeframe: TIMEFRAME.WEEK,
            openGoalID: null,
            alsoTrackingOpen: false,
        }
    },
    created: async function() {
        let [appStore, goalStore, plannerStore, universalStore, iterationStore, todoStore] = await Promise.all([
            import(`@/store/appStore`),
            import(`@/store/goalStore`),
            import(`@/store/plannerStore`),
            import(`@/store/universalStore`),
            import(`@/store/iterationStore`),
            import(`@/store/todoStore`),
        ]);
        this.appStore = appStore.useAppStore();
        this.goalStore = goalStore.useGoalStore();
        this.plannerStore = plannerStore.usePlannerStore();
        this.universalStore = universalStore.useUniversalStore();
        this.iterationStore = iterationStore.useIterationStore();
        this.todoStore = todoStore.useTodoStore();

        this.loadNotes();
    },
    computed: {
        selectedDate() {
            return (this.plannerStore) ? this.plannerStore.selectedDate : today();
        },
        settings() {
            return (this.appStore) ? this.appStore.itemPanel.briefing : {};
        },
        showReasons() {
            return this.settings.showReasons ?? true;
        },
        showPoints() {
            return this.settings.showPoints ?? true;
        },
        newestFirst() {
            return (this.settings.noteSort ?? 'newest') == 'newest';
        },
        dateText() {
            let date = moment(this.selectedDate);
            if (this.idTimeframe == TIMEFRAME.WEEK) return `Week of ${date.clone().startOf('week').format('MMMM D')}`;
            if (this.idTimeframe == TIMEFRAME.MONTH) return date.format('MMMM YYYY');
            if (this.idTimeframe == TIMEFRAME.YEAR) return date.format('YYYY');
            return date.format('dddd, MMMM D');
        },
        subtitle() {
            let notes = `${this.notes.length} ${this.notes.length == 1 ? 'note' : 'notes'}`;
            if (this.idTimeframe == TIMEFRAME.DAY) {
                let goals = `${this.inFocusGoals.length} ${this.inFocusGoals.length == 1 ? 'goal' : 'goals'}`;
                return `${goals} in focus · ${notes} today`;
            }
            if (this.idTimeframe == TIMEFRAME.WEEK) {
                let { start, end } = getTimeframeEndpoints(TIMEFRAME.WEEK, this.selectedDate);
                let range = moment(start).isSame(end, 'month')
                    ? `${moment(start).format('MMM D')} – ${moment(end).format('D')}`
                    : `${moment(start).format('MMM D')} – ${moment(end).format('MMM D')}`;
                return `${range} · ${notes}`;
            }
            return `${notes} ${PERIOD_LABELS[this.idTimeframe]}`;
        },
        pointsTimeframeText() {
            return TABS.find(x => x.id == this.idPointsTimeframe)?.text;
        },
        /* Goals */
        goalGroups() {
            return getGoalGroups(this.goalStore, this.idTimeframe, this.selectedDate);
        },
        // The shortest timeframe that has goals; usually the selected one
        inFocusGoals() {
            return this.goalsOf(this.goalGroups[0]);
        },
        // Goals that only appear in longer timeframes, shortest timeframe first
        alsoTrackingGoals() {
            return this.goalGroups.slice(1).flatMap(group => this.goalsOf(group));
        },
        openAlsoTrackingGoal() {
            if (!this.alsoTrackingOpen) return undefined;
            return this.alsoTrackingGoals.find(x => x.id == this.openGoalID);
        },
        linkableGoals() {
            return [...this.inFocusGoals, ...this.alsoTrackingGoals].map(x => ({ id: x.id, text: x.text }));
        },
        goalTimeframes() {
            let timeframes = {};
            this.goalGroups.forEach(group => group.goalIDs.forEach(id => timeframes[id] = group.idTimeframe));
            return timeframes;
        },
        /* Points */
        pointStores() {
            return { iterationStore: this.iterationStore, todoStore: this.todoStore, goalStore: this.goalStore };
        },
        periods() {
            return getPeriods(this.idPointsTimeframe, this.selectedDate);
        },
        paceRanges() {
            // "Now" on today; the end of the selected day when looking at another day
            let now = isToday(this.selectedDate) ? (this.plannerStore?.currentTime ?? new Date()) : endOfDay(this.selectedDate);
            return getPaceRanges(this.idPointsTimeframe, now);
        },
        /* Notes */
        // Briefing notes from every timeframe, after the header's brief/debrief filter; the feed groups them
        filteredNotes() {
            if (!this.universalStore) return [];
            let filter = this.settings.noteFilter ?? 'all';
            return this.universalStore.blurbs.filter(x => {
                if (filter == 'brief') return x.idType == BLURBTYPE.BRIEFING;
                if (filter == 'debrief') return x.idType == BLURBTYPE.DEBRIEFING;
                return x.idType == BLURBTYPE.BRIEFING || x.idType == BLURBTYPE.DEBRIEFING;
            });
        },
        // Notes filed under the selected timeframe or a shorter one, for a period within the selected one
        // (e.g. the week's notes and its days' notes on the Week tab). Newest written first.
        notes() {
            let { start, end } = (this.idTimeframe == TIMEFRAME.DAY)
                ? { start: startOfDay(this.selectedDate), end: endOfDay(this.selectedDate) }
                : getTimeframeEndpoints(this.idTimeframe, this.selectedDate);
            let timeframeIDs = GOAL_TIMEFRAMES.slice(0, GOAL_TIMEFRAMES.indexOf(this.idTimeframe) + 1);
            return this.filteredNotes
                .filter(x => timeframeIDs.includes(x.idTimeframe))
                .filter(x => isNoteInRange(x, start, end))
                .sort((a, b) => +new Date(b.datetime) - +new Date(a.datetime));
        },
    },
    methods: {
        goalsOf(group) {
            if (!group || !this.goalStore) return [];
            return group.goalIDs.map(id => this.goalStore.getItem(id)).filter(Boolean);
        },
        goalPoints(idGoal, start, end) {
            return getPoints(this.pointStores, { type: 'goal', id: idGoal }, start, end);
        },
        goalPeriods(idGoal) {
            return this.periods.map(period => ({ ...period, points: this.goalPoints(idGoal, period.start, period.end) }));
        },
        currentPoints(idGoal) {
            let current = this.periods[this.periods.length - 1];
            return current ? this.goalPoints(idGoal, current.start, current.end) : 0;
        },
        goalCardProps(goal) {
            let expanded = goal.id == this.openGoalID;
            let idGoalTimeframe = this.goalTimeframes[goal.id] ?? this.idTimeframe;
            let props = {
                goal,
                expanded,
                reasons: getGoalReasons(goal, this.universalStore, idGoalTimeframe, this.selectedDate),
                periods: (this.showPoints || expanded) ? this.goalPeriods(goal.id) : [],
                periodLabel: PERIOD_LABELS[this.idPointsTimeframe],
                showReasons: this.showReasons,
                showPoints: this.showPoints,
                saveNote: this.saveNote,
            };
            if (expanded) {
                let { current, previous } = this.paceRanges;
                props.pace = {
                    current: this.goalPoints(goal.id, current.start, current.end),
                    previous: this.goalPoints(goal.id, previous.start, previous.end),
                    unit: timeframeUnit(this.idPointsTimeframe),
                };
                props.notes = this.notes.filter(note => (note.goalIDs ?? []).some(x => x.id == goal.id));
            }
            return props;
        },
        toggleGoal(idGoal) {
            this.openGoalID = (this.openGoalID == idGoal) ? null : idGoal;
        },
        selectTimeframe(idTimeframe) {
            this.idTimeframe = idTimeframe;
        },
        // Called by the panel header's "Jump to today"
        resetTimeframe() {
            this.idTimeframe = TIMEFRAME.DAY;
            this.openGoalID = null;
        },
        toggleAlsoTracking() {
            this.alsoTrackingOpen = !this.alsoTrackingOpen;
        },
        // Called by the panel header's "Collapse all". Collapses the open goal card, Also tracking and the
        // note sections; when everything is already collapsed, expands Also tracking and the note sections.
        // Returns whether everything is now collapsed.
        toggleAllSections() {
            let feed = this.$refs.feed;
            let anyOpen = this.openGoalID != null || this.alsoTrackingOpen || (feed?.hasOpenSection() ?? false);
            this.openGoalID = null;
            this.alsoTrackingOpen = !anyOpen;
            feed?.setAllSectionsCollapsed(anyOpen);
            return anyOpen;
        },
        toggleSort() {
            this.appStore.setItemPanelSetting('briefing', 'noteSort', this.newestFirst ? 'oldest' : 'newest');
        },
        // Every timeframe is loaded, since each tab also shows notes filed under shorter and longer ones
        loadNotes() {
            GOAL_TIMEFRAMES.forEach(idTimeframe => this.universalStore?.getBriefingBlurbs(idTimeframe, this.selectedDate));
        },
        async saveNote({ text, json, idMetric, idBlurbType, idGoal }) {
            let blurb = await this.universalStore.addBriefingBlurb(text, new Date(), this.selectedDate, idBlurbType, idMetric, this.idTimeframe, json);
            if (!blurb) throw new Error("AddBriefingBlurb returned no blurb");

            if (idGoal) {
                let goalMapping = { mappingType: BLURB_MAPPING_TYPE.GOAL, idEntity: idGoal, position: null, idTimeframe: null, idMetric: null };
                let updated = await this.universalStore.updateBlurb(blurb.id, undefined, [], [], undefined, undefined, undefined, [goalMapping], [], undefined);
                if (!updated) throw new Error("Linking the note to its goal failed");
                blurb = updated;
            }

            // Don't wait on SignalR to show the note
            this.universalStore.runUpdates({ blurbs: [blurb] });
        },
    },
    watch: {
        idTimeframe() {
            this.openGoalID = null;
        },
        selectedDate() {
            this.loadNotes();
        },
    },
}
</script>

<style scoped>
.briefing-rethink {
    --rt-bg: #faf7f2;
    --rt-border: #e9e2d8;
    --rt-text: #1f1b16;
    --rt-text-secondary: #6b635a;
    --rt-text-muted: #a39a8f;
    --rt-accent: #b4532a;
    --rt-sans: 'DM Sans', system-ui, sans-serif;
    --rt-serif: 'Fraunces', Georgia, serif;

    gap: 14px;
    padding: 24px;
    background-color: var(--rt-bg);
    font-family: var(--rt-sans);
    color: var(--rt-text);
    text-align: left;
}

.briefing-rethink :deep(button) {
    font-family: inherit;
}

.header {
    gap: 4px;
}

.date {
    font-family: var(--rt-serif);
    font-size: 26px;
    line-height: 32px;
    color: var(--rt-text);
}

.subtitle {
    font-size: 13px;
    line-height: 18px;
    color: var(--rt-text-secondary);
}

.tabs {
    gap: 18px;
    padding-top: 10px;
}

.tab {
    gap: 4px;
    padding: 0;
    border: none;
    background: none;
    font-size: 13px;
    line-height: 18px;
    color: var(--rt-text-muted);
}

.tab .indicator {
    width: 16px;
    height: 2px;
    border-radius: 1px;
}

.tab.active {
    font-weight: 600;
    color: var(--rt-text);
}

.tab.active .indicator {
    background-color: var(--rt-accent);
}

.label-row {
    padding-top: 8px;
}

.label {
    font-size: 11px;
    font-weight: 600;
    line-height: 14px;
    color: var(--rt-text-muted);
}

/* The native select sits invisibly over the "Week ▾" text */
.points-window {
    position: relative;
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    color: var(--rt-accent);
    cursor: pointer;
}

.points-window select {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
}

.goal-cards {
    gap: 8px;
}

.empty {
    font-size: 13px;
    color: var(--rt-text-muted);
}

.also-tracking {
    gap: 6px;
    font-size: 12px;
    line-height: 16px;
}

.also-label {
    gap: 6px;
    padding: 0;
    border: none;
    background: transparent;
    font: inherit;
    color: var(--rt-text-muted);
}

.also-count {
    font-weight: 600;
}

.also-toggle {
    font-weight: 500;
    color: var(--rt-accent);
}

.chip {
    gap: 5px;
    padding: 3px 8px;
    border: 1px solid var(--rt-border);
    border-radius: 10px;
    background: transparent;
    white-space: nowrap;
}

.chip.open {
    border-color: var(--rt-accent);
}

.chip-text {
    color: var(--rt-text-secondary);
}

.chip-points {
    font-weight: 600;
    color: var(--rt-text);
}

.notes-title {
    gap: 6px;
}

.label-count {
    font-size: 11px;
    line-height: 14px;
    color: #C2B9AD;
}

.sort-toggle {
    gap: 4px;
    padding: 3px 8px;
    border: 1px solid #E2D9CC;
    border-radius: 10px;
    background: transparent;
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    color: var(--rt-text-secondary);
}
</style>
