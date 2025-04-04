<template>
    <div class="workout-active d-flex flex-column overflow-scroll"
         :class="{ 'is-active': isActive }">
        <div class="label d-flex flex-row">
            <img class="icon-button mb-2"
                 src='/icon/previous.png' width="20" height="20"
                 @click.prevent="back"/>
            <span>{{ workout.name }}</span>
        </div>
        <div class="d-flex flex-column">
            <WorkoutSection v-for="section in sections" :key="section.id" :section="section"
                            class="mt-2"/>
        </div>
        <!-- Completion Controls -->
        <div v-if="isActive" class="completion d-flex flex-column justify-content-center position-sticky bottom-0 pb-1">
            <div class="clock d-flex flex-row justify-content-center align-items-center">
                <img class="icon-button me-2"
                        src='/icon/circle-stop.png' width="24" height="24"
                        @click.prevent="stopWorkout"/>
                <div>{{ timeSinceStart }}</div>
            </div>
            <div v-if="completion.isActive" class="form-group pb-2">
                    <!-- Time -->
                    <DateTimeSelector class="date-selector" :class="{ 'invalid': !completion.isValid }"
                                        :dateTime="startAt.value" @onChange="setIterationTime($event, 'start')"/>
                    <DateTimeSelector class="date-selector mt-2" :class="{ 'invalid': !completion.isValid }"
                                        :dateTime="endAt.value" @onChange="setIterationTime($event, 'end')"/>
                    <!-- Create Event -->
                    <div class="d-flex flex-row justify-items-start mt-2">
                        <input type="checkbox" id="create-event" v-model="completion.createEvent" />
                        <label class="ms-1" for="create-event">Create Event</label>
                    </div>
                    <!-- Log Buttom -->
                    <div class="d-flex flex-row mt-2">
                        <button type="button" class="btn btn-primary mb-2" @click="completeWorkout">Log</button>
                        <button type="button" class="btn btn-warning mb-2 ms-2" @click="cancelCompletion">Cancel</button>
                    </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useAppStore } from '@/store/appStore'
import { useWorkoutStore } from '@/store/workoutStore';
import WorkoutSection from './WorkoutSection.vue';
import DateTimeSelector from '../../../controls/select/DateTimeSelector.vue';
import { timeSince } from '../../../../../utility/timeUtility';

export default {
    name: 'WorkoutActive',
    components: { WorkoutSection, DateTimeSelector },
    props: {
        
    },
    data: function () {
        return {
            appStore: null,
            workoutStore: null,
            now: Date.now(),
            settings: {
                isShown: false,
                confimDelete: false
            },
            completion: {
                isActive: false,
                isValid: true,
                createEvent: true
            }
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
        },
        startAt() {
            if (this.workout && this.workout.iteration && this.workout.iteration.startAt) {
                return this.workout.iteration.startAt;
            }
            return undefined;
        },
        endAt() {
            if (this.workout && this.workout.iteration && this.workout.iteration.endAt) {
                return this.workout.iteration.endAt;
            }
            return undefined;
        },
        isActive() {
            if ((this.startAt && !this.endAt) || this.completion.isActive) {
                return true;
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
        timeSinceStart() {
            if (this.isActive && this.startAt) {
                let startAt = new Date(this.startAt);
                return timeSince(startAt, this.now);
            } else {
                return undefined;
            }
        }
    },
    methods: {
        stopWorkout,
        back() {
            this.appStore.onBackWorkoutPanel();
        }
    },
}



function stopWorkout() {
    if (!this.completion.isActive) {
        let sets = this.exercises.value.flatMap(x => x.sets.value).filter(set => set.iteration && set.iteration.completedAt);
        if (sets.length > 0) {
            let lastLoggedTime = new Date(sets[0].iteration.completedAt);
            sets.forEach(set => {
                if (set.iteration && set.iteration.completedAt) {
                    let completedAt = new Date(set.iteration.completedAt);
                    if (+completedAt > +lastLoggedTime) {
                        lastLoggedTime = completedAt;
                    }
                }
            });
            this.endAt.value = lastLoggedTime.toISOString();
        }
        this.validateTimes();
        this.completion.isActive = !this.completion.isActive;
    }
}

</script>

<style scoped>
.workout-active {
    padding-top: 12px;
    padding-bottom: 12px;
}

.workout-active.is-active {
    padding-bottom: 0px;
}

.label {
    font-size: 14px;
    line-height: 20px;
}

.clock {
    min-height: 40px;
}

.date-selector.invalid {
    border: solid 1px red;
}
</style>