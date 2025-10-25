<template>
    <div class="fitness-goals d-flex flex-column p-3">
        <div class="label d-flex flex-row mb-2">
            <img class="icon-button"
                 src='/icon/previous.png' width="20" height="20"
                 @click.prevent="back"/>
            <span>Fitness Goals</span>
        </div>
        <div v-for="goal in goals" :key="goal.id" 
             class="fitness-goal d-flex flex-column mb-2">
             <span class="goal-title text-start">{{ goal.text }}</span>
            <div v-for="timePairTodo in getTimePairTodos(goal)" :key="timePairTodo.todoID"
                 class="fitness-goal-todo d-flex flex-column">
                <FitnessGoalTodo :timePairTodo="timePairTodo" />
            </div>
        </div>
    </div>
</template>

<script>
import FitnessGoalTodo from './FitnessGoalTodo.vue';

export default {
    name: 'FitnessGoals',
    components: { FitnessGoalTodo },
    props: {
        
    },
    data: function () {
        return {
            appStore: undefined,
            plannerStore: undefined,
            goalStore: undefined,
        }
    },
    created: async function() {
        let appStore = await import(`@/store/appStore`);
        this.appStore = appStore.useAppStore();

        let plannerStore = await import(`@/store/plannerStore`);
        this.plannerStore = plannerStore.usePlannerStore();
    
        let goalStore = await import(`@/store/goalStore`);
        this.goalStore = goalStore.useGoalStore();
    },
    computed: {
        selectedDate() {
            return (this.plannerStore) ? this.plannerStore.selectedDate : today();
        },
        goals() {
            if (this.goalStore) {
                let goals = this.goalStore.getFitnessGoals();
                goals = goals.filter(this.isGoalActive);
                return goals;
            }
        }
    },
    methods: {
        isGoalActive,
        isTimePairActive,
        getTimePairTodos,
        back() {
            this.appStore.onBackWorkoutPanel();
        }
    },
}

function isGoalActive(goal) {
    let isActive = goal.timePairs.some(this.isTimePairActive);
    return isActive;
}

function isTimePairActive(timepair) {
    let isTimePairActive = false;
    if (timepair.startTime && (+timepair.startTime.dateTime.toDate() <= +this.selectedDate)) {
        isTimePairActive = true
    }
    if (timepair.endTime && (+timepair.endTime.dateTime.toDate() < +this.selectedDate)) {
        isTimePairActive = false;
    }
    return isTimePairActive;
}

function getTimePairTodos(goal) {
    let timePairs = goal.timePairs.flatMap(timePair => {
        let isActive = this.isTimePairActive(timePair);
        return (isActive) ? timePair.goalTimePairTodos : [];
    });
    return timePairs;
}

</script>

<style scoped>
.fitness-goal {
    /* border: 1px #979797 solid; */
    /* padding: 4px; */
}

.goal-title {
    color: var(--dark-gray-text);
    font-weight: 600;
}
</style>