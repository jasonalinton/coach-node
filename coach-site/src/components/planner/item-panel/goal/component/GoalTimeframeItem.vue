<template>
    <div v-if="goal">
        <span class="goal">{{ goal.text }}</span>
        <div class="d-flex flex-column">
            <GoalTimeframeTodoItem v-for="gtpt in goalTimePairTodos" :key="gtpt.id"
                                   :todoID="gtpt.todoID" 
                                   :goalTimePairTodoID="gtpt.id"
                                   :completedAt="gtpt.completedAt" />
        </div>
    </div>
</template>

<script>
import GoalTimeframeTodoItem from './GoalTimeframeTodoItem.vue';
import { today } from '../../../../../../utility/timeUtility';

export default {
    name: 'GoalTimeframeItem',
    components: { GoalTimeframeTodoItem },
    props: {
        goalID: Number,
        timeframeID: Number
    },
    data: function () {
        return {
            plannerStore: undefined,
            goalStore: undefined,
        }
    },
    created: async function() {
        let plannerStore = await import(`@/store/plannerStore`);
        this.plannerStore = plannerStore.usePlannerStore();

        let goalStore = await import(`@/store/goalStore`);
        this.goalStore = goalStore.useGoalStore();
    },
    computed: {
        selectedDate() {
            if (this.plannerStore) {
                return this.plannerStore.selectedDate;
            }
            return today();
        },
        goal() {
            if (this.goalStore) {
                let goal = this.goalStore.getItem(this.goalID);
                return goal;
            }
            return undefined;
        },
        goalTimePairTodos() {
            if (this.goal) {
                var index = this.goal.timePairs.findIndex(timePair => {
                    if (timePair.idTimeframe != this.timeframeID) {
                        return false;
                    }

                    let start = (timePair.startTime) ? new Date(timePair.startTime.dateTime) : undefined
                    let end = (timePair.endTime) ? new Date(timePair.endTime.dateTime) : undefined
                    if ((start && +start <= +this.selectedDate) && (end && +end >= +this.selectedDate)) {
                        return true;
                    }
                    return false;
                });
                let timePair = this.goal.timePairs[index];
                return timePair.goalTimePairTodos;
            }
            return [];
        },
    },
    methods: {
        
    },
}

</script>

<style scoped>
.goal {
    padding-left: 20px;
    color: #565656;
}
</style>