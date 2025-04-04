<template>
    <div class="workout-section d-flex flex-column">
        <div class="header d-flex flex-row"
             @click="isShown = !isShown">
            <span class="name">{{ sectionName }}</span>
            <img class="icon-button" src="/icon/add-button.png" :width="20" :height="20" 
                @click="addExercise" />
            <img v-if="!isShown" class="caret mt-auto mb-auto me-2" 
                    src='/icon/caret-right.png' width="5" height="8"/>
            <img v-if="isShown" class="caret mt-auto mb-auto me-2" 
                    src='/icon/caret-down.png' width="8" height="5"/>
        </div>
        <div v-if="isShown" class="d-felx flex-column">
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
            addedExercises: [],
            isShown: false
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
        },
        addExercise() {
            this.appStore.onAddExerciseToSection(this.section.id);
        }
    },
}

</script>

<style scoped>
.name {
    padding-left: 12px;
}

.caret {
    visibility: hidden;
}

.header:hover .caret {
    visibility: visible;
}

</style>