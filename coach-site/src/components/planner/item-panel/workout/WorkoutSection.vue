<template>
    <div class="workout-section d-flex flex-column">
        <div class="d-flex flex-row">
            <span class="name">{{ sectionName }}</span>
        </div>
        <div class="d-felx flex-column">
            <ExerciseCard class="exercise-card" v-for="exercise in exercises"
                          :exercise="exercise" 
                          @selectExercise="selectExercise($event)"/>
            <!-- <div class="exercise-card" v-for="exercise in exercises">
                {{ exercise.name }}
            </div> -->
        </div>
    </div>
</template>

<script>
import { useAppStore } from '@/store/appStore'
import { useWorkoutStore } from '@/store/workoutStore';
import ExerciseCard from './ExerciseCard.vue';
import { workoutSectionTypes } from '../../../../model/types';
import { clone } from '../../../../../utility';

export default {
    name: 'WorkoutSection',
    components: { ExerciseCard },
    props: {
        section: Object
    },
    data: function () {
        return {
            appStore: undefined,
            workoutStore: null,
            workoutSectionTypes: clone(workoutSectionTypes),
        }
    },
    created: function() {
        this.appStore = useAppStore();
        this.workoutStore = useWorkoutStore();
    },
    computed: {
        sectionName() {
            let sectionType = this.workoutSectionTypes.find(x => x.id == this.section.id);
            return sectionType.text;
        },
        exercises() {
            let exercises = [];
            if (this.workoutStore) {
                this.section.exercises.forEach(x => {
                    let exercisesModel = this.workoutStore.getExercise(x.id);
                    let exercise = {
                        ...x,
                        ...exercisesModel
                    };
                    exercises.push(exercise);
                })
            }
            return exercises;
        }
    },
    methods: {
        selectExercise(id) {
            this.appStore.selectExercise(id);
        }
    },
}

</script>

<style scoped>
.name {
    padding-left: 12px;
}

</style>