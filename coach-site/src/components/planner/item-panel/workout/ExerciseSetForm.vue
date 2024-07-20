<template>
     <div class="exercise-set-view d-flex flex-column flex-grow-1" :class="{ complete: isComplete }">
        <div v-if="!showVariationSelector && variationString" class="d-flex flex-row"
             @click="showVariationSelector = true">
            <span class="variations text-start">{{variationString}}</span>
        </div>
        <div v-if="showVariationSelector" class="d-flex flex-row"
             @mouseleave="showVariationSelector = false">
            <div class="variations picks d-flex flex-row">
                <span v-for="variation in potentialVariations" :key="variation.id"
                      :class="{ selected: variationIDs.includes(variation.id)}"
                      @click="variationClicked(variation.id)">
                {{ variation.name }}
                </span>
            </div>
        </div>
        <!-- Edit Mode -->
        <div v-if="isEditing" class="editing d-flex flex-row flex-grow-1">
            <div class="index">{{ index }}</div>
            <div class="d-flex flex-row flex-grow-1" style="gap:10px">
                <div v-if="showReps" class="reps d-flex flex-column align-items-center">
                    <input class="prop form-control form-control-sm me-1" type="number" min="0" ref="repsInput"
                           v-model="set.reps"
                           :style="{'width': inputWidth(set.reps)}"
                           @keyup.enter.esc="doneEditing"
                           @blur="blur"/>
                    <span class="text">REPS</span>
                </div>
                <div v-if="showTimeSeconds" class="time d-flex flex-column align-items-center">
                    <input class="prop form-control form-control-sm me-1" type="number" min="0" ref="timeInput"
                           v-model="set.timeSeconds"
                           :style="{'width': inputWidth(set.timeSeconds)}" 
                           @keyup.enter.esc="doneEditing"
                           @blur="blur"/>
                    <span class="text">TIME</span>
                </div>
                <div v-if="showWeight" class="weight d-flex flex-column align-items-center">
                    <input class="prop form-control form-control-sm me-1" type="number" min="0" ref="weightInput"
                           v-model="set.weight"
                           :style="{'width': inputWidth(set.weight)}" 
                           @keyup.enter.esc="doneEditing"
                           @blur="blur"/>
                    <span class="text">LBS</span>
                </div>
                <div v-if="showHoldSeconds" class="hold d-flex flex-column align-items-center">
                    <input class="prop form-control form-control-sm me-1" type="number" min="0" ref="holdInput"
                           v-model="set.holdSeconds"
                           :style="{'width': inputWidth(set.holdSeconds)}" 
                           @keyup.enter.esc="doneEditing"
                           @blur="blur"/>
                    <span class="text">HOLD</span>
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
            <div class="button-group d-flex flex-column">
                <!-- <img class="icon-button" 
                     src='/icon/edit-button.png' width="16" height="16"
                        @click="onEdit"/> -->
                <img class="icon-button" 
                        src='/icon/task-icon.png' width="16" height="16"
                        @click="doneEditing"/>
                <img class="icon-button" 
                     src='/icon/delete-button.png' width="16" height="16"
                        @click="$emit('deleteSet', set.id)"/>
            </div>
        </div>
        <!-- Display Mode -->
        <div v-else class="d-flex flex-row flex-grow-1"
             @mouseover="showCheckbox = true"
             @mouseleave="showCheckbox = false">
             <div class="d-flex flex-column flex-grow-1">
                 <div class="d-flex flex-row flex-grow-1">
                     <div v-if="!showCheckbox" class="index">
                          {{ index }}
                     </div>
                     <ItemCheckbox v-if="showCheckbox" class="checkbox align-self-start" style="margin-top: -2px;" 
                                 :checked="isComplete" 
                                 :width="20"
                                 :height="20"
                                 @onChecked="markComplete" 
                                 @onUnchecked="markIncomplete"/>
                     <div class="top d-flex flex-row flex-grow-1" style="gap:10px">
                         <div v-if="showReps" class="reps d-flex flex-row align-items-center"
                              @click="editProp('repsInput')">
                             <span class="prop">{{ set.reps }}</span>
                             <span class="text ms-1">REPS</span>
                         </div>
                         <div v-if="showTimeSeconds" class="time d-flex flex-row align-items-center"
                              @click="editProp('timeInput')">
                             <span class="prop">{{ set.timeSeconds }}</span>
                             <span class="text ms-1">SECS</span>
                         </div>
                         <div v-if="showWeight" class="weight d-flex flex-row align-items-center"
                              @click="editProp('weightInput')">
                             <span class="prop">{{ set.weight }}</span>
                             <span class="text ms-1">LBS</span>
                         </div>
                         <div v-if="showHoldSeconds" class="hold d-flex flex-row align-items-center"
                              @click="editProp('holdInput')">
                             <span class="prop">{{ set.holdSeconds }}</span>
                             <span class="text ms-1">HOLD</span>
                         </div>
                     </div>
                 </div>
                 <div class="bottom d-flex flex-row flex-grow-1">
                     <div class="rest"
                          @click="editProp('restInput')">
                         <span>{{ rest }} REST</span>
                     </div>
                 </div>
             </div>
             <!-- Edit & Delete Buttons -->
            <div class="button-group d-flex flex-column">
                <img class="icon-button" 
                    src='/icon/edit-button.png' width="16" height="16"
                        @click="showVariationSelector = !showVariationSelector"/>
                <img class="icon-button" 
                    src='/icon/delete-button.png' width="16" height="16"
                        @click="$emit('deleteSet', set.id)"/>
            </div>
        </div>
     </div>
</template>

<script>
import { useWorkoutStore } from '../../../../store/workoutStore';
import { clone, listToString } from '../../../../../utility';
import ItemCheckbox from '../component/ItemCheckbox.vue';


export default {
    name: 'ExerciseSet',
    components: { ItemCheckbox },
    props: {
        index: Number,
        set: Object,
        exerciseID: Number,
        editingSetID: Number,
        showReps: {
            type: Boolean,
            default: true
        },
        showWeight: {
            type: Boolean,
            default: true
        },
        showHoldSeconds: {
            type: Boolean,
            default: true
        },
        showTimeSeconds: {
            type: Boolean,
            default: true
        },
    },
    created: function() {
        this.workoutStore = useWorkoutStore();
        if (this.editingSetID == this.set.id) {
            this.isEditing = true;
        }
    },
    data: function () {
        return {
            workoutStore: null,
            isEditing: false,
            showCheckbox: false,
            showVariationSelector: false,
            console: console
        }
    },
    computed: {
        rest() {
            if (this.set.restSeconds) {
                let minutes_floor = 0;
                let seconds = this.set.restSeconds;
                if (seconds > 60) {
                    let minutes = seconds / 60;
                    minutes_floor = Math.floor(minutes);
                    seconds = seconds - (minutes_floor * 60);
                }
                let seconds_floor = Math.floor(seconds);
                let secString = seconds_floor.toLocaleString(undefined, {minimumIntegerDigits: 2, useGrouping:false});

                return `${minutes_floor}:${secString}`;
            } else {
                return "";
            }
        },
        isComplete() {
            if (this.set.iteration && this.set.iteration.completedAt) {
                return true;
            } else {
                return false;
            }
        },
        potentialVariations() {
            if (this.workoutStore) {
                let exercise = clone(this.workoutStore.getExercise(this.exerciseID));
                let variations = exercise.variations;
                return variations;
            }
            return [];
        },
        variationIDs() {
            return this.set.variations.map(x => x.id);
        },
        variationString() {
            if (this.set.variations.length > 0) {
                return listToString(this.set.variations, 'name');
            } else {
                return undefined;
            }
        }
    },
    methods: {
        inputWidth(prop) {
            if (prop < 10) {
                return "27px";
            } else if (prop < 100){
                return "37px";
            } else {
                return "45px";
            }
        },
        editProp(prop) {
            let _this = this;
            this.isEditing = true;
            this.$nextTick(() => {
                _this.$refs[prop].focus();
            });
            this.$emit('setEditingID', this.set.id);
        },
        markComplete() {
            this.workoutStore.logSet(this.set.id, new Date());
        },
        markIncomplete() {
            this.workoutStore.logSet(this.set.id, undefined);
        },
        blur(e) {
            if (!e.relatedTarget || !e.relatedTarget.classList.contains("prop")) {
                this.doneEditing();
                this.$emit('saveWorkout');
            }
        },
        doneEditing() {
            this.isEditing = false;
            this.$emit('setEditingID', undefined);
        },
        variationClicked(variationID) {
            if (this.variationIDs.includes(variationID)) {
                this.$emit('removeVariation', { setID: this.set.id, variationID, exerciseID: this.exerciseID});
            } else {
                this.$emit('addVariation', { setID: this.set.id, variationID, exerciseID: this.exerciseID});
            }
        }
    },
    watch: {
        editingSetID(value) {
            if (value && value != this.set.id) {
                this.doneEditing();
            }
        }
    }
}

</script>

<style scoped>
.exercise-set-view {
    margin-top: 8px;
}

.exercise-set-view.complete {
    opacity: .5;
}

.done {
    font-size: 14px;
    line-height: 16px;
}

.variations {
    font-size: 14px;
    line-height: 16px;
}

.variations:not(.picks) {
    margin-left: 24px;
    line-height: 20px;
}

.variations.picks {
    white-space: nowrap;
    overflow: scroll;
}

.variations.picks span {
    border-radius: 8px;
    padding: 2px 4px;
    margin-left:4px;
}

.variations.picks span.selected {
    background-color: darkgray;
}

.variations.picks span:hover {
    background-color: #c4c4c4;
}

image.add {
    margin-left: 6px;
}

.editing .index {
    /* margin-left: 6px; */
    font-size: 12px;
    line-height: 30px;
    height: 30px;
    width: 20px;
}

.index:not(.editing .index) {
    /* margin-left: 6px; */
    font-size: 12px;
    line-height: 24px;
    width: 20px;
    margin-right: 4px;
}

.checkbox {
    margin-right: 4px;
}

.checkbox img {
    margin-top: -2px;
}

.text { 
    font-size: 12px;
    line-height: 16px;
}

.reps input, .frequency input {
    line-height: 20px;
    min-height: 30px;
    /* padding: 4px; */
}

.form-control {
    background-color: #D8D8D8;
    border-color: #606060;
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

input.prop {
    padding-top: 2px;
    padding-bottom: 2px;
    line-height: 18px;
    min-height: auto;
}

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
    visibility: hidden;
}

.exercise-set-view:hover .button-group {
    visibility: visible;
}

.top {
    height: 24px;
}

.prop {
    font-size: 16px;
    /* line-height: 18px; */
    line-height: 24px;
}

.rest {
    font-size: 12px;
    line-height: 16px;
    color: #606060;
}

.rest:not(.editing .rest) {
    margin-left: 24px;
}

.bottom {
    height: 16px;
}
</style>