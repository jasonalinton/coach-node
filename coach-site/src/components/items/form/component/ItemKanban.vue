<template>
    <div v-if="goal" class="goal-kanban d-flex flex-column">
        <!-- Title -->
        <div class="title">{{ goal.text }}</div>
        <!-- Toolbar -->
        <div class="toolbar d-flex flex-column">
            <div class="d-flex flex-row justify-content-between align-items-center">
                <div class="d-flex gap-4">
                    <!-- Item Type Picker -->
                    <div class="item-picker d-flex flex-row gap-1">
                        <span v-for="type in ITEMTYPE" :key="type.id"
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
        <div class="goal-kanban-columns d-flex flex-row">
            <!-- <GoalColumn v-for="column in COLUMNS" :key="column.id"
                        :idGoal="idGoal" :idColumn="column.id"
                        :idTimeframe="(column.id == KANBAN_COLUMN.ON_DECK) ? null : idTimeframe"
                        :items="resolvedItems" @update:items="kanbanItems = $event" /> -->
            <GoalColumn :idGoal="idGoal" :idItemType="idItemType" :idColumn="KANBAN_COLUMN.ON_DECK"
                        :idTimeframe="idTimeframe" :items="onDeckItems" @update:items="kanbanItems = $event" />
            <GoalColumn :idGoal="idGoal" :idItemType="idItemType" :idColumn="KANBAN_COLUMN.ON_HOLD"
                        :idTimeframe="idTimeframe" :items="onHoldItems" @update:items="kanbanItems = $event" />
            <GoalColumn :idGoal="idGoal" :idItemType="idItemType" :idColumn="KANBAN_COLUMN.ACTIVE"
                        :idTimeframe="idTimeframe" :items="activeItems" @update:items="kanbanItems = $event" />
            <GoalColumn :idGoal="idGoal" :idItemType="idItemType" :idColumn="KANBAN_COLUMN.COMPLETE"
                        :idTimeframe="idTimeframe" :items="completeItems" @update:items="kanbanItems = $event" />
        </div>
    </div>
</template>

<script>
import GoalColumn from './GoalColumn.vue';
import { KANBAN_COLUMN, ITEMTYPES, TIMEFRAME } from '../../../../model/constants';

const ITEMTYPE = [
    { id: ITEMTYPES.GOAL, label: "Descendants" },
    { id: ITEMTYPES.TODO, label: "Todos" },
    { id: ITEMTYPES.TASK, label: "Iterations" }
];

const TIMEFRAMES = [
    { id: TIMEFRAME.MILESTONE, label: "Milestone" },
    { id: TIMEFRAME.YEAR, label: "Year" },
    { id: TIMEFRAME.MONTH, label: "Month" },
    { id: TIMEFRAME.WEEK, label: "Week" }
];

const COLUMNS = [
    { id: KANBAN_COLUMN.ON_DECK },
    { id: KANBAN_COLUMN.ON_HOLD },
    { id: KANBAN_COLUMN.ACTIVE },
    { id: KANBAN_COLUMN.COMPLETE }
];

const TRACKED_COLUMNS = COLUMNS.map(column => column.id);

export default {
    name: "GoalKanban",
    components: { GoalColumn },
    props: {
        idGoal: { type: Number, required: true }
    },
    data: function() {
        return {
            goalStore: null,
            // kanbanItems: [],
            idTimeframe: null,
            idItemType: ITEMTYPES.GOAL,
            TIMEFRAMES,
            ITEMTYPE,
            COLUMNS,
            KANBAN_COLUMN
        }
    },
    created: async function() {
        let goalStore = await import(`@/store/goalStore`);
        this.goalStore = goalStore.useGoalStore();
    },
    computed: {
        goal() {
            if (this.goalStore) {
                return this.goalStore.getItem(this.idGoal);
            }
            return null;
        },
        kanbanItems() {
            if (this.goal) {
                let items = this.goal.kanbanCards
                    .filter(item => item.idType == this.idItemType);
                return items;
            }
            return [];
        },
        onDeckItems() {
            let items_OnDeck = this.kanbanItems
                .filter(item => item.idColumn == KANBAN_COLUMN.ON_DECK && !item.dateRemoved);
            let items_Other = this.kanbanItems
                .filter(item => !item.dateRemoved);
            let otherIDs = items_Other.map(item => item.idItem);

            let positionDescendant = (items_OnDeck.length > 0) ? Math.max(...items_OnDeck.map(item => item.positionDescendant)) + 1 : 1;
            let placeholders = this.descendantTypeIDs
                .filter(idItem => !otherIDs.includes(idItem))
                .map(idItem => ({
                    idParent: this.idGoal,
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
            if (this.goal) {
                collect(this.goal);
            }
            return ids;
        },
        // A descendant is a child item (recursively) of the root goal being viewed.
        descendantTypeIDs() {
            let ids = [];
            if (this.idItemType == ITEMTYPES.GOAL) {
                ids = this.descendantGoalIDs;
            } else if (this.idItemType == ITEMTYPES.TODO) {
                ids = this.goalStore.getDescendantTodoIDs(this.idGoal);
            } else if (this.idItemType == ITEMTYPES.TASK) {
                ids = this.goalStore.getDescendantIterationIDs(this.idGoal);
            }
            return ids;
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
        },
        // On Deck is a special case: any descendant that isn't currently placed in one of the
        // other three columns is shown there without being queried/persisted, until it's first moved.
        resolvedItems() {
            let map = this.currentByDescendant;
            let onDeckPositions = Object.values(map)
                .filter(item => item.idColumn == KANBAN_COLUMN.ON_DECK && !item.dateRemoved)
                .map(item => item.positionDescendant);
            let nextPosition = (onDeckPositions.length > 0) ? Math.max(...onDeckPositions) + 1 : 1;

            let placeholders = this.descendantGoalIDs
                .filter(idItem => {
                    let existing = map[idItem];
                    return !existing || existing.dateRemoved || !TRACKED_COLUMNS.includes(existing.idColumn);
                })
                .map(idItem => ({
                    idParent: this.idGoal,
                    idItem,
                    idColumn: KANBAN_COLUMN.ON_DECK,
                    idTimeframe: null,
                    positionDescendant: nextPosition++,
                    date: null,
                    dateAdded: new Date(),
                    dateRemoved: null
                }));

            return [...this.kanbanItems, ...placeholders];
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
        }
    }
}
</script>

<style scoped>
.goal-kanban {
    text-align: start;
    gap: 24px;
    padding: 16px;
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

.goal-kanban-columns {
    gap: 20px;
    overflow-x: scroll;
    /* overflow-y: hidden; */
    align-items: stretch;
    height: 100%;
}
</style>
