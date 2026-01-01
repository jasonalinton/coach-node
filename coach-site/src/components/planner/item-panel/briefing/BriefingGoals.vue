<template>
    <div class="briefing-goals d-flex flex-column p-2">
        <div v-for="goal in goals" :key="goal.id" class="d-flex flex-column">
            <BriefingGoal :idGoal="goal.id" />
        </div>
    </div>
</template>

<script>
import BriefingGoal from './BriefingGoal.vue';
import { today } from '../../../../../utility/timeUtility';

export default {
    name: 'BriefingGoals',
    components: { BriefingGoal },
    props: {
        idTimeframe: {
            type: Number,
            default: () => 55
        }
    },
    data: function () {
        return {
            goalStore: undefined,
            plannerStore: undefined,
        }
    },
    created: async function() {
        let goalStore = await import(`@/store/goalStore`);
        this.goalStore = goalStore.useGoalStore();

        let plannerStore = await import(`@/store/plannerStore`);
        this.plannerStore = plannerStore.usePlannerStore();
    },
    computed: {
        selectedDate() {
            return (this.plannerStore) ? this.plannerStore.selectedDate : today();
        },
        goals() {
            if (this.goalStore) {
                let goals = this.goalStore.getGoalsInTimeframe(this.idTimeframe, this.selectedDate);
                return goals;
            }
            return [];
        }
    },
    methods: {
        
    },
}

</script>

<style scoped>

</style>