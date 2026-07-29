<template>
    <div class="goal-column d-flex flex-column flex-grow-1 flex-shrink-1">
        <!-- Column Header -->
        <div class="d-flex flex-row justify-content-between align-items-center header">
            <div class="d-flex flex-row align-items-center gap-2">
                <span class="dot" :style="{ backgroundColor: laneMeta.color }"></span>
                <span class="label">{{ laneMeta.label }}</span>
                <span class="count-pill">{{ laneItems.length }}</span>
            </div>
            <i class="fa-solid fa-ellipsis more-icon"></i>
        </div>
        <!-- Kanban Cards -->
        <div class="cards d-flex flex-column"
             @dragover.prevent="onContainerDragOver"
             @drop="onContainerDrop">
            <div v-for="item in laneItems" :key="item.idDescendant"
                 class="kanban-item"
                 :class="dragPositionFor(item)"
                 draggable="true"
                 @dragstart="onDragStart($event, item)"
                 @dragover="onDragOver($event, item)"
                 @dragleave="onDragLeave(item)"
                 @drop.stop="onDrop($event, item)"
                 @dragend="onDragEnd($event)">
                <GoalKanbanCard :id="item.idDescendant" />
            </div>
        </div>
    </div>
</template>

<script>
import GoalKanbanCard from './GoalKanbanCard.vue';
import { KANBAN_COLUMN } from '../../../../model/constants';

const COLUMN_META = {
    [KANBAN_COLUMN.COMPLETE]: { label: "Complete", color: "#059669" },
    [KANBAN_COLUMN.ACTIVE]: { label: "Active", color: "#3B82F6" },
    [KANBAN_COLUMN.ON_HOLD]: { label: "On Hold", color: "#EA580C" },
    [KANBAN_COLUMN.ON_DECK]: { label: "On Deck", color: "#FBBF24" }
};

export default {
    name: "GoalColumn",
    components: { GoalKanbanCard },
    props: {
        idGoal: { type: Number, required: true },
        idTimeframe: { type: Number, default: null },
        idColumn: { type: Number, required: true },
        items: { type: Array, default: () => [] }
    },
    data: function() {
        return {
            goalStore: null,
            localItems: [],
            dragOverDescendantID: null,
            dragPosition: ""
        }
    },
    created: async function() {
        let goalStore = await import(`@/store/goalStore`);
        this.goalStore = goalStore.useGoalStore();
        this.localItems = [...this.items];
    },
    watch: {
        items(newItems) {
            this.localItems = [...newItems];
        }
    },
    computed: {
        currentByDescendant() {
            let map = {};
            this.localItems.forEach(item => {
                let existing = map[item.idDescendant];
                if (!existing || new Date(item.dateAdded) > new Date(existing.dateAdded)) {
                    map[item.idDescendant] = item;
                }
            });
            return Object.values(map);
        },
        laneItems() {
            return this.currentByDescendant
                .filter(item => item.idColumn == this.idColumn &&
                    !item.dateRemoved &&
                    (this.idTimeframe == null || item.idTimeframe == this.idTimeframe))
                .sort((a, b) => a.positionDescendant - b.positionDescendant);
        },
        laneMeta() {
            return COLUMN_META[this.idColumn] || { label: "", color: "#9CA3AF" };
        }
    },
    methods: {
        dragPositionFor(item) {
            return (this.dragOverDescendantID == item.idDescendant) ? this.dragPosition : "";
        },
        onDragStart(ev, item) {
            ev.target.classList.add("drag");
            ev.dataTransfer.dropEffect = 'move';
            ev.dataTransfer.effectAllowed = 'move';
            this.goalStore.setDraggedKanbanTask(item);
        },
        onDragOver(ev, item) {
            ev.preventDefault();

            let dragged = this.goalStore.getDraggedKanbanTask;
            if (!dragged || dragged.idDescendant == item.idDescendant) {
                this.dragOverDescendantID = null;
                return;
            }

            this.dragOverDescendantID = item.idDescendant;
            let rect = ev.currentTarget.getBoundingClientRect();
            let percent = (ev.clientY - rect.y) / rect.height;
            this.dragPosition = (percent < .50) ? "before" : "after";
        },
        onDragLeave(item) {
            if (this.dragOverDescendantID == item.idDescendant) {
                this.dragOverDescendantID = null;
                this.dragPosition = "";
            }
        },
        onDrop(ev, item) {
            ev.preventDefault();

            let dragged = this.goalStore.getDraggedKanbanTask;
            if (dragged && dragged.idDescendant != item.idDescendant) {
                this.moveItem(dragged, item.idDescendant, this.dragPosition);
            }

            this.dragOverDescendantID = null;
            this.dragPosition = "";
        },
        onContainerDragOver() {
            // Allows dropping into empty space below the last card / into an empty lane
        },
        onContainerDrop() {
            let dragged = this.goalStore.getDraggedKanbanTask;
            if (dragged) {
                this.moveItem(dragged, null, "end");
            }
        },
        onDragEnd(ev) {
            ev.target.classList.remove("drag");
            this.goalStore.clearDraggedKanbanTask();
            this.dragOverDescendantID = null;
            this.dragPosition = "";
        },
        // Resequences the whole target lane around the dragged item rather than nudging a
        // single positionDescendant value. SetKanbanTask only ever inserts new rows (there's
        // no atomic "shift everyone after position N" on the backend), so reassigning every
        // affected row's position in one pass is what keeps positions contiguous. Each row
        // that moves gets a freshly inserted replacement (SetKanbanTask) and its old row is
        // explicitly closed out (RemoveKanbanTask) rather than left dangling.
        moveItem(draggedItem, referenceDescendantID, position) {
            let orderedIDs = this.laneItems
                .map(item => item.idDescendant)
                .filter(idDescendant => idDescendant != draggedItem.idDescendant);

            let insertionIndex = orderedIDs.length;
            if (referenceDescendantID != null) {
                let targetIndex = orderedIDs.indexOf(referenceDescendantID);
                insertionIndex = (position == "before") ? targetIndex : targetIndex + 1;
            }
            orderedIDs.splice(insertionIndex, 0, draggedItem.idDescendant);

            let now = new Date();
            let newRows = [];
            let removedRowIDs = [];

            orderedIDs.forEach((idDescendant, index) => {
                let newPosition = index + 1;
                let sourceItem = (idDescendant == draggedItem.idDescendant)
                    ? draggedItem
                    : this.laneItems.find(item => item.idDescendant == idDescendant);

                let hasMoved = (idDescendant == draggedItem.idDescendant) || (sourceItem.positionDescendant != newPosition);
                if (hasMoved) {
                    newRows.push({
                        ...sourceItem,
                        idColumn: this.idColumn,
                        idTimeframe: this.idTimeframe,
                        positionDescendant: newPosition,
                        dateAdded: now,
                        dateRemoved: null
                    });
                    removedRowIDs.push(sourceItem.id);
                }
            });

            let closeOutRemovedRows = item => removedRowIDs.includes(item.id) ? { ...item, dateRemoved: now } : item;
            this.localItems = this.localItems.map(closeOutRemovedRows).concat(newRows);
            this.$emit('update:items', this.items.map(closeOutRemovedRows).concat(newRows));

            newRows.forEach(row => {
                this.goalStore.setKanbanTask(this.idGoal, row.idDescendant, row.idColumn, row.idTimeframe,
                    row.positionDescendant, row.date, row.dateAdded, row.dateRemoved);
            });
            removedRowIDs.filter(id => id != undefined).forEach(id => {
                this.goalStore.removeKanbanTask(id, now);
            });
        }
    }
}
</script>

<style scoped>
.goal-column {
    min-width: 250px;
    min-height: 100%;
    flex-basis: 0;
    gap: 20px;
    background-color: #F9FAFB;
    padding: 10px;
    border-radius: 10px;
}

.header {
    padding: 0 4px;
}

.dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
}

.label {
    font-size: 16px;
    font-weight: 600;
    color: var(--dark-gray-text);
}

.count-pill {
    font-size: 12px;
    font-weight: 700;
    color: #6366F1;
    background-color: #EEF2FF;
    padding: 2px 8px;
    border-radius: 100px;
    margin-left: 4px;
}

.more-icon {
    color: var(--gray-text);
    cursor: pointer;
    padding: 4px;
}

.cards {
    width: 100%;
    gap: 12px;
    min-height: 100%;
}

.kanban-item {
    width: 100%;
}

.kanban-item.drag {
    opacity: .5;
}

.kanban-item.before {
    box-shadow: 0 -2px 0 0 var(--dark-gray-text);
}

.kanban-item.after {
    box-shadow: 0 2px 0 0 var(--dark-gray-text);
}
</style>
