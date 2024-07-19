<template>
    <div class="d-flex flex-column flex-grow-1">
        <div class="workout-view d-flex flex-column flex-grow-1 justify-content-between" 
             :class="{ hide: selectedPanel != 'form', 'is-active': isActive }">
             <div class="d-flex flex-column">
                <div class="top d-flex flex-column sticky-top">
                    <div class="label d-flex flex-row mb-2">
                        <img class="icon-button mb-2"
                                src='/icon/previous.png' width="20" height="20"
                                @click.prevent="$emit('back')"/>
                        <span>Exercises</span>
                        <img class="icon-button" src="/icon/add-button.png" :width="20" :height="20" 
                            @click="selectExercises" />
                    </div>
                    <input id="name" class="textbox mb-2" type="text" ref="text"  placeholder="Workout Name"
                            v-model.lazy.trim="name.value" 
                            spellcheck/>
                    <button type="button" class="btn btn-primary mb-2" @click="save()">Save</button>
                 </div>
                 <div class="d-flex flex-column">
                     <ExerciseItem class="mb-2" v-for="exercise in exercises.value" :key="exercise.id"
                                   :exercise="exercise"
                                   :isActive="isActive"
                                   :isComplete="isComplete"
                                   @addDefaultSet="addDefaultSet"
                                   @addSet="addSet"
                                   @deleteSet="deleteSet"
                                   @addVariation="addVariation($event)"
                                   @removeVariation="removeVariation($event)"
                                   @repositionExercise="repositionExercise"/>
                 </div>
                 <!-- Settings -->
                 <span class="text-start"
                       @click="settings.isShown = !settings.isShown">Settings</span>
                 <div v-if="settings.isShown" class="d-flex flex-column">
                    <!-- Time -->
                    <div class="d-flex flex-column">
                        <DateTimeSelector class="date-selector" :class="{ 'invalid': !completion.isValid }"
                                          :dateTime="startAt.value" @onChange="setIterationTime($event, 'start')"/>
                        <DateTimeSelector class="date-selector mt-2" :class="{ 'invalid': !completion.isValid }"
                                          :dateTime="endAt.value" @onChange="setIterationTime($event, 'end')"/>
                    </div>
                    <!-- Is Template -->
                     <div class="d-flex flex-row justify-items-start mt-2">
                         <input type="checkbox" id="is-template" v-model="isTemplate.value" />
                         <label class="ms-1" for="is-template">Is Template</label>
                     </div>
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
        <ExerciseList v-if="selectedPanel == 'exerciseList'"
                      :isSelector="true"
                      :selectedIDs="exerciseIDs"
                      @setExercises="setExercises"
                      @setPanelHeader="$emit('setPanelHeader', $event)"
                      @back="selectedPanel = 'form'"/>
    </div>
</template>

<script>
import DateTimeSelector from '../../../controls/select/DateTimeSelector.vue'
import { useWorkoutStore } from '../../../../store/workoutStore';
import { clone, removeItemByID } from '../../../../../utility';
import { timeSince } from '../../../../../utility/timeUtility';
import ExerciseItem from './ExerciseItem.vue';
import ExerciseList from './ExerciseList.vue';

export default {
    name: 'WorkoutForm',
    components: { ExerciseItem, ExerciseList, DateTimeSelector },
    props: {
        id: {
            type: Number,
            default: -1
        }
    },
    data: function () {
        return {
            workoutStore: null,
            selectedPanel: "form",
            now: Date.now(),
            startAt: {
                value: undefined,
                oldValue: undefined,
                isUpdated: false
            },
            endAt: {
                value: undefined,
                oldValue: undefined,
                isUpdated: false
            },
            name: {
                value: undefined,
                oldValue: undefined,
                isUpdated: false
            },
            description: {
                value: undefined,
                oldValue: undefined,
                isUpdated: false
            },
            isTemplate: {
                value: undefined,
                oldValue: undefined,
                isUpdated: false
            },
            exercises: {
                value: [],
                oldValue: [],
            },
            default: {
                reps: null,
                restSeconds: 120,
                weight: null,
                holdSeconds: null,
                timeSeconds: null
            },
            settings: {
                isShown: false,
                confimDelete: false
            },
            completion: {
                isActive: false,
                isValid: true,
                createEvent: true
            }
        };
    },
    created: function() {
        this.workoutStore = useWorkoutStore();
        var _this = this
        setInterval(function () {
            _this.now = Date.now()
        }, 1000);
    },
    computed: {
        workout() {
            if (this.workoutStore) {
                if (this.id > 0) {
                    let workout = this.workoutStore.getWorkout(this.id);
                    return clone(workout);
                } else {
                    this.setProps();
                }
            }
            return undefined;
        },
        isActive() {
            if ((this.startAt.value && !this.endAt.value) || this.completion.isActive) {
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
        exerciseIDs() {
            return this.exercises.value.map(e => e.exercise.id)
        },
        timeSinceStart() {
            if (this.isActive && this.startAt.value) {
                let startAt = new Date(this.startAt.value);
                return timeSince(startAt, this.now);
            } else {
                return undefined;
            }
        }
    },
    methods: {
        setProps,
        selectExercises,
        setExercises,
        addDefaultSet,
        addSet,
        deleteSet,
        addVariation,
        removeVariation,
        stopWorkout,
        cancelCompletion,
        completeWorkout,
        setIterationTime,
        validateTimes,
        deleteWorkout,
        repositionExercise,
        save,
    },
    watch: {
        workout() {
            this.setProps();
        },
    }
}

function setProps() {
    if (this.id > 0) {
        if (this.workout) {
            this.name.value = this.workout.name;
            this.name.oldValue = this.workout.name;
            this.name.isUpdated = false;
            
            this.description.value = this.workout.description;
            this.description.oldValue = this.workout.description;
            this.description.isUpdated = false;
            
            this.isTemplate.value = this.workout.isTemplate;
            this.isTemplate.oldValue = this.workout.isTemplate;
            this.isTemplate.isUpdated = false;
            
            let exercises = [];
            this.workout.exercises.forEach(e => {
                exercises.push({ 
                    exercise: clone(e.exercise), 
                    position: e.position,
                    sets: {
                        value: clone(e.sets),
                        oldValue: clone(e.sets)
                    }
                });
            });
            
            this.exercises.value = exercises;
            this.exercises.oldValue = clone(exercises);

            if (this.workout.iteration) {
                if (this.workout.iteration.startAt) {
                    this.startAt.value = this.workout.iteration.startAt;
                    this.startAt.oldValue = this.workout.iteration.startAt;
                    this.startAt.isUpdated = false;
                }
                if (this.workout.iteration.endAt) {
                    this.endAt.value = this.workout.iteration.endAt;
                    this.endAt.oldValue = this.workout.iteration.endAt;
                    this.endAt.isUpdated = false;
                }
            }
        }
    } else {
        this.name.value = undefined;
        this.name.oldValue = undefined;
        this.name.isUpdated = false;

        this.description.value = undefined;
        this.description.oldValue = undefined;
        this.description.isUpdated = false;

        this.isTemplate.value = true;
        this.isTemplate.oldValue = undefined;
        this.isTemplate.isUpdated = false;

        this.exercises.value = [];
        this.exercises.oldValue = [];

        this.startAt.value = undefined;
        this.startAt.oldValue = undefined;
        this.startAt.isUpdated = false;
        this.endAt.value = undefined;
        this.endAt.oldValue = undefined;
        this.endAt.isUpdated = false;

        this.workout = {
            id: -1,
            name: undefined,
            description: undefined,
            exercises: []
        }
    }
}

function selectExercises() {
    this.selectedPanel = "exerciseList"
    this.$emit('setPanelHeader', { text: 'Select Exercises' } );
}

function setExercises(selectedIDs) {
    this.selectedPanel = "form"
    this.$emit('setPanelHeader', { text: 'Workout' } );

    let exercises = this.workoutStore.getExercises();
    exercises = exercises.filter(e => selectedIDs.includes(e.id));

    let position = 0;
    exercises.forEach(e => {
        position++;
        let workoutExercise = this.exercises.value.find(we => we.exercise.id == e.id);
        if (!workoutExercise) {
            this.exercises.value.push({
                exercise: clone(e),
                position,
                sets: {
                    value: [],
                    oldValue: []
                }
            });
        }
    });
    /* Check is exercises is removed */
    let ids_Removed = [];
    this.exercises.value.forEach(e => {
        let index = exercises.findIndex(x => x.id == e.exercise.id);
        if (index < 0) {
            ids_Removed.push(e.exercise.id);
        }
    });
    this.exercises.value = this.exercises.value.filter(x => !ids_Removed.includes(x.exercise.id));

    for (let i = 1; i <= this.exercises.value.length; i++) {
        this.exercises.value[i-1].position = i;
    }
}

function addDefaultSet(exerciseID) {
    let sets = this.exercises.value.flatMap(x => x.sets.value);
    let setIDs = sets.map(s => s.id).sort((a, b) => a - b);
    let nextID = (setIDs.length == 0 || setIDs[0] - 1 > -1) ? -1 : setIDs[0] - 1;
    let exercise = this.exercises.value.find(e => e.exercise.id == exerciseID);
    exercise.sets.value.push({
            id: nextID,
            reps: this.default.reps,
            weight: this.default.weight,
            restSeconds: this.default.restSeconds,
            holdSeconds: this.default.holdSeconds,
            timeSeconds: this.default.timeSeconds,
            variations: [],
            isAdded: true
        });
}

function addSet(exerciseID) {
    let sets = this.exercises.value.flatMap(x => x.sets.value);
    let setIDs = sets.map(s => s.id).sort((a, b) => a - b);
    let nextID = (setIDs.length == 0 || setIDs[0] - 1 > -1) ? -1 : setIDs[0] - 1;
    let exercise = this.exercises.value.find(e => e.exercise.id == exerciseID);
    if (exercise.sets.value == 0) {
        exercise.sets.value.push({
            id: nextID,
            reps: this.default.reps,
            weight: this.default.weight,
            restSeconds: this.default.restSeconds,
            holdSeconds: this.default.holdSeconds,
            timeSeconds: this.default.timeSeconds,
            variations: [],
            isAdded: true
        });
    } else {
        let set = exercise.sets.value[exercise.sets.value.length - 1];
        let set_New = clone(set);
        set_New.iteration = null;
        set_New.id = nextID;
        set_New.isAdded = true;
        exercise.sets.value.push(set_New);
    }
}

function deleteSet({setID, exerciseID}) {
    let exercise = this.exercises.value.find(e => e.exercise.id == exerciseID);
    removeItemByID(setID, exercise.sets.value);
}

function addVariation({setID, variationID, exerciseID}) {
    let exerciseModel = clone(this.workoutStore.getExercise(exerciseID));
    let variation = exerciseModel.variations.find(x => x.id == variationID);
    let exercise = this.exercises.value.find(x => x.exercise.id == exerciseID);
    let set = exercise.sets.value.find(x => x.id == setID);
    set.variations.push({
        id: variationID,
        name: variation.name
    });
}

function removeVariation({setID, variationID, exerciseID}) {
    let exercise = this.exercises.value.find(x => x.exercise.id == exerciseID);
    let set = exercise.sets.value.find(x => x.id == setID);
    set.variations = set.variations.filter(x => x.id != variationID);
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

function cancelCompletion() {
    this.endAt.value = undefined;
    this.completion.isActive = false;
}

function completeWorkout() {
    if (this.completion.isValid) {
        this.workoutStore.completeWorkout(this.workout.id, this.startAt.value, this.endAt.value, this.completion.createEvent)
        .then(() => {
            this.completion.isActive = false;
            this.$emit('back');
        });
    }
}

function setIterationTime(value, endpoint) {
    if (value) {
        if (endpoint == "start") {
            this.startAt.value = value;
        } else if (endpoint == "end") {
            this.endAt.value = value;
        }
        this.validateTimes();
    }
}

function validateTimes() {
    let iteration = this.workout.iteration || undefined;
    if (iteration) {
        if (this.startAt.value && this.endAt.value) {
            if (+new Date(this.startAt.value) > +new Date(this.endAt.value)) {
                this.completion.isValid = false;
            } else if (+new Date(this.startAt.value) <= +new Date(this.endAt.value)) {
                this.completion.isValid = true;
            }
        } else if (!this.endAt.value) {
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

     this.workoutStore.saveWorkout(model)
        .then(() => this.$emit('back'));
}

function repositionExercise(exerciseID, position) {
    this.workoutStore.repositionExercise(this.id, exerciseID, position)
}

function save() {
    let _this = this;
    let errors = [];
    let model = { 
        id: this.id,
        isNew: (this.id < 1) ? true : false,
        isUpdated: false
     };

    /* Set name */
    if (this.name.value.trim() != "") {
        if (this.name.value != this.name.oldValue) {
            let name = {
                value: this.name.value,
                isUpdated: true
            };
            model.name = name;
            model.isUpdated = true;
        }
    } else { 
        errors.push("Exercise must have a name");
    }

    /* Set description */
    let description = (this.description.value) ? this.description.value.trim() : null
    let oldDescription = (this.description.oldValue) ? this.description.oldValue.trim() : null
    if (description != oldDescription) {
        model.description = {
            value: this.description.value.trim(),
            isUpdated: true
        };
        model.isUpdated = true;
    }

    /* Set isTemplate */
    if (this.isTemplate.value != this.isTemplate.oldValue) {
        model.isTemplate = {
            value: this.isTemplate.value,
            isUpdated: true
        };
        model.isUpdated = true;
    }

    /* Set time */
    if (model.isNew) {
        if (this.startAt.value) {
            model.startAt = {
                value: this.startAt.value,
                isUpdated: true
            }
            model.isUpdated = true;
        }
        if (this.endAt.value) {
            model.endAt = {
                value: this.endAt.value,
                isUpdated: true
            }
            model.isUpdated = true;
        }
    } else {
        if (this.startAt.value && this.startAt.value != this.startAt.oldValue) {
            model.startAt = {
                value: this.startAt.value,
                isUpdated: true
            }
            model.isUpdated = true;
        }
        if (this.endAt.value && this.endAt.value != this.endAt.oldValue) {
            model.endAt = {
                value: this.endAt.value,
                isUpdated: true
            }
            model.isUpdated = true;
        }
    }

    /* Set exercises */
    let exercises = [];
    this.exercises.value.forEach(e => {
        let exercise = { id: e.exercise.id };
        /* Check if exercise is added */
        let index = _this.exercises.oldValue.findIndex(x => x.exercise.id == e.exercise.id);
        if (index < 0) { // Exercise is added
            /* Set added sets */
            let sets = [];
            e.sets.value.forEach(s => {
                let set = {
                    reps: (!s.reps) ? null : s.reps,
                    weight: (!s.weight) ? null : s.weight,
                    holdSeconds: (!s.holdSeconds) ? null : s.holdSeconds,
                    restSeconds: (!s.restSeconds) ? null : s.restSeconds,
                    timeSeconds: (!s.timeSeconds) ? null : s.timeSeconds,
                    variations: [],
                    isAdded: true
                };
                /* Add variations */
                s.variations.forEach(v => {
                    set.variations.push({
                        id: v.id,
                        isAdded: true
                    });
                });
                sets.push(set);
            });
            exercise.position = e.position;
            exercise.isAdded = true;
            exercises.push(exercise);
            model.isUpdated = true;
            exercise.sets = sets;
        } else { // Exercise is updated
            /* Set sets */
            let sets = [];
            e.sets.value.forEach(s => {
                let set_old = e.sets.oldValue.find(s_old => s_old.id == s.id);
                if (!set_old) {
                    /* Added set */
                    let set = {
                        id: s.id,
                        reps: (!s.reps) ? null : s.reps,
                        holdSeconds: (!s.holdSeconds) ? null : s.holdSeconds,
                        weight: (!s.weight) ? null : s.weight,
                        restSeconds: (!s.restSeconds) ? null : s.restSeconds,
                        timeSeconds: (!s.timeSeconds) ? null : s.timeSeconds,
                        variations: [],
                        isAdded: true
                    };
                    /* Added set's variations */
                    s.variations.forEach(v => {
                        set.variations.push({
                            id: v.id,
                            isAdded: true
                        });
                    })
                    sets.push(set);
                } else {
                    /* Check if set is updated */
                    let variations = [];
                    /* Add variations */
                    s.variations.forEach(v => {
                        let index = set_old.variations.findIndex(v_old => v_old.id == v.id);
                        if (index == -1) {
                            variations.push({
                                id: v.id,
                                isAdded: true
                            });
                        }
                    });
                    /* Remove variations */
                    set_old.variations.forEach(v_old => {
                        let index = s.variations.findIndex(v => v.id == v_old.id);
                        if (index == -1) {
                            variations.push({
                                id: v_old.id,
                                isRemoved: true
                            });
                        }
                    });
                    if (s.reps != set_old.reps ||
                        s.weight != set_old.weight ||
                        s.holdSeconds != set_old.holdSeconds ||
                        s.restSeconds != set_old.restSeconds ||
                        s.timeSeconds != set_old.timeSeconds ||
                        variations.length > 0) {
                            sets.push({
                                id: s.id,
                                reps: (!s.reps) ? null : s.reps,
                                holdSeconds: (!s.holdSeconds) ? null : s.holdSeconds,
                                weight: (!s.weight) ? null : s.weight,
                                restSeconds: (!s.restSeconds) ? null : s.restSeconds,
                                timeSeconds: (!s.timeSeconds) ? null : s.timeSeconds,
                                variations: variations,
                                isUpdated: true
                            });
                    }
                }
            });
            /* Set deleted sets */
            e.sets.oldValue.forEach(s => {
                let index_set = e.sets.value.findIndex(_set => _set.id == s.id);
                if (index_set < 0) {
                    sets.push({
                        id: s.id,
                        isDeleted: true
                    });
                }
            });
            let oldExercise = _this.exercises.oldValue[index];
            if (sets.length > 0 || oldExercise.position != e.position) {
                if (oldExercise.position != e.position) { // Set position
                    exercise.position = e.position;
                }
                exercises.push(exercise);
                exercise.sets = sets;
                exercise.isUpdated = true;
                model.isUpdated = true;
            }
        }

    })
    /* Set removed exercises */
    this.exercises.oldValue.forEach(e => {
        let index = _this.exercises.value.findIndex(x => x.exercise.id == e.exercise.id);
        if (index < 0) {
            exercises.push({
                id: e.exercise.id,
                isRemoved: true
            });
        }
    });
    model.exercises = exercises;
    if (model.exercises.length > 0) {
        model.isUpdated = true;
    }

    this.workoutStore.saveWorkout(model)
        // .then(() => this.$emit('back'));
}

</script>

<style scoped>
.workout-view {
    padding: 12px;
    padding-top: 0px;
}

.workout-view.is-active {
    padding-bottom: 0px;
}

.hide {
    display: none !important;
}

.top {
    padding-top: 12px;
    background-color: white;
}

.label {
    font-size: 14px;
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
</style>