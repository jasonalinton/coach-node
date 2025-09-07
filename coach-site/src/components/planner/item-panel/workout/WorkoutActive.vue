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
        <!-- Settings -->
        <div class="settings">
            <span class="text-start cursor-default"
                @click="settings.isShown = !settings.isShown">Settings</span>
            <div v-if="settings.isShown" class="d-flex flex-column mt-2">
                <!-- Time -->
                <div class="d-flex flex-column">
                    <DateTimeSelector class="date-selector" :class="{ 'invalid': !completion.isValid }"
                                        :dateTime="startAt" @onChange="setIterationTime($event, 'start')"/>
                    <DateTimeSelector class="date-selector mt-2" :class="{ 'invalid': !completion.isValid }"
                                        :dateTime="endAt" @onChange="setIterationTime($event, 'end')"/>
                </div>
                <!-- Is Template -->
                <div class="d-flex flex-row justify-items-start mt-2">
                    <input type="checkbox" id="is-template" v-model="workout.isTemplate" />
                    <label class="ms-1" for="is-template">Is Template</label>
                </div>
                <!-- Save -->
                <button type="button" class="btn btn-primary mt-2 mb-2" @click="saveSettings()">Save</button>
                <!-- Delete -->
                <button v-if="!settings.confimDelete" type="button" class="btn btn-danger mb-2" @click="settings.confimDelete = true">Delete</button>
                <!-- Delete Confirmation -->
                <div v-if="settings.confimDelete" class="d-flex flex-row mb-2 align-items-center">
                    <span>Are you sure?</span>
                    <button type="button" class="btn btn-warning ms-2" @click="settings.confimDelete = false">Cancel</button>
                    <button type="button" class="btn btn-danger ms-2" @click="deleteWorkout">Delete</button>
                </div>
            </div>
        </div>
        <!-- Completion Controls -->
        <div v-if="isActive" class="completion d-flex flex-column justify-content-center position-sticky bottom-0 ps-2 pe-2 pb-1">
            <QuickLogExercise />
            <div class="clock d-flex flex-row justify-content-center align-items-center">
                <img class="icon-button me-2"
                        src='/icon/circle-stop.png' width="24" height="24"
                        @click.prevent="stopWorkout"/>
                <div>{{ timeSinceStart }}</div>
            </div>
            <div v-if="completion.isActive" class="form-group">
                    <!-- Time -->
                    <DateTimeSelector class="date-selector" :class="{ 'invalid': !completion.isValid }"
                                        :dateTime="startAt" @onChange="setIterationTime($event, 'start')"/>
                    <DateTimeSelector class="date-selector mt-2" :class="{ 'invalid': !completion.isValid }"
                                        :dateTime="endAt" @onChange="setIterationTime($event, 'end')"/>
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
import QuickLogExercise from './QuickLogExercise.vue';

export default {
    name: 'WorkoutActive',
    components: { WorkoutSection, DateTimeSelector, QuickLogExercise },
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
            },
            startAt: undefined,
            endAt: undefined
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
        cancelCompletion,
        completeWorkout,
        setIterationTime,
        validateTimes,
        deleteWorkout,
        saveSettings,
        back() {
            this.appStore.onBackWorkoutPanel();
        }
    },
    watch: {
        workout() {
            if (this.workout.iteration) {
                if (this.workout.iteration.startAt) {
                    this.startAt = this.workout.iteration.startAt;
                }
                if (this.workout.iteration.endAt) {
                    this.endAt = this.workout.iteration.endAt;
                }
            }
        },
        id(value) {
            let exercise = this.workoutStore.getActiveExercise(value);
            this.appStore.setActiveExercise(exercise.idWorkoutExercise);

        }
    }
}



function stopWorkout() {
    if (!this.completion.isActive) {
        let sets = this.sections
            .flatMap(x => x.exercises).flatMap(x => x.sets)
            .filter(set => set.iteration && set.iteration.completedAt);
            
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
            this.endAt = lastLoggedTime.toJSON();
        }
        this.validateTimes();
        this.completion.isActive = !this.completion.isActive;
    }
}

function cancelCompletion() {
    this.endAt = undefined;
    this.completion.isActive = false;
}

function completeWorkout() {
    if (this.completion.isValid) {
        this.workoutStore.completeWorkout(this.workout.id, this.startAt, this.endAt, this.completion.createEvent)
        .then(() => {
            this.completion.isActive = false;
            this.back();
        });
    }
}

function setIterationTime(value, endpoint) {
    if (value) {
        if (endpoint == "start") {
            this.startAt = value;
        } else if (endpoint == "end") {
            this.endAt = value;
        }
        this.validateTimes();
    }
}

function validateTimes() {
    let iteration = this.workout.iteration || undefined;
    if (iteration) {
        if (this.startAt && this.endAt) {
            if (+new Date(this.startAt) > +new Date(this.endAt)) {
                this.completion.isValid = false;
            } else if (+new Date(this.startAt) <= +new Date(this.endAt)) {
                this.completion.isValid = true;
            }
        } else if (!this.endAt) {
            this.completion.isValid = false;
        } else {
            this.completion.isValid = true;
        }
    }
}

function deleteWorkout() {
    let model = { 
        id: this.id,
        isDeleted: true,
    };

    this.workoutStore.saveWorkout(model);
    this.appStore.onDoneWorkout();
    this.back();
}

function saveSettings() {
    let model = { 
        id: this.id,
        isUpdated: true,
        startAt: {
            isUpdated: true,
            value: this.startAt
        },
        endAt: {
            isUpdated: true,
            value: this.endAt
        },
        isTemplate: {
            isUpdated: true,
            value: this.workout.isTemplate
        },
     };
     
     this.workoutStore.saveWorkout(model);
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

.completion {
    background-color: white;
}

.clock {
    min-height: 40px;
}

.date-selector.invalid {
    border: solid 1px red;
}

.settings-header {
    padding-left: 12px;
}

.settings {
    padding: 0 12px;
}
</style>