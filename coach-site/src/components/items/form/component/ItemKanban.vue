<template>
    <div v-if="item" class="item-kanban d-flex flex-column">
        <!-- Title -->
        <div class="title">{{ item.text }}</div>
        <!-- Toolbar -->
        <div class="toolbar d-flex flex-column">
            <div class="d-flex flex-row justify-content-between align-items-center">
                <div class="d-flex gap-4">
                    <!-- Item Type Picker -->
                    <div class="item-picker d-flex flex-row gap-1">
                        <span v-for="type in itemTypeTabs" :key="type.id"
                              class="tab"
                              :class="{ active: idItemType == type.id }"
                              @click="selectItemType(type.id)">
                            {{ type.label }}
                        </span>
                    </div>
                    <!-- Timeframe Picker -->
                    <div class="timeframe-picker d-flex flex-row gap-1">
                        <span v-for="timeframe in TIMEFRAMES" :key="timeframe.id"
                              class="tab"
                              :class="{ active: idTimeframe == timeframe.id }"
                              @click="selectTimeframe(timeframe.id)">
                            {{ timeframe.label }}
                        </span>
                    </div>
                </div>
                <i class="fa-solid fa-ellipsis more-icon"></i>
            </div>
            <div class="divider"></div>
        </div>
        <!-- Columns -->
        <div class="item-kanban-columns d-flex flex-row">
            <KanbanColumn :idParent="idParent" :idKanbanType="idKanbanType" :idItemType="idItemType" :idColumn="KANBAN_COLUMN.ON_DECK"
                        :idTimeframe="idTimeframe" :items="onDeckItems" @move="applyMove" @update:items="loadKanbanCards" />
            <KanbanColumn :idParent="idParent" :idKanbanType="idKanbanType" :idItemType="idItemType" :idColumn="KANBAN_COLUMN.ON_HOLD"
                        :idTimeframe="idTimeframe" :items="onHoldItems" @move="applyMove" @update:items="loadKanbanCards" />
            <KanbanColumn :idParent="idParent" :idKanbanType="idKanbanType" :idItemType="idItemType" :idColumn="KANBAN_COLUMN.ACTIVE"
                        :idTimeframe="idTimeframe" :items="activeItems" @move="applyMove" @update:items="loadKanbanCards" />
            <KanbanColumn :idParent="idParent" :idKanbanType="idKanbanType" :idItemType="idItemType" :idColumn="KANBAN_COLUMN.COMPLETE"
                        :idTimeframe="idTimeframe" :items="completeItems" @move="applyMove" @update:items="loadKanbanCards" />
        </div>
    </div>
</template>

<script>
import KanbanColumn from './KanbanColumn.vue';
import { KANBAN_COLUMN, ITEMTYPES, TIMEFRAME } from '../../../../model/constants';

const TIMEFRAMES = [
    { id: TIMEFRAME.DAY, label: "Day" },
    { id: TIMEFRAME.WEEK, label: "Week" },
    { id: TIMEFRAME.MONTH, label: "Month" },
    { id: TIMEFRAME.MILESTONE, label: "Milestone" },
    { id: TIMEFRAME.YEAR, label: "Year" }
];

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

export default {
    name: "ItemKanban",
    components: { KanbanColumn },
    props: {
        idParent: { type: Number, required: true },
        idKanbanType: { type: Number, required: true }
    },
    data: function() {
        return {
            ownerStore: null,
            kanbanCards: [],
            idTimeframe: null,
            idItemType: (this.idKanbanType == ITEMTYPES.TODO) ? ITEMTYPES.TODO : ITEMTYPES.GOAL,
            TIMEFRAMES,
            KANBAN_COLUMN
        }
    },
    created: async function() {
        this.ownerStore = await loadOwnerStore(this.idKanbanType);
        await this.loadKanbanCards();
    },
    computed: {
        item() {
            if (this.ownerStore) {
                return this.ownerStore.getItem(this.idParent);
            }
            return null;
        },
        // Metrics don't have a "Descendants" tab (they map directly to Goals instead of
        // recursing through a goal-like tree), and Todos only distinguish Descendants/
        // Iterations since a todo's descendants are other todos, not a separate item type.
        itemTypeTabs() {
            if (this.idKanbanType == ITEMTYPES.METRIC) {
                return [
                    { id: ITEMTYPES.GOAL, label: "Goals" },
                    { id: ITEMTYPES.TODO, label: "Todos" },
                    { id: ITEMTYPES.TASK, label: "Iterations" }
                ];
            } else if (this.idKanbanType == ITEMTYPES.TODO) {
                return [
                    { id: ITEMTYPES.TODO, label: "Descendants" },
                    { id: ITEMTYPES.TASK, label: "Iterations" }
                ];
            }
            return [
                { id: ITEMTYPES.GOAL, label: "Descendants" },
                { id: ITEMTYPES.TODO, label: "Todos" },
                { id: ITEMTYPES.TASK, label: "Iterations" }
            ];
        },
        kanbanItems() {
            return this.kanbanCards.filter(item => item.idType == this.idItemType);
        },
        onDeckItems() {
            let items_OnDeck = this.kanbanItems
                .filter(item => item.idColumn == KANBAN_COLUMN.ON_DECK && !item.dateRemoved);
            // An item already sits in another lane of this view if its current row is open, not On Deck,
            // and (when a timeframe tab is selected) belongs to that timeframe
            let placedIDs = Object.values(this.currentByDescendant)
                .filter(item => !item.dateRemoved && item.idColumn != KANBAN_COLUMN.ON_DECK
                                && (!this.idTimeframe || item.idTimeframe == this.idTimeframe))
                .map(item => item.idItem);
            let onDeckIDs = items_OnDeck.map(item => item.idItem);

            let positionDescendant = (items_OnDeck.length > 0) ? Math.max(...items_OnDeck.map(item => item.positionDescendant)) + 1 : 1;
            let descendantTypeIDs = this.descendantTypeIDs
                .filter(idItem => !placedIDs.includes(idItem) && !onDeckIDs.includes(idItem));
            let placeholders = descendantTypeIDs
                .map(idItem => ({
                    idParent: this.idParent,
                    idItem,
                    idColumn: KANBAN_COLUMN.ON_DECK,
                    idTimeframe: null,
                    positionDescendant: positionDescendant++,
                    date: null,
                    dateAdded: new Date(),
                    dateRemoved: null
                }));
            let items = [...items_OnDeck, ...placeholders];
            return items;
        },
        onHoldItems() {
            let items = this.kanbanItems
                .filter(item => item.idColumn == KANBAN_COLUMN.ON_HOLD && !item.dateRemoved);
            return items;
        },
        activeItems() {
            let items = this.kanbanItems
                .filter(item => item.idColumn == KANBAN_COLUMN.ACTIVE && !item.dateRemoved);
            return items;
        },
        completeItems() {
            let items = this.kanbanItems
                .filter(item => item.idColumn == KANBAN_COLUMN.COMPLETE && !item.dateRemoved);
            return items;
        },
        // A descendant is a child goal (recursively) of the root goal being viewed.
        // Only meaningful when idKanbanType is GOAL - Metric's "Goals" tab uses its
        // direct goalIDs instead, since metrics don't have descendant semantics.
        descendantGoalIDs() {
            let ids = [];
            let collect = (goal) => {
                (goal.children || []).forEach(child => {
                    if (!ids.includes(child.id)) {
                        ids.push(child.id);
                        collect(child);
                    }
                });
            };
            if (this.item) {
                collect(this.item);
            }
            return ids;
        },
        descendantTypeIDs() {
            if (this.idKanbanType == ITEMTYPES.METRIC) {
                if (this.idItemType == ITEMTYPES.GOAL) {
                    return this.item?.goalIDs || [];
                } else if (this.idItemType == ITEMTYPES.TODO) {
                    return this.item?.todoIDs || [];
                } else if (this.idItemType == ITEMTYPES.TASK) {
                    return this.ownerStore.getDescendantIterationIDs(this.idParent);
                }
            } else if (this.idKanbanType == ITEMTYPES.TODO) {
                if (this.idItemType == ITEMTYPES.TODO) {
                    return this.ownerStore.getDescendantIDs(this.idParent);
                } else if (this.idItemType == ITEMTYPES.TASK) {
                    return this.ownerStore.getDescendantIterationIDs(this.idParent);
                }
            } else {
                if (this.idItemType == ITEMTYPES.GOAL) {
                    return this.descendantGoalIDs;
                } else if (this.idItemType == ITEMTYPES.TODO) {
                    return this.ownerStore.getDescendantTodoIDs(this.idParent);
                } else if (this.idItemType == ITEMTYPES.TASK) {
                    return this.ownerStore.getDescendantIterationIDs(this.idParent);
                }
            }
            return [];
        },
        currentByDescendant() {
            let map = {};
            this.kanbanItems.forEach(item => {
                let existing = map[item.idItem];
                if (!existing || new Date(item.dateAdded) > new Date(existing.dateAdded)) {
                    map[item.idItem] = item;
                }
            });
            return map;
        }
    },
    methods: {
        selectTimeframe(id) {
            this.idTimeframe = (this.idTimeframe == id) ? null : id;
        },
        selectItemType(id) {
            if (id != this.idItemType) {
                this.idItemType = id;
            }
        },
        // Optimistically applies a column's move to the shared rows so every lane updates at once -
        // the source column drops the card without waiting for loadKanbanCards. New rows get idType
        // since placeholders (On Deck descendants with no row yet) don't carry one.
        applyMove({ newRows, removedRowIDs, dateRemoved }) {
            let cards = this.kanbanCards.map(item => removedRowIDs.includes(item.id) ? { ...item, dateRemoved } : item);
            this.kanbanCards = cards.concat(newRows.map(row => ({ ...row, idType: this.idItemType })));
        },
        // Re-fetches the full set of kanban rows from the backend rather than merging the
        // partial per-column payload KanbanColumn emits, since that payload only reflects the
        // one lane/column a drag landed in - the backend is the simplest source of truth here.
        async loadKanbanCards() {
            if (this.idKanbanType == ITEMTYPES.METRIC) {
                this.kanbanCards = (await this.ownerStore.getMetricKanban(this.idParent)) || [];
            } else if (this.idKanbanType == ITEMTYPES.TODO) {
                // No backend kanban endpoint exists yet for Todo-owned kanbans.
                this.kanbanCards = [];
            } else {
                this.kanbanCards = (await this.ownerStore.getGoalKanban(this.idParent)) || [];
            }
        }
    }
}
</script>

<style scoped>
.item-kanban {
    text-align: start;
    gap: 24px;
    padding: 16px;
    flex: 1 1 auto;
    min-height: 0;
}

.title {
    font-size: 32px;
    font-weight: 700;
    color: var(--dark-gray-text);
}

.toolbar {
    gap: 0;
}

.timeframe-picker {
    gap: 4px;
}

.tab {
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    color: var(--gray-text);
    cursor: pointer;
}

.tab.active {
    background-color: #EEEEF9;
    color: #6366F1;
    font-weight: 600;
}

.more-icon {
    color: var(--gray-text);
    cursor: pointer;
    padding: 4px;
}

.divider {
    height: 1px;
    background-color: #E0E0E0;
    margin-top: 16px;
}

/* Takes the height left under the title/toolbar; each column scrolls its own cards */
.item-kanban-columns {
    gap: 20px;
    overflow-x: auto;
    overflow-y: hidden;
    align-items: stretch;
    flex: 1 1 auto;
    min-height: 0;
}
</style>
