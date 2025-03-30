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
            <div v-for="(set, index) in sets" :key="set.id"
                 class="exercise-set d-flex flex-row flex-grow-1" style="gap:10px">
                <span>{{ index }}</span>
                <div class="reps d-flex flex-column align-items-center">
                    <input class="prop form-control form-control-sm me-1" type="number" min="0" ref="repsInput"
                           v-model="set.reps"
                           :style="{'width': inputWidth(set.reps)}"
                           @keyup.enter.esc="doneEditing"
                           @blur="saveSet(set)"/>
                    <span class="text">REPS</span>
                </div>
                <div class="time d-flex flex-column align-items-center">
                    <input class="prop form-control form-control-sm me-1" type="number" min="0" ref="timeInput"
                           v-model="set.timeSeconds"
                           :style="{'width': inputWidth(set.timeSeconds)}" 
                           @keyup.enter.esc="doneEditing"
                           @blur="blur"/>
                    <span class="text">TIME</span>
                </div>
                <div class="hold d-flex flex-column align-items-center">
                    <input class="prop form-control form-control-sm me-1" type="number" min="0" ref="holdInput"
                           v-model="set.holdSeconds"
                           :style="{'width': inputWidth(set.holdSeconds)}" 
                           @keyup.enter.esc="doneEditing"
                           @blur="blur"/>
                    <span class="text">HOLD</span>
                </div>
                <div class="weight d-flex flex-column align-items-center">
                    <input class="prop form-control form-control-sm me-1" type="number" min="0" ref="weightInput"
                           v-model="set.weight"
                           :style="{'width': inputWidth(set.weight)}" 
                           @keyup.enter.esc="doneEditing"
                           @blur="blur"/>
                    <span class="text">LBS</span>
                </div>
                <div class="rest d-flex flex-column align-items-center">
                    <input class="prop form-control form-control-sm me-1" type="number" min="0" ref="restInput"
                           v-model="set.restSeconds"
                           :style="{'width': inputWidth(set.restSeconds)}" 
                           @keyup.enter.esc="doneEditing"
                           @blur="blur"/>
                    <span class="text">REST</span>
                </div>
            </div>
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
import { clone } from '../../../../../utility';

export default {
    name: '',
    components: {  },
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
            return (this.appStore) ? this.appStore.itemPanel.workout.selectedExerciseID : undefined;
        },
        idWorkout() {
            return (this.appStore) ? this.appStore.itemPanel.workout.selectedWorkoutID : undefined;
        },
        exercise() {
            if (this.workoutStore && this.id) {
                let workoutExercise = this.workoutStore.getWorkoutExercise(this.id, this.idWorkout);
                let exercise = this.workoutStore.getExercise(this.id);
                return {
                    ...workoutExercise,
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
        inputWidth(prop) {
            if (prop < 10) {
                return "27px";
            } else if (prop < 100){
                return "37px";
            } else {
                return "45px";
            }
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
            }
        },
        saveSet(set) {

        }
    },
}

</script>

<style scoped>
.media {
    min-height: 300px;
    background-color: beige;
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}

.btn {
    font-weight: 600;
}
</style>