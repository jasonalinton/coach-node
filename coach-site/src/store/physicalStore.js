import { defineStore } from 'pinia';
import { getSocketConnection } from './socket';
import { getNutritionHistory, getMealsInRange, getRecentFoodItems, getWaterLogs, foodSearchAutoComplete, searchFoodUPC, 
    addFoodItemToMeal, logWater, setMealTime, removeFoodItem } from '../api/physicalAPI';
import { sortAsc, replaceOrAddItem, removeItemByID } from '../../utility';
import { postEndpoint } from '../api/api';

let initialized = false;

export const usePhysicalStore = defineStore('physical', {
    state: () => ({
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
            let result = await getRecentFoodItems();
            return result;
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
            let result = await searchFoodUPC(upc);
            return result;
        },
        async addFoodItemToMeal(model) {
            postEndpoint("Physical", "AddFoodItemToMeal", model)
                .then(this.onResponse);
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
        }
    },
})