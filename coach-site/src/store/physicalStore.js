import { defineStore } from 'pinia';
import { getSocketConnection } from './socket';
import { getMealsInRange, foodSearchAutoComplete, addFoodItemToMeal } from '../api/physicalAPI';
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
        async foodSearchAutoComplete(searchTerm) {
            let result = await foodSearchAutoComplete(searchTerm);
            return result;
        },
        async addFoodItemToMeal(model) {
            addFoodItemToMeal(model);
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