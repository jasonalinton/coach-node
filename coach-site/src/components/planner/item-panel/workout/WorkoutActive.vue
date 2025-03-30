<template>
    <div class="workout-active d-flex flex-column overflow-scroll">
        <div class="label d-flex flex-row mb-2">
            <img class="icon-button mb-2"
                 src='/icon/previous.png' width="20" height="20"
                 @click.prevent="back"/>
            <span>{{ workout.name }}</span>
        </div>
        <div class="d-flex flex-column">
            <WorkoutSection v-for="section in sections" :key="section.id" :section="section"/>
        </div>
    </div>
</template>

<script>
import { useAppStore } from '@/store/appStore'
import { useWorkoutStore } from '@/store/workoutStore';
import WorkoutSection from './WorkoutSection.vue';

export default {
    name: 'WorkoutActive',
    components: { WorkoutSection },
    props: {
        
    },
    data: function () {
        return {
            appStore: null,
            workoutStore: null,
        }
    },
    created: function() {
        this.appStore = useAppStore();
        this.workoutStore = useWorkoutStore();
    },
    computed: {
        id() {
            return (this.appStore) ? this.appStore.itemPanel.workout.selectedWorkoutID : undefined;
        },
        workout() {
            if (this.workoutStore && this.id) {
                let workout = this.workoutStore.getWorkout(this.id);
                return workout;
            }
            return undefined;
        },
        name() {
            return (this.workout) ? this.workout.name : "Loading..."
        },
        sections() {
            if (this.workout) {
                return this.workout.sections;
            }
            return [];
        }
    },
    methods: {
        back() {
            this.appStore.onBackWorkoutPanel();
        }
    },
}

</script>

<style scoped>
.workout-active {
    padding-top: 12px;
    padding-bottom: 12px;
}

.label {
    font-size: 14px;
}
</style>