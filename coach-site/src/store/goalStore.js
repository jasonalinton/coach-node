import { defineStore } from 'pinia'
import { getGoals, saveGoal, addReason, getGoalsWithTimeframe, createAndMapItem, 
    mapItems, deleteTimePair, unmapTodoFromGoalTimePair } from '../api/goalAPI'
import { repositionItem } from '../api/itemAPI';
import { replaceOrAddItem, sortAsc } from '../../utility';
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
        async refresh() {
            let promise = this.fill();
            return promise;
        },
        async fill() {
            let promise = getGoals().then(res => this.goals = res);
            this.initializeItems();
            return promise;
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
        getTimeframeItems(start, end) {
            let _this = this;
            return getGoalsWithTimeframe(start, end)
                .then(goals => {
                    goals.forEach(goal => {
                        replaceOrAddItem(goal, _this.goals);
                    })
                    this.initializeItems(goals);
                    sortAsc(_this.goals);
                    return goals;
                });
        },
        getGoalsInTimeframe(timeFrameID, datetime) {
            var goals = this.goals.filter(goal => {
                var index = goal.timePairs.findIndex(timePair => {
                    if (timePair.idTimeframe != timeFrameID) {
                        return false;
                    }

                    let start = (timePair.startTime) ? new Date(timePair.startTime.dateTime) : undefined
                    let end = (timePair.endTime) ? new Date(timePair.endTime.dateTime) : undefined
                    if ((start && +start <= +datetime) && (end && +end >= +datetime)) {
                        return true;
                    }
                    return false;
                });
                return index > -1;
            });
            return goals;
        },
        repositionItem(parentType, itemType, goalID, metricID, newPosition) {
            repositionItem(parentType, itemType, goalID, metricID, newPosition);
        },
        createAndMapItem(goalID, itemType, itemText) {
            createAndMapItem(goalID, itemType, itemText);
        },
        mapItems(goalID, itemType, addedIDs, removedIDs) {
            mapItems(goalID, itemType, addedIDs, removedIDs);
        },
        deleteTimePair(goalTimePairID) {
            deleteTimePair(goalTimePairID);
        },
        unmapTodoFromGoalTimePair(goalTimePairTodoID) {
            unmapTodoFromGoalTimePair(goalTimePairTodoID);
        },
        saveDescription(goalID, description) {
            let model = {
                id: goalID,
                description: {
                    value: description
                }
            };
            saveGoal(model);
        },
        addReason(id, datetime, text) {
            addReason(id, datetime, text);
        },
        connectSocket() {
            if (!initialized) {
                let connection = getSocketConnection("goalHub");

                let _this = this;
                connection.on("UpdateGoals", goals => {
                    goals.forEach(goal => {
                        replaceOrAddItem(goal, _this.goals);
                    })
                    this.initializeItems(goals);
                    sortAsc(_this.goals);
                });
            }
        }
    },
})