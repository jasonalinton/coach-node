<template>
    <div class="exercise-item d-flex flex-column" 
         :class="[{ 'complete': isExerciseComplete }, dragPosition]"
         ref="item"
         draggable @dragenter.prevent
         @dragstart="onDragStart($event)" @dragend="onDragEnd($event)"
         @drop="onDrop($event)" @dragover="onDragOver($event)" @dragleave="onDragLeave($event)">
        <div class="d-flex flex-row flex-grow-1 justify-content-between position-relative">
            <div class="d-flex flex-row overflow-hidden">
                <!-- <input class="form-control form-control-sm me-1" type="number" v-model="exercise.position"
                       :style="{'width': '35px'}"/> -->
                <span class="image flex-shrink-0"></span>
                <div class="label d-flex flex-column">
                    <span class="name">{{ exercise.exercise.name }}</span>
                    <div class="d-flex flex-row">
                        <span class="set-count"
                              @click="showSets">
                              {{ setCount }} Sets
                        </span>
                        <img v-if="setsShown" class="icon-button ms-1" src="/icon/add-button.png" :width="14" :height="14" 
                             @click="addSet" />
                    </div>
                </div>
            </div>
            <div class="button-group d-flex flex-column">
                <img class="icon-button" 
                     src='/icon/edit-button.png' width="16" height="16"
                        @click="showOptions = !showOptions"/>
                <img class="icon-button" 
                     src='/icon/delete-button.png' width="16" height="16"
                        @click="$emit('removeExercise', exercise.exercise.id)"/>
            </div>
        </div>
        <div v-if="showOptions" class="d-flex flex-row mt-1">
            <input type="checkbox" id="reps" v-model="showReps" />
            <label class="ms-1" for="reps">Reps</label>
            <input class="ms-2" type="checkbox" id="weight" v-model="showWeight" />
            <label class="ms-1" for="weight">Weight</label>
            <input class="ms-2" type="checkbox" id="hold" v-model="showHoldSeconds" />
            <label class="ms-1" for="hold">Hold</label>
            <input class="ms-2" type="checkbox" id="time" v-model="showTimeSeconds" />
            <label class="ms-1" for="time">Time</label>
        </div>
        <div v-if="setsShown" class="sets d-flex flex-column">
            <div v-for="(set, index) in exercise.sets.value" :key="set.id">
                <ExerciseSetForm :set="set" :index="index + 1"
                                 :exerciseID="exercise.exercise.id"
                                 :showReps="showReps"
                                 :showWeight="showWeight"
                                 :showHoldSeconds="showHoldSeconds"
                                 :showTimeSeconds="showTimeSeconds"
                                 :editingSetID="editingSetID"
                                 @deleteSet="deleteSet"
                                 @setEditingID="editingSetID = $event"
                                 @addVariation="$emit('addVariation', $event)"
                                 @removeVariation="$emit('removeVariation', $event)"
                                 @saveWorkout="$emit('saveWorkout')"/>
            </div>
            <!-- <button type="button" class="btn btn-sm btn-success mt-2" @click="addSet()">Add Set</button> -->
        </div>
    </div>
</template>

<script>
import ExerciseSetForm from './ExerciseSetForm.vue';
import { useWorkoutStore } from '../../../../store/workoutStore';

export default {
    name: 'ExerciseItem',
    components: { ExerciseSetForm },
    props: {
        exercise: Object,
        isActive: Boolean,
        isComplete: Boolean
    },
    data: function () {
        return {
            workoutStore: undefined,
            setsShown: false,
            showOptions: false,
            showReps: false,
            showWeight: false,
            showHoldSeconds: false,
            showTimeSeconds: false,
            editingSetID: undefined,
            dragPosition: ""
        }
    },
    created: function() {
        this.workoutStore = useWorkoutStore();
        let _this = this;
        if (this.exercise.sets.value.length == 0) {
            this.$emit("addDefaultSet", this.exercise.exercise.id);
        }
        if (this.exercise.sets.value.length == 1) {
            let set = this.exercise.sets.value[0];
            if (!set.reps && !set.weight && !set.holdSeconds && !set.timeSeconds) {
                this.editingSetID = set.id;
                _this.showReps = true;
                _this.showWeight = true;
                _this.showHoldSeconds = true;
                _this.showTimeSeconds = true;
            } else {
                if (set.reps) {
                    _this.showReps = true;
                }
                if (set.weight) {
                    _this.showWeight = true;
                }
                if (set.holdSeconds) {
                    _this.showHoldSeconds = true;
                }
                if (set.timeSeconds) {
                    _this.showTimeSeconds = true;
                }
            }
        } else {
            this.exercise.sets.value.forEach(set => {
                if (set.reps) {
                    _this.showReps = true;
                }
                if (set.weight) {
                    _this.showWeight = true;
                }
                if (set.holdSeconds) {
                    _this.showHoldSeconds = true;
                }
                if (set.timeSeconds) {
                    _this.showTimeSeconds = true;
                }
            });
        }

        if (this.isComplete) {
            this.setsShown = false;
        }
    },
    computed: {
        // sets() {
        //     return this.exercise.sets.map(s => s.value);
        // },
        setCount() {
            let setCount = this.exercise.sets.value.length;
            if (this.isActive) {
                let compledCount = this.exercise.sets.value.filter(x => x.iteration && x.iteration.completedAt).length;
                return `${compledCount}/${setCount}`;
            } else {
                return `${setCount}`;
            }
        },
        isExerciseComplete() {
            let setCount = this.exercise.sets.value.length;
            if (this.isActive) {
                let compledCount = this.exercise.sets.value.filter(x => x.iteration && x.iteration.completedAt).length;
                return compledCount == setCount;
            } else {
                return false;
            }
        }
    },
    methods: {
        addSet() {
            this.$emit('addSet', this.exercise.exercise.id);
        },
        deleteSet(setID) {
            this.$emit('deleteSet', { setID, exerciseID: this.exercise.exercise.id  })
        },
        showSets() {
            if (this.exercise.sets.value.length == 0) {
                this.$emit("addDefaultSet", this.exercise.exercise.id);
            }
            this.setsShown = !this.setsShown;
        },
        onDragStart,
        onDragOver,
        onDrop,
        onDragLeave,
        onDragEnd
    },
}

function onDragStart(ev) {
    console.log("Drag Started");
    ev.target.classList.add("drag");
    ev.dataTransfer.dropEffect = 'move';
    ev.dataTransfer.effectAllowed = 'move';

    this.workoutStore.setDraggedProps(this.exercise.exercise.id);
}

function onDragOver(ev) {
    ev.preventDefault();
    this.dragPosition = "";

    if (!ev.currentTarget.classList.contains("drag")) {
        ev.preventDefault();

        var rect = this.$refs.item.getBoundingClientRect();
        var offset = ev.clientY - rect.y;
        var percent = offset / rect.height;

        if ((percent < .50)) {
            this.dragPosition = "before";
        } else {
            this.dragPosition = "after";
        }
    }
}

function onDrop(ev) {
    ev.preventDefault();

    var dragged = this.workoutStore.getDragged;
    var position = (this.dragPosition == "before") ? this.exercise.position : this.exercise.position + 1;
    
    this.$emit('repositionExercise', dragged.exerciseID, position);
    
    this.dragPosition = "";
}

function onDragLeave() {
    this.dragPosition = "";
}

function onDragEnd(ev) {
    ev.target.classList.remove("drag");
    this.dragPosition = "";

    this.workoutStore.clearDraggedProps();
}

</script>

<style scoped>
.exercise-item {
    background-color: #D8D8D8;
    min-height: 56px;
    padding: 8px 12px;
    /* padding-right: 0px; */
    cursor: default;
}

.exercise-item.complete {
    opacity: .6;
}

.image {
    width: 40px;
    height: 40px;
    background-color: #E25555;
}

.label {
    margin: auto 0 auto 6px;
    text-align: start;
    overflow: hidden;
}

.name {
    font-size: 14px;
    line-height: 22px;
    white-space: nowrap;
    text-overflow: ellipsis;
    /* width: 203px; */
}

.set-count {
    font-size: 12px;
    line-height: 14px;
}

/* .sets {
    margin-top: 12px;
} */

.icon-button {
    border-radius: 8px;
    width: 16px;
}

.icon-button:hover {
    background-color: rgba(60, 64, 67, .10);
}

.button-group {
    width: 16px;
    z-index: 5;
    position: absolute;
    right: 0px;
    background-color: #D8D8D8;
    margin-top: 4px;
    visibility: hidden;
}

.exercise-item:hover .button-group {
    visibility: visible;
}

.before {
    border-top: 1px solid black !important;
}

.after {
    border-bottom: 1px solid black !important;
}
</style>