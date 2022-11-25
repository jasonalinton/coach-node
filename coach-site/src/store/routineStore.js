import { defineStore } from 'pinia'
import { getRoutines } from '../api/routineAPI'
import { repositionItem } from '../api/itemAPI';
import { replaceItem, sortAsc } from '../../utility';
import { getSocketConnection } from './socket'

let initialized = false;

export const useRoutineStore = defineStore('routine', {
    state: () => ({
        routines: []
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
            this.routines = await getRoutines();
        },
        getItems() {
            return this.routines;
        },
        getItem(id) {
            return this.routines.find(x => x.id == id);
        },
        repositionItem(parentType, itemType, goalID, metricID, newPosition) {
            repositionItem(parentType, itemType, goalID, metricID, newPosition);
        },
        connectSocket() {
            if (!initialized) {
                let connection = getSocketConnection("routineHub");

                let _this = this;
                connection.on("UpdateRoutines", routines => {
                    routines.forEach(routine => {
                        let exists = replaceItem(routine, _this.routines);
                        if (!exists) _this.routines.push(routine);
                    })
                    sortAsc(_this.routines);
                });

                connection.start();
            }
        }
    },
})