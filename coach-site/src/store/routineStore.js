import { defineStore } from 'pinia'
import { getRoutines } from '../api/routineAPI'
import { repositionItem } from '../api/itemAPI';
import { replaceItem, sortAsc } from '../../utility';
import { getSocketConnection } from './socket'
import { useMetricStore } from '@/store/metricStore'
import { useTodoStore } from '@/store/todoStore'
import { useGoalStore } from '@/store/goalStore'

let initialized = false;

export const useRoutineStore = defineStore('routine', {
    state: () => ({
        routines: []
    }),
    getters: {
        
    },
    actions: {
        async initialize() {
            let promise = this.fill();
            this.connectSocket();
            initialized = true;
            return promise;
        },
        async fill() {
            return getRoutines().then(res => this.routines = res);
        },
        initializeItems(routines) {
            let metricStore = useMetricStore();
            let todoStore = useTodoStore();
            let goalStore = useGoalStore();

            routines = routines || this.routines;
            routines.forEach(routine => {
                routine.parents = this.routines.filter(x => routine.parentIDs.includes(x.id));
                routine.children = this.routines.filter(x => routine.childIDs.includes(x.id));
                routine.metrics = metricStore.getItems().filter(x => routine.metricIDs.includes(x.id));
                routine.todos = todoStore.getItems().filter(x => routine.todoIDs.includes(x.id));
                routine.goals = goalStore.getItems().filter(x => routine.goalIDs.includes(x.id));
            })
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
                    this.initializeItems(routines);
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