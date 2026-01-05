<template>
    <div v-if="goal" class="goal-daily-timeframe-item">
        <div class="goal" @click="showTodos = !showTodos">{{ goal.text }}</div>
        <div v-if="showTodos" class="d-flex flex-column">
            <span v-for="iteration in iterations" :key="iteration.id" class="iteration">{{ iteration.text }}</span>
        </div>
    </div>
</template>

<script>

export default {
    name: 'GoalDailyTimeframeItem',
    components: {  },
    props: {
        goalID: Number,
        iterationIDs: Array
    },
    data: function () {
        return {
            goalStore: undefined,
            // todoStore: undefined,
            iterationStore: undefined,
            showTodos: false
        }
    },
    created: async function() {
        let goalStore = await import(`@/store/goalStore`);
        this.goalStore = goalStore.useGoalStore();

        // let todoStore = await import(`@/store/todoStore`);
        // this.todoStore = todoStore.useTodoStore();

        let iterationStore = await import(`@/store/iterationStore`);
        this.iterationStore = iterationStore.useIterationStore();
    },
    computed: {
        goal() {
            if (this.goalStore) {
                let goal = this.goalStore.getItem(this.goalID);
                return goal;
            }
            return undefined;
        },
        iterations() {
            if (this.iterationStore) {
                let iterations = this.iterationStore.iterations.filter(x => this.iterationIDs.includes(x.id));
                return iterations;
            }
            return [];
        }
    },
    methods: {
        
    },
}

</script>

<style scoped>
.goal {
    padding-left: 20px;
    color: #565656;
    cursor: default;
}

.iteration {
    padding-left: 35px;
    color: var(--gray-text);
}
</style>