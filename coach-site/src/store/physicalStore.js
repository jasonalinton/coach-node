import { defineStore } from 'pinia';
import { getSocketConnection, deferUpdate } from './socket';
import { getNutritionHistory, getMealsInRange, getWaterLogs } from '../api/physicalAPI';
import { sortAsc, replaceOrAddItem, removeItemByID, addDay } from '../../utility';
import { postEndpoint } from '../api/api';
import { addYear } from '../../utility/timeUtility';

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
            let now = new Date();
            this.getNutritionHistory(null, addYear(now, -1), addDay(now, 1))
            .then(result => {  
                this.mealHistories = result.meals;
                this.waterLogs = result.waterLogs;
             });
             postEndpoint("Physical", "GetBodyMeasurements")
                .then(response => {
                    this.bodyMeasurements = response.result
                });

            initialized = true;
        },
        async getNutritionHistory(idTimeframe, startAt, endAt) {
            return postEndpoint("Physical", "GetNutritionHistory", { idTimeframe, startAt, endAt })
            .then(response => response.result);
        },
        getMealsInRange(startAt, endAt, shouldRequestServer) {
            let _this = this;
            if (shouldRequestServer) {
                getMealsInRange(startAt, endAt)
                .then(_meals => {
                    let meals = [..._this.meals];
                    _meals.forEach(meal => replaceOrAddItem(meal, meals));
                    _this.meals = sortAsc(meals);
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
            return postEndpoint("Physical", "FoodSearchAutoComplete", { query: searchTerm })
            .then(response => response.result);
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
            const deferred = [];
            /* Meal */
            if (updates.meals?.length > 0 || updates.mealIDsRemoved?.length > 0) {
                let meals = [..._this.meals];
                let mealHistories = [..._this.mealHistories];
                if (updates.meals?.length > 0) {
                    updates.meals.forEach(meal => {
                        replaceOrAddItem(meal, meals);
                        replaceOrAddItem({ id: meal.id, name: meal.name, dateTime: meal.dateTime, calories: meal.calories, carbs: meal.carbohydrates, protein: meal.protein, fat: meal.fat }, mealHistories);
                    });
                }
                if (updates.mealIDsRemoved?.length > 0) {
                    updates.mealIDsRemoved.forEach(id => { removeItemByID(id, meals); removeItemByID(id, mealHistories); });
                }
                deferred.push(() => { _this.meals = sortAsc(meals); _this.mealHistories = mealHistories; });
            }
            /* Food Item */
            if (updates.foodItems?.length > 0 || updates.foodItemIDsRemoved?.length > 0) {
                let foodItems = [..._this.foodItems];
                if (updates.foodItems?.length > 0) updates.foodItems.forEach(item => replaceOrAddItem(item, foodItems));
                if (updates.foodItemIDsRemoved?.length > 0) updates.foodItemIDsRemoved.forEach(id => removeItemByID(id, foodItems));
                deferred.push(() => { _this.foodItems = sortAsc(foodItems); });
            }
            /* Water Log */
            if (updates.waterLogs?.length > 0 || updates.waterLogIDsRemoved?.length > 0) {
                let waterLogs = [..._this.waterLogs];
                if (updates.waterLogs?.length > 0) updates.waterLogs.forEach(log => replaceOrAddItem(log, waterLogs));
                if (updates.waterLogIDsRemoved?.length > 0) updates.waterLogIDsRemoved.forEach(id => removeItemByID(id, waterLogs));
                deferred.push(() => { _this.waterLogs = sortAsc(waterLogs); });
            }
            deferred.forEach(fn => deferUpdate(fn));
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