<template>
    <div class="preview-board p-4">
        <h3>Goal Column Preview (temporary — not part of the app)</h3>
        <div class="d-flex flex-row gap-2 align-items-center mb-4">
            <label>idGoal:</label>
            <input type="number" v-model.number="idGoal" class="form-control" style="width: 100px;" />
            <button class="btn btn-sm btn-secondary" @click="load">Reload</button>
            <span v-if="loading">Loading...</span>
            <span id="debug-row-count">Total rows: {{ kanbanItems.length }}</span>
        </div>
        <div class="d-flex flex-row gap-4" style="overflow-x: auto;">
            <GoalColumn v-for="lane in lanes" :key="lane.id"
                :idGoal="idGoal" :idColumn="lane.id"
                :items="kanbanItems" @update:items="kanbanItems = $event" />
        </div>
    </div>
</template>

<script>
import GoalColumn from './components/items/form/goal/GoalColumn.vue';
import { KANBAN_COLUMN } from './model/constants';

export default {
    name: "PreviewGoalColumnBoard",
    components: { GoalColumn },
    data: function() {
        return {
            goalStore: null,
            idGoal: 1,
            kanbanItems: [],
            loading: false,
            lanes: [
                { id: KANBAN_COLUMN.COMPLETE },
                { id: KANBAN_COLUMN.ACTIVE },
                { id: KANBAN_COLUMN.ON_HOLD },
                { id: KANBAN_COLUMN.ON_DECK }
            ]
        }
    },
    created: async function() {
        let goalStoreModule = await import(`@/store/goalStore`);
        let todoStoreModule = await import(`@/store/todoStore`);
        let metricStoreModule = await import(`@/store/metricStore`);
        let routineStoreModule = await import(`@/store/routineStore`);
        let iterationStoreModule = await import(`@/store/iterationStore`);

        this.goalStore = goalStoreModule.useGoalStore();
        let todoStore = todoStoreModule.useTodoStore();
        let metricStore = metricStoreModule.useMetricStore();
        let routineStore = routineStoreModule.useRoutineStore();
        let iterationStore = iterationStoreModule.useIterationStore();

        iterationStore.initialize();
        let metricPromise = metricStore.initialize();
        let goalPromise = this.goalStore.initialize();
        let todoPromise = todoStore.initialize();
        let routinePromise = routineStore.initialize();

        await Promise.all([metricPromise, goalPromise, todoPromise, routinePromise]);
        metricStore.initializeItems();
        this.goalStore.initializeItems();
        todoStore.initializeItems();
        routineStore.initializeItems();

        await this.load();
    },
    methods: {
        async load() {
            this.loading = true;
            this.kanbanItems = (await this.goalStore.getGoalKanban(this.idGoal)) || [];
            this.loading = false;
        }
    }
}
</script>
