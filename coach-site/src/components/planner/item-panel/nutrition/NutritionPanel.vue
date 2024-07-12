<template>
    <div class="row g-0 h-100">
        <div class="col h-100 d-flex flex-column">
            <div class="nutrition d-flex flex-column flex-grow-1 overflow-hidden">
                <div class="head align-content-center">
                    <span class="label">Nutrition</span>
                    <div class="d-flex flex-row justify-content-start ps-2">
                        <img class="icon-button"
                            src='/icon/previous.png' width="20" height="20"
                            @click.prevent="back"/>
                    </div>
                </div>
                <div class="body d-flex flex-column flex-grow-1" :class="{ hide: selectedPanel != 'home'}">
                    <!-- Nutrient Info -->
                    <div class="info d-flex flex-row">
                        <div class="calories d-flex flex-row">
                            <div class="d-flex flex-column">
                                <span class="amount">{{ caloriesRecommended }}</span>
                                <span class="label">Recommended</span>
                                <span class="amount">{{ float(caloriesConsumed,0) }}</span>
                                <span class="label">Consumed</span>
                            </div>
                            <img src="/icon/nutrition/calorie-flame.png" width="33" height="45"/>
                            <div class="remaining d-flex flex-column">
                                    <span class="calorie-amount">{{ float(caloriesRemaining,0) }}</span>
                                    <span class="calories-label">Calories</span>
                                    <span class="label">Remaining</span>
                            </div>
                        </div>
                        <div class="water d-flex flex-row">
                            <div class="remaining d-flex flex-column">
                                <span class="water-amount">{{ waterRemaining }}</span>
                                <span class="water-label">Water</span>
                                <span class="label">Remaining</span>
                            </div>
                            <img src="/icon/nutrition/water-droplet.png" width="33" height="45"/>
                            <div class="d-flex flex-column">
                                <span class="amount">{{ waterRecommended }}</span>
                                <span class="label">Recommended</span>
                                <div v-if="!isEditWater" class="d-flex flex-column"
                                     @click.prevent.stop="editWater">
                                    <span class="amount">{{ waterConsumed }}</span>
                                    <span class="label">Consumed</span>
                                </div>
                                <input v-else class="water-quantity textbox ms-1" ref="waterQuantity" type="number"
                                       v-model.trim.lazy="waterQuantity"
                                       :style="{'width': waterInputWidth}"
                                       @keyup.enter.prevent.stop="$refs.waterQuantity.blur()"
                                       @keyup.esc.prevent.stop="cancelEditWater"
                                       @click.prevent.stop
                                       @blur.prevent.stop="setWater" />
                            </div>
                        </div>
                    </div>
                    <!-- Protein -->
                    <div class="protein d-flex flex-row mt-1">
                        <span>Protein</span>
                        <span class="ms-2">{{ float(proteinConsumed,0) }}</span>
                    </div>
                    <!-- Nutrient Chart -->
                    <NutrientChart/>
                    <!-- Meal Items -->
                    <div class="meals d-flex flex-column mt-1">
                        <MealItem v-for="meal in meals" :key="meal.id" 
                                  class="mb-2"
                                  :meal="meal" 
                                  @searchFoodItems="searchFoodItems"/>
                    </div>
                </div>
                <FoodItemSearch v-show="selectedPanel == 'foodItemSearch'"
                                :meal="activeMeal"
                                :class="{ hide: selectedPanel != 'foodItemSearch'}" 
                                @back="back"/>
            </div>
        </div>
    </div>
</template>

<script>
import { usePlannerStore } from '@/store/plannerStore'
import { usePhysicalStore } from '@/store/physicalStore'
import NutrientChart from './NutrientChart.vue';
import MealItem from './MealItem.vue';
import FoodItemSearch from './FoodItemSearch.vue';
import { today, endOfDay, setTimeFromDate } from '../../../../../utility/timeUtility';
import { clone, float } from '../../../../../utility';

export default {
    name: 'NutritionPanel',
    components: { MealItem, FoodItemSearch, NutrientChart },
    props: {
        
    },
    data: function () {
        return {
            plannerStore: undefined,
            physicalStore: undefined,
            selectedPanel: "home",
            activeMeal: undefined,
            waterQuantity: undefined,
            isEditWater: false,
            isTimeValid: true,
        }
    },
    created: function() {
        this.plannerStore = usePlannerStore();
        this.physicalStore = usePhysicalStore();
        this.refresh();
    },
    computed: {
        date() {
            if (this.plannerStore) {
                return this.plannerStore.selectedDate;
            } else {
                return today(new Date());
            }
        },
        proteinConsumed() {
            if (this.mealsInRange) {
                return this.mealsInRange
                .reduce((accumulator, currentValue) => accumulator + currentValue.protein, 0,);
            } else { 
                return 0;
            }
        },
        caloriesRecommended() {
            return 2000;
        },
        caloriesConsumed() {
            if (this.mealsInRange) {
                return this.mealsInRange
                .reduce((accumulator, currentValue) => accumulator + currentValue.calories, 0,);
            } else { 
                return 0;
            }
        },
        caloriesRemaining() {
            return this.caloriesRecommended - this.caloriesConsumed;
        },
        waterRecommended() {
            return 140;
        },
        waterConsumed() {
            if (this.waterInRange) {
                return this.waterInRange
                .reduce((accumulator, currentValue) => accumulator + currentValue.amount, 0,);
            } else { 
                return 0;
            }
        },
        waterRemaining() {
            return this.waterRecommended - this.waterConsumed;
        },
        waterInputWidth() {
            if (this.waterQuantity < 10) {
                return "25px";
            } else if (this.waterQuantity < 100){
                return "34px";
            } else {
                return "41px";
            }
        },
        waterInRange() {
            if (this.date) {
                let end = endOfDay(this.date);
                let waterLogs = this.physicalStore.waterLogs;
                waterLogs = waterLogs.filter(waterLog => 
                +new Date(waterLog.dateTime) >= this.date && +new Date(waterLog.dateTime) <= end);
                return clone(waterLogs);
            } else {
                return [];
            }
        },
        mealsInRange() {
            if (this.date) {
                let end = endOfDay(this.date);
                let meals = this.physicalStore.meals;
                meals = meals.filter(meal => 
                +new Date(meal.dateTime) >= this.date && +new Date(meal.dateTime) <= end);
                return clone(meals);
            } else {
                return [];
            }
        },
        meals() {
            let _this = this;
            let id = 1;
            return [ 'Breakfast', 'Lunch', 'Dinner', 'Snack'].map(name => {
                let meal = _this.mealsInRange.find(x => x.name.toLowerCase() == name.toLowerCase());
                let data = {};
                if (meal) {
                    data = {
                        ...meal
                    };
                } else {
                    data = {
                        id: -1 * id++,
                        name: name,
                        dateTime: _this.date,
                        foodItems: [],
                        macros: {
                            carbs: 0,
                            protein: 0,
                            fat: 0
                        },
                        water: 0
                    };
                }
                return data;
            })
        }
    },
    methods: {
        refresh,
        searchFoodItems,
        back,
        float,
        setTimeFromDate,
        editWater,
        cancelEditWater,
        setWater,
    },
    watch: {
        date() {
            this.refresh();
        },
    }
}

function refresh() {
    let end = endOfDay(this.date);
    this.physicalStore.getMealsInRange(this.date, end, true);
}

function searchFoodItems(meal) {
    this.activeMeal = meal;
    this.selectedPanel = "foodItemSearch";
}

function back() {
    if (this.selectedPanel == 'foodItemSearch') {
        this.selectedPanel = 'home';
    }
}

async function editWater() {
    this.isEditWater = true;
    await this.$nextTick();
    this.$refs.waterQuantity.focus();
}

async function cancelEditWater() {
    this.waterQuantity = undefined;
    await this.$nextTick();
    this.isEditWater = false;
}

function setWater() {
    this.isEditWater = false;

    if (this.waterQuantity) {
        var datetime = new Date(this.date);
        this.setTimeFromDate(datetime, new Date());
        
        this.physicalStore.logWater(this.waterQuantity, datetime);
        this.waterQuantity = undefined;
    }
}

</script>

<style scoped>
.nutrition .body {
    padding: 8px;
    overflow: scroll;
}

.hide {
    display: none !important;
}

.head {
    min-height: 64px;
    border-bottom: 1px solid black;
}

.head .label {
    margin: auto;
}

.info {
    padding-top: 6px;
}

.amount {
    font: Helvetica;
    font-size: 14px;
    line-height: 14px;
    color: #565656;
    text-align: center;

}

.label:not(.head .label) {
    font: Helvetica;
    font-size: 8px;
    line-height: 10px;
    color: #BCBCBC;
    text-align: center;
}

.calorie-amount {
    font: Helvetica;
    font-size: 18px;
    line-height: 18px;
    color: #EA8919;
    text-align: center;
}

.calories-label {
    font: Helvetica;
    font-size: 12px;
    line-height: 12px;
    color: #EA8919;
    text-align: center;
}

.calories .remaining {
    margin-left: 5px;
    margin-right: 5px;
}

/* Water Input - Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Water Input - Firefox */
input[type=number] {
  -moz-appearance: textfield;
}

.water .remaining {
    margin-left: 5px;
    margin-right: 5px;
}

.water-amount {
    font: Helvetica;
    font-size: 18px;
    line-height: 18px;
    color: #3B99FC;
    text-align: center;
}

.water-label {
    font: Helvetica;
    font-size: 12px;
    line-height: 12px;
    color: #3B99FC;
    text-align: center;
}

.remaining {
    margin-top: 5px;
}

.meals {
    margin-top: 10px;
}

</style>