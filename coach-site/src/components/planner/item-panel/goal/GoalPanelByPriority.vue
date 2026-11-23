<template>
    <div class="goal-panel-priority">
        <div class="priority-plan d-flex flex-column">
            <!-- Header -->
            <div class="plan-header d-flex align-items-center">
                <div class="d-flex flex-column flex-grow-1">
                    <span class="plan-title">{{ (idTimeframe == TIMEFRAME.DAY) ? 'Today' : 'This week' }}</span>
                    <span class="plan-subtitle">{{ dateLabel }} · {{ totals.completed }} of {{ totals.potential }} pts</span>
                </div>
                <div class="timeframe-toggle d-flex">
                    <span v-for="timeframe in timeframes" :key="timeframe.id"
                          class="toggle-option" :class="{ on: idTimeframe == timeframe.id }"
                          @click="idTimeframe = timeframe.id">{{ timeframe.label }}</span>
                </div>
                <button class="plan-btn" :class="{ on: isPlanning }" type="button"
                        @click="isPlanning = !isPlanning">{{ isPlanning ? 'Done' : 'Plan' }}</button>
            </div>
            <!-- Add search -->
            <PriorityGoalSearch v-if="isPlanning" :lanes="lanes" :placements="placements"
                                @add="addGoal" @create="createGoal" />
            <!-- Lanes -->
            <PriorityLane v-for="lane in lanes" :key="lane.key"
                          :lane="lane" :nodes="nodesByLane[lane.key]" :isPlanning="isPlanning"
                          :dragged="dragged"
                          @drag-start="node => dragged = { node, fromKey: lane.key }"
                          @drag-end="dragged = null"
                          @drop-node="beforeItemID => moveGoal(lane.key, beforeItemID)"
                          @points="setPoints"
                          @remove="node => removeGoal(lane.key, node)"
                          @add-sub="(parent, payload) => addSubGoal(lane.key, parent, payload)" />
        </div>
    </div>
</template>

<script>
import PriorityLane from './component/PriorityLane.vue';
import PriorityGoalSearch from './component/PriorityGoalSearch.vue';
import { resolveCardTree, computeNodePoints } from './component/priorityGoalTree';
import { PRIORITY_GOAL, TIMEFRAME, KANBAN_TO_REPEAT_TIMEFRAME } from '../../../../model/constants';
import { today, getTimeframeEndpoints } from '../../../../../utility/timeUtility';

const LANES = [
    { key: 'PRIMARY', n: 1, label: 'Primary', color: '#1f6f5c' },
    { key: 'SECONDARY', n: 2, label: 'Secondary', color: '#5b8c7e' },
    { key: 'TERTIARY', n: 3, label: 'Tertiary', color: '#a9c4bb' }
];

export default {
    name: 'GoalPanelByPriority',
    components: { PriorityLane, PriorityGoalSearch },
    data: function () {
        return {
            plannerStore: undefined,
            goalStore: null,
            todoStore: null,
            iterationStore: null,
            TIMEFRAME,
            timeframes: [{ id: TIMEFRAME.DAY, label: 'Day' }, { id: TIMEFRAME.WEEK, label: 'Week' }],
            idTimeframe: TIMEFRAME.DAY,
            isPlanning: false,
            dragged: null,
            kanbanRows: { PRIMARY: [], SECONDARY: [], TERTIARY: [] }
        }
    },
    created: async function() {
        let plannerStore = await import(`@/store/plannerStore`);
        this.plannerStore = plannerStore.usePlannerStore();

        let goalStore = await import(`@/store/goalStore`);
        this.goalStore = goalStore.useGoalStore();

        let todoStore = await import(`@/store/todoStore`);
        this.todoStore = todoStore.useTodoStore();

        let iterationStore = await import(`@/store/iterationStore`);
        this.iterationStore = iterationStore.useIterationStore();

        this.loadIterationsInRange();
        await this.loadKanbanRows();
    },
    watch: {
        idTimeframe() {
            this.loadIterationsInRange();
        },
        selectedDate() {
            this.loadIterationsInRange();
        }
    },
    computed: {
        selectedDate() {
            if (this.plannerStore) {
                return this.plannerStore.selectedDate;
            }
            return today(new Date());
        },
        dateRange() {
            return getTimeframeEndpoints(this.idTimeframe, this.selectedDate);
        },
        lanes() {
            return LANES.map(lane => ({ ...lane, idPriority: PRIORITY_GOAL[lane.key] }));
        },
        // Each lane's goal tree with points worked out for the selected day/week
        nodesByLane() {
            let result = { PRIMARY: [], SECONDARY: [], TERTIARY: [] };
            if (!this.goalStore || !this.todoStore || !this.iterationStore) {
                return result;
            }
            let { start, end } = this.dateRange;
            LANES.forEach(({ key }) => {
                result[key] = resolveCardTree(this.kanbanRows[key], this.idTimeframe, this.goalStore, this.todoStore)
                    .map(node => computeNodePoints(node, this.iterationStore, this.goalStore, start, end, this.idTimeframe));
            });
            return result;
        },
        totals() {
            let potential = 0;
            let completed = 0;
            Object.values(this.nodesByLane).flat().forEach(node => {
                potential += node.potentialPoints;
                completed += node.completedPoints;
            });
            return { potential, completed };
        },
        dateLabel() {
            let { start, end } = this.dateRange;
            let format = (date, options) => new Date(date).toLocaleDateString(undefined, options);
            if (this.idTimeframe == TIMEFRAME.DAY) {
                return format(start, { weekday: 'short', month: 'short', day: 'numeric' });
            }
            return `${format(start, { month: 'short', day: 'numeric' })} – ${format(end, { month: 'short', day: 'numeric' })}`;
        },
        // Where each goal currently sits (newest open row per priority), for the search results
        placements() {
            let placements = {};
            LANES.forEach(({ key, label }) => {
                let latest = {};
                this.kanbanRows[key].forEach(row => {
                    if (!latest[row.idItem] || new Date(row.dateAdded) > new Date(latest[row.idItem].dateAdded)) {
                        latest[row.idItem] = row;
                    }
                });
                Object.values(latest)
                    .filter(row => !row.dateRemoved && [TIMEFRAME.DAY, TIMEFRAME.WEEK].includes(row.idTimeframe))
                    .forEach(row => {
                        placements[row.idItem] = `${label} · ${(row.idTimeframe == TIMEFRAME.DAY) ? 'Day' : 'Week'}`;
                    });
            });
            return placements;
        }
    },
    methods: {
        async loadKanbanRows() {
            for (let { key } of LANES) {
                this.kanbanRows[key] = (await this.goalStore.getGoalKanban(PRIORITY_GOAL[key])) || [];
            }
        },
        // Make sure every iteration in the selected day/week is loaded, not just the days viewed so far
        loadIterationsInRange() {
            if (!this.iterationStore) {
                return;
            }
            let { start, end } = this.dateRange;
            this.iterationStore.getIterationsInRange(start, end);
        },
        async addGoal(goalID, laneKey) {
            await this.goalStore.addPriorityGoals(PRIORITY_GOAL[laneKey], this.idTimeframe, [goalID], this.kanbanRows[laneKey]);
            await this.loadKanbanRows();
        },
        async createGoal(text, laneKey) {
            await this.goalStore.createPriorityGoal(PRIORITY_GOAL[laneKey], this.idTimeframe, this.kanbanRows[laneKey], text);
            await this.loadKanbanRows();
        },
        async moveGoal(toKey, beforeItemID) {
            if (!this.dragged) return;
            let { node, fromKey } = this.dragged;
            this.dragged = null;
            if (beforeItemID == node.item.id) return;
            await this.goalStore.movePriorityGoal(node, PRIORITY_GOAL[fromKey], PRIORITY_GOAL[toKey], this.idTimeframe,
                this.kanbanRows[fromKey], this.kanbanRows[toKey], beforeItemID);
            await this.loadKanbanRows();
        },
        async removeGoal(laneKey, node) {
            await this.goalStore.removePriorityGoal(node, this.kanbanRows[laneKey]);
            await this.loadKanbanRows();
        },
        // The updated repeat comes back through the socket, which refreshes the points
        setPoints(goal, points) {
            this.goalStore.setPriorityGoalPoints(goal, KANBAN_TO_REPEAT_TIMEFRAME[this.idTimeframe], points);
        },
        async addSubGoal(laneKey, parent, payload) {
            await this.goalStore.addPrioritySubGoal(parent.id, PRIORITY_GOAL[laneKey], this.idTimeframe, this.kanbanRows[laneKey], payload);
            await this.loadKanbanRows();
        }
    }
}
</script>

<style scoped>
.goal-panel-priority {
    padding: 12px 12px 16px 12px;
}
.priority-plan {
    background-color: #faf7f2;
    border-radius: 16px;
    padding: 20px;
    gap: 18px;
    font-family: 'DM Sans', system-ui, sans-serif;
    color: #1c2b27;
    text-align: start;
}
.plan-header {
    gap: 10px;
}
.plan-title {
    font-family: 'Fraunces', Georgia, serif;
    font-size: 24px;
    font-weight: 600;
    line-height: 1.15;
}
.plan-subtitle {
    font-size: 12px;
    font-weight: 500;
    color: #7a847f;
}
.timeframe-toggle {
    background-color: #efe9df;
    border-radius: 8px;
    padding: 2px;
}
.toggle-option {
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    color: #7a847f;
    cursor: pointer;
    user-select: none;
}
.toggle-option.on {
    background-color: #ffffff;
    color: #1c2b27;
    font-weight: 600;
}
.plan-btn {
    padding: 6px 12px;
    border-radius: 8px;
    border: 1px solid #e8e2d8;
    background-color: transparent;
    font-size: 12px;
    font-weight: 600;
    color: #1f6f5c;
}
.plan-btn.on {
    background-color: #1f6f5c;
    border-color: #1f6f5c;
    color: #ffffff;
}
</style>
