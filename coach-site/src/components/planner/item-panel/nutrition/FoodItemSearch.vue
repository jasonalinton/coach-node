<template>
    <div class="food-item-search d-flex flex-column flex-grow-1 overflow-scroll">
        <div class="mt-2 ms-2 me-2">
            <div class="d-flex flex-row">
                <input id="title" class="textbox" type="text" ref="text"  placeholder="Search"
                        v-model.trim.lazy="searchTerm" 
                        spellcheck/>
                <input id="quantity" class="textbox ms-1" type="number" placeholder="#"
                        v-model.trim.lazy="quantity" />
            </div>
            <RadioButton :initiallySelected="tab" 
                         :options="tabs"
                         @selectOption="tab = $event"/>
        </div>
        <div v-if="['All', 'Recent', 'Common', 'Branded'].includes(tab)" class="recents d-flex flex-column">
            <span class="text-start ms-2">Recents</span>
            <div v-for="item in recents" :key="item.id"
                 class="item d-flex flex-row"
                 @click="addFoodItem(item, 'recent')">
            </div>
        </div>
        <div v-if="['All', 'Common'].includes(tab)" class="common d-flex flex-column">
            <span class="text-start ms-2">Common</span>
            <div v-for="(item, index) in common" :key="index"
                 class="item d-flex flex-row align-items-center"
                 @click="addFoodItem(item, 'common')">
                <img :src="item.photoThumb" height="40" width="40"/>
                <div class="d-flex flex-column flex-grow-1">
                    <span class="name text-start">{{ item.food_name }}</span>
                    <div class="serving d-flex flex-row">
                        <span>{{ item.serving_qty }}</span>
                        <span class="ms-1">{{ item.serving_unit }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="['All', 'Branded'].includes(tab)" class="branded d-flex flex-column">
            <span class="text-start ms-2">Branded</span>
            <div v-for="(item, index) in branded" :key="index"
                    class="item d-flex flex-row align-items-center"
                 @click="addFoodItem(item, 'branded')">
                <img :src="item.photoThumb" height="40" width="40"/>
                <div class="d-flex flex-column flex-grow-1">
                    <span class="name text-start">{{ item.food_name }}</span>
                    <div class="serving d-flex flex-row">
                        <span>{{ item.brand_name }}</span>
                        <span class="ms-1">{{ item.serving_qty }}</span>
                        <span class="ms-1">{{ item.serving_unit }}</span>
                    </div>
                </div>
                <span class="float-end">{{ item.nf_calories }}</span>
            </div>
        </div>
        <div v-if="['UPC'].includes(tab)" class="upc d-flex flex-column">
            <span class="text-start ms-2">UPC</span>
            <div v-for="(item, index) in upc" :key="index"
                    class="item d-flex flex-row align-items-center"
                 @click="addFoodItem(item, 'upc')">
                <img :src="item.thumbURL" height="40" width="40"/>
                <div class="d-flex flex-column flex-grow-1">
                    <span class="name text-start">{{ item.name }}</span>
                    <div class="serving d-flex flex-row">
                        <span>{{ item.brandName }}</span>
                        <span class="ms-1">{{ item.quantity }}</span>
                        <span class="ms-1">{{ item.unit }}</span>
                    </div>
                </div>
                <span class="float-end">{{ item.nf_calories }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { usePhysicalStore } from '../../../../store/physicalStore';
import RadioButton from '../../../controls/button/RadioButton.vue';

export default {
    name: '',
    components: { RadioButton },
    props: {
        meal: Object
    },
    data: function () {
        return {
            physicalStore: undefined,
            searchTerm: "",
            quantity: 1,
            tab: "All",
            tabs: [
                'All',
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
    created: function() {
       this.physicalStore = usePhysicalStore();
    },
    methods: {
        searchFoodItem,
        searchUPC,
        addFoodItem
    },
    watch: {
        searchTerm() {
            if (['All','Common','Branded'].includes(this.tab)) {
                this.searchFoodItem();
            } else if (this.tab == "UPC") {
                this.searchUPC();
            }
        }
    }
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
    let model = {
        mealID: (this.meal.id > 0) ? this.meal.id : undefined,
        meal: this.meal.name,
        foodName: (type == "upc") ? foodItem.name : foodItem.food_name,
        nIXItemID: (type == "branded") ? foodItem.nix_item_id : undefined,
        unit: (type == "upc") ? foodItem.unit : foodItem.serving_unit,
        quantity: this.quantity,
        dateTime: this.meal.dateTime,
        foodItem: (type == "upc") ? foodItem : undefined
    }
    this.physicalStore.addFoodItemToMeal(model);
    this.$emit('back');
}

</script>

<style scoped>
#quantity {
    width: 60px;
}

.item {
    height: 56px;
    padding: 8px 12px;
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
    white-space: nowrap;
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