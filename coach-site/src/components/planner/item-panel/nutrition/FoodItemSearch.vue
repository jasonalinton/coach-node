<template>
    <div class="food-item-search d-flex flex-column flex-grow-1 overflow-scroll">
        <div class="pt-2 ms-2 me-2 mb-2 sticky-top head">
            <div class="d-flex flex-row mb-2">
                <input id="food-search-input" class="title textbox" type="text" ref="text"  placeholder="Search"
                        v-model.trim.lazy="searchTerm" 
                        @keyup.enter="search"/>
                <input id="quantity" class="quantity textbox ms-1" type="number" placeholder="#"
                        v-model.trim.lazy="quantity" />
                <button class="add-btn my-auto ms-1" type="button" @click="createFoodItem">
                    <img class="m-auto" src="/icon/button/add.png" width="10" height="10"/>
                </button>
            </div>
            <RadioButton :initiallySelected="tab" 
                         :options="tabs"
                         @selectOption="tab = $event"/>
        </div>
        <!-- Recents -->
        <div v-if="['Recent'].includes(tab) && recents.length > 0" 
             class="recents d-flex flex-column">
            <span class="text-start ms-2">Recents</span>
            <div v-for="(item, index) in recents" :key="index"
                 class="item d-flex flex-row align-items-center"
                 @click="addFoodItem(item, 'recent')">
                <img class="align-self-start" :src="item.thumbURL" height="40" width="40"
                     @click.prevent.stop="$emit('selectFoodItem', item)"/>
                <div class="d-flex flex-column flex-grow-1">
                    <span class="name text-start">{{ item.name }}</span>
                    <div class="serving d-flex flex-row">
                        <span>{{ item.brandName }}</span>
                        <span>{{ item.quantity }}</span>
                        <span class="ms-1">{{ item.unit }}</span>
                    </div>
                </div>
                <span class="float-end">{{ float(item.calories,0) }}</span>
            </div>
        </div>
        <!-- Recents2 -->
        <div v-if="['Recent2'].includes(tab) && recents2.length > 0" 
             class="recents d-flex flex-column">
            <span class="text-start ms-2">Recents</span>
            <FoodSearchItem v-for="(item, index) in recents2" :key="index"
                            :item="item" :meal="meal"
                            @selectFoodItem="$emit('selectFoodItem', $event)" />
        </div>
        <!-- Common -->
        <div v-if="['All', 'Common'].includes(tab) && common.length > 0"
             class="common d-flex flex-column">
            <span class="text-start ms-2">Common</span>
            <div v-for="(item, index) in common" :key="index"
                 class="item d-flex flex-row align-items-center"
                 @click="addFoodItem(item, 'common')">
                <img class="align-self-start" :src="item.photoThumb" height="40" width="40"/>
                <div class="d-flex flex-column flex-grow-1">
                    <span class="name text-start">{{ item.food_name }}</span>
                    <div class="serving d-flex flex-row">
                        <span>{{ item.serving_qty }}</span>
                        <span class="ms-1">{{ item.serving_unit }}</span>
                    </div>
                </div>
            </div>
        </div>
        <!-- Branded -->
        <div v-if="['All', 'Branded'].includes(tab) && branded.length > 0" 
             class="branded d-flex flex-column">
            <span class="text-start ms-2">Branded</span>
            <div v-for="(item, index) in branded" :key="index"
                    class="item d-flex flex-row align-items-center"
                 @click="addFoodItem(item, 'branded')">
                <img class="align-self-start" :src="item.photoThumb" height="40" width="40"/>
                <div class="d-flex flex-column flex-grow-1">
                    <span class="name text-start">{{ item.food_name }}</span>
                    <div class="serving d-flex flex-row">
                        <span>{{ item.brand_name }}</span>
                        <span>{{ item.serving_qty }}</span>
                        <span class="ms-1">{{ item.serving_unit }}</span>
                    </div>
                </div>
                <span class="float-end">{{ float(item.nf_calories,0) }}</span>
            </div>
        </div>
        <!-- UPC -->
        <div class="upc d-flex flex-column">
             <div v-if="['UPC'].includes(tab) && upc.length > 0"
                  class="d-flex flex-column">
                 <span class="text-start ms-2">UPC</span>
                 <FoodSearchItem v-for="(item, index) in upc" :key="index"
                                 :item="item" :meal="meal" />
            </div>
            <span v-if="noUPCResult == true">No Results</span>
        </div>
    </div>
</template>

<script>
import RadioButton from '../../../controls/button/RadioButton.vue';
import FoodSearchItem from './FoodSearchItem.vue';
import { usePhysicalStore } from '../../../../store/physicalStore';
import { setTimeFromDate } from '../../../../../utility/timeUtility';
import { float } from '../../../../../utility';

export default {
    name: '',
    components: { RadioButton, FoodSearchItem },
    props: {
        meal: Object
    },
    data: function () {
        return {
            physicalStore: undefined,
            searchTerm: "",
            quantity: 1,
            tab: "Recent2",
            tabs: [
                'All',
                'Recent',
                'Recent2',
                'UPC',
                // 'Common',
                // 'Branded'
            ],
            recents: [],
            common: [],
            branded: [],
            upc: [],
            noUPCResult: undefined
        }
    },
    created: async function() {
       this.physicalStore = usePhysicalStore();
       this.recents = await this.physicalStore.getRecentFoodItems();
    },
    computed: {
        recents2() {
            if (this.physicalStore) {
                let recents = this.physicalStore.getRecentFoodItems2();
                return recents;
            }
            return [];
        }
    },
    methods: {
        float,
        setTimeFromDate,
        search,
        clearResults,
        searchFoodItem,
        searchUPC,
        addRecentItem,
        createFoodItem,
        addFoodItem
    },
    watch: {
        searchTerm() {
            this.search();
        }
    },
}

function search() {
    if (this.searchTerm.trim() != "") {
        if (['All','Common','Branded'].includes(this.tab)) {
            this.searchFoodItem();
        } else if (this.tab == "UPC") {
            this.searchUPC();
        }
    } else {
        this.clearResults();
    }
}

function clearResults() {
    this.common = [];
    this.branded = [];
    this.upc = [];
}

async function searchFoodItem() {
    let result = await this.physicalStore.foodSearchAutoComplete(this.searchTerm);
    this.common = result.common;
    this.branded = result.branded;
}

async function searchUPC() {
    let result = await this.physicalStore.searchFoodUPC(this.searchTerm);
    if (result) {
        this.upc = result;
        this.noUPCResult = false;
    } else {
        this.upc = [];
        this.noUPCResult = true;
    }
}

function createFoodItem() {
    let foodItem = this.physicalStore.createFoodItem();
    this.$emit('selectFoodItem', foodItem);
}

function addRecentItem(item) {
    this.recents2.unshift(item);
}

async function addFoodItem(foodItem, type) {
    var datetime = new Date(this.meal.dateTime);
    this.setTimeFromDate(datetime, new Date());
    
    let model = {
        mealID: (this.meal.id > 0) ? this.meal.id : undefined,
        meal: this.meal.name,
        foodName: (['upc','recent'].includes(type)) ? foodItem.name : foodItem.food_name,
        nutritionixID: (type == "branded") ? foodItem.nix_item_id : undefined,
        unit: (['upc','recent'].includes(type)) ? foodItem.unit : foodItem.serving_unit,
        quantity: this.quantity,
        dateString: datetime.toLocaleString(),
        foodItem: (['upc','recent'].includes(type)) ? foodItem : undefined
    }
    this.physicalStore.addFoodItemToMeal(model);
    this.$emit('back');
}

</script>

<style scoped>
.textbox {
    font-size: 16px;
    line-height: 16px;
    height: 32px;
}

.quantity {
    width: 60px;
}

.head {
    background-color: white;
}

.item {
    min-height: 56px;
    padding: 8px 8px;
    cursor: default;
    margin-bottom: 2px;
}

.item:hover {
    background-color: #F5F5F5;
}

.image {
    width: 40px;
    height: 40px;
    background-color: #E25555;
}

.name {
    margin: auto 0 auto 6px;
    font-size: 16px;
    line-height: 18px;
    /* white-space: nowrap; */
    text-overflow: ellipsis;
    overflow: hidden;
    text-transform: capitalize;
}

.serving {
    font-size: 12px;
    line-height: 12px;
    margin-left: 6px;
    margin-top: 2px;
    text-transform: capitalize;
}

</style>