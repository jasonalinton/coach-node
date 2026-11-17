<template>
    <component :is="selectable ? 'button' : 'span'" v-if="tag" class="metric-tag"
               :class="{ selectable, selected: !selectable || selected }"
               :style="tagStyle" @click="selectable && $emit('select', tag.id)">
        <span class="dot" :style="{ backgroundColor: tag.color }"></span>
        <span class="text">{{ tag.text }}</span>
    </component>
</template>

<script>
import { getMetricTag } from '../briefingUtility';

export default {
    name: 'RethinkMetricTag',
    emits: ['select'],
    props: {
        idMetric: Number,
        // Selectable tags are the composer's pick-one row; unselected ones are outlined and grey
        selectable: Boolean,
        selected: Boolean,
    },
    computed: {
        tag() {
            return getMetricTag(this.idMetric);
        },
        tagStyle() {
            if (this.selectable && !this.selected) return {};
            return {
                color: this.tag.color,
                backgroundColor: `${this.tag.color}1F`, // 12% alpha
                borderColor: this.selectable ? this.tag.color : 'transparent',
            };
        }
    },
}
</script>

<style scoped>
.metric-tag {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 8px 3px 7px;
    border-radius: 10px;
    border: 1px solid transparent;
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    white-space: nowrap;
    flex-shrink: 0;
    background: transparent;
}

.metric-tag.selectable {
    cursor: pointer;
    border-color: var(--rt-border);
    color: var(--rt-text-secondary);
}

.dot {
    width: 6px;
    height: 6px;
    border-radius: 3px;
}
</style>
