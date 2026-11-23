<template>
    <div class="priority-lane d-flex flex-column"
         @dragover.prevent="onDragOver" @dragleave="onDragLeave" @drop.prevent="onDrop">
        <!-- Header -->
        <div class="lane-header d-flex align-items-center">
            <span class="lane-badge" :style="{ backgroundColor: lane.color }">{{ lane.n }}</span>
            <span class="lane-name flex-grow-1">{{ lane.label }}</span>
            <span class="lane-progress">{{ completed }} of {{ potential }} pts</span>
        </div>
        <div v-if="!isPlanning" class="progress-bar">
            <div class="progress-fill" :style="{ width: progressPercent + '%', backgroundColor: lane.color }"></div>
        </div>
        <!-- Rows -->
        <div class="lane-rows d-flex flex-column" :class="{ planning: isPlanning }">
            <template v-for="node in nodes" :key="node.item.id">
                <div v-if="isDropTarget && dropBeforeID == node.item.id" class="drop-indicator"></div>
                <div :data-item-id="node.item.id" class="lane-node">
                    <PriorityGoalRow :node="node" :depth="0" :isPlanning="isPlanning"
                                     :isDragging="dragged && dragged.node.item.id == node.item.id"
                                     @drag-start="$emit('drag-start', $event)" @drag-end="$emit('drag-end')"
                                     @points="(goal, points) => $emit('points', goal, points)"
                                     @remove="$emit('remove', $event)"
                                     @add-sub="(parent, payload) => $emit('add-sub', parent, payload)"
                                     @reorder="$emit('reorder', $event)" />
                </div>
            </template>
            <div v-if="isDropTarget && dropBeforeID == null && nodes.length > 0" class="drop-indicator"></div>
            <!-- Empty -->
            <div v-if="nodes.length == 0 && isPlanning" class="drop-zone" :class="{ active: isDropTarget }">Drop goals here</div>
            <div v-else-if="nodes.length == 0" class="lane-empty">Nothing here yet. Tap Plan to add goals.</div>
        </div>
    </div>
</template>

<script>
import PriorityGoalRow from './PriorityGoalRow.vue';

export default {
    name: 'PriorityLane',
    components: { PriorityGoalRow },
    emits: ['drag-start', 'drag-end', 'drop-node', 'points', 'remove', 'add-sub', 'reorder'],
    props: {
        lane: { type: Object, required: true },
        nodes: { type: Array, default: () => [] },
        isPlanning: { type: Boolean, default: false },
        dragged: { type: Object, default: null }
    },
    data: function() {
        return {
            isDropTarget: false,
            dropBeforeID: null
        }
    },
    computed: {
        potential() {
            return this.nodes.reduce((total, node) => total + node.potentialPoints, 0);
        },
        completed() {
            return this.nodes.reduce((total, node) => total + node.completedPoints, 0);
        },
        progressPercent() {
            return (this.potential > 0) ? Math.min(100, Math.round(this.completed / this.potential * 100)) : 0;
        }
    },
    methods: {
        // Drops land above the top-level row under the pointer's upper half, else below it
        onDragOver(event) {
            if (!this.isPlanning || !this.dragged) return;
            this.isDropTarget = true;
            let rows = [...this.$el.querySelectorAll('.lane-node')];
            let before = rows.find(row => {
                let rect = row.getBoundingClientRect();
                return event.clientY < rect.top + rect.height / 2;
            });
            this.dropBeforeID = (before) ? Number(before.dataset.itemId) : null;
        },
        onDragLeave(event) {
            if (!this.$el.contains(event.relatedTarget)) {
                this.isDropTarget = false;
            }
        },
        onDrop() {
            if (!this.isPlanning || !this.dragged) return;
            this.isDropTarget = false;
            this.$emit('drop-node', this.dropBeforeID);
        }
    }
}
</script>

<style scoped>
.priority-lane {
    gap: 4px;
}
.lane-header {
    gap: 8px;
    padding: 0 4px 4px 4px;
}
.lane-badge {
    width: 22px;
    height: 22px;
    border-radius: 11px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 600;
    color: #ffffff;
    flex-shrink: 0;
}
.lane-name {
    font-size: 13px;
    font-weight: 600;
}
.lane-progress {
    font-size: 12px;
    font-weight: 500;
    color: #7a847f;
}
.progress-bar {
    height: 4px;
    border-radius: 2px;
    background-color: #e8e2d8;
    overflow: hidden;
}
.progress-fill {
    height: 100%;
    border-radius: 2px;
    transition: width 0.3s ease;
}
.lane-rows {
    padding-top: 4px;
    gap: 0;
}
.lane-rows.planning {
    gap: 6px;
}
.drop-indicator {
    height: 2px;
    border-radius: 1px;
    background-color: #1f6f5c;
}
.drop-zone {
    padding: 14px;
    border: 1px dashed #cfc7b9;
    border-radius: 10px;
    text-align: center;
    font-size: 12px;
    font-weight: 500;
    color: #7a847f;
}
.drop-zone.active {
    border-color: #1f6f5c;
    background-color: #e3efe9;
}
.lane-empty {
    padding: 4px 10px;
    font-size: 13px;
    color: #7a847f;
}
</style>
