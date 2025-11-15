<template>
    <div class="food-item-search-item item d-flex flex-column align-items-center">
        <div class="d-flex flex-row justify-content-between align-items-center w-100"
             @click="$emit('selectFoodItem', item)">
            <img class="align-self-start" :src="item.thumbURL" height="40" width="40"/>
            <div class="d-flex flex-column flex-grow-1">
                <span class="name text-start">{{ item.name }}</span>
                <div class="serving d-flex flex-row">
                    <span>{{ item.brandName }}</span>
                    <!-- <span>{{ item.quantity }}</span>
                    <span class="ms-1">{{ item.unit }}</span> -->
                </div>
            </div>
            <span class="float-end">{{ float(item.calories,0) }}</span>
        </div>
        <!-- unit dropdown -->
        <div class="input-wrrapper d-flex flex-row w-100 mt-1">
            <input class="quantity textbox" type="number" placeholder="#"
                    v-model.trim.lazy="quantity" />
            <select class="form-select form-select-sm panel-select ms-1" aria-label="select" v-model="unit"
                    @click.stop> 
                <option v-for="(unit, index) in units" :key="index" :value="index">{{unit.text}}</option> 
            </select>
            <button class="add-btn my-auto ms-1" type="button" @click="addFoodItem">
                <img class="m-auto" src="/icon/button/add.png" width="10" height="10"/>
            </button>
        </div>
    </div>
</template>

<script>
import { usePhysicalStore } from '../../../../store/physicalStore';
import { float } from '../../../../../utility';
import { setTimeFromDate } from '../../../../../utility/timeUtility';

export default {
    name: 'FoodSearchItem',
    components: {  },
    props: {
        item: Object,
        meal: Object
    },
    data: function () {
        return {
            physicalStore: undefined,
            quantity: 1,
            unit: 0
        }
    },
    created: async function() {
       this.physicalStore = usePhysicalStore();

       this.quantity = this.item.quantity;

       this.setUnit();
    },
    computed: {
        units() {
            let units = [];
            this.item.units.forEach(x => {
                let unit = { ...x };
                unit.text = `${x.unit} (${x.grams.round()}g)`;
                units.push(unit);
            });
            return units;
        },
    },
    watch: {
        units() {
            this.setUnit();
        }
    },
    methods: {
        setUnit,
        addFoodItem,
        float
    },
}

function setUnit() {
        let unit = 0;
        for (let i = 0; i < this.units.length; i++) {
            if (this.units[i].isDefault) {
                unit = i;
                break;
            }
        }
        this.unit = unit;
}

async function addFoodItem() {
    /* Set date to the same day as the meal */
    var datetime = new Date(this.meal.dateTime);
    setTimeFromDate(datetime, new Date());
    
    let model = {
        foodItemID: this.item.id,
        mealID: (this.meal.id > 0) ? this.meal.id : undefined,
        meal: this.meal.name,
        foodName: this.item.name,
        unit: this.units[this.unit].unit,
        grams: this.units[this.unit].grams,
        quantity: this.quantity,
        dateString: datetime.toLocaleString(),
        dateTime: datetime,
        foodItem: (this.item.id) ? undefined : this.item
    }

    this.physicalStore.addFoodItemToMeal(model);
}

</script>

<style scoped>
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
    font-size: 14px;
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

.quantity {
    width: 60px;
    border: 1px solid rgba(0, 0, 0, .2);
}
</style>