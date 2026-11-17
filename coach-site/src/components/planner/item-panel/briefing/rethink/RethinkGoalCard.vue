<template>
    <!-- Collapsed -->
    <div v-if="!expanded" class="goal-card collapsed d-flex align-items-center" role="button" tabindex="0"
         @click="$emit('toggle')" @keydown.enter.prevent="$emit('toggle')">
        <div class="text d-flex flex-column flex-grow-1">
            <span class="title">{{ goal.text }}</span>
            <span v-if="showReasons && topReason" class="reason">“{{ topReason }}”</span>
        </div>
        <div v-if="showPoints" class="points d-flex flex-column align-items-end">
            <span class="score">{{ currentPoints }}</span>
            <RethinkPointsBars :periods="periods" mini />
        </div>
    </div>

    <!-- Expanded -->
    <div v-else class="goal-card expanded d-flex flex-column">
        <div class="top d-flex align-items-center justify-content-between" role="button" @click="$emit('toggle')">
            <span class="title">{{ goal.text }}</span>
            <span class="points-label">{{ currentPoints }} pts {{ periodLabel }}</span>
        </div>

        <RethinkPointsBars :periods="periods" />
        <span v-if="pace" class="pace" :class="paceClass">{{ paceText }}</span>

        <div v-if="reasons.length" class="section d-flex flex-column">
            <span class="section-label">WHY</span>
            <p v-for="reason in reasons" :key="reason.id" class="why">“{{ reasonText(reason) }}”</p>
        </div>

        <div class="section d-flex flex-column">
            <span class="section-label">NOTES ON THIS GOAL<template v-if="notes.length"> · {{ notes.length }}</template></span>
            <div v-for="note in notes" :key="note.id" class="linked-note d-flex align-items-start">
                <RethinkMetricTag v-if="note.idMetric" :idMetric="note.idMetric" />
                <BlurbContent class="note-text" :blurb="note" compact />
            </div>
            <RethinkNoteComposer variant="goal" :goal="goal" :save="saveNote" />
        </div>
    </div>
</template>

<script>
import RethinkPointsBars from './RethinkPointsBars.vue';
import RethinkMetricTag from './RethinkMetricTag.vue';
import RethinkNoteComposer from './RethinkNoteComposer.vue';
import BlurbContent from '../../../../controls/display/BlurbContent.vue';
import { blurbText } from '../briefingUtility';

export default {
    name: 'RethinkGoalCard',
    components: { RethinkPointsBars, RethinkMetricTag, RethinkNoteComposer, BlurbContent },
    emits: ['toggle'],
    props: {
        goal: Object,
        // REASON blurbs, closest timeframe first
        reasons: { type: Array, default: () => [] },
        // [{ label, points, isCurrent }], oldest first
        periods: { type: Array, default: () => [] },
        // { current, previous, unit } points so far this period vs. the same point last period
        pace: Object,
        // Briefing notes linked to this goal
        notes: { type: Array, default: () => [] },
        // "this week", "this month", ...
        periodLabel: String,
        expanded: Boolean,
        showReasons: { type: Boolean, default: true },
        showPoints: { type: Boolean, default: true },
        saveNote: { type: Function, required: true },
    },
    computed: {
        topReason() {
            return this.reasons.length ? blurbText(this.reasons[0]) : undefined;
        },
        currentPoints() {
            return this.periods.find(x => x.isCurrent)?.points ?? 0;
        },
        paceDiff() {
            return this.pace ? this.pace.current - this.pace.previous : 0;
        },
        paceText() {
            let diff = this.paceDiff;
            let at = `vs. this point last ${this.pace.unit}`;
            if (diff == 0) return `Even ${at}`;
            return `${diff > 0 ? '+' : ''}${diff} ${at}`;
        },
        paceClass() {
            return { ahead: this.paceDiff > 0, behind: this.paceDiff < 0 };
        }
    },
    methods: {
        reasonText: blurbText,
    },
}
</script>

<style scoped>
.goal-card {
    border-radius: 12px;
    background-color: white;
}

.goal-card.collapsed {
    gap: 12px;
    padding: 12px 14px;
    border: 1px solid var(--rt-border);
    cursor: pointer;
}

.goal-card.collapsed:hover {
    border-color: #d9cfc1;
}

.goal-card.expanded {
    gap: 10px;
    padding: 12px 14px 14px;
    border: 1.5px solid var(--rt-accent);
}

.text {
    gap: 3px;
    min-width: 0;
}

.title {
    font-size: 15px;
    font-weight: 600;
    line-height: 20px;
    color: var(--rt-text);
}

.reason {
    font-family: var(--rt-serif);
    font-style: italic;
    font-size: 13px;
    line-height: 18px;
    color: var(--rt-text-secondary);
}

.points {
    gap: 4px;
    flex-shrink: 0;
}

.score {
    font-family: var(--rt-serif);
    font-size: 22px;
    font-weight: 600;
    line-height: 24px;
    color: var(--rt-accent);
}

.top {
    cursor: pointer;
}

.points-label {
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    color: var(--rt-accent);
    white-space: nowrap;
}

.pace {
    font-size: 11px;
    line-height: 14px;
    color: var(--rt-text-muted);
}

.pace.ahead {
    color: #3E7C59;
}

.pace.behind {
    color: var(--rt-accent);
}

.section {
    gap: 6px;
    padding-top: 4px;
}

.section-label {
    font-size: 10px;
    font-weight: 600;
    line-height: 12px;
    color: var(--rt-text-muted);
}

.why {
    margin: 0;
    font-family: var(--rt-serif);
    font-style: italic;
    font-size: 14px;
    line-height: 20px;
    color: var(--rt-text);
}

.linked-note {
    gap: 8px;
}

.note-text {
    font-size: 13px;
    line-height: 18px;
    color: var(--rt-text);
}
</style>
