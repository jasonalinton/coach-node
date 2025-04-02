<template>
    <div class="exercise-set d-flex flex-column flex-grow-1" :class="{ complete: isComplete }" style="gap:10px">
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
        <div class="d-flex flex-row flex-grow-1">
            <span class="set-number" :class="{ active: isActive }"
                    @click="activeSetID = set.id">{{ setNumber }}</span>
            <div class="reps d-flex flex-column align-items-center">
                <input class="prop form-control form-control-sm me-1" type="number" min="0" ref="repsInput"
                        v-model="set.reps"
                        :style="{'width': inputWidth(set.reps)}"
                        @keyup.enter.esc="doneEditing"
                        @blur="save(set)"/>
                <span class="text">REPS</span>
            </div>
            <div class="time d-flex flex-column align-items-center">
                <input class="prop form-control form-control-sm me-1" type="number" min="0" ref="timeInput"
                        v-model="set.timeSeconds"
                        :style="{'width': inputWidth(set.timeSeconds)}" 
                        @keyup.enter.esc="doneEditing"
                        @blur="save(set)"/>
                <span class="text">TIME</span>
            </div>
            <div class="hold d-flex flex-column align-items-center">
                <input class="prop form-control form-control-sm me-1" type="number" min="0" ref="holdInput"
                        v-model="set.holdSeconds"
                        :style="{'width': inputWidth(set.holdSeconds)}" 
                        @keyup.enter.esc="doneEditing"
                        @blur="save(set)"/>
                <span class="text">HOLD</span>
            </div>
            <div class="weight d-flex flex-column align-items-center">
                <input class="prop form-control form-control-sm me-1" type="number" min="0" ref="weightInput"
                        v-model="set.weight"
                        :style="{'width': inputWidth(set.weight)}" 
                        @keyup.enter.esc="doneEditing"
                        @blur="save(set)"/>
                <span class="text">LBS</span>
            </div>
            <div class="rest d-flex flex-column align-items-center">
                <input class="prop form-control form-control-sm me-1" type="number" min="0" ref="restInput"
                        v-model="set.restSeconds"
                        :style="{'width': inputWidth(set.restSeconds)}" 
                        @keyup.enter.esc="doneEditing"
                        @blur="save(set)"/>
                <span class="text">REST</span>
            </div>
            <!-- Edit & Delete Buttons -->
            <div class="button-group d-flex flex-column">
                <img class="icon-button" 
                    src='/icon/edit-button.png' width="16" height="16"
                        @click.stop.prevent="showVariationSelector = !showVariationSelector"/>
                <img class="icon-button" 
                    src='/icon/delete-button.png' width="16" height="16"
                        @click="$emit('deleteSet', set.id)"/>
            </div>
        </div>
    </div>
</template>

<script>
import { useWorkoutStore } from '@/store/workoutStore';
import { listToString, clone } from '../../../../../utility';

export default {
    name: 'ExerciseSet',
    components: {  },
    props: {
        set: Object,
        isActive: Boolean,
        setNumber: Number,
        idExercise: Number
    },
    data: function () {
        return {
            workoutStore: undefined,
            showVariationSelector: false,
        }
    },
    created: function() {
        this.workoutStore = useWorkoutStore();
    },
    computed: {
        variationIDs() {
            return this.set.variations.map(x => x.id);
        },
        variationString() {
            if (this.set.variations.length > 0) {
                return listToString(this.set.variations, 'name');
            } else {
                return undefined;
            }
        },
        potentialVariations() {
            if (this.workoutStore) {
                let exercise = clone(this.workoutStore.getExercise(this.idExercise));
                let variations = exercise.variations;
                return variations;
            }
            return [];
        },
        isComplete() {
            return (this.set.iteration) ? true : false;
        },
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
        variationClicked(variationID) {
            if (this.variationIDs.includes(variationID)) {
                this.$emit('removeVariation', { setID: this.set.id, variationID, idExercise: this.idExercise});
            } else {
                let set = {
                    ...this.set
                };
                set.variations.push({ id: variationID });
                this.workoutStore.saveSet(this.set);
            }
        },
        save() {
            this.workoutStore.saveSet(this.set);
        }
    },
}

</script>

<style scoped>
.exercise-set.complete {
    opacity: .5;
}

.set-number {
    line-height: 30px;
    width: 20px;
    height: 30px;
    border-radius: 10px;
}

.set-number.active {
    background-color: greenyellow;
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

</style>