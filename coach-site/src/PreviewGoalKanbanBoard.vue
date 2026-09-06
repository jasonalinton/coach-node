<template>
    <div class="preview-board p-4">
        <h3>Goal Kanban Preview (temporary — not part of the app)</h3>
        <div class="d-flex flex-row gap-2 align-items-center mb-4">
            <label>idGoal:</label>
            <input type="number" v-model.number="idGoal" class="form-control" style="width: 100px;" />
            <button class="btn btn-sm btn-secondary" @click="reloadKey++">Reload</button>
        </div>
        <GoalKanban :key="reloadKey" :idGoal="idGoal" />
    </div>
</template>

<script>
import GoalKanban from './components/items/form/goal/GoalKanban.vue';

export default {
    name: "PreviewGoalKanbanBoard",
    components: { GoalKanban },
    data: function() {
        return {
            idGoal: 1,
            reloadKey: 0
        }
    },
    created: async function() {
        let goalStoreModule = await import(`@/store/goalStore`);
        let todoStoreModule = await import(`@/store/todoStore`);
        let metricStoreModule = await import(`@/store/metricStore`);
        let routineStoreModule = await import(`@/store/routineStore`);
        let iterationStoreModule = await import(`@/store/iterationStore`);

        let goalStore = goalStoreModule.useGoalStore();
        let todoStore = todoStoreModule.useTodoStore();
        let metricStore = metricStoreModule.useMetricStore();
        let routineStore = routineStoreModule.useRoutineStore();
        let iterationStore = iterationStoreModule.useIterationStore();

        iterationStore.initialize();
        let metricPromise = metricStore.initialize();
        let goalPromise = goalStore.initialize();
        let todoPromise = todoStore.initialize();
        let routinePromise = routineStore.initialize();

        await Promise.all([metricPromise, goalPromise, todoPromise, routinePromise]);
        metricStore.initializeItems();
        goalStore.initializeItems();
        todoStore.initializeItems();
        routineStore.initializeItems();
    }
}
</script>
