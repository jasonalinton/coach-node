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
        waterLogs: [],
        bodyMeasurements: []
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
             postEndpoint("Physical", "GetBodyMeasurements")
                .then(response => {
                    this.bodyMeasurements = response.result
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
            .then(response => response.result);
        },
        getRecentFoodItems2() {
            postEndpoint("Physical", "GetRecentFoodItems_Refactored")
                .then(response => {
                    response.result.forEach(item => {
                        replaceOrAddItem(item, this.foodItems);
                    })
                });

            return this.foodItems;
        },
        async getWaterLogs() {
            let result = await getWaterLogs();
            return result;
        },
        getBodyMeasurements() {
            return this.bodyMeasurements;
        },
        async foodSearchAutoComplete(searchTerm) {
            let result = await foodSearchAutoComplete(searchTerm);
            return result;
        },
        async searchFoodUPC(upc) {
            return postEndpoint("Physical", "SearchFoodUPC", { upc })
            .then(response => response.result);
        },
        async saveFoodItem(foodItem) {
            return postEndpoint("Physical", "SaveFoodItem", { model: foodItem })
            .then(response => response.result);
        },
        async addFoodItemToMeal(model) {
            return postEndpoint("Physical", "AddFoodItemToMeal", model)
            .then(response => response.result);
        },
        async replaceOGFoodItem(id_OG, id_New) {
            return postEndpoint("Physical", "ReplaceOGFoodItem", {id_OG, id_New});
        },
        async logWater(amountFLOZ, dateTime, mealID) {
            return postEndpoint("Physical", "LogWater", { amountFLOZ, dateTime, mealID })
            .then(response => response.result);
        },
        async setMealTime(mealID, startAt, endAt) {
            return postEndpoint("Physical", "SetMealTime", { mealID, startAt, endAt })
            .then(response => response.result);
        },
        async removeFoodItem(mealID, foodItemID) {
            return postEndpoint("Physical", "RemoveFoodItem", { mealID, foodItemID })
            .then(response => response.result);
        },
        runUpdates(updates) {
            let _this = this;
            /* Meal */
            if (updates.meals && updates.meals.length > 0) {
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
            if (updates.mealIDsRemoved && updates.mealIDsRemoved.length > 0) {
                updates.mealIDsRemoved.forEach(mealID => {
                    removeItemByID(mealID, _this.meals);
                    removeItemByID(mealID, _this.mealHistories);
                })
                sortAsc(_this.meals);
            }
            /* Food Item */
            if (updates.foodItems && updates.foodItems.length > 0) {
                updates.foodItems.forEach(foodItem => {
                    replaceOrAddItem(foodItem, this.foodItems);
                });
            }
            if (updates.foodItemIDsRemoved && updates.foodItemIDsRemoved.length > 0) {
                updates.foodItemIDsRemoved.forEach(foodItemID => {
                    removeItemByID(foodItemID, _this.foodItems);
                })
                sortAsc(_this.foodItems);
            }
            /* Water Log */
            if (updates.waterLogs && updates.waterLogs.length > 0) {
                updates.waterLogs.forEach(waterLog => {
                    replaceOrAddItem(waterLog, _this.waterLogs);
                })
                sortAsc(_this.waterLogs);
            }
            if (updates.waterLogIDsRemoved && updates.waterLogIDsRemoved.length > 0) {
                updates.waterLogIDsRemoved.forEach(waterLogID => {
                    removeItemByID(waterLogID, _this.waterLogs);
                })
                sortAsc(_this.waterLogs);
            }
        },
        connectSocket() {
            if (!initialized) {
                let coachConnection = getSocketConnection("coachHub");
                coachConnection.on("SendUpdates", updateModel => {
                    this.runUpdates(updateModel);
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