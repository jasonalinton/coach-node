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
                <input type="number" class="form-control" :id="`food-item-form-${nutrient.name.toCamelCase()}`" :placeholder="nutrient.name"
                        v-model.lazy.trim="item[nutrient.name.toCamelCase()]" min="0">
                <label :for="`food-item-form-${nutrient.name.toCamelCase()}`">{{ nutrient.name }}</label>
            </div>
        </div>
        <div class="d-flex sticky-bottom">
            <button type="button" class="btn btn-primary btn-sm float-start mb-2 me-1"
                    @click="save">
                    Save
            </button>
            <button type="button" class="btn btn-warning btn-sm float-start mb-2"
                    @click="showForm = false">
                    Cancel
            </button>
        </div>
    </div>
</template>

<script>
import { clone } from '../../../../../utility';
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
                { name: 'Carbohydrates', },
                { name: 'Protein', },
                { name: 'Fat', },
                { name: 'Calcium', },
                { name: 'Cholesterol', },
                { name: 'MonounsaturatedFat', },
                { name: 'PolyunsaturatedFat', },
                { name: 'SaturatedFat', },
                { name: 'TransFat', },
                { name: 'Iron', },
                { name: 'Fiber', },
                { name: 'Folate', },
                { name: 'Potassium', },
                { name: 'Magnesium', },
                { name: 'Sodium', },
                { name: 'NiacinB3', },
                { name: 'Phosphorus', },
                { name: 'RiboflavinB2', },
                { name: 'Sugars', },
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
    // computed: {
    //     item() {
    //         return clone(this.foodItem);
    //     }
    // },
    methods: {
        save
    },
    watch: {
        foodItem(value) {
            this.item = clone(value);
        }
    }
}

function save() {
    
}

</script>

<style scoped>

</style>