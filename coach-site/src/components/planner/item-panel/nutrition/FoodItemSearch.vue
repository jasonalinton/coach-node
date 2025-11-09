<template>
    <div class="food-item-search d-flex flex-column flex-grow-1 overflow-scroll">
        <div class="pt-2 ms-2 me-2 mb-2 sticky-top head">
            <div class="d-flex flex-row mb-2">
                <input id="food-search-input" class="title textbox" type="text" ref="text"  placeholder="Search"
                        v-model.trim.lazy="searchTerm" 
                        @keyup.enter="search"/>
                <input id="quantity" class="quantity textbox ms-1" type="number" placeholder="#"
                        v-model.trim.lazy="quantity" />
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
                <img class="align-self-start" :src="item.thumbURL" height="40" width="40"/>
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
        <div v-if="['UPC'].includes(tab) && upc.length > 0" 
             class="upc d-flex flex-column">
            <span class="text-start ms-2">UPC</span>
            <FoodSearchItem v-for="(item, index) in upc" :key="index"
                            :item="item" :meal="meal" />
            <!-- <div v-for="(item, index) in upc" :key="index"
                    class="item d-flex flex-column align-items-center"
                 @click="addFoodItem(item, 'upc')">
                 <div class="d-flex flex-row">
                     <img class="align-self-start" :src="item.thumbURL" height="40" width="40"/>
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
                 <div class="input-wrrapper d-flex flex-row">
                    <input class="quantity textbox ms-1" type="number" placeholder="#"
                           v-model.trim.lazy="item.quantity"
                           @click.stop />
                    <select :id="`upc-search`" class="form-select panel-select" aria-label="select" v-model="item.unit"
                            @click.stop> 
                        <option :value="'Gram'">None</option> 
                        <option v-for="(unit, index) in item.units" :key="index" :value="unit.unit">{{unit.unit}}</option> 
                    </select>
                </div>
            </div> -->
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
            tab: "Recent",
            tabs: [
                'All',
                'Recent',
                'UPC',
                'Common',
                'Branded'
            ],
            recents: [],
            common: [],
            branded: [],
            upc: []
        }
    },
    created: async function() {
       this.physicalStore = usePhysicalStore();
       this.recents = await this.physicalStore.getRecentFoodItems();
    },
    methods: {
        float,
        setTimeFromDate,
        search,
        clearResults,
        searchFoodItem,
        searchUPC,
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
    this.upc = result;
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
        quantity: foodItem.quantity,
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