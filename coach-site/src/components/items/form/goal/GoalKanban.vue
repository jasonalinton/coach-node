<template>
    <div v-if="goal" class="goal-kanban d-flex flex-column">
        <!-- Title -->
        <div class="title">{{ goal.text }}</div>
        <!-- Toolbar -->
        <div class="toolbar d-flex flex-column">
            <div class="d-flex flex-row justify-content-between align-items-center">
                <div class="timeframe-picker d-flex flex-row">
                    <span v-for="timeframe in TIMEFRAMES" :key="timeframe.id"
                          class="timeframe-tab"
                          :class="{ active: idTimeframe == timeframe.id }"
                          @click="selectTimeframe(timeframe.id)">
                        {{ timeframe.label }}
                    </span>
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
            <GoalColumn :idGoal="idGoal" :idColumn="KANBAN_COLUMN.ON_DECK"
                        :idTimeframe="idTimeframe" :items="onDeckItems" @update:items="kanbanItems = $event" />
            <GoalColumn :idGoal="idGoal" :idColumn="KANBAN_COLUMN.ON_HOLD"
                        :idTimeframe="idTimeframe" :items="onHoldItems" @update:items="kanbanItems = $event" />
            <GoalColumn :idGoal="idGoal" :idColumn="KANBAN_COLUMN.ACTIVE"
                        :idTimeframe="idTimeframe" :items="activeItems" @update:items="kanbanItems = $event" />
            <GoalColumn :idGoal="idGoal" :idColumn="KANBAN_COLUMN.COMPLETE"
                        :idTimeframe="idTimeframe" :items="completeItems" @update:items="kanbanItems = $event" />
        </div>
    </div>
</template>

<script>
import GoalColumn from './GoalColumn.vue';
import { KANBAN_COLUMN, TIMEFRAME } from '../../../../model/constants';

const TIMEFRAMES = [
    { id: TIMEFRAME.WEEK, label: "Week" },
    { id: TIMEFRAME.MONTH, label: "Month" },
    { id: TIMEFRAME.YEAR, label: "Year" },
    { id: TIMEFRAME.MILESTONE, label: "Milestone" }
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
            TIMEFRAMES,
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
                let items = this.goal.kanbanCards;
                return items;
            }
            return [];
        },
        onDeckItems() {
            let items_OnDeck = this.kanbanItems
                .filter(item => item.idColumn == KANBAN_COLUMN.ON_DECK && !item.dateRemoved);
            let items_Other = this.kanbanItems
                .filter(item => !item.dateRemoved);
            let otherIDs = items_Other.map(item => item.idDescendant);

            let positionDescendant = (items_OnDeck.length > 0) ? Math.max(...items_OnDeck.map(item => item.positionDescendant)) + 1 : 1;
            let placeholders = this.descendantGoalIDs
                .filter(idDescendant => !otherIDs.includes(idDescendant))
                .map(idDescendant => ({
                    idParent: this.idGoal,
                    idDescendant,
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
        currentByDescendant() {
            let map = {};
            this.kanbanItems.forEach(item => {
                let existing = map[item.idDescendant];
                if (!existing || new Date(item.dateAdded) > new Date(existing.dateAdded)) {
                    map[item.idDescendant] = item;
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
                .filter(idDescendant => {
                    let existing = map[idDescendant];
                    return !existing || existing.dateRemoved || !TRACKED_COLUMNS.includes(existing.idColumn);
                })
                .map(idDescendant => ({
                    idParent: this.idGoal,
                    idDescendant,
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

.timeframe-tab {
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    color: var(--gray-text);
    cursor: pointer;
}

.timeframe-tab.active {
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
    align-items: stretch;
    height: 100%;
}
</style>
