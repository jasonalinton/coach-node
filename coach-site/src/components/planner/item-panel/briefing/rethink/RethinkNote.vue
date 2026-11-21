<template>
    <div class="rethink-note d-flex flex-column" :class="filedClass">
        <div class="meta d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center left">
                <RethinkMetricTag v-if="note.idMetric" :idMetric="note.idMetric" />
                <span class="kind">{{ kind }}</span>
            </div>
            <div class="d-flex align-items-center right">
                <span v-if="chip" class="timeframe-chip">{{ chip }}</span>
                <span v-if="time" class="time">{{ time }}</span>
            </div>
        </div>
        <BlurbContent class="text" :blurb="note" />
        <div v-if="goalNames.length" class="linked-goal d-flex align-items-center">
            <img src="/icon/briefing/goal-link.svg" width="12" height="12" alt="" />
            <span>{{ goalNames.join(', ') }}</span>
        </div>
    </div>
</template>

<script>
import RethinkMetricTag from './RethinkMetricTag.vue';
import BlurbContent from '../../../../controls/display/BlurbContent.vue';
import { BLURBTYPE, TIMEFRAME } from '../../../../../model/constants';

// Notes filed under a longer timeframe get a tinted card and a chip (Figma: Rethink v2 / Timed Note)
const FILED = {
    [TIMEFRAME.WEEK]: { chip: 'Week', class: 'filed-week' },
    [TIMEFRAME.MONTH]: { chip: 'Month', class: 'filed-month' },
    [TIMEFRAME.YEAR]: { chip: 'Year', class: 'filed-month' },
};

export default {
    name: 'RethinkNote',
    components: { RethinkMetricTag, BlurbContent },
    props: {
        note: Object,
        goalStore: Object,
        // e.g. "9:12 AM" or "Sun 8:05 PM"; hidden when empty
        time: String,
        // Mark notes filed under a longer timeframe (week, month, year)
        showFiled: Boolean,
    },
    computed: {
        kind() {
            return (this.note.idType == BLURBTYPE.DEBRIEFING) ? 'Debrief' : 'Brief';
        },
        filed() {
            return this.showFiled ? FILED[this.note.idTimeframe] : undefined;
        },
        chip() {
            return this.filed?.chip;
        },
        filedClass() {
            return this.filed?.class;
        },
        goalNames() {
            if (!this.goalStore) return [];
            return (this.note.goalIDs ?? [])
                .map(x => this.goalStore.getItem(x.id)?.text)
                .filter(Boolean);
        }
    },
}
</script>

<style scoped>
.rethink-note {
    gap: 8px;
    padding: 12px 14px;
    border: 1px solid var(--rt-border);
    border-radius: 12px;
    background-color: white;
}

.rethink-note.filed-week {
    border-color: #E6D6BF;
    background-color: #F6EFE4;
}

.rethink-note.filed-month {
    border-color: #D6DBE2;
    background-color: #EEF0F2;
}

.meta .left {
    gap: 8px;
}

.meta .right {
    gap: 6px;
}

.kind {
    font-size: 12px;
    line-height: 16px;
    color: var(--rt-text-muted);
}

.timeframe-chip {
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 500;
    line-height: 14px;
}

.filed-week .timeframe-chip {
    color: #8A4424;
    background-color: rgba(180, 83, 42, .12);
}

.filed-month .timeframe-chip {
    color: #3D5068;
    background-color: rgba(79, 100, 128, .12);
}

.time {
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    color: #8F867B;
    white-space: nowrap;
}

.text {
    margin: 0;
    font-size: 14px;
    line-height: 20px;
    color: var(--rt-text);
    overflow-wrap: break-word;
}

.text :deep(p) {
    margin: 0;
}

.linked-goal {
    gap: 4px;
    font-size: 12px;
    line-height: 16px;
    color: var(--rt-text-secondary);
}
</style>
