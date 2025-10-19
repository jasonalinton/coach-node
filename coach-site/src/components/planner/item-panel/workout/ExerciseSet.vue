<template>
    <div class="exercise-set d-flex flex-column flex-grow-1 mt-2" :class="{ complete: isComplete }">
        <div v-if="!showVariationSelector && variationString" class="d-flex flex-row"
             @click="showVariationSelector = true">
            <span class="variations text-start">{{variationString}}</span>
        </div>
        <div v-if="showVariationSelector" class="d-flex flex-row"
             @mouseleave="showVariationSelector = false">
            <div class="variations picks d-flex flex-row">
                <span v-for="variation in potentialVariations" :key="variation.id"
                      :class="{ selected: variationIDs.includes(variation.id)}"
                      @click="variationClicked(variation)">
                {{ variation.name }}
                </span>
            </div>
        </div>
        <div class="d-flex flex-row flex-grow-1">
            <span v-if="!isProcessing" class="set-number" :class="{ active: isActive }"
            @click="activeSetID = set.id">{{ setNumber }}</span>
            <div>
                <div v-if="isProcessing" class="loader"></div>
            </div>
            <div class="reps d-flex flex-column align-items-center">
                <input class="prop form-control form-control-sm me-2" type="number" min="0" ref="repsInput"
                        v-model="set.reps"
                        :style="{'width': inputWidth(set.reps)}"
                        @keyup.enter.esc="doneEditing"
                        @blur="blur"/>
                <span class="field me-2">REPS</span>
            </div>
            <div class="time d-flex flex-column align-items-center">
                <input class="prop form-control form-control-sm me-2" type="number" min="0" ref="timeInput"
                        v-model="set.timeSeconds"
                        :style="{'width': inputWidth(set.timeSeconds)}" 
                        @keyup.enter.esc="doneEditing"
                        @blur="blur"/>
                <span class="field me-2">TIME</span>
            </div>
            <div class="weight d-flex flex-column align-items-center">
                <input class="prop form-control form-control-sm me-2" type="number" min="0" ref="weightInput"
                        v-model="set.weight"
                        :style="{'width': inputWidth(set.weight)}" 
                        @keyup.enter.esc="doneEditing"
                        @blur="blur"/>
                <span class="fieldme-2">LBS</span>
            </div>
            <!-- Edit & Delete Buttons -->
            <div class="button-group d-flex flex-column" :class="{ active: isActive }">
                <img class="icon-button" 
                    src='/icon/edit-button.png' width="16" height="16"
                        @click.stop.prevent="showVariationSelector = !showVariationSelector"/>
                <img class="icon-button" 
                    src='/icon/delete-button.png' width="16" height="16"
                        @click.stop="deleteSet"/>
            </div>
        </div>
    </div>
</template>

<script>
import { useAppStore } from '@/store/appStore';
import { useWorkoutStore } from '@/store/workoutStore';
import { listToString, clone } from '../../../../../utility';

export default {
    name: 'ExerciseSet',
    components: {  },
    props: {
        idExercise: Number,
        set: Object,
        setNumber: Number,
        isActive: Boolean,
    },
    data: function () {
        return {
            appStore: undefined,
            workoutStore: undefined,
            showVariationSelector: false,
            isProcessing: false
        }
    },
    created: function() {
        this.appStore = useAppStore();
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
        variationClicked(variation) {
            if (this.variationIDs.includes(variation.id)) {
                let index = this.set.variations.findIndex(x => x.id == variation.id);
                this.set.variations.splice(index, 1);
                let set = {
                    ...this.set
                };
                set.variations = [{
                    id: variation.id,
                    isRemoved: true
                }];
                this.workoutStore.saveSet(set);
            } else {
                let set = {
                    ...this.set
                };
                set.variations.push({ id: variation.id, name: variation.name });
                this.workoutStore.saveSet(this.set);
            }
        },
        deleteSet() {
            this.isProcessing = true;
            var data = { 
                ...this.set,
                isDeleted: true
            };
            this.$emit('removeActiveSet');
            this.workoutStore.saveSet(data)
            .then(result => {
                this.isProcessing = false;
            });
        },
        blur(e) {
            if (!e.relatedTarget || !e.relatedTarget.classList.contains("prop")) {
                this.save();
            }
        },
        save() {
            this.isProcessing = true;
            this.workoutStore.saveSet(this.set)
            .then(result => {
                this.isProcessing = false;
            });
        }
    },
}

</script>

<style scoped>
.exercise-set {
    gap: 4px;
}

.exercise-set.complete {
    opacity: .5;
}

.set-number {
    margin-top: 2px;
    margin-right: 4px;
    line-height: 30px;
    width: 30px;
    height: 30px;
    border-radius: 15px;
    font-size: 14px;
}

.set-number.active {
    background-color: var(--active-gray);
}

.variations {
    font-size: 14px;
    line-height: 16px;
}

.variations:not(.picks) {
    max-width: 228px;
    margin-left: 34px;
    line-height: 20px;
}

.variations.picks {
    max-width: 278px;
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

.prop {
    min-width: 68px;
    text-align: center;
    font-size: 16px;
}

.field {
  font-size: 14px
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

.button-group {
    margin-top: 2px;
}

.button-group:not(.active) {
    visibility: hidden;
}

/* Loader */
.loader {
    margin-top: 2px;
    margin-right: 4px;
    width: 30px;
    aspect-ratio: 1;
    border-radius: 50%;
    border: 4px solid var(--workout-red);
    animation:
    l20-1 0.8s infinite linear alternate,
    l20-2 1.6s infinite linear;
}
@keyframes l20-1{
   0%    {clip-path: polygon(50% 50%,0       0,  50%   0%,  50%    0%, 50%    0%, 50%    0%, 50%    0% )}
   12.5% {clip-path: polygon(50% 50%,0       0,  50%   0%,  100%   0%, 100%   0%, 100%   0%, 100%   0% )}
   25%   {clip-path: polygon(50% 50%,0       0,  50%   0%,  100%   0%, 100% 100%, 100% 100%, 100% 100% )}
   50%   {clip-path: polygon(50% 50%,0       0,  50%   0%,  100%   0%, 100% 100%, 50%  100%, 0%   100% )}
   62.5% {clip-path: polygon(50% 50%,100%    0, 100%   0%,  100%   0%, 100% 100%, 50%  100%, 0%   100% )}
   75%   {clip-path: polygon(50% 50%,100% 100%, 100% 100%,  100% 100%, 100% 100%, 50%  100%, 0%   100% )}
   100%  {clip-path: polygon(50% 50%,50%  100%,  50% 100%,   50% 100%,  50% 100%, 50%  100%, 0%   100% )}
}
@keyframes l20-2{ 
  0%    {transform:scaleY(1)  rotate(0deg)}
  49.99%{transform:scaleY(1)  rotate(135deg)}
  50%   {transform:scaleY(-1) rotate(0deg)}
  100%  {transform:scaleY(-1) rotate(-135deg)}
}

</style>