<template>
    <div class="workout-panel-dashboard d-flex flex-column">
        <div class="workout card"
             @click="selectView('workoutList', { panel: 'workoutList' })">
            <span>Workouts</span>
        </div>
        <div class="exercise card"
             @click="$emit('selectView', { panel: 'exerciseList' } )">
            <span>Exercises</span>
        </div>
        <div class="skill card">
            <span>Skills</span>
        </div>
        <div class="muscle card">
            <span>Muscles</span>
        </div>
    </div>
</template>

<script>
import { useAppStore } from '@/store/appStore'

export default {
    name: 'WorkoutPanelDashboard',
    components: {  },
    props: {
        
    },
    data: function () {
        return {
            appStore: undefined
        }
    },
    created: function() {
        this.appStore = useAppStore();
    },
    methods: {
        selectView(view, data) {
            this.appStore.selectWorkoutView(view);
            this.$emit('selectView', data );
        }
    },
}

</script>

<style scoped>
.workout-panel-dashboard {
    padding: 8px;
}
.workout-panel-dashboard  .card {
    width: 255px;
    height: 100px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 8px;
}
.workout-panel-dashboard  .card span {
    margin: auto;
}
</style>