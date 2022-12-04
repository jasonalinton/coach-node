import { defineStore } from 'pinia'
import { getGoals } from '../api/goalAPI'
import { repositionItem } from '../api/itemAPI';
import { replaceItem, sortAsc } from '../../utility';
import { getSocketConnection } from './socket'
import { useMetricStore } from '@/store/metricStore'
import { useTodoStore } from '@/store/todoStore'
import { useRoutineStore } from '@/store/routineStore'

        

let initialized = false;

export const useGoalStore = defineStore('goal', {
    state: () => ({
        goals: []
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
            return getGoals().then(res => this.goals = res);
        },
        initializeItems(goals) {
            let metricStore = useMetricStore();
            let todoStore = useTodoStore();
            let routineStore = useRoutineStore();

            goals = goals || this.goals;
            goals.forEach(goal => {
                goal.parents = this.goals.filter(x => goal.parentIDs.includes(x.id));
                goal.children = this.goals.filter(x => goal.childIDs.includes(x.id));
                goal.metrics = metricStore.getItems().filter(x => goal.metricIDs.includes(x.id));
                goal.todos = todoStore.getItems().filter(x => goal.todoIDs.includes(x.id));
                goal.routines = routineStore.getItems().filter(x => goal.routineIDs.includes(x.id));
            })
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
                    this.initializeItems(goals);
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