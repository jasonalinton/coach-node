<template>
    <div class="workout-item d-flex flex-row align-items-center position-relative"
         @click="selectWorkout">
            <span class="image flex-shrink-0"></span>
            <div class="d-flex flex-column flex-grow-1">
                <span v-if="!workout.isTemplate" class="name text-start">{{ `${workout.name} - ${workout.points}` }}</span>
                <span v-if="workout.isTemplate" class="name text-start">{{ `${workout.name}` }}</span>
                <div v-if="isActive" class="d-flex flex-row justify-content-between">
                    <span class="time text-start">{{ startAt }}</span>
                    <span class="time text-start">{{ timeSinceStart }}</span>
                </div>
                <span v-if="isComplete" class="time text-start">{{ completedAt }}</span>
            </div>
            <img v-if="!isActive" class="start icon-button me-2 position-absolute end-0"
                 src='/icon/circle-start.png' width="24" height="24"
                 @click.prevent.stop="startWorkout"/>
    </div>
</template>

<script>
import { useAppStore } from '@/store/appStore';
import { useWorkoutStore } from '@/store/workoutStore';
import { timeSince, toShortWeekdayString, toShortTimeString } from '../../../../../utility/timeUtility';

export default {
    name: 'WorkoutItem',
    props: {
        workout: Object
    },
    data: function () {
        return {
            workoutStore: null,   
            appStore: null,   
            now: Date.now()         
        }
    },
    created: function() {
        this.appStore = useAppStore();
        this.workoutStore = useWorkoutStore();
        var _this = this
        setInterval(function () {
            _this.now = Date.now()
        }, 1000);
    },
    computed: {
        isActive() {
            if (this.workout) {
                if (this.workout && this.workout.iteration && 
                    this.workout.iteration.startAt && !this.workout.iteration.endAt) {
                        return true;
                }
            }
            return false;
        },
        isComplete() {
            if (this.workout) {
                if (this.workout && this.workout.iteration && this.workout.iteration.completedAt) {
                        return true;
                }
            }
            return false;
        },
        startAt() {
            if (this.isActive) {
                let startAt = new Date(this.workout.iteration.startAt);
                return toShortWeekdayString(startAt);
            } else {
                return undefined;
            }
        },
        timeSinceStart() {
            if (this.isActive) {
                let startAt = new Date(this.workout.iteration.startAt);
                return timeSince(startAt, this.now);
            } else {
                return undefined;
            }
        },
        completedAt() {
            if (this.isComplete) {
                return `${toShortWeekdayString(this.workout.iteration.startAt)}, ${toShortTimeString(this.workout.iteration.startAt)}`;
            } else {
                return undefined;
            }
        }
    },
    methods: {
        startWorkout,
        selectWorkout,
    },
}

function startWorkout() {
    this.workoutStore.copyAndStartWorkout(this.workout.id, new Date())
        .then((workout) => {
            this.$emit('selectWorkout', { id: workout.id } )
        });
}

function selectWorkout() {
    this.$emit('selectWorkout', { id: this.workout.id } )
}

</script>

<style scoped>
.workout-item {
    background-color: #D8D8D8;
    height: 56px;
    padding: 8px 12px;
    cursor: default;
}

.workout-item:hover {
    padding-right: 32px;
}

.image {
    width: 40px;
    height: 40px;
    background-color: #E25555;
}

.name {
    margin: auto 0 auto 6px;
    font-size: 14px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}

.time {
    margin: auto 0 auto 6px;
    font-size: 12px;
}

.start {
    visibility: hidden;
}

.workout-item:hover .start {
    visibility: visible;
}
</style>