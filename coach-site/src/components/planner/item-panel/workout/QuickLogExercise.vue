<template>
    <div class="quick-log-exercise">
        <div v-if="activeSet" class="d-flex flex-column">
            <span class="exercise-name">{{ `${activeExercise.exercise.name}` }}</span>
            <span class="variation-text" v-if="variationString">{{ variationString }}</span>
            <div class="values d-flex flex-row">
                <span v-if="reps">{{ `${reps} REPS` }}</span>
                <span v-if="time">{{ `${time} SECS` }}</span>
                <span v-if="hold">{{ `${hold} SECS` }}</span>
                <span v-if="weight">{{ `${weight} SECS` }}</span>
            </div>
            <!-- Buttons -->
            <div class="d-flex flex-row justify-content-between">
                <div class="d-flex flex-row">
                    <!-- <img src="/icon/angle-left.png" width="48" height="48"/> -->
                    <img src="/icon/previous.png" width="48" height="48"/>
                    <img src="/icon/next.png" width="48" height="48"/>
                    <!-- <img src="/icon/angle-right.png" width="48" height="48"/> -->
                </div>
                <div class="d-flex flex-row">
                    <img :class="{ 'is-logged': isLogged }" src="/icon/check-double.png" width="48" height="48"
                         @click="logAllSets"/>
                    <img :class="{ 'is-logged': isLogged }" src="/icon/check.png" width="48" height="48"
                         @click="logSet"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useAppStore } from '@/store/appStore';
import { useWorkoutStore } from '@/store/workoutStore';
import { listToString } from '../../../../../utility';

export default {
    name: 'QuickLogExercise',
    components: {  },
    props: {

    },
    data: function () {
        return {
            appStore: undefined,
            workoutStore: undefined,
            activeSetID: undefined,
            isLogged: false
        }
    },
    created: function() {
        this.appStore = useAppStore();
        this.workoutStore = useWorkoutStore();
    },
    computed: {
        idWorkout() {
            return (this.appStore) ? this.appStore.itemPanel.workout.selectedWorkoutID : undefined;
        },
        idActiveExercise() {
            return (this.appStore) ? this.appStore.itemPanel.workout.activeExerciseID : undefined;
        },
        activeExercise() {
            if (this.idActiveExercise) {
                let workoutExercise = this.workoutStore.getWorkoutExercise(this.idActiveExercise, this.idWorkout);
                return workoutExercise;
            }
            return undefined;
        },
        sets() {
            if (this.activeExercise) {
                return this.activeExercise.sets;
            }
            return [];
        },
        activeSet() {
            if (this.activeSetID) {
                let index = this.sets.findIndex(x => x.id == this.activeSetID);
                let set = this.sets[index];
                return set;
            }
            return undefined;
        },
        variationString() {
            if (this.activeSet.variations.length > 0) {
                return listToString(this.activeSet.variations, 'name');
            } else {
                return undefined;
            }
        },
        reps() {
            if (this.activeSet && this.activeSet.reps) {
                return this.activeSet.reps;
            }
        },
        time() {
            if (this.activeSet && this.activeSet.timeSeconds) {
                return this.activeSet.timeSeconds;
            }
        },
        hold() {
            if (this.activeSet && this.activeSet.holdSeconds) {
                return this.activeSet.holdSeconds;
            }
        },
        weight() {
            if (this.activeSet && this.activeSet.weight) {
                return this.activeSet.weight;
            }
        }
    },
    methods: {
        logSet() {
            if (this.activeSet) {
                this.isLogged = true;
                let completedAt = (this.activeSet.iteration) ? undefined : new Date();
                this.workoutStore.logSet(this.activeSet.id, completedAt);
            }
        },
        logAllSets() {
            this.isLogged = true;
            this.workoutStore.logAllSets(this.activeExercise.idWorkoutExercise);
        },
        // selectPreviousSet() {
        //     let id = this.workoutStore.getPreviousSetID(this.activeSet.id);
        //     this.appStore.setActiveSet(id);
        // },
        // selectNextSet() {
            
        // },
        // selectPreviousExercise() {

        // },
        // selectNextExercise() {

        // }
    },
    watch: {
        sets() {
            let set = undefined;
            for (let i = 0; i < this.sets.length; i++) {
                if (this.sets[i].iteration == undefined) {
                    this.activeSetID = this.sets[i].id;
                    break;
                } else if (i == this.sets.length-1) {
                    let exercise = this.workoutStore.getNextWorkoutExercise(this.idWorkout, this.activeExercise.id);
                    if (exercise) {
                        this.appStore.setActiveExercise(exercise.idWorkoutExercise);
                    }
                }
            }
        },
        activeExercise() {
            this.isLogged = false;
        }
    }
}

</script>

<style scoped>
.quick-log-exercise {
    background-color: #292929;
}

span {
    text-align: start;
}
/* /*  */
.exercise-name {
    font-size: 20px;
    line-height: 24px;
    color: rgba(255, 255, 255, 0.87);
} 

.variation-text {
    font-size: 14px;
    line-height: 16px;
    color: rgba(255, 255, 255, 0.60);
} 

.values {
    font-size: 14px;
    line-height: 16px;
    color: rgba(255, 255, 255, 0.87);
}

img.is-logged {
    background-color: white;
}
</style>