import { defineStore } from 'pinia';
import { getSocketConnection } from './socket';
import { getNutritionHistory, getMealsInRange, getWaterLogs, foodSearchAutoComplete, 
    logWater, setMealTime, removeFoodItem } from '../api/physicalAPI';
import { sortAsc, replaceOrAddItem, removeItemByID } from '../../utility';
import { postEndpoint } from '../api/api';

let initialized = false;

export const usePhysicalStore = defineStore('physical', {
    state: () => ({
        foodItems: [],
        meals: [],
        mealHistories: [],
        waterLogs: []
    }),
    getters: {
        
    },
    actions: {
        async initialize() {
            let _this = this;
            this.connectSocket();
            getNutritionHistory()
            .then(result => {  
                _this.mealHistories = result.meals;
                _this.waterLogs = result.waterLogs;
             });
            initialized = true;
        },
        getMealsInRange(startAt, endAt, shouldRequestServer) {
            let _this = this;
            if (shouldRequestServer) {
                getMealsInRange(startAt, endAt)
                .then(_meals => {
                    _meals.forEach(meal => {
                        replaceOrAddItem(meal, _this.meals);
                    })
                    sortAsc(_this.meals);
                    // sortAsc(_this.meals, 'dateTime');
                });
            }
            return this.meals.filter(meal =>
                +new Date(meal.startAt) >= startAt && +new Date(meal.startAt) <= endAt
            );
        },
        async getRecentFoodItems() {
            return postEndpoint("Physical", "GetRecentFoodItems")
                .then(this.onResponse);
        },
        getRecentFoodItems2() {
            postEndpoint("Physical", "GetRecentFoodItems_Refactored")
                .then(items => {
                    this.onResponse(items);
                    items.result.forEach(item => {
                        replaceOrAddItem(item, this.foodItems);
                    })
                });

            return this.foodItems;
        },
        async getWaterLogs() {
            let result = await getWaterLogs();
            return result;
        },
        async foodSearchAutoComplete(searchTerm) {
            let result = await foodSearchAutoComplete(searchTerm);
            return result;
        },
        async searchFoodUPC(upc) {
            return postEndpoint("Physical", "SearchFoodUPC", { upc })
                .then(this.onResponse);
        },
        async saveFoodItem(foodItem) {
            return postEndpoint("Physical", "SaveFoodItem", { model: foodItem })
                .then(response => {
                    this.onResponse(response);
                    replaceOrAddItem(response.result, this.foodItems);
                });
        },
        async addFoodItemToMeal(model) {
            return postEndpoint("Physical", "AddFoodItemToMeal", model)
                .then(response => {
                    this.onResponse(response);
                    replaceOrAddItem(response.result, this.foodItems);
                });
        },
        async logWater(amountFLOZ, dateTime, mealID) {
            logWater(amountFLOZ, dateTime, mealID);
        },
        async setMealTime(mealID, startAt, endAt) {
            setMealTime(mealID, startAt, endAt);
        },
        async removeFoodItem(mealID, foodItemID) {
            removeFoodItem(mealID, foodItemID);
        },
        onResponse(response) {
            if (response.updates)
                this.runUpdates(response.updates);
            return response.result;
        },
        runUpdates(updates) {
            let _this = this;
            if (updates.meals) {
                updates.meals.forEach(meal => {
                    replaceOrAddItem(meal, _this.meals);
                    let mealHistory = {
                        id: meal.id,
                        name: meal.name,
                        dateTime: meal.dateTime,
                        calories: meal.calories,
                        carbs: meal.carbohydrates,
                        protein: meal.protein,
                        fat: meal.fat
                    }
                    replaceOrAddItem(mealHistory, _this.mealHistories);
                })
                sortAsc(_this.meals);
            }
            if (updates.foodItems) {
                
            }
        },
        connectSocket() {
            if (!initialized) {
                let connection = getSocketConnection("metricHub");

                let _this = this;
                connection.on("UpdateMeals", meals => {
                    meals.forEach(meal => {
                        replaceOrAddItem(meal, _this.meals);
                        let mealHistory = {
                            id: meal.id,
                            name: meal.name,
                            dateTime: meal.dateTime,
                            calories: meal.calories,
                            carbs: meal.carbohydrates,
                            protein: meal.protein,
                            fat: meal.fat
                        }
                        replaceOrAddItem(mealHistory, _this.mealHistories);
                    })
                    sortAsc(_this.meals);
                });
                connection.on("RemoveMeals", mealIDs => {
                    mealIDs.forEach(mealID => {
                        removeItemByID(mealID, _this.meals);
                        removeItemByID(mealID, _this.mealHistories);
                    })
                    sortAsc(_this.meals);
                });
                connection.on("UpdateWaterLogs", waterLogs => {
                    waterLogs.forEach(waterLog => {
                        replaceOrAddItem(waterLog, _this.waterLogs);
                    })
                    sortAsc(_this.waterLogs);
                });
                connection.on("RemoveWaterLogs", waterLogIDs => {
                    waterLogIDs.forEach(waterLogID => {
                        removeItemByID(waterLogID, _this.waterLogs);
                    })
                    sortAsc(_this.meals);
                });
            }
        },
        createFoodItem() {
            return {
                id: null,
                edamamID: null,
                nutritionixID: null,
                name: null,
                brandName: null,
                quantity: 1,
                idUnit: null,
                unit: null,
                weight: 1,
                grams: null,
                upc: null,
                thumbURL: null,
                wasConsumed: false,
                units: [],
                calories: null,
                carbohydrates: null,
                protein: null,
                fat: null,
                calcium: null,
                cholesterol: null,
                monounsaturatedFat: null,
                polyunsaturatedFat: null,
                saturatedFat: null,
                transFat: null,
                iron: null,
                fiber: null,
                folate: null,
                potassium: null,
                magnesium: null,
                sodium: null,
                niacinB3: null,
                phosphorus: null,
                riboflavinB2: null,
                sugars: null,
                thiaminB1: null,
                vitaminE: null,
                vitaminA: null,
                vitaminB12: null,
                vitaminB6: null,
                vitaminC: null,
                vitaminD: null,
                vitaminK: null
            }
        }
    },
})