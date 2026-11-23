<template>
    <div class="priority-goal-row d-flex flex-column" :class="{ planning: isPlanning }">
        <div class="row-line d-flex align-items-center"
             :class="{ 'is-dragging': isDragging }"
             :style="{ paddingLeft: (10 + depth * 22) + 'px' }"
             :draggable="canDrag"
             @dragstart="onDragStart" @dragend="$emit('drag-end')">
            <svg v-if="isPlanning" class="drag-handle" :class="{ hidden: !canDrag }" width="10" height="14" viewBox="0 0 10 14">
                <g fill="#b5ad9f"><circle cx="2.5" cy="2.5" r="1.3"/><circle cx="7.5" cy="2.5" r="1.3"/><circle cx="2.5" cy="7" r="1.3"/>
                <circle cx="7.5" cy="7" r="1.3"/><circle cx="2.5" cy="11.5" r="1.3"/><circle cx="7.5" cy="11.5" r="1.3"/></g>
            </svg>
            <span class="check" :class="{ done: node.status == 'complete', partial: node.status == 'partial' }">
                <svg v-if="node.status == 'complete'" width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l2.5 2.5L9 1" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </span>
            <span class="label flex-grow-1" :class="{ 'is-parent': hasChildren, done: node.status == 'complete' }"
                  @click="openForm">{{ node.item.text }}</span>
            <!-- Points -->
            <span v-if="!isPlanning || !isGoal" class="points">{{ pointsLabel }}</span>
            <span v-else class="stepper d-flex align-items-center">
                <span class="step" @click="stepPoints(-1)">−</span>
                <input class="step-value" type="number" min="0" inputmode="numeric" :value="points"
                       @input="typePoints($event.target.value)"
                       @keydown.enter.prevent="$event.target.blur()" @blur="flushPoints"
                       @focus="$event.target.select()" />

                <span class="step" @click="stepPoints(1)">+</span>
            </span>
            <span v-if="isPlanning && isGoal" class="remove" title="Remove from priority" @click="$emit('remove', node)">×</span>
        </div>
        <!-- Children -->
        <div v-if="hasChildren" class="children d-flex flex-column"
             @dragover="onChildDragOver" @drop="onChildDrop">
            <template v-for="child in node.children" :key="child.item.id">
                <div v-if="draggedChildID != null && dropBeforeChildID == child.item.id" class="drop-indicator"
                     :style="{ marginLeft: (10 + (depth + 1) * 22) + 'px' }"></div>
                <div class="child-node" :data-item-id="child.item.id">
                    <PriorityGoalRow :node="child" :depth="depth + 1" :isPlanning="isPlanning"
                                     :isDragging="draggedChildID == child.item.id"
                                     @drag-start="draggedChildID = $event.item.id"
                                     @drag-end="draggedChildID = null"
                                     @points="(goal, value) => $emit('points', goal, value)"
                                     @remove="$emit('remove', $event)"
                                     @add-sub="(parent, payload) => $emit('add-sub', parent, payload)"
                                     @reorder="ids => $emit('reorder', ids)" />
                </div>
            </template>
            <div v-if="draggedChildID != null && dropBeforeChildID == null" class="drop-indicator"
                 :style="{ marginLeft: (10 + (depth + 1) * 22) + 'px' }"></div>
        </div>
        <!-- Add sub-goal -->
        <template v-if="isPlanning && isGoal && depth == 0">
            <span v-if="!isAddingSub" class="add-sub" :style="{ paddingLeft: (54 + depth * 22) + 'px' }"
                  @click="startAddingSub">+ sub-goal</span>
            <div v-else class="sub-picker d-flex flex-column" :style="{ paddingLeft: (32 + depth * 22) + 'px' }">
                <input ref="subInput" v-model="subText" class="sub-input" type="text"
                       placeholder="New or existing sub-goal…"
                       @keydown.down.prevent="moveHighlight(1)" @keydown.up.prevent="moveHighlight(-1)"
                       @keydown.enter.prevent="submitSub" @keydown.esc="cancelSub" @blur="onSubBlur" />
                <div v-if="subMatches.length > 0" class="sub-matches d-flex flex-column">
                    <span v-for="(goal, index) in subMatches" :key="goal.id"
                          class="sub-match" :class="{ active: index == highlight }"
                          @mousedown.prevent="pickSub(goal)">{{ goal.text }}</span>
                </div>
                <span v-if="subText.trim()" class="sub-hint">↵ {{ (highlight >= 0) ? 'adds the highlighted goal' : `creates “${subText.trim()}”` }}</span>
            </div>
        </template>
    </div>
</template>

<script>
import { ITEMTYPES } from '../../../../../model/constants';

export default {
    name: 'PriorityGoalRow',
    emits: ['drag-start', 'drag-end', 'points', 'remove', 'add-sub', 'reorder'],
    props: {
        node: { type: Object, required: true },
        depth: { type: Number, default: 0 },
        isPlanning: { type: Boolean, default: false },
        isDragging: { type: Boolean, default: false }
    },
    data: function() {
        return {
            appStore: undefined,
            goalStore: null,
            pendingPoints: null,
            sentPoints: null,
            pointsTimer: null,
            draggedChildID: null,
            dropBeforeChildID: null,
            isAddingSub: false,
            subText: '',
            highlight: -1
        }
    },
    created: async function() {
        let appStore = await import(`@/store/appStore`);
        this.appStore = appStore.useAppStore();

        let goalStore = await import(`@/store/goalStore`);
        this.goalStore = goalStore.useGoalStore();
    },
    computed: {
        isGoal() {
            return this.node.idType == ITEMTYPES.GOAL;
        },
        hasChildren() {
            return this.node.children && this.node.children.length > 0;
        },
        // Top-level goals drag between lanes (their in-lane children move with them);
        // sub-goals drag to reorder among their siblings
        canDrag() {
            return this.isPlanning && (this.depth > 0 || this.isGoal);
        },
        // The goal's own target for this day/week (0 when it has none)
        points() {
            return (this.pendingPoints != null) ? this.pendingPoints : (this.node.targetRepeat?.points || 0);
        },
        pointsLabel() {
            return (this.node.potentialPoints > 0) ? this.node.potentialPoints : '–';
        },
        subMatches() {
            let text = this.subText.trim().toLowerCase();
            if (!text || !this.goalStore) return [];
            let childIDs = this.node.item.childIDs || [];
            return this.goalStore.goals
                .filter(goal => goal.id != this.node.item.id && !childIDs.includes(goal.id)
                                && goal.text && goal.text.toLowerCase().includes(text))
                .slice(0, 5);
        }
    },
    watch: {
        subMatches() {
            this.highlight = -1;
        }
    },
    beforeUnmount() {
        this.flushPoints();
    },
    methods: {
        openForm() {
            if (this.node.idType == ITEMTYPES.TODO) {
                this.appStore.selectTodoForm(this.node.item.id);
            } else {
                this.appStore.selectGoalForm(this.node.item.id);
            }
        },
        onDragStart(event) {
            if (!this.canDrag) return;
            event.stopPropagation();
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('text/plain', String(this.node.item.id));
            this.$emit('drag-start', this.node);
        },
        // Only this row's own children are handled here; a deeper drag is left to its own parent row
        onChildDragOver(event) {
            if (this.draggedChildID == null) return;
            event.preventDefault();
            event.stopPropagation();
            let rows = [...event.currentTarget.children].filter(el => el.classList.contains('child-node'));
            let before = rows.find(row => {
                let rect = row.getBoundingClientRect();
                return event.clientY < rect.top + rect.height / 2;
            });
            this.dropBeforeChildID = (before) ? Number(before.dataset.itemId) : null;
        },
        onChildDrop(event) {
            if (this.draggedChildID == null) return;
            event.preventDefault();
            event.stopPropagation();
            let ids = this.node.children.map(child => child.item.id).filter(id => id != this.draggedChildID);
            let index = ids.indexOf(this.dropBeforeChildID);
            ids.splice((index < 0) ? ids.length : index, 0, this.draggedChildID);
            let changed = ids.some((id, i) => id != this.node.children[i].item.id);
            this.draggedChildID = null;
            this.dropBeforeChildID = null;
            if (changed) this.$emit('reorder', ids);
        },
        // Clicks are batched so tapping + three times saves once
        stepPoints(delta) {
            this.pendingPoints = Math.max(0, this.points + delta);
            clearTimeout(this.pointsTimer);
            this.pointsTimer = setTimeout(() => this.flushPoints(), 400);
        },
        typePoints(value) {
            let points = parseInt(value, 10);
            this.pendingPoints = (isNaN(points) || points < 0) ? 0 : points;
            clearTimeout(this.pointsTimer);
            this.pointsTimer = setTimeout(() => this.flushPoints(), 800);
        },
        flushPoints() {
            clearTimeout(this.pointsTimer);
            // Skip a value already sent (the typing timer and blur can both flush it) so a goal
            // without a repeat doesn't get two created
            if (this.pendingPoints == null || this.pendingPoints === this.sentPoints) return;
            if (this.pendingPoints != (this.node.targetRepeat?.points || 0)) {
                this.$emit('points', this.node.item, this.pendingPoints);
            }
            // Keep showing the new value until the saved repeat arrives over the socket
            let saved = this.sentPoints = this.pendingPoints;
            setTimeout(() => {
                if (this.pendingPoints === saved) this.pendingPoints = null;
                if (this.sentPoints === saved) this.sentPoints = null;
            }, 3000);
        },
        startAddingSub() {
            this.isAddingSub = true;
            this.$nextTick(() => this.$refs.subInput?.focus());
        },
        moveHighlight(delta) {
            if (this.subMatches.length == 0) return;
            this.highlight = Math.min(this.subMatches.length - 1, Math.max(-1, this.highlight + delta));
        },
        submitSub() {
            if (this.highlight >= 0) {
                this.pickSub(this.subMatches[this.highlight]);
            } else if (this.subText.trim()) {
                this.$emit('add-sub', this.node.item, { text: this.subText.trim() });
                this.cancelSub();
            }
        },
        pickSub(goal) {
            this.$emit('add-sub', this.node.item, { goalID: goal.id });
            this.cancelSub();
        },
        cancelSub() {
            this.isAddingSub = false;
            this.subText = '';
            this.highlight = -1;
        },
        onSubBlur() {
            if (!this.subText.trim()) this.cancelSub();
        }
    }
}
</script>

<style scoped>
.row-line {
    gap: 10px;
    padding: 8px 10px;
    border-radius: 10px;
}
.planning > .row-line {
    background-color: #ffffff;
    border: 1px solid #e8e2d8;
}
.planning > .row-line[draggable="true"] {
    cursor: grab;
}
.row-line.is-dragging {
    opacity: 0.4;
}
.children {
    gap: 0;
}
.planning > .children {
    gap: 6px;
    padding-top: 6px;
}
.drop-indicator {
    height: 2px;
    border-radius: 1px;
    background-color: #1f6f5c;
}
.drag-handle {
    flex-shrink: 0;
}
.drag-handle.hidden {
    visibility: hidden;
}
.check {
    width: 20px;
    height: 20px;
    border-radius: 6px;
    border: 1.5px solid #cfc7b9;
    background-color: #ffffff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}
.check.done {
    background-color: #1f6f5c;
    border-color: #1f6f5c;
}
.check.partial {
    border-color: #1f6f5c;
    background: linear-gradient(135deg, #e3efe9 50%, #ffffff 50%);
}
.label {
    font-size: 14px;
    color: #1c2b27;
    word-break: break-word;
    cursor: pointer;
}
.label:hover {
    text-decoration: underline;
}
.label.is-parent {
    font-weight: 600;
}
.label.done {
    color: #7a847f;
    text-decoration: line-through;
}
.points {
    font-size: 13px;
    font-weight: 500;
    color: #7a847f;
}
.stepper {
    gap: 8px;
    padding: 2px 6px;
    border-radius: 8px;
    background-color: #faf7f2;
}
.step {
    font-size: 14px;
    font-weight: 500;
    color: #7a847f;
    cursor: pointer;
    user-select: none;
}
.step:hover {
    color: #1f6f5c;
}
.step-value {
    width: 28px;
    padding: 0;
    border: none;
    border-radius: 4px;
    background: transparent;
    text-align: center;
    font-size: 13px;
    font-weight: 600;
    color: #1c2b27;
    -moz-appearance: textfield;
}
.step-value::-webkit-outer-spin-button,
.step-value::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
.step-value:focus {
    outline: 1.5px solid #1f6f5c;
    background-color: #ffffff;
}
.remove {
    font-size: 16px;
    color: #b5ad9f;
    cursor: pointer;
    line-height: 1;
}
.remove:hover {
    color: #b42318;
}
.add-sub {
    padding-top: 2px;
    font-size: 12px;
    font-weight: 600;
    color: #1f6f5c;
    cursor: pointer;
    align-self: flex-start;
}
.sub-picker {
    gap: 4px;
    padding-top: 2px;
}
.sub-input {
    height: 32px;
    padding: 0 10px;
    border-radius: 8px;
    border: 1.5px solid #1f6f5c;
    font-size: 13px;
    outline: none;
}
.sub-matches {
    background-color: #ffffff;
    border: 1px solid #e8e2d8;
    border-radius: 8px;
    padding: 4px 0;
}
.sub-match {
    padding: 5px 10px;
    font-size: 13px;
    cursor: pointer;
}
.sub-match:hover, .sub-match.active {
    background-color: #e3efe9;
}
.sub-hint {
    font-size: 11px;
    color: #7a847f;
}
</style>
