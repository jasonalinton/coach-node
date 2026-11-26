<template>
    <div class="source-card d-flex flex-column" :class="{ selected: isSelected }"
         role="button" :aria-pressed="isSelected"
         @pointerenter="onPointer($event, true)" @pointerleave="onPointer($event, false)"
         @click="$emit('toggle')">
        <div class="top d-flex flex-row justify-content-between">
            <span class="kind">{{ kind }}</span>
            <span class="count">{{ countText }}</span>
        </div>
        <div class="display d-flex flex-row">
            <img src="/icon/calendar-day.png" width="14" height="14"/>
            <div class="d-flex flex-column">
                <span v-for="(line, index) in lines" :key="index" :class="{ blue: index == 0 }">{{ line }}</span>
            </div>
        </div>
        <span class="breakdown">{{ breakdown }}</span>
    </div>
</template>

<script>
import { STATUS } from './planningUtility'

export default {
    name: 'PlanningSourceCard',
    props: {
        kind: String,      // "Repeat" or "Time pair"
        lines: Array,
        statuses: Array,   // status of each of this source's iterations
        isSelected: Boolean
    },
    emits: ['hover', 'toggle'],
    methods: {
        // Touch has no hover; a tap selects instead
        onPointer(event, isHovered) {
            if (event.pointerType == 'mouse') this.$emit('hover', isHovered);
        }
    },
    computed: {
        countText() {
            let count = this.statuses.length;
            return `${count} ${count == 1 ? 'iteration' : 'iterations'}`;
        },
        breakdown() {
            let parts = [
                [STATUS.DONE, 'done'], [STATUS.ATTEMPTED, 'attempted'],
                [STATUS.MISSED, 'missed'], [STATUS.UPCOMING, 'upcoming']
            ].map(([status, text]) => {
                let count = this.statuses.filter(x => x == status).length;
                return count ? `${count} ${text}` : null;
            }).filter(x => x);
            return parts.length ? parts.join(' · ') : 'Nothing planned in this range';
        }
    }
}
</script>

<style scoped>
.source-card {
    gap: 6px;
    padding: 10px 12px;
    border: 1px solid #DEE2E6;
    border-radius: 8px;
    background-color: white;
    cursor: pointer;
    text-align: start;
    transition: border-color .15s, background-color .15s, box-shadow .15s;
}

.source-card:hover {
    border-color: #8AB4F8;
    background-color: #F8FBFF;
    box-shadow: 0 2px 6px rgba(26, 77, 179, .12);
}

.source-card.selected {
    border-color: #1A73E8;
    background-color: #E8F0FE;
    box-shadow: inset 0 0 0 1px #1A73E8;
}

.kind {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: .06em;
    color: #6C757D;
}

.count {
    font-size: 12px;
    font-weight: 500;
    color: #495057;
}

.selected .count {
    color: #1A73E8;
}

.display {
    gap: 8px;
    font-size: 12px;
    line-height: 18px;
}

.display img {
    margin-top: 2px;
}

.blue {
    color: #3B99FC;
}

.breakdown {
    font-size: 12px;
    color: #6C757D;
}
</style>
