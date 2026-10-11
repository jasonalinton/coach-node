<template>
    <div class="goal-panel-priority d-flex flex-column">
        <PriorityGoalSection :timeframeID="TIMEFRAME.DAY" title="Daily Goals"
                              :kanbanRows="kanbanRows" :selectedDate="selectedDate" />
        <PriorityGoalSection :timeframeID="TIMEFRAME.WEEK" title="Weekly Goals"
                              :kanbanRows="kanbanRows" :selectedDate="selectedDate" />
    </div>
</template>

<script>
import PriorityGoalSection from './component/PriorityGoalSection.vue';
import { PRIORITY_GOAL, TIMEFRAME } from '../../../../model/constants';
import { today } from '../../../../../utility/timeUtility';

export default {
    name: 'GoalPanelByPriority',
    components: { PriorityGoalSection },
    data: function () {
        return {
            plannerStore: undefined,
            goalStore: null,
            PRIORITY_GOAL,
            TIMEFRAME,
            kanbanRows: { PRIMARY: [], SECONDARY: [], TERTIARY: [] }
        }
    },
    created: async function() {
        let plannerStore = await import(`@/store/plannerStore`);
        this.plannerStore = plannerStore.usePlannerStore();

        let goalStore = await import(`@/store/goalStore`);
        this.goalStore = goalStore.useGoalStore();

        await this.loadKanbanRows();
    },
    computed: {
        selectedDate() {
            if (this.plannerStore) {
                return this.plannerStore.selectedDate;
            }
            return today(new Date());
        }
    },
    methods: {
        async loadKanbanRows() {
            for (let key of ['PRIMARY', 'SECONDARY', 'TERTIARY']) {
                this.kanbanRows[key] = (await this.goalStore.getGoalKanban(this.PRIORITY_GOAL[key])) || [];
            }
        }
    }
}
</script>

<style scoped>
.goal-panel-priority {
    padding: 24px 20px 32px 20px;
    gap: 24px;
}
</style>
