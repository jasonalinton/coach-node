import { defineStore } from 'pinia';
import { getSocketConnection } from './socket';
import { getMealsInRange, getRecentFoodItems, foodSearchAutoComplete, searchFoodUPC, 
    addFoodItemToMeal, setMealTime, removeFoodItem } from '../api/physicalAPI';
import { sortAsc, replaceOrAddItem, removeItemByID } from '../../utility';

let initialized = false;

export const usePhysicalStore = defineStore('physical', {
    state: () => ({
        meals: []
    }),
    getters: {
        
    },
    actions: {
        async initialize() {
            this.connectSocket();
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
        async foodSearchAutoComplete(searchTerm) {
            let result = await foodSearchAutoComplete(searchTerm);
            return result;
        },
        async searchFoodUPC(upc) {
            let result = await searchFoodUPC(upc);
            return result;
        },
        async addFoodItemToMeal(model) {
            addFoodItemToMeal(model);
        },
        async setMealTime(mealID, startAt, endAt) {
            setMealTime(mealID, startAt, endAt);
        },
        async removeFoodItem(mealID, foodItemID) {
            removeFoodItem(mealID, foodItemID);
        },
        connectSocket() {
            if (!initialized) {
                let connection = getSocketConnection("metricHub");

                let _this = this;
                connection.on("UpdateMeals", meals => {
                    meals.forEach(meal => {
                        replaceOrAddItem(meal, _this.meals);
                    })
                    sortAsc(_this.meals);
                });
                connection.on("RemoveMeals", mealIDs => {
                    mealIDs.forEach(mealID => {
                        removeItemByID(mealID, _this.meals);
                    })
                    sortAsc(_this.meals);
                });
            }
        }
    },
})