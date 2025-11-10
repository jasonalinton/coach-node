<template>
    <div v-if="item" class="food-item-form d-flex flex-column p-2 flex-grow-1 overflow-scroll">
        <div class="d-flex flex-column overflow-scroll">
            <!-- Name -->
            <div class="form-floating mb-2">
                <input type="text" class="form-control" :id="`food-item-form-name`" placeholder="Name"
                        v-model.lazy.trim="item.name">
                <label :for="`food-item-form-name`">Name</label>
            </div>
            <!-- Brand Name -->
            <div class="form-floating mb-2">
                <input type="text" class="form-control" :id="`food-item-form-brand-name`" placeholder="Brand Name"
                        v-model.lazy.trim="item.brandName">
                <label :for="`food-item-form-brand-name`">Brand Name</label>
            </div>
            <!-- UPC -->
            <div class="form-floating mb-2">
                <input type="text" class="form-control" :id="`food-item-form-upc`" placeholder="UPC"
                        v-model.lazy.trim="item.upc">
                <label :for="`food-item-form-upc`">UPC</label>
            </div>
            <!-- Grams -->
            <div class="form-floating mb-2">
                <input type="number" class="form-control" :id="`food-item-form-grams`" placeholder="Grams"
                        v-model.lazy.trim="item.grams" min="0">
                <label :for="`food-item-form-name`">Grams</label>
            </div>
            <!-- Nutrients -->
            <div v-for="(nutrient, index) in nutrients" :key="index" class="form-floating mb-2">
                <input type="number" class="form-control" :id="`food-item-form-${toCamelCase(nutrient.name)}`" :placeholder="nutrient.name"
                        v-model.lazy.trim="item[toCamelCase(nutrient.name)]" min="0">
                <label :for="`food-item-form-${toCamelCase(nutrient.name)}`">{{ nutrient.name }}</label>
            </div>
            <!-- Thumb URL -->
            <div class="form-floating mb-2">
                <input type="text" class="form-control" :id="`food-item-form-thumb-url`" placeholder="Thumb URL"
                        v-model.lazy.trim="item.thumbURL">
                <label :for="`food-item-form-thumb-url`">Thumb URL</label>
            </div>
            <!-- Unit -->
            <div class="units d-flex flex-column mb-4">
                <div class="d-flex">
                    <span class="text-start">{{ `Units` }}</span>
                    <!-- Add Unit - Button -->
                    <button class="add-btn my-auto ms-1" type="button" @click="createUnit">
                        <img class="m-auto" src="/icon/button/add.png" width="10" height="10"/>
                    </button>
                </div>
                <div v-for="(unit, index) in units"
                     class="food-item-unit d-flex flex-column mb-2">
                    <div class="d-flex justify-content-between">
                        <span class="text-start ms-2 mb-1">{{ `Unit ${index + 1}` }}</span>
                        <!-- Is Default -->
                        <div class="d-flex flex-row justify-items-start mb-2">
                            <span class="checkbox" :class="{ 'selected': unit.isDefault }"
                                  @click="setDefaultUnit(unit.id)">
                                Default
                            </span>
                        </div>
                    </div>
                    <!-- Unit -->
                    <div class="form-floating mb-2">
                        <input type="text" class="form-control" :id="`food-item-form-unit-unit-${index}`" placeholder="Unit"
                        v-model.lazy.trim="unit.unit">
                        <label :for="`food-item-form-unit-unit-${index}`">Unit</label>
                    </div>
                    <div class="d-flex gap-2">
                        <!-- Grams -->
                        <div class="form-floating mb-2">
                            <input type="number" class="form-control" :id="`food-item-form-unit-grams-${index}`" placeholder="Grams"
                            v-model.lazy.trim="unit.grams" min="0">
                            <label :for="`food-item-form-unit-grams-${index}`">Grams</label>
                        </div>
                        <!-- Serving Quantity -->
                        <div class="form-floating mb-2">
                            <input type="number" class="form-control" :id="`food-item-form-unit-serving-quantity-${index}`" placeholder="Serving Quantity"
                            v-model.lazy.trim="unit.servingQuantity" min="0">
                            <label :for="`food-item-form-unit-serving-quantity-${index}`">Serving Quantity</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="d-flex sticky-bottom">
            <button type="button" class="btn btn-primary btn-sm float-start mb-2 me-1"
                    @click="save">
                    Save
            </button>
            <button type="button" class="btn btn-warning btn-sm float-start mb-2"
                    @click="$emit('back')">
                    Cancel
            </button>
        </div>
    </div>
</template>

<script>
import { clone, toCamelCase } from '../../../../../utility';
import { usePhysicalStore } from '../../../../store/physicalStore';

export default {
    name: 'FoodItemForm',
    components: {  },
    props: {
        foodItem: Object
    },
    data: function () {
        return {
            physicalStore: undefined,
            item: undefined,
            nutrients: [
                { name: 'Calories', },
                { name: 'Fat', },
                { name: 'SaturatedFat', },
                { name: 'TransFat', },
                { name: 'MonounsaturatedFat', },
                { name: 'PolyunsaturatedFat', },
                { name: 'Cholesterol', },
                { name: 'Sodium', },
                { name: 'Carbohydrates', },
                { name: 'Fiber', },
                { name: 'Sugars', },
                { name: 'Protein', },
                { name: 'Calcium', },
                { name: 'Iron', },
                { name: 'Potassium', },
                { name: 'Folate', },
                { name: 'Magnesium', },
                { name: 'NiacinB3', },
                { name: 'Phosphorus', },
                { name: 'RiboflavinB2', },
                { name: 'ThiaminB1', },
                { name: 'VitaminE', },
                { name: 'VitaminA', },
                { name: 'VitaminB12', },
                { name: 'VitaminB6', },
                { name: 'VitaminC', },
                { name: 'VitaminD', },
                { name: 'VitaminK', },
            ]
        }
    },
    created: async function() {
        this.physicalStore = usePhysicalStore();

        if (this.foodItem)
            this.item = clone(this.foodItem);
    },
    computed: {
        // item() {
        //     if (this.foodItem) {
        //         return this.foodItem;
        //     } 
        //     else if (!this.foodItem && this.physicalStore) {
        //         let foodItem = this.physicalStore.createFoodItem();
        //         return foodItem;
        //     }
        // },
        units() {
            return this.item.units;
        }
    },
    methods: {
        toCamelCase,
        setDefaultUnit,
        createUnit,
        save
    },
    watch: {
        foodItem(value) {
            this.item = clone(value);
        }
    }
}

function setDefaultUnit(id) {
    this.item.units.forEach(unit => {
        unit.isDefault = (unit.id == id) ? true : false;
    })
}

function createUnit() {
    let unit = {
        unit: undefined,
        grams: undefined,
        servingQuantity: undefined,
        isDefault: undefined
    };
    this.item.units.push(unit);
}

function save() {
    this.nutrients.forEach(x => {
        if (this.item[x.name.toCamelCase()] == "") {
            this.item[x.name.toCamelCase()] = null;
        }
    })

    this.physicalStore.saveFoodItem(this.item)
    .then(foodItem => { 
        if (foodItem)
            this.$emit('back');
    })
}

</script>

<style scoped>
.form-control {
    height: 48px;
    font-size: 14px;
}

.form-floating label {
    font-size: 14px;
    padding: 14px 10px;
}

.units {
    padding: 0px 8px;
}

.units span {
    line-height: 28px;
}

.checkbox {
    cursor: pointer;
    padding: 4px 4px;
    line-height: 14px;
    font-size: 14px;
    background-color: var(--pill-default);
    border-radius: 4px;
    border: transparent solid 1px;
}
.checkbox:hover {
    border: var(--pill-border-hover) solid 1px;
}
.checkbox.selected {
    border: var(--pill-border-hover) solid 1px;
    background-color: var(--pill-background-selected);
}
.checkbox:active {
    background-color: var(--pill-background-selected);
}
</style>