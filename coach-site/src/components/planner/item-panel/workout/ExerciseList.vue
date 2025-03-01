<template>
     <div class="d-flex flex-column flex-grow-1 overflow-scroll">
         <div class="exercise-list d-flex flex-column" :class="{ hide: selectedExerciseID}">
             <div class="label d-flex flex-row flex-grow-1 mb-2">
                 <img class="icon-button"
                     src='/icon/previous.png' width="20" height="20"
                     @click.prevent="$emit('back')"/>
                 <span>Create Exercise</span>
                 <img class="icon-button" src="/icon/add-button.png" :width="20" :height="20" @click="createExercise" />
             </div>
             <input id="title" class="textbox mb-2" type="text" ref="text"  placeholder="Search"
                    v-model.trim="searchTerm" 
                    spellcheck="true"/>
             <button type="button" class="btn btn-primary mb-2" @click="done()">Done</button>
             <div class="d-flex flex-column">
                 <div v-for="(list, index) in exerciseList" :key="index">
                     <div class="letter text-start">{{ list.letter }}</div>
                     <!-- <div class="exercise d-flex flex-row" v-for="(exercise, index2) in list.exercises" :key="index2">
                         {{ exercise.name }}
                     </div> -->
                     <div class="exercise-item d-flex flex-row flex-grow-1"
                          :class="{ selected: exercise.isSelected }"
                          v-for="(exercise, index2) in list.exercises" :key="index2"
                          @click="selectExercise(exercise)">
                             <div class="image flex-shrink-0"></div>
                             <div class="label d-flex flex-column">
                                 <div class="name">{{ exercise.name }}</div>
                             </div>
                     </div>
                 </div>
             </div>
         </div>
         <ExerciseForm v-if="selectedExerciseID" 
                       :id="selectedExerciseID"
                       @back="back"/>
     </div>
</template>

<script>
import { useWorkoutStore } from '../../../../store/workoutStore';
import { sortAlphaAsc, clone } from '../../../../../utility';
import ExerciseForm from './ExerciseForm.vue';

export default {
    name: 'ExerciseList',
    components: { ExerciseForm },
    props: {
        isSelector: Boolean,
        selectedIDs: {
            type: Array,
            default: () => { return []}
        }
    },
    data: function () {
        return {
            workoutStore: undefined,
            searchTerm: "",
            selectedExerciseID: undefined,
            exerciseList: []
        }
    },
    created: function() {
       this.workoutStore = useWorkoutStore();

    },
    computed: {
        exercises() {
            if (this.workoutStore) {
                let exercises = clone(this.workoutStore.getExercises());
                if (this.isSelector) {
                    exercises.forEach(e => { 
                        e.isSelected = (this.selectedIDs.includes(e.id)) ? true : false;
                    });
                }
                return clone(exercises);
            } else {
                return [];
            }
        }
    },
    methods: {
        setExerciseList,
        createExercise,
        selectExercise,
        done,
        back
    },
    watch: {
        exercises: {
            handler() {
                this.setExerciseList();
            },
            deep: true
        },
        searchTerm() {
            this.setExerciseList();
        }
    }
}

function setExerciseList() {
        let exerciseList = [];
        if (this.exercises.length > 0) {
            let exercises = sortAlphaAsc(this.exercises, "name");
            if (this.searchTerm && this.searchTerm != "") {
                let _searchTerm = this.searchTerm;
                exercises = exercises.filter(x => x.name.toLowerCase().includes(_searchTerm))
            }
            let letter = exercises[0].name.charAt(0).toLowerCase();
            let letterList = [];
            exerciseList.push({ letter: letter.toUpperCase(), exercises: letterList });
            exercises.forEach(e => {

                let _letter = e.name.charAt(0).toLowerCase();
                if (_letter == letter) {
                    letterList.push(e);
                } else {
                    letter = _letter;
                    letterList = [ e ]
                    exerciseList.push({ letter: letter.toUpperCase(), exercises: letterList });
                }
            });
        }
        this.exerciseList = exerciseList;
}

function createExercise() {
    this.selectedExerciseID = -1;
    this.$emit('setPanelHeader', { text: 'Exercise Form' } );
}

function selectExercise(exercise) {
    if (this.isSelector) {
        exercise.isSelected = !exercise.isSelected;
    } else {
        this.selectedExerciseID = exercise.id;
        this.$emit('setPanelHeader', { text: 'Exercise Form' } );
    }
}

function done() {
    let selectedIDs = [];
    this.exercises.forEach(e => {
        if (e.isSelected) {
            selectedIDs.push(e.id);
        }
    });
    this.$emit("setExercises", selectedIDs);
}

function back() {
    this.selectedExerciseID = undefined;
    this.$emit('setPanelHeader', { text: 'Exercise List' } );
}
</script>

<style scoped>
.exercise-list {
    padding: 8px;
}

.hide {
    display: none !important;
}

.letter {
    font-size: 14px;
    line-height: 18px;
    margin-bottom: 8px;
}

.exercise-item {
    background-color: #D8D8D8;
    height: 56px;
    padding: 8px 12px;
    margin-bottom: 8px;
    cursor: default;
}

.exercise-item.selected {
    border: #000000 1px solid;
}

.name {
    font-size: 18px;
    line-height: 22px;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: start;
    margin-left: 8px
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
    font-size: 14px;
}
</style>