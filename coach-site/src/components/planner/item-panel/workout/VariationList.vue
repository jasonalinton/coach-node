<template>
    <div class="variation-list d-flex flex-column">
        <div class="label d-flex flex-row flex-grow-1 mb-2">
            <img class="icon-button"
                src='/icon/previous.png' width="20" height="20"
                @click.prevent="$emit('back')"/>
            <span>Create Variation</span>
            <img class="icon-button" src="/icon/add-button.png" :width="20" :height="20" @click="createVariation" />
        </div>
        <input id="title" class="textbox mb-2" type="text" ref="text"  placeholder="Search"
               v-model.trim="searchTerm" 
               spellcheck/>
        <button type="button" class="btn btn-primary mb-2" @click="done()">Done</button>
        <div class="d-flex flex-column">
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
</template>

<script>
import { useWorkoutStore } from '../../../../store/workoutStore';
import { clone, sortAlphaAsc } from '../../../../../utility';

export default {
    name: 'VariationList',
    components: {  },
    props: {
        exercise: Object,
        selectedIDs: {
            type: Array,
            default: () => []
        }
    },
    data: function () {
        return {
            workoutStore: undefined,
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
                    v.isSelected = (_this.selectedIDs.includes(v.id)) ? true : false;
                })
                return variations;
            } else {
                return [];
            }
        },
    },
    methods: {
        createVariation,
        done() {
            let selectedVariations = [];
            for (const vl in this.variationList) {
                this.variationList[vl].forEach(v => {
                    if (v.isSelected) {
                        selectedVariations.push(v);
                    }
                })
            }
            this.$emit("setVariations", selectedVariations);
        }
    },
    watch: {
        variations() {
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
    }
}

function createVariation() {

}
</script>

<style scoped>
.variation-list {
    padding: 8px;
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