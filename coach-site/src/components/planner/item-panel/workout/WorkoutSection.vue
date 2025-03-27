<template>
    <div class="workout-section d-flex flex-column">
        <div class="d-flex flex-row">
            <span class="name">{{ sectionName }}</span>
        </div>
        <div class="d-felx flex-column">
            <ExerciseCard class="exercise-card" v-for="exercise in exercises"
                          :exercise="exercise" />
            <!-- <div class="exercise-card" v-for="exercise in exercises">
                {{ exercise.name }}
            </div> -->
        </div>
    </div>
</template>

<script>
import ExerciseCard from './ExerciseCard.vue';
import { useWorkoutStore } from '../../../../store/workoutStore';
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
            workoutStore: null,
            workoutSectionTypes: clone(workoutSectionTypes),
        }
    },
    created: function() {
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
                // let exercisesModels = this.workoutStore.exercises;
                // exercises = exercises.filter(x => this.sec)
            }
            return exercises;
        }
    },
    methods: {
        // getExercise(exercise) {
        //     exercise = clone(exercise);
        //     if (this.workoutStore) {
        //         let exerciseModel = this.workoutStore.getExercise(exercise.id);
        //         exercise = {
        //             ...exercise,
        //             ...exerciseModel
        //         }
        //     }
        // }
    },
}

</script>

<style scoped>
.name {
    padding-left: 12px;
}

</style>