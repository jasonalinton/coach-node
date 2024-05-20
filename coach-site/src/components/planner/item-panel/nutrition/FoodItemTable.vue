<template>
    <div class="overflow-scroll">
        <table class="table">
            <thead>
                <tr>
                    <!-- <th scope="col">Pic</th> -->
                    <th scope="col">Qty</th>
                    <th scope="col">Unit</th>
                    <th scope="col">Name</th>
                    <th scope="col">Cals</th>
                    <th scope="col">Carbs</th>
                    <th scope="col">Prot</th>
                    <th scope="col">Fat</th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in foodItems" :key="item.id">
                    <!-- <td><img :src="item.thumbURL" height="30" width="30"/></td> -->
                    <td>{{item.quantity}}</td>
                    <td>{{ item.unit }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ float(item.calories,0) }}</td>
                    <td>{{ float(item.carbohydrates,0) }}</td>
                    <td>{{ float(item.protein,0) }}</td>
                    <td>{{ float(item.fat,0) }}</td>
                    <td>
                        <div class="d-flex justufy-content-center">
                            <button class="delete-btn btn btn-secondary btn-sm float-end" type="button" @click.prevent.stop="onDeleteItem(item)">
                                <i class="far fa-trash-alt"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { usePhysicalStore } from '@/store/physicalStore'
import { float } from '../../../../../utility';

export default {
    name: 'FoodItemTable',
    components: {  },
    props: {
        meal: Object
    },
    data: function () {
        return {
            physicalStore: undefined,
            foodItems: []
        }
    },
    created: function() {
        this.physicalStore = usePhysicalStore();
        this.foodItems = this.meal.foodItems;
    },
    methods: {
        float,
        onDeleteItem
    },
    watch: {
        meal(value) {
            this.foodItems = value.foodItems;
        }
    }
}

function onDeleteItem(item) {
    this.physicalStore.removeFoodItem(this.meal.id, item.id);
}

</script>

<style scoped>
table {
    font-size: 10px;
}
</style>