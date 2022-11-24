import { defineStore } from 'pinia'
import { getGoals, repositionTodo, repositionMetric } from '../api/goalAPI'
import { replaceItem, sortAsc } from '../../utility';
import { getSocketConnection } from './socket'

let initialized = false;

export const useGoalStore = defineStore('goal', {
    state: () => ({
        goals: []
    }),
    getters: {
        
    },
    actions: {
        async initialize() {
            this.fill();
            this.connectSocket();
            initialized = true;
        },
        async fill() {
            this.goals = await getGoals();
        },
        getItems() {
            return this.goals;
        },
        getItem(id) {
            return this.goals.find(x => x.id == id);
        },
        repositionMetric(goalID, metricID, newPosition) {
            repositionMetric(goalID, metricID, newPosition);
        },
        repositionTodo(goalID, todoID, newPosition) {
            repositionTodo(goalID, todoID, newPosition);
        },
        connectSocket() {
            if (!initialized) {
                let connection = getSocketConnection("goalHub");

                let _this = this;
                connection.on("UpdateGoals", goals => {
                    goals.forEach(goal => {
                        let exists = replaceItem(goal, _this.goals);
                        if (!exists) _this.goals.push(goal);
                    })
                    sortAsc(_this.goals);
                });

                connection.start();
                    // .then(() => connection.invoke("SendMessage", "Hello"));
            }
        }
    },
})