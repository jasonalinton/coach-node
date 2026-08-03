<template>
    <div class="kanban-column d-flex flex-column flex-grow-1 flex-shrink-1">
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
            <div v-for="item in laneItems" :key="item.idItem"
                 class="kanban-item"
                 :class="dragPositionFor(item)"
                 draggable="true"
                 @dragstart="onDragStart($event, item)"
                 @dragover="onDragOver($event, item)"
                 @dragleave="onDragLeave(item)"
                 @drop.stop="onDrop($event, item)"
                 @dragend="onDragEnd($event)">
                <GoalKanbanCard v-if="idItemType === ITEMTYPES.GOAL" :id="item.idItem" />
                <TodoKanbanCard v-if="idItemType === ITEMTYPES.TODO" :id="item.idItem" />
            </div>
        </div>
    </div>
</template>

<script>
import GoalKanbanCard from './GoalKanbanCard.vue';
import TodoKanbanCard from './TodoKanbanCard.vue';
import { KANBAN_COLUMN, ITEMTYPES } from '../../../../model/constants';

const COLUMN_META = {
    [KANBAN_COLUMN.COMPLETE]: { label: "Complete", color: "#059669" },
    [KANBAN_COLUMN.ACTIVE]: { label: "Active", color: "#3B82F6" },
    [KANBAN_COLUMN.ON_HOLD]: { label: "On Hold", color: "#EA580C" },
    [KANBAN_COLUMN.ON_DECK]: { label: "On Deck", color: "#FBBF24" }
};

async function loadOwnerStore(idKanbanType) {
    if (idKanbanType == ITEMTYPES.METRIC) {
        let metricStore = await import(`@/store/metricStore`);
        return metricStore.useMetricStore();
    } else if (idKanbanType == ITEMTYPES.TODO) {
        let todoStore = await import(`@/store/todoStore`);
        return todoStore.useTodoStore();
    } else {
        let goalStore = await import(`@/store/goalStore`);
        return goalStore.useGoalStore();
    }
}

// The store that owns the *displayed* items (idItemType: Goal/Todo) - separate from
// ownerStore, which owns the kanban rows themselves (idKanbanType) and can differ,
// e.g. a Metric-owned kanban's "Goals" tab is owned by metricStore but displays goals.
async function loadItemTypeStore(idItemType) {
    if (idItemType == ITEMTYPES.TODO) {
        let todoStore = await import(`@/store/todoStore`);
        return todoStore.useTodoStore();
    } else {
        let goalStore = await import(`@/store/goalStore`);
        return goalStore.useGoalStore();
    }
}

export default {
    name: "KanbanColumn",
    components: { GoalKanbanCard, TodoKanbanCard },
    props: {
        idParent: { type: Number, required: true },
        idKanbanType: { type: Number, required: true },
        idItemType: { type: Number, default: ITEMTYPES.GOAL },
        idTimeframe: { type: Number, default: null },
        idColumn: { type: Number, required: true },
        items: { type: Array, default: () => [] }
    },
    data: function() {
        return {
            ITEMTYPES,
            ownerStore: null,
            localItems: [],
            dragOverDescendantID: null,
            dragPosition: ""
        }
    },
    created: async function() {
        this.ownerStore = await loadOwnerStore(this.idKanbanType);
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
                let existing = map[item.idItem];
                if (!existing || new Date(item.dateAdded) > new Date(existing.dateAdded)) {
                    map[item.idItem] = item;
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
            return (this.dragOverDescendantID == item.idItem) ? this.dragPosition : "";
        },
        onDragStart(ev, item) {
            ev.target.classList.add("drag");
            ev.dataTransfer.dropEffect = 'move';
            ev.dataTransfer.effectAllowed = 'move';
            this.ownerStore.setDraggedKanbanTask(item);
        },
        onDragOver(ev, item) {
            ev.preventDefault();

            let dragged = this.ownerStore.getDraggedKanbanTask;
            if (!dragged || dragged.idItem == item.idItem) {
                this.dragOverDescendantID = null;
                return;
            }

            this.dragOverDescendantID = item.idItem;
            let rect = ev.currentTarget.getBoundingClientRect();
            let percent = (ev.clientY - rect.y) / rect.height;
            this.dragPosition = (percent < .50) ? "before" : "after";
        },
        onDragLeave(item) {
            if (this.dragOverDescendantID == item.idItem) {
                this.dragOverDescendantID = null;
                this.dragPosition = "";
            }
        },
        onDrop(ev, item) {
            ev.preventDefault();

            let dragged = this.ownerStore.getDraggedKanbanTask;
            if (dragged && dragged.idItem != item.idItem) {
                this.moveItem(dragged, item.idItem, this.dragPosition);
            }

            this.dragOverDescendantID = null;
            this.dragPosition = "";
        },
        onContainerDragOver() {
            // Allows dropping into empty space below the last card / into an empty lane
        },
        onContainerDrop() {
            let dragged = this.ownerStore.getDraggedKanbanTask;
            if (dragged) {
                this.moveItem(dragged, null, "end");
            }
        },
        onDragEnd(ev) {
            ev.target.classList.remove("drag");
            this.ownerStore.clearDraggedKanbanTask();
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
                .map(item => item.idItem)
                .filter(idItem => idItem != draggedItem.idItem);

            let insertionIndex = orderedIDs.length;
            if (referenceDescendantID != null) {
                let targetIndex = orderedIDs.indexOf(referenceDescendantID);
                insertionIndex = (position == "before") ? targetIndex : targetIndex + 1;
            }
            orderedIDs.splice(insertionIndex, 0, draggedItem.idItem);

            let now = new Date();
            let newRows = [];
            let removedRowIDs = [];

            orderedIDs.forEach((idItem, index) => {
                let newPosition = index + 1;
                let sourceItem = (idItem == draggedItem.idItem)
                    ? draggedItem
                    : this.laneItems.find(item => item.idItem == idItem);

                let hasMoved = (idItem == draggedItem.idItem) || (sourceItem.positionDescendant != newPosition);
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
                if (this.idItemType == ITEMTYPES.GOAL) {
                    this.ownerStore.setKanbanTask(row.idParent, row.idItem, null, null, row.idColumn, row.idTimeframe,
                        row.positionDescendant, row.date, row.dateAdded, row.dateRemoved);
                } else if (this.idItemType == ITEMTYPES.TODO) {
                    this.ownerStore.setKanbanTask(row.idParent, null, row.idItem, null, row.idColumn, row.idTimeframe,
                        row.positionDescendant, row.date, row.dateAdded, row.dateRemoved);
                }else if (this.idItemType == ITEMTYPES.TASK) {
                    this.ownerStore.setKanbanTask(row.idParent, null, null, row.idItem, row.idColumn, row.idTimeframe,
                        row.positionDescendant, row.date, row.dateAdded, row.dateRemoved);
                }
            });
            removedRowIDs.filter(id => id != undefined).forEach(id => {
                this.ownerStore.removeKanbanTask(id, now);
            });
        }
    }
}
</script>

<style scoped>
.kanban-column {
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
