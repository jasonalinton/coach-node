<template>
    <div class="priority-goal-section d-flex flex-column">
        <div class="section-header d-flex justify-content-between align-items-center">
            <span class="title">{{ title }}</span>
            <span class="fraction">{{ fraction }}</span>
        </div>
        <div class="divider"></div>
        <PriorityGoalCard tagLabel="PRIMARY" tagClass="tag-primary"
                           :rows="kanbanRows.PRIMARY" :timeframeID="timeframeID" :selectedDate="selectedDate" />
        <PriorityGoalCard tagLabel="SECONDARY" tagClass="tag-secondary"
                           :rows="kanbanRows.SECONDARY" :timeframeID="timeframeID" :selectedDate="selectedDate" />
        <PriorityGoalCard tagLabel="TERTIARY" tagClass="tag-tertiary"
                           :rows="kanbanRows.TERTIARY" :timeframeID="timeframeID" :selectedDate="selectedDate" />
    </div>
</template>

<script>
import PriorityGoalCard, { resolveCardTree, computeNodePoints } from './PriorityGoalCard.vue';
import { getTimeframeEndpoints } from '../../../../../../utility/timeUtility';

export default {
    name: 'PriorityGoalSection',
    components: { PriorityGoalCard },
    props: {
        timeframeID: { type: Number, required: true },
        title: { type: String, required: true },
        kanbanRows: { type: Object, required: true },
        selectedDate: { type: Date, required: true }
    },
    data: function() {
        return {
            goalStore: null,
            todoStore: null,
            iterationStore: null
        }
    },
    created: async function() {
        let goalStore = await import(`@/store/goalStore`);
        this.goalStore = goalStore.useGoalStore();

        let todoStore = await import(`@/store/todoStore`);
        this.todoStore = todoStore.useTodoStore();

        let iterationStore = await import(`@/store/iterationStore`);
        this.iterationStore = iterationStore.useIterationStore();
    },
    computed: {
        fraction() {
            if (!this.goalStore || !this.todoStore || !this.iterationStore) {
                return "0/0";
            }

            let { start, end } = getTimeframeEndpoints(this.timeframeID, this.selectedDate);
            let potential = 0;
            let completed = 0;

            ['PRIMARY', 'SECONDARY', 'TERTIARY'].forEach(key => {
                let tree = resolveCardTree(this.kanbanRows[key], this.timeframeID, this.goalStore, this.todoStore);
                tree.forEach(node => {
                    let resolved = computeNodePoints(node, this.iterationStore, this.goalStore, start, end);
                    potential += resolved.potentialPoints;
                    completed += resolved.completedPoints;
                });
            });

            return `${completed}/${potential}`;
        }
    }
}
</script>

<style scoped>
.priority-goal-section {
    gap: 16px;
    width: 100%;
}
.section-header {
    width: 100%;
}
.title {
    font-size: 16px;
    font-weight: 700;
    color: #111827;
}
.fraction {
    font-size: 14px;
    font-weight: 600;
    color: #4b5563;
}
.divider {
    height: 1px;
    background-color: #e5e7eb;
    width: 100%;
}
</style>
