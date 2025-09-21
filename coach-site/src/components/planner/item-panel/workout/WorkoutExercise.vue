<template>
    <div class="workout-exercise d-flex flex-column flex-grow-1 overflow-scroll">
        <div class="label d-flex flex-row pt-2 pb-2 sticky-top">
            <img class="icon-button"
                 src='/icon/previous.png' width="20" height="20"
                 @click.prevent="back"/>
            <span>{{ name }}</span>
        </div>
        <!-- Demo -->
        <div class="media position-relative">

            <div class="toolbar d-flex flex-row position-absolute bottom-0 end-0 mb-2 me-2">
                <!-- <span>{{ restSeconds }}</span> -->
                <img class="history-button"
                     src='/icon/exercise-history.svg' width="24" height="24"
                     @click.prevent="showHistory"/>
            </div>
        </div>
        <!-- Sets -->
        <div class="exercise-sets d-flex flex-column ms-auto me-auto mt-3">
            <ExerciseSet v-for="(set, index) in sets" :key="set.id" 
                         :set="set" :isActive="set.id == activeSetID" 
                         :setNumber="index + 1" :idExercise="this.exercise.id"
                         @removeActiveSet="activeSetID = undefined"
                         @click="activeSetID = set.id" />
            <div class="d-flex flex-row mt-1">
                <!-- <img class="icon-button ms-1" src="/icon/add-button.png" :width="24" :height="24" 
                     @click="addSet" />
                <span>Add Set</span> -->
                <button class="btn btn-sm ms-4 mb-3" type="button"
                        @click="addSet" >
                    Add Set
                </button>
            </div>
        </div>
        <!-- Rest Timer -->
        <div v-if="restRemaining" class="rest-timer d-flex flex-row position-sticky bottom-0">
            <img src='/icon/goal-icon.png' width="40" height="40" />
            <div>{{ restRemaining }}</div>
            <img src='/icon/goal-icon.png' width="40" height="40" />
        </div>
        <!-- Log Buttons -->
        <div v-if="!restRemaining" class="d-flex flex-row mt-auto ps-2 pe-2 position-sticky bottom-0">
            <button type="button" class="btn btn-warning mb-2 flex-grow-1" @click="logSet">Log Set</button>
            <button type="button" class="btn btn-primary mb-2 ms-2" @click="logAllSets">Log All Sets</button>
        </div>
    </div>
</template>

<script>
import { useAppStore } from '@/store/appStore'
import { useWorkoutStore } from '@/store/workoutStore';
import ExerciseSet from './ExerciseSet.vue';
import { clone } from '../../../../../utility';
import { timeSince } from '../../../../../utility/timeUtility';

export default {
    name: '',
    components: { ExerciseSet },
    props: {
        
    },
    data: function () {
        return {
            appStore: undefined,
            workoutStore: undefined,
            activeSetID: undefined,
            restRemaining: undefined,
            restIntervalID: undefined
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
        name() {
            return (this.exercise) ? this.exercise.name : "Loading..."
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
        restSeconds() {
            if (this.workoutExercise) {
                return this.workoutExercise.restSeconds;
            }
            return undefined;
        },
        // restRemaining() {
        //     if (this.restStart) {
        //         return timeSince(this.restStart, this.now);
        //     } else {
        //         return undefined;
        //     }
        // }
    },
    methods: {
        back() {
            this.appStore.onBackWorkoutPanel();
        },
        setActiveSet,
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
        showHistory() {
            let variationIDs = [];
            this.appStore.selectExerciseHistory(this.exercise.id, variationIDs);
        },
        logSet() {
            //TODO: Can only unlog last logged set
            let index = this.sets.findIndex(x => x.id == this.activeSetID);

            if (this.restSeconds) {
                this.restRemaining = this.restSeconds;
                var _this = this
                this.restIntervalID = setInterval(function () {
                    _this.restRemaining--;
                }, 1000);
            }

            let set = this.sets[index];
            let completedAt = (set.iteration) ? undefined : new Date();
            this.workoutStore.logSet(set.id, completedAt);
            this.activeSetID = undefined;
        },
        logAllSets() {
            this.workoutStore.logAllSets(this.workoutExercise.idWorkoutExercise);
            this.activeSetID = undefined;
        },
    },
    watch: {
        restRemaining(value) {
            if (value != undefined && value == 0) {
                clearInterval(this.restIntervalID);
                this.restIntervalID = undefined;
                this.restRemaining = undefined;
            }
        },
        sets(value) {
            if (value.length > 0) {
                this.setActiveSet();
            }
        }
    }
}

function setActiveSet() {
    if (this.activeSetID) {
        return;
    }

    let activeSetID = undefined;
    this.sets.forEach(set => {
        if (!set.iteration && !activeSetID) {
            activeSetID = set.id
        }
    });
    this.activeSetID = activeSetID;
}

</script>

<style scoped>
.label {
    background-color: var(--background-color);
}

.icon-button {
    margin-top: 2px;
}

.media {
    min-height: 300px;
    background-color: beige;
}

.history-button {
    
}

.btn {
    font-weight: 600;
}

.rest-timer {
    height: 200px;
}
</style>