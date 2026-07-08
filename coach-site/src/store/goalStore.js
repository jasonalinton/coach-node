import { defineStore } from 'pinia'
import { markRaw } from 'vue'
import { getGoals, getGoalsWithTimeframe } from '../api/goalAPI'
import { capitalize, replaceOrAddItem, sortAsc, sum } from '../../utility';
import { getSocketConnection, deferUpdate } from './socket'
import { useMetricStore } from '@/store/metricStore'
import { useTodoStore } from '@/store/todoStore'
import { useRoutineStore } from '@/store/routineStore'
import { useIterationStore } from '@/store/iterationStore'
import { GOAL_TYPE } from '../model/constants';
import { postEndpoint } from '../api/api';

        

let initialized = false;

export const useGoalStore = defineStore('goal', {
    state: () => ({
        goals: []
    }),
    getters: {
        fitnessGoals: (state) => {
            let fitnessGoals = state.goals.filter(goal => {
                let isFitness = goal.types.some(type => type.id == GOAL_TYPE.FITNESS);
                return isFitness;
            });
            return fitnessGoals;
        }
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
            return promise;
        },
        initializeItems(goals, allGoals) {
            let metricStore = useMetricStore();
            let todoStore = useTodoStore();
            let routineStore = useRoutineStore();

            allGoals = allGoals || this.goals;
            goals = goals || allGoals;
            goals.forEach(goal => {
                goal.parents  = markRaw(allGoals.filter(x => goal.parentIDs.includes(x.id)));
                goal.children = markRaw(allGoals.filter(x => goal.childIDs.includes(x.id)));
                goal.metrics  = markRaw(metricStore.getItems().filter(x => goal.metricIDs.includes(x.id)));
                goal.todos    = markRaw(todoStore.getItems().filter(x => goal.todoIDs.includes(x.id)));
                goal.routines = markRaw(routineStore.getItems().filter(x => goal.routineIDs.includes(x.id)));
            })
        },
        getItems() {
            return this.goals;
        },
        getItem(id) {
            return this.goals.find(x => x.id == id);
        },
        getTimeframeItems(start, end) {
            return getGoalsWithTimeframe(start, end)
                .then(goals => {
                    let allGoals = [...this.goals];
                    goals.forEach(goal => replaceOrAddItem(goal, allGoals));
                    this.initializeItems(goals, allGoals);
                    this.goals = sortAsc(allGoals);
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
                    if ((start && +start <= +datetime) && ((end && +end >= +datetime) || end == undefined)) {
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
        getPoints(goalID) {
            let iterationIDs = this.getIterationIDs(goalID);
            let iterationStore = useIterationStore();
            let iterations = iterationStore.iterations
                .filter(task => iterationIDs.includes(task.id));
            let iterations_Attempted = iterations.filter(task => task.completedAt || task.attemptedAt);
            let iterations_WithPoints = iterations_Attempted.filter(x => x.points);
            let points = sum(iterations_WithPoints, 'points');
            return points;
        },
        getIterationIDs(goalID) {
            let idsChecked = { goals: [], todos: [], iterations: [] };
            this.getAncensorIterationsFromGoal(goalID, idsChecked);
            return idsChecked.iterations;
        },
        getAncensorIterationsFromGoal(goalID, idsChecked) {
            if (!idsChecked.goals.includes(goalID)) {
                idsChecked.goals.push(goalID);
                let goal = this.goals.find(goal => goal.id == goalID);
                
                /* Loop through todos */
                goal.todoIDs.forEach(todoID => {
                    this.getAncestorIterationsFromTodo(todoID, idsChecked);
                })
                /* Loop through goals */
                goal.childIDs.forEach(goalID => {
                    this.getAncensorIterationsFromGoal(goalID, idsChecked);
                })
            }
        },
        getAncestorIterationsFromTodo(todoID, idsChecked) {
            if (!idsChecked.todos.includes(todoID)) {
                idsChecked.todos.push(todoID);
                
                /* Loop through todo's children */
                let todoStore = useTodoStore();
                let todo = todoStore.getItem(todoID);
                todo.childIDs.forEach(childID => {
                    this.getAncestorIterationsFromTodo(childID, idsChecked);
                })
                
                /* Record iteration ids */
                let iterationStore = useIterationStore();
                let iterations = iterationStore.getIterationsForTodo(todoID); 
                let iterationIDs = iterations.map(x => x.id);
                idsChecked.iterations = idsChecked.iterations.concat(iterationIDs);
            }
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
        createIteration(idGoal, text, datetime) {
            return postEndpoint("Goal", "CreateIterationForGoal", { idGoal, text, datetime })
            .then(response => response.result);
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
                ...blurb,
                idGoal, 
                idBlurbType: blurb.idType,
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
            const hasGoals = updates.goals?.length > 0;
            const hasRemovals = updates.goalIDsRemoved?.length > 0;
            if (!hasGoals && !hasRemovals) return;

            let goals = [...this.goals];
            if (hasGoals) {
                updates.goals.forEach(goal => replaceOrAddItem(goal, goals));
                this.initializeItems(updates.goals, goals);
            }
            if (hasRemovals) {
                updates.goalIDsRemoved.forEach(id => removeItemByID(id, goals));
            }
            deferUpdate(() => { this.goals = sortAsc(goals); });
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