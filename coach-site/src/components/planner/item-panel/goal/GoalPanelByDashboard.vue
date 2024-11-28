<template>
    <div class="goal-panel-dashboard d-flex flex-column">
        <div class="main card"
             @click="$emit('selectView', { panel: 'main' } )">
            <span>Main</span>
        </div>
        <div class="d-flex flex-column">
            <div v-for="mainGoal in mainGoals" :key="mainGoal.id" 
                 class="goal text-start">{{  mainGoal.text }}</div>
        </div>
        <div class="skill card"
             @click="$emit('selectView', { panel: 'skill' } )">
            <span>Skills</span>
        </div>
        <div class="d-flex flex-column">
            <div v-for="skillGoal in skillGoals" :key="skillGoal.id" 
                 class="goal text-start">{{  skillGoal.text }}</div>
        </div>
        <div class="metrics card"
             @click="$emit('selectView', { panel: 'metrics' } )">
            <span>Metrics</span>
        </div>
    </div>
</template>

<script>
import { today } from '../../../../../utility/timeUtility';

export default {
    name: 'GoalPanelByDefault',
    components: {  },
    props: {
        
    },
    data: function () {
        return {
            plannerStore: undefined,
            goalStore: null,
            mainGoalIDs: [ 48, 211, 182, 232, 6 ],
            skillGoalIDs: [ 211, 6, 233, 234 ],
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
            return today;
        },
        mainGoals() {
            let goals = [];
            if (this.goalStore) {
                this.mainGoalIDs.forEach(id => {
                    let goal = this.goalStore.getItem(id);
                    goals.push(goal);
                })
            }
            return goals;
        },
        skillGoals() {
            if (this.goalStore) {
                let goals = this.goalStore.getItems();
                goals = goals.filter(x => this.skillGoalIDs.includes(x.id));
                return goals;
            }
            return [];
        },
    },
    methods: {
        
    },
}

</script>

<style scoped>
.goal-panel-dashboard {
    padding: 8px;
}
.goal-panel-dashboard  .card {
    width: 255px;
    height: 50px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 8px;
}
.goal-panel-dashboard  .card span {
    margin: auto;
}

.goal {
    width: 255px;
    margin-left: auto;
    margin-right: auto;
}
</style>