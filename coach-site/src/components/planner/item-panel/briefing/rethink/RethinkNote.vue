<template>
    <div class="rethink-note d-flex flex-column">
        <div class="meta d-flex align-items-center">
            <RethinkMetricTag v-if="note.idMetric" :idMetric="note.idMetric" />
            <span class="kind">{{ kind }}</span>
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
import { BLURBTYPE } from '../../../../../model/constants';

export default {
    name: 'RethinkNote',
    components: { RethinkMetricTag, BlurbContent },
    props: {
        note: Object,
        goalStore: Object,
    },
    computed: {
        kind() {
            return (this.note.idType == BLURBTYPE.DEBRIEFING) ? 'Debrief' : 'Brief';
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

.meta {
    gap: 8px;
}

.kind {
    font-size: 12px;
    line-height: 16px;
    color: var(--rt-text-muted);
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
