<template>
    <div class="workout-panel">
        <!-- Header -->
        <ItemPanelHeader v-show="showHead" 
            :title="title"/>
    </div>
</template>

<script>
import ItemPanelHeader from '../component/ItemPanelHeader.vue';

export default {
    name: 'WorkoutPanel',
    components: { ItemPanelHeader },
    props: {
        
    },
    data: function () {
        return {
            title: "Workout Dashboard",
        }
    },
    created: function() {
        this.workoutStore = useWorkoutStore();
    },
    methods: {
        
    },
}

</script>

<style scoped>

</style>