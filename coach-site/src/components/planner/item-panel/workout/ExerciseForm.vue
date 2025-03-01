<template>
    <div class="d-flex flex-column flex-grow-1">
        <div class="exercise-form d-flex flex-column flex-grow-1" :class="{ hide: selectedPanel != 'form'}">
            <img class="icon-button mb-2"
                 src='/icon/previous.png' width="20" height="20"
                 @click.prevent="$emit('back')"/>
            <!-- Text -->
            <input id="name" class="textbox mb-2" type="text" ref="name"  placeholder="Exercise Name"
                   v-model.lazy.trim="name.value" 
                   spellcheck="true"/>
            <textarea id="description" class="textarea" 
                    type="text"
                    placeholder="Exercise Description"
                    v-model="description.value"
                    spellcheck="true"></textarea>
            <button type="button" class="btn btn-primary mt-2" @click="save()">Save</button>
            <!-- Muscle Groups -->
            <div class="d-flex flex-column">
                <div class="label d-flex flex-row">
                    <span>Muscle Groups</span>
                    <img class="icon-button" src="/icon/add-button.png" :width="20" :height="20" 
                         @click="selectedPanel = 'muscleSelector'" />
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
            <!-- Variations -->
            <div class="label d-flex flex-row mb-2">
                <span>Variations</span>
                <img class="icon-button" src="/icon/add-button.png" :width="20" :height="20" 
                @click="selectedPanel = 'variationList'" />
            </div>
            <div class="d-flex flex-column flex-grow-1 gap-2">
                <div v-for="(list, name, index) in variationList" :key="index">
                    <div class="letter text-start">{{ name }}</div>
                    <div class="d-flex flex-column gap-2">
                        <div class="variation-item d-flex flex-row flex-grow-1" 
                             v-for="(variation, index2) in list" :key="index2"
                             @click="selectVariation(variation)">
                             <div class="d-flex flex-row">
                                 <div class="image flex-shrink-0"></div>
                                 <div class="label d-flex flex-column">
                                     <div class="name">{{ variation.name.value }}</div>
                                 </div>
                             </div>
                            <!-- Delete Button -->
                            <div class="button-group d-flex flex-column">
                                <img class="icon-button" 
                                    src='/icon/delete-button.png' width="16" height="16"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <MuscleSelector v-if="selectedPanel == 'muscleSelector'"
                        :selectedGroups="muscleGroups.value"
                        @setMuscleGroups="setMuscleGroups"
                        @back="selectedPanel = 'form'"/>
        <VariationList v-if="selectedPanel == 'variationList'"
                       :exercise="exercise"
                       :selectedVariations="selectedVariations"
                       @setVariations="setVariations"
                       @saveExerciseVariation="saveExerciseVariation"
                       @back="selectedPanel = 'form'"/>
        <ExerciseVariationForm v-if="selectedPanel == 'exerciseVariationForm'"
                               :exerciseVariation="selectedVariation"
                               :exercise="exercise"
                               @saveExerciseVariation="saveExerciseVariation"
                               @back="closeVariationForm"/>
    </div>
</template>

<script>
import { useWorkoutStore } from '../../../../store/workoutStore';
import { clone, replaceOrAddItem, sortAsc, sortAlphaAsc } from '../../../../../utility';
import MuscleSelector from './MuscleSelector.vue';
import VariationList from './VariationList.vue';
import ExerciseVariationForm from './ExerciseVariationForm.vue';

export default {
    name: 'ExerciseForm',
    components: { MuscleSelector, VariationList, ExerciseVariationForm },
    props: {
        id: {
            type: Number,
            default: -1
        }
    },
    data: function () {
        return {
            workoutStore: null,
            exercise: null,
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
            muscleGroups: {
                value: [],
                oldValue: [],
            },
            variations: {
                value: [],
                oldValue: [],
            },
            selectedPanel: "form",
            selectedVariation: undefined
        }
    },
    created: function() {
        this.workoutStore = useWorkoutStore();
        this.setProps();
    },
    computed: {
        selectedVariations() {
            return this.variations.value.map(v => {
                return {
                    name: v.name.value,
                    type: {
                        id: v.type.value.id,
                        text: v.type.value.text
                    }
                }
            });
        },
        variationList() {
            let variationList = {};
            if (this.variations.value.length > 0) {
                /* Sort variations */
                // let variations = sortAlphaAsc(this.variations.value, "name");
                let variations2 = clone(this.variations.value);
                let variations = variations2.sort((a, b) => {
                    if (a.name.value.toLowerCase() < b.name.value.toLowerCase()) {
                        return -1;
                    } 
                    if (a.name.value.toLowerCase() > b.name.value.toLowerCase()) {
                        return 1;
                    }
                    return 0;
                });

                /* Sort types */
                let types = variations.map(x => x.type.value.text);
                types = [... new Set(types)];
                types = sortAlphaAsc(types);
                types.forEach(type => {
                    variationList[type] = [];
                })

                /* Create variation list object */
                variations.forEach( v => {
                    variationList[v.type.value.text].push(v);
                });
            }
            return variationList;
        }
    },
    mounted() {
        this.$refs.name.focus();
    },
    methods: {
        setProps,
        setMuscleGroups,
        selectVariation,
        closeVariationForm,
        setVariations,
        saveExerciseVariation,
        save
    },
}

function setProps() {
    if (this.id != 0) {
        let exercise = this.workoutStore.getExercise(this.id);
        if (exercise) {
            this.exercise = clone(exercise);
            this.name.value = this.exercise.name;
            this.name.oldValue = this.exercise.name;
            this.name.isUpdated = false;
            
            this.description.value = this.exercise.description;
            this.description.oldValue = this.exercise.description;
            this.description.isUpdated = false;
            
            this.muscleGroups.value = clone(this.exercise.muscleGroups);
            this.muscleGroups.oldValue = clone(this.exercise.muscleGroups);

            /* These are technically exerciseVariations which contain the property variation.
            Don't get confused with variations */
            this.variations.value = [];
            this.variations.oldValue = [];

            let _this = this;
            this.exercise.variations.forEach(v => {
                let v_new = clone(v);
                v_new.name = {}
                v_new.description = {}
                v_new.muscleGroups = {};

                v_new.name.value = v.name;
                v_new.name.oldValue = v.name;
                v_new.name.isUpdated = false;
                
                v_new.description.value = v.description || "";
                v_new.description.oldValue = v.description || "";
                v_new.description.isUpdated = false;

                v_new.type = {};
                v_new.type.value = clone(v.type)
                v_new.type.oldValue = clone(v.type)
                v_new.type.isUpdated = false;

                v_new.muscleGroups.value = clone(v.muscleGroups);
                v_new.muscleGroups.oldValue = clone(v.muscleGroups);

                _this.variations.value.push(v_new);
                _this.variations.oldValue.push(v_new);
            });
        }
    } else {
        this.exercise = {
            id: this.id,
            name: {
                value: undefined,
                oldValue: undefined
            },
            description: {
                value: undefined,
                oldValue: undefined
            },
            muscleGroups: {
                value: [],
                oldValue: []
            },
            variations: {
                value: [],
                oldValue: []
            },
        };

        this.name.value = this.exercise.name;
        this.name.oldValue = this.exercise.name;
        this.name.isUpdated = false;
        
        this.description.value = this.exercise.description;
        this.description.oldValue = this.exercise.description;
        this.description.isUpdated = false;
                
        this.muscleGroups.value = [];
        this.muscleGroups.oldValue = [];
        
        this.variations.value = [];
        this.variations.oldValue = [];
    }
}

function setMuscleGroups(selectedGroups) {
    this.muscleGroups.value = selectedGroups;
    this.selectedPanel = 'form'
}

function selectVariation(variation) {
    this.selectedVariation = variation;
    this.selectedPanel = 'exerciseVariationForm';
}

function closeVariationForm() {
    this.selectedVariation = undefined;
    this.selectedPanel = 'form';
}

function setVariations(selectedVariations) {
    let _this = this;
    let variations = sortAsc(this.variations.value.filter(x => x.id < 1));
    let nextID = (variations.length > 0) ? variations[0].id - 1 : -1;
    /* Map Variation */
    selectedVariations.forEach(sv => {
        let variation_old = _this.variations.oldValue.find(x => x.name.value == sv.name && x.type.value.id == sv.type.id);
        let variation_value = _this.variations.value.find(x => x.name.value == sv.name && x.type.value.id == sv.type.id);
        if (variation_old == undefined) {
            /* Create new mapping */
            if (variation_value == undefined) {
                let v_new = {};
                v_new.name = {}
                v_new.description = {}
                v_new.muscleGroups = {};

                v_new.name.value = sv.name;
                v_new.name.oldValue = null;
                v_new.name.isUpdated = true;
                
                v_new.description.value = null;
                v_new.description.oldValue = null;
                v_new.description.isUpdated = false;

                v_new.muscleGroups.value = [];
                v_new.muscleGroups.oldValue = [];

                v_new.type = {};
                v_new.type.value = clone(sv.type)
                v_new.type.oldValue = {
                    id: undefined,
                    text: undefined
                }
                v_new.type.isUpdated = true;

                v_new.id = nextID--;
                _this.variations.value.push(v_new);
            }
        } else {
            /* Return removed variation */
            if (variation_value == undefined) {
                _this.variations.value.push(variation_old);
            }
        }
    });
        
    /* Unmap Variation */
    let ids_Removed = [];
    this.variations.value.forEach(v => {
        let index = selectedVariations.findIndex(sv => sv.name == v.name.value && sv.type.id == v.type.value.id);
        if (index < 0) {
            ids_Removed.push({
                name: v.name.value,
                typeID: v.type.value.id
            });
        }
    });
    this.variations.value = this.variations.value
        .filter(v => ids_Removed.findIndex(x => x.name == v.name.value && x.typeID == v.type.value.id) == -1);

    this.selectedPanel = 'form'
}

function saveExerciseVariation(variation) {
    if (variation.type.isUpdated) {
        this.workoutStore.addVariation(variation.name.value, variation.type.value.id, variation.type.value.text);
    }
    if (!variation.id) {
        let variations = sortAsc(this.variations.value.filter(x => x.id < 1));
        variation.id = (variations.length > 0) ? variations[0].id - 1 : -1;
    }
    replaceOrAddItem(variation, this.variations.value);
    this.selectedPanel = 'form';
}

async function save() {
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
        let description = {
            value: this.description.value.trim(),
            isUpdated: true
        };
        model.description = description;
        model.isUpdated = true;
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
                    isPrimary: mg.isPrimary,
                    isSecondary: mg.isSecondary,
                    isUpdated: true,
                    name: mg.name
                });
            }
        } else { // added
            muscleGroups.push({
                id: mg.id,
                isPrimary: mg.isPrimary,
                isSecondary: mg.isSecondary,
                isAdded: true,
                    name: mg.name
            });
        }
    });
    /* Check if Muscle Group is removed */
    this.muscleGroups.oldValue.forEach(mg => {
        let index = _this.muscleGroups.value.findIndex(x => x.id == mg.id);
        if (index < 0) {
            muscleGroups.push({
                id: mg.id,
                isDeleted: true,
                    name: mg.name
            })
        }
    });
    model.muscleGroups = muscleGroups;
    if (model.muscleGroups.length > 0) {
        model.isUpdated = true;
    }

    /* Set Variations */
    let variations = [];
    this.variations.value.forEach(v => {
        /* Check if updated or added */
        if (v.id < 1) {
            variations.push({
                id: v.id,
                typeID: v.type.value.id,
                name: v.name,
                description: v.description,
                muscleGroups: v.muscleGroups.value,
                // muscles: v.muscles.value
                isNew: true
            });
        } else if (v.isUpdated) {
            variations.push({
                id: v.id,
                typeID: (v.type.value.id != v.type.oldValue.id) ? v.type.value.id : undefined,
                name: v.name,
                description: v.description,
                muscleGroups: v.muscleGroups.value,
                // muscles: v.muscles.value
                isUpdated: true
            });
        } 
    });
    /* Check if variation is removed */
    this.variations.oldValue.forEach(v => {
        let index = _this.variations.value.findIndex(x => x.id == v.id);
        if (index < 0) {
            variations.push({
                id: v.id,
                isDeleted: true,
                name: v.name
            })
        }
    });
    model.variations = variations;
    if (model.variations.length > 0) {
        model.isUpdated = true;
    }

    this.workoutStore.saveExercise(model)
        .then(() => {
            // _this.setProps();
            this.$emit('back');
        });
}

</script>

<style scoped>
.exercise-form {
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

.variation-item {
    background-color: #D8D8D8;
    height: 56px;
    padding: 8px 12px;
    cursor: default;
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

.button-group {
    width: 16px;
    z-index: 5;
    visibility: hidden;
}

.variation-view:hover .button-group {
    visibility: visible;
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