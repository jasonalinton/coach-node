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
                    <div class="info d-flex flex-row">
                        <div class="calories d-flex flex-row">
                            <div class="d-flex flex-column">
                                <span class="amount">{{ caloriesRecommended }}</span>
                                <span class="label">Recommended</span>
                                <span class="amount">{{ caloriesConsumed }}</span>
                                <span class="label">Consumed</span>
                            </div>
                            <img src="/icon/nutrition/calorie-flame.png" width="33" height="45"/>
                            <div class="remaining d-flex flex-column">
                                <span class="calorie-amount">{{ caloriesRemaining }}</span>
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
                                <span class="amount">{{ waterConsumed }}</span>
                                <span class="label">Consumed</span>
                            </div>
                        </div>
                    </div>
                    <div class="meals d-flex flex-column">
                        <MealItem v-for="meal in mealsInRange" :key="meal.id" 
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
import MealItem from './MealItem.vue';
import FoodItemSearch from './FoodItemSearch.vue';
import { today, endOfDay, firstDayOfWeek, lastDayOfWeek } from '../../../../../utility/timeUtility';
import { clone } from '../../../../../utility';

export default {
    name: 'NutritionPanel',
    components: { MealItem, FoodItemSearch },
    props: {
        
    },
    data: function () {
        return {
            plannerStore: undefined,
            physicalStore: undefined,
            selectedPanel: "home",
            activeMeal: undefined
        }
    },
    created: function() {
        this.plannerStore = usePlannerStore();
        this.physicalStore = usePhysicalStore();
        let start = firstDayOfWeek(this.date);
        let end = lastDayOfWeek(this.date);
        this.physicalStore.getMealsInRange(start, end, true);
    },
    computed: {
        date() {
            if (this.plannerStore) {
                return this.plannerStore.selectedDate;
            } else {
                return today(new Date());
            }
        },
        caloriesRecommended() {
            return 2000;
        },
        caloriesConsumed() {
            return 457;
        },
        caloriesRemaining() {
            return 1543;
        },
        waterRecommended() {
            return 140;
        },
        waterConsumed() {
            return 28;
        },
        waterRemaining() {
            return 112;
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
                        id: meal.id,
                        name: meal.name,
                        dateTime: meal.dateTime,
                        foodItems: meal.foodItems,
                        macros: meal.macros
                    }
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
                        }
                    };
                }
                return data;
            })
        }
    },
    methods: {
        searchFoodItems,
        back
    },
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

.label {
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