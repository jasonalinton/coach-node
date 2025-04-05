<template>
    <div class="workout-exercise d-flex flex-column flex-grow-1 overflow-scroll pt-2">
        <div class="label d-flex flex-row mb-2">
            <img class="icon-button mb-2"
                 src='/icon/previous.png' width="20" height="20"
                 @click.prevent="back"/>
            <span>{{ name }}</span>
        </div>
        <div class="media">

        </div>
        <div class="exercise-sets d-flex flex-column ms-auto me-auto mt-3">
            <ExerciseSet v-for="(set, index) in sets" :key="set.id" 
                         :set="set" :isActive="set.id == activeSetID" 
                         :setNumber="index + 1" :idExercise="this.exercise.id"
                         @click="activeSetID = set.id" />
            <div class="d-flex flex-row mt-1">
                <img class="icon-button ms-1" src="/icon/add-button.png" :width="24" :height="24" 
                     @click="addSet" />
                <span>Add Set</span>
        </div>
        </div>
        <!-- Log Buttons -->
        <div class="d-flex flex-row mt-auto ps-2 pe-2">
            <button type="button" class="btn btn-primary mb-2" @click="logAllSets">Log All Sets</button>
            <button type="button" class="btn btn-warning mb-2 ms-2 flex-grow-1" @click="logSet">Log Set</button>
        </div>
    </div>
</template>

<script>
import { useAppStore } from '@/store/appStore'
import { useWorkoutStore } from '@/store/workoutStore';
import ExerciseSet from './ExerciseSet.vue';
import { clone } from '../../../../../utility';

export default {
    name: '',
    components: { ExerciseSet },
    props: {
        
    },
    data: function () {
        return {
            appStore: undefined,
            workoutStore: undefined,
            activeSetID: undefined
        }
    },
    created: function() {
        this.appStore = useAppStore();
        this.workoutStore = useWorkoutStore();
    },
    computed: {
        id() {
            return (this.appStore) ? this.appStore.itemPanel.workout.selectedExerciseID : undefined;
        },
        idWorkout() {
            return (this.appStore) ? this.appStore.itemPanel.workout.selectedWorkoutID : undefined;
        },
        exercise() {
            if (this.workoutExercise) {
                let exercise = this.workoutStore.getExercise(this.workoutExercise.idExercise);
                return {
                    ...this.workoutExercise,
                    ...exercise
                };
            }
            return undefined;
        },
        workoutExercise() {
            if (this.workoutStore && this.id) {
                let workoutExercise = this.workoutStore.getWorkoutExercise(this.id, this.idWorkout);
                return workoutExercise;
            }
            return undefined;
        },
        sets() {
            if (this.workoutExercise) {
                let sets = this.workoutExercise.sets.map(set => {
                    return {
                        idWorkoutExercise: this.workoutExercise.idWorkoutExercise,
                        ...set
                    }
                });
                return sets;
            }
            return [];
        },
        name() {
            return (this.exercise) ? this.exercise.name : "Loading..."
        },
    },
    methods: {
        back() {
            this.appStore.onBackWorkoutPanel();
        },
        addSet() {
            let setIDs = this.sets.map(s => s.id).sort((a, b) => a - b);
            let nextID = (setIDs.length == 0 || setIDs[0] - 1 > -1) ? -1 : setIDs[0] - 1;
            if (this.sets.length > 0) {
                let lastSet = this.sets.at(-1);
                let newSet = clone(lastSet);
                newSet.iteration = null;
                newSet.id = nextID;

                this.workoutStore.saveSet(newSet);
            } else {
                let newSet = {
                    id: nextID,
                    idWorkoutExercise: this.workoutExercise.idWorkoutExercise
                };
                this.workoutStore.saveSet(newSet);
            }
        },
        logSet() {
            //TODO: Can only unlog last logged set
            let set = this.sets.find(x => x.id == this.activeSetID);
            let completedAt = (set.iteration) ? undefined : new Date();
            this.workoutStore.logSet(set.id, completedAt);
        },
        logAllSets() {
            this.workoutStore.logAllSets(this.workoutExercise.idWorkoutExercise);
        },
    },
}

</script>

<style scoped>
.media {
    min-height: 300px;
    background-color: beige;
}

.btn {
    font-weight: 600;
}
</style>