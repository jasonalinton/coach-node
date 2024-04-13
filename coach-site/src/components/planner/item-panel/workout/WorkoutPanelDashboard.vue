<template>
    <div class="workout-panel-dashboard d-flex flex-column">
        <div class="workout card"
             @click="$emit('selectView', { panel: 'workoutList' } )">
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
            <span>Muscles</span></div>
    </div>
</template>

<script>

export default {
    name: 'WorkoutPanelDashboard',
    components: {  },
    props: {
        
    },
    data: function () {
        return {
            
        }
    },
    created: function() {
       
    },
    methods: {
        
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