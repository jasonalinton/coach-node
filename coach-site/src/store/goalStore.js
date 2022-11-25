import { defineStore } from 'pinia'
import { getGoals } from '../api/goalAPI'
import { repositionItem } from '../api/itemAPI';
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
        repositionItem(parentType, itemType, goalID, metricID, newPosition) {
            repositionItem(parentType, itemType, goalID, metricID, newPosition);
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