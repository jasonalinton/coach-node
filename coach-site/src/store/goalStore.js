import { defineStore } from 'pinia'
import { getGoals, getGoalsWithTimeframe } from '../api/goalAPI'
import { capitalize, replaceOrAddItem, sortAsc } from '../../utility';
import { getSocketConnection } from './socket'
import { useMetricStore } from '@/store/metricStore'
import { useTodoStore } from '@/store/todoStore'
import { useRoutineStore } from '@/store/routineStore'
import { GOAL_TYPE } from '../model/constants';
import { postEndpoint } from '../api/api';

        

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
        getActiveGoals(datetime) {
            var goals = this.goals.filter(goal => {
                var index = goal.timePairs.findIndex(timePair => {
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
        getFitnessGoals() {
            let fitnessGoals = this.goals.filter(goal => {
                let isFitness = goal.types.some(type => type.id == GOAL_TYPE.FITNESS);
                return isFitness;
            });
            return fitnessGoals;
        },
        saveGoal(model) {
            return postEndpoint("Goal", "SaveGoal", model)
            .then(response => response.result);
        },
        repositionItem(parentType, itemType, parentID, itemID, newPosition) {
            var data = { newPosition };
            data[`${parentType}ID`] = parentID;
            data.itemID = itemID;
        
            itemType = capitalize(itemType);
            parentType = capitalize(parentType);

            return postEndpoint(parentType, `Reposition${itemType}In${parentType}`, data);
        },
        createAndMapItem(goalID, itemType, itemText) {
            let data = { goalID, itemType, itemText };
            return postEndpoint("Goal", "CreateAndMapItemToGoal", data)
            .then(response => response.result);
        },
        mapItems(goalID, itemType, addedIDs, removedIDs) {
            let data = { goalID, itemType, addedIDs, removedIDs };
            return postEndpoint("Goal", "MapItemsToGoal", data)
            .then(response => response.result);
        },
        deleteTimePair(goalTimePairID) {
            return postEndpoint("Goal", "DeleteGoalTimePair", { goalTimePairID })
            .then(response => response.result);
        },
        unmapTodoFromGoalTimePair(goalTimePairTodoID) {
            return postEndpoint("Goal", "UnmapTodoFromGoalTimePair", { goalTimePairTodoID })
            .then(response => response.result);
        },
        saveDescription(goalID, description) {
            let model = {
                id: goalID,
                description: {
                    value: description
                }
            };
            this.saveGoal(model);
        },
        saveMetrics(goalID, addedIDs, removedIDs) {
            let model = {
                id: goalID,
                metrics: {
                    addedIDs,
                    removedIDs
                }
            };
            this.saveGoal(model);
        },
        saveTimePair(timePair) {
            return postEndpoint("Goal", "SaveGoalTimePair", { timePair })
            .then(response => response.result);
        },
        addReason(id, datetime, text) {
            return postEndpoint("Goal", "AddReason", { id, datetime, text })
            .then(response => response.result);
        },
        addBlurb(idGoal, blurb) {
            let data = { 
                idGoal, 
                idBlurbType: blurb.idType,
                ...blurb
            }
            return postEndpoint("Goal", "AddBlurbToGoal", data)
            .then(response => response.result);
        },
        updateBlurb(blurb) {
            let data = { 
                idBlurb: blurb.id, 
                idBlurbType: blurb.idType,
                ...blurb
            }
            return postEndpoint("Goal", "UpdateBlurbInGoal", data)
            .then(response => response.result);
        },
        runUpdates(updates) {
            let _this = this;
            if (updates.goals && updates.goals.length > 0) {
                updates.goals.forEach(goal => {
                    replaceOrAddItem(goal, _this.goals);
                })
                this.initializeItems(updates.goals);
                sortAsc(_this.goals);
            }
            if (updates.goalIDsRemoved && updates.goalIDsRemoved.length > 0) {
                updates.goalIDsRemoved.forEach(goalID => {
                    removeItemByID(goalID, _this.goals);
                })
                sortAsc(_this.goals);
            }
        },
        connectSocket() {
            if (!initialized) {
                let coachConnection = getSocketConnection("coachHub");
                coachConnection.on("SendUpdates", updateModel => {
                    this.runUpdates(updateModel);
                });
            }
        }
    },
})