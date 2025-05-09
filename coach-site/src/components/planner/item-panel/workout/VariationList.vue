<template>
    <div class="d-flex flex-column flex-grow-1">
        <div class="variation-list d-flex flex-column flex-grow-1" :class="{ hide: selectedPanel != 'list'}">
            <div class="label d-flex flex-row mb-2">
                <img class="icon-button"
                    src='/icon/previous.png' width="20" height="20"
                    @click.prevent="$emit('back')"/>
                <span>Create Variation</span>
                <img class="icon-button" src="/icon/add-button.png" :width="20" :height="20" @click="selectedPanel = 'exerciseVariationForm'" />
            </div>
            <input id="title" class="textbox mb-2" type="text" ref="text"  placeholder="Search"
                   v-model.trim="searchTerm" 
                   spellcheck="true"/>
            <button type="button" class="btn btn-primary mb-2" @click="done()">Done</button>
            <div class="d-flex flex-column flex-grow-1">
                <div v-for="(list, name, index) in variationList" :key="index">
                    <div class="letter text-start">{{ name }}</div>
                    <div class="variation-item d-flex flex-row flex-grow-1" 
                         :class="{ selected: variation.isSelected }"
                         v-for="(variation, index2) in list" :key="index2"
                         @click="variation.isSelected = !variation.isSelected">
                            <div class="image flex-shrink-0"></div>
                            <div class="label d-flex flex-column">
                                <div class="name">{{ variation.name }}</div>
                            </div>
                    </div>
                </div>
            </div>
        </div>
        <ExerciseVariationForm v-if="selectedPanel == 'exerciseVariationForm'"
                               :exercise="exercise"
                               @saveExerciseVariation="$emit('saveExerciseVariation', $event)"
                               @back="selectedPanel = 'list'"/>
    </div>
</template>

<script>
import { useWorkoutStore } from '../../../../store/workoutStore';
import { clone, sortAlphaAsc } from '../../../../../utility';
import ExerciseVariationForm from './ExerciseVariationForm.vue';

export default {
    name: 'VariationList',
    components: { ExerciseVariationForm },
    props: {
        exercise: Object,
        selectedVariations: {
            type: Array,
            default: () => []
        },
    },
    data: function () {
        return {
            workoutStore: undefined,
            selectedPanel: "list",
            searchTerm: "",
            variationList: []
        }
    },
    created: function() {
       this.workoutStore = useWorkoutStore();

    },
    computed: {
        variations() {
            if (this.workoutStore) {
                let _this = this;
                let variations = clone(this.workoutStore.getVariations());
                variations.forEach(v => {
                    let index = _this.selectedVariations.findIndex(x => x.name == v.name && x.type && x.type.id == v.type.id);
                    v.isSelected = (index > -1) ? true : false;
                })
                return variations;
            } else {
                return [];
            }
        },
    },
    methods: {
        done() {
            let selectedVariations = [];
            this.variations.forEach(v => {
                if (v.isSelected) {
                    selectedVariations.push(v);
                }
            })
            this.$emit("setVariations", selectedVariations);
        },
        setVariationList
    },
    watch: {
        variations: {
            handler() {
                this.setVariationList();
            },
            deep: true
        },
        searchTerm() {
            this.setVariationList();
        }
    }
}

function setVariationList() {
    let variationList = {};
    if (this.variations.length > 0) {
        /* Sort variations and filter by search term */
        let variations = sortAlphaAsc(this.variations, "name");
        if (this.searchTerm && this.searchTerm != "") {
            let _searchTerm = this.searchTerm;
            variations = variations.filter(x => x.name.toLowerCase().includes(_searchTerm))
        }

        /* Sort types */
        let types = variations.map(x => x.type.text);
        types = [... new Set(types)];
        types = sortAlphaAsc(types);
        types.forEach(type => {
            variationList[type] = [];
        })

        /* Create variation list object */
        variations.forEach( v => {
            variationList[v.type.text].push(v);
        });
    }
    this.variationList = variationList;
}
</script>

<style scoped>
.variation-list {
    padding: 8px;
}

.hide {
    display: none !important;
}

.label {
    font-size: 14px;
}

.letter {
    font-size: 14px;
    line-height: 18px;
    margin-bottom: 8px;
}

.variation-item {
    background-color: #D8D8D8;
    height: 56px;
    padding: 8px 12px;
    margin-bottom: 8px;
    cursor: default;
}

.variation-item.selected {
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
}
</style>