<template>
    <div>
        <div class="exercise-variation-form d-flex flex-column flex-grow-1" :class="{ hide: selectedPanel != 'form'}">
            <img class="icon-button mb-2"
                 src='/icon/previous.png' width="20" height="20"
                 @click.prevent="$emit('back')"/>
            <!-- Text -->
            <input id="name" class="textbox mb-2" type="text" ref="name"  placeholder="Variation Name"
            v-model.lazy.trim="name.value" 
            spellcheck="true"/>
            <!-- Description -->
            <textarea id="description" class="textarea" 
                    type="text"
                    placeholder="Variation Description"
                    v-model="description.value"
                    spellcheck="true"></textarea>
            <!-- Type -->
            <div class="d-flex flex-column mt-2">
                <select class="form-select panel-select" aria-label="select" v-model="type.value.id">
                    <option v-for="_type in types" v-bind:key="_type.id" :value="_type.id">{{_type.text}}</option> 
                </select> 
            </div>
            <button type="button" class="btn btn-primary mt-2" @click="save()">Save</button>
            <!-- Muscle Groups -->
            <div class="d-flex flex-column flex-grow-1">
                <div class="label d-flex flex-row flex-grow-1">
                    <span>Muscle Groups</span>
                    <img class="icon-button" src="/icon/add-button.png" :width="20" :height="20" @click="selectedPanel = 'muscleSelector'" />
                </div>
                <span class="sm-label">Primary</span>
                <div class="d-flex flex-row flex-wrap gap-1 mb-2">
                    <div v-for="(muscleGroup, index) in muscleGroups.value.filter(x => x.isPrimary)" :key="index"
                         class="muscle-group d-flex">
                            <span>{{ muscleGroup.name }}</span>
                        </div>
                </div>
                <span class="sm-label">Secondary</span>
                <div class="d-flex flex-row flex-wrap gap-1">
                    <div v-for="(muscleGroup, index) in muscleGroups.value.filter(x => x.isSecondary)" :key="index"
                         class="muscle-group d-flex">
                            <span>{{ muscleGroup.name }}</span>
                        </div>
                </div>
            </div>
        </div>
        <MuscleSelector v-if="selectedPanel == 'muscleSelector'"
                        :selectedGroups="muscleGroups.value"
                        @setMuscleGroups="setMuscleGroups"
                        @back="selectedPanel = 'form'"/>
    </div>
</template>

<script>
import { useWorkoutStore } from '../../../../store/workoutStore';
import { clone } from '../../../../../utility';
import { exerciseVariationTypes } from '../../../../model/types'
import MuscleSelector from './MuscleSelector.vue';

export default {
    name: 'ExerciseVariationForm',
    components: { MuscleSelector },
    props: {
        exerciseVariation: Object,
        exercise: Object
    },
    data: function () {
        return {
            workoutStore: null,
            variation: undefined,
            types: clone(exerciseVariationTypes),
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
            type: {
                value: undefined,
                oldValue: undefined,
                isUpdated: false
            },
            muscleGroups: {
                value: [],
                oldValue: [],
            },
            selectedPanel: "form"
        }
    },
    created: function() {
        this.workoutStore = useWorkoutStore();
        this.setProps();
    },
    methods: {
        setProps,
        setMuscleGroups,
        save,
    },
}

function setProps() {
    if (!this.exerciseVariation) {
        this.variation = {
            id: undefined,
            name:  {
                value: "",
                oldValue: "",
                isUpdated: false
            },
            description: {
                value: "",
                oldValue: "",
                isUpdated: false
            },
            muscleGroups: {
                value: [],
                oldValue: [],
                isUpdated: false
            },
            type: {
                value: {
                    id: 148, // Default value
                    text: "Misc"
                },
                oldValue: {
                    id: 0,
                    text: ""
                },
                isUpdated: false
            }
        };
    } else {
        this.variation = clone(this.exerciseVariation);
    }

    this.name = clone(this.variation.name);
    this.description = clone(this.variation.description);
    this.type = clone(this.variation.type);
    this.muscleGroups = clone(this.variation.muscleGroups);
}

function setMuscleGroups(selectedGroups) {
    this.muscleGroups.value = selectedGroups;
    this.selectedPanel = 'form'
}

function save() {
    let _this = this;
    let errors = [];
    let model = clone(this.variation);
    model.isUpdated = false;
    if (model.id == undefined) {
        model.isNew = true;
    }

    /* Set name */
    model.name.value = this.name.value.trim();
    if (this.name.value.trim() != "") {
        if (this.name.value != this.name.oldValue) {
            model.name.isUpdated = true;
            if (model.id && model.id > 0) {
                model.isUpdated = true;
            }
        } else {
            model.name.isUpdated = false;
        }
    } else { 
        errors.push("Variation must have a name");
    }

    /* Set description */
    model.description.value = (this.description.value) ? this.description.value.trim() : null;
    let oldDescription = (this.description.oldValue) ? this.description.oldValue.trim() : null
    if (model.description.value != oldDescription) {
        model.description.isUpdated = true;
        if (model.id && model.id > 0) {
            model.isUpdated = true;
        }
    } else {
        model.description.isUpdated = false;
    }   

    if (this.type.value.id) {
        if (this.type.value.id != this.type.oldValue.id) {
            model.type.value = this.types.find(x => x.id == this.type.value.id);
            model.type.isUpdated = true;
            model.isUpdated = true;
        }
    } else { 
        errors.push("Variation must have a type");
    }

    /* Set Muscle Groups */
    let muscleGroups = [];
    this.muscleGroups.value.forEach(mg => {
        /* Check if updated or added*/
        let index = _this.muscleGroups.oldValue.findIndex(x => x.id == mg.id);
        if (index > -1) { // updated
            let original = this.muscleGroups.oldValue[index];
            if (original.isPrimary != mg.isPrimary && original.isSecondary != mg.isSecondary) {
                muscleGroups.push({
                    id: mg.id,
                    name: mg.name,
                    isPrimary: mg.isPrimary,
                    isSecondary: mg.isSecondary,
                    isUpdated: true
                });
                model.isUpdated = true;
            } else {
                muscleGroups.push(original);
            }
        } else { // added
            muscleGroups.push({
                id: mg.id,
                name: mg.name,
                isPrimary: mg.isPrimary,
                isSecondary: mg.isSecondary,
                isAdded: true
            });
            model.isUpdated = true;
        }
    });
    /* Check if removed */
    this.muscleGroups.oldValue.forEach(mg => {
        let index = _this.muscleGroups.value.findIndex(x => x.id == mg.id);
        if (index < 0) {
            muscleGroups.push({
                id: mg.id,
                isDeleted: true
            })
        }
    });
    model.muscleGroups.value = muscleGroups;

    if (errors.length > 0) {
        alert(errors.toString())
    } else {
        this.$emit('saveExerciseVariation', model);
    }

}

</script>

<style scoped>
.exercise-variation-form {
    padding: 12px;
}

.hide {
    display: none !important;
}

.label {
    font-size: 14px;
    margin: 8px 0;
    text-align: start;
    overflow: hidden;
}

.sm-label {
    text-align: start;
    font-size: 12px;
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

.muscle-group {
    width: 85px;
    height: 85px;
    background-color: #D8D8D8;
}

.muscle-group span {
    margin-top: auto;
    text-align: center;
    width: 85px;
    /* height: 85px; */
    display: block;
}

button.save {
    position: sticky;
    bottom: 0px;
}
</style>