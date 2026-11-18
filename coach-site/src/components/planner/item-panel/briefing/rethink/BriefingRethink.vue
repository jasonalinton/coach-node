<template>
    <div class="briefing-rethink d-flex flex-column flex-grow-1 overflow-scroll">
        <!-- Header -->
        <div class="header d-flex flex-column">
            <span class="date">{{ dateText }}</span>
            <span class="subtitle">{{ inFocusGoals.length }} {{ inFocusGoals.length == 1 ? 'goal' : 'goals' }} in focus · {{ notes.length }} {{ notes.length == 1 ? 'note' : 'notes' }} so far</span>
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
        <div v-if="alsoTrackingGoals.length" class="also-tracking d-flex flex-wrap align-items-center">
            <span class="also-label">Also tracking</span>
            <button v-for="goal in alsoTrackingGoals" :key="goal.id" class="chip d-flex"
                    :class="{ open: goal.id == openGoalID }" @click="toggleGoal(goal.id)">
                <span class="chip-text">{{ goal.text }}</span>
                <span v-if="showPoints" class="chip-points">{{ currentPoints(goal.id) }}</span>
            </button>
        </div>
        <RethinkGoalCard v-if="openAlsoTrackingGoal" v-bind="goalCardProps(openAlsoTrackingGoal)"
                         @toggle="toggleGoal(openAlsoTrackingGoal.id)" />

        <!-- Notes -->
        <div class="label-row d-flex align-items-center">
            <span class="label">NOTES</span>
        </div>
        <RethinkNoteComposer variant="main" :goals="linkableGoals" :save="saveNote" />
        <div class="notes-feed d-flex flex-column">
            <RethinkNote v-for="note in filteredNotes" :key="note.id" :note="note" :goalStore="goalStore" />
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import RethinkGoalCard from './RethinkGoalCard.vue';
import RethinkNote from './RethinkNote.vue';
import RethinkNoteComposer from './RethinkNoteComposer.vue';
import { getGoalGroups, getGoalReasons, getPeriods, getPaceRanges, timeframeUnit } from '../briefingUtility';
import { getPoints } from '../../../../../../utility/pointsUtility';
import { BLURBTYPE, BLURB_MAPPING_TYPE, TIMEFRAME } from '../../../../../model/constants';
import { today, isToday, endOfDay, getTimeframeEndpoints } from '../../../../../../utility/timeUtility';

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
    components: { RethinkGoalCard, RethinkNote, RethinkNoteComposer },
    data: function () {
        return {
            TABS,
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
        dateText() {
            return moment(this.selectedDate).format('dddd, MMMM D');
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
        notes() {
            if (!this.universalStore) return [];
            // Any note dated within the selected period (e.g. anywhere in this week on the Week tab)
            let { start, end } = getTimeframeEndpoints(this.idTimeframe, this.selectedDate);
            return this.universalStore.blurbs
                .filter(x => x.idType == BLURBTYPE.BRIEFING || x.idType == BLURBTYPE.DEBRIEFING)
                .filter(x => x.idTimeframe == this.idTimeframe)
                .filter(x => {
                    let datetime = +new Date(x.datetime);
                    return datetime >= +start && datetime <= +end;
                })
                .sort((a, b) => b.id - a.id);
        },
        filteredNotes() {
            let filter = this.settings.noteFilter ?? 'all';
            if (filter == 'brief') return this.notes.filter(x => x.idType == BLURBTYPE.BRIEFING);
            if (filter == 'debrief') return this.notes.filter(x => x.idType == BLURBTYPE.DEBRIEFING);
            return this.notes;
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
        loadNotes() {
            this.universalStore?.getBriefingBlurbs(this.idTimeframe, this.selectedDate);
        },
        async saveNote({ text, json, idMetric, idBlurbType, idGoal }) {
            let blurb = await this.universalStore.addBriefingBlurb(text, new Date(),idBlurbType, idMetric, this.idTimeframe, json);
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
            this.loadNotes();
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
    color: var(--rt-text-muted);
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

.notes-feed {
    gap: 8px;
}
</style>
