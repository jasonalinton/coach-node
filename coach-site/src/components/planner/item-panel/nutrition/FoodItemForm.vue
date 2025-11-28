<template>
    <div v-if="item" class="food-item-form d-flex flex-column p-2 flex-grow-1 overflow-scroll">
        <div class="d-flex flex-column overflow-scroll">
            <!-- ID -->
            <span class="text-start ms-1 mb-2">{{ item.id }}</span>
            <!-- Food Item 2 Id -->
            <div v-if="item.isOG" class="form-floating mb-2">
                <input type="number" class="form-control" :id="`food-item-form-fi2-id`" placeholder="Food Item 2 ID"
                        v-model.lazy.trim="idFoodItem2">
                <label :for="`food-item-form-fi2-id`">Food Item 2 ID</label>
            </div>
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
                    <span class="units-head text-start">{{ `Units` }}</span>
                    <!-- Add Unit - Button -->
                    <button class="add-btn my-auto ms-1" type="button" @click="createUnit">
                        <img class="m-auto" src="/icon/button/add.png" width="10" height="10"/>
                    </button>
                </div>
                <div v-for="(unit, index) in units"
                     class="food-item-unit d-flex flex-column mb-2">
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="text-start ms-2 mb-1">{{ `Unit ${index + 1}` }}</span>
                        <!-- Is Default -->
                        <div class="d-flex flex-row justify-items-start mb-2">
                            <span class="checkbox" :class="{ 'selected': unit.isDefault }"
                                  @click="setDefaultUnit(unit)">
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
                    <!-- Grams -->
                    <div class="form-floating mb-2">
                        <input type="number" class="form-control" :id="`food-item-form-unit-grams-${index}`" placeholder="Grams"
                               :value="unit.grams" min="0"
                               @input="onChange_Grams($event, unit)">
                        <label :for="`food-item-form-unit-grams-${index}`">Grams</label>
                    </div>
                    <div class="d-flex gap-2">
                        <!-- Serving Grams -->
                        <div class="form-floating mb-2">
                            <input type="number" class="form-control" :class="{ invalid: unit.isValid == false }" :id="`food-item-form-unit-serving-grams-${index}`" placeholder="Serving Grams"
                                   :value="unit.servingGrams" min="0"
                                   @input="onChange_ServingGrams($event, unit)">
                            <label :for="`food-item-form-unit-serving-grams-${index}`">Serving Grams</label>
                        </div>
                        <!-- Serving Quantity -->
                        <div class="form-floating mb-2">
                            <input type="number" class="form-control" :class="{ invalid: unit.isValid == false}" :id="`food-item-form-unit-serving-quantity-${index}`" placeholder="Serving Quantity"
                                   v-model.lazy.trim="unit.servingQuantity" min="0"
                                   @input="onChange_ServingQuantity($event, unit)">
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
            idFoodItem2: undefined,
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
                { name: 'TCH', },
                { name: 'CBD', },
                { name: 'Alcohol', },
            ]
        }
    },
    created: async function() {
        this.physicalStore = usePhysicalStore();

        if (this.foodItem)
            this.initializeItem(this.foodItem);
    },
    computed: {
        units() {
            return this.item.units;
        }
    },
    methods: {
        initializeItem,
        toCamelCase,
        setDefaultUnit,
        createUnit,
        onChange_Grams,
        onChange_ServingGrams,
        onChange_ServingQuantity,
        save
    },
    watch: {
        foodItem(value) {
            this.initializeItem(value);
        }
    }
}

function initializeItem(model){
    let item = clone(model);

    // Add serving quantity prop
    item.units.forEach(unit => {
        unit.servingGrams = (unit.servingQuantity && unit.grams) ? unit.grams * unit.servingQuantity : undefined;
    });

    this.item = item;
}

function setDefaultUnit(unit) {
    this.item.units.forEach(unit => {
        unit.isDefault = false;
    });
    unit.isDefault = true;
}

function createUnit() {
    let hasDefault = false;
    this.item.units.forEach(unit => {
        if (unit.isDefault) {
            hasDefault = true;
        };
    })

    let unit = {
        unit: undefined,
        grams: undefined,
        servingQuantity: undefined,
        isDefault: (hasDefault) ? undefined : true
    };
    this.item.units.push(unit);
}

function onChange_Grams(event, unit) {
    let grams = event.target.value;

    unit.grams = grams;
    if (unit.servingQuantity) {
        unit.servingGrams = grams * unit.servingQuantity;
        unit.isValid = true;
    }
}

function onChange_ServingGrams(event, unit) {
    let servingGrams = event.target.value;

    unit.servingGrams = servingGrams;
    if (unit.servingQuantity && servingGrams) {
        unit.grams = servingGrams / unit.servingQuantity;
        unit.isValid = true;
    } else if (!unit.servingQuantity && !unit.servingGrams) {
        unit.isValid = true;
    }
}

function onChange_ServingQuantity(event, unit) {
    let servingQuantity = event.target.value;

    unit.servingQuantity = servingQuantity;
    if (unit.servingGrams && servingQuantity) {
        unit.grams = unit.servingGrams / servingQuantity;
        unit.isValid = true;
    } else if (!unit.servingQuantity && !unit.servingGrams) {
        unit.isValid = true;
    }
}

function save() {
    let isValid = true;

    if (this.item.isOG) {
        if (this.idFoodItem2) {
            this.physicalStore.replaceOGFoodItem(this.item.id, this.idFoodItem2)
            .then(() => { 
                this.$emit('back');
            });
        }
    } else {
        this.nutrients.forEach(x => {
            if (this.item[x.name.toCamelCase()] == "") {
                this.item[x.name.toCamelCase()] = null;
            }
        });

        this.item.units.forEach(unit => {
            if (!unit.servingQuantity && unit.servingGrams) {
                unit.isValid = false;
                isValid = false;
            }
            if (unit.servingQuantity && !unit.servingGrams) {
                unit.isValid = false;
                isValid = false;
            }
        })
        if (isValid) {
            this.physicalStore.saveFoodItem(this.item)
            .then(foodItem => { 
                if (foodItem)
                    this.$emit('back');
            });
        }
    }
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

.units-head {
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

input.invalid {
    border-color: red;
}
</style>