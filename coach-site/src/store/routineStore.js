import { defineStore } from 'pinia'
import { markRaw } from 'vue'
import { getRoutines, refreshRepetitionForRepeat } from '../api/routineAPI'
import { capitalize, replaceOrAddItem, sortAsc } from '../../utility';
import { ROUTINETYPES } from '../model/constants';
import { getSocketConnection, deferUpdate } from './socket'
import { useMetricStore } from '@/store/metricStore'
import { useTodoStore } from '@/store/todoStore'
import { useGoalStore } from '@/store/goalStore'
import { postEndpoint } from '../api/api';

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
        initializeItems(routines, allRoutines) {
            let metricStore = useMetricStore();
            let todoStore = useTodoStore();
            let goalStore = useGoalStore();

            allRoutines = allRoutines || this.routines;
            routines = routines || allRoutines;
            routines.forEach(routine => {
                routine.parents  = markRaw(allRoutines.filter(x => routine.parentIDs.includes(x.id)));
                routine.children = markRaw(allRoutines.filter(x => routine.childIDs.includes(x.id)));
                routine.metrics  = markRaw(metricStore.getItems().filter(x => routine.metricIDs.includes(x.id)));
                routine.todos    = markRaw(todoStore.getItems().filter(x => routine.todoIDs.includes(x.id)));
                routine.goals    = markRaw(goalStore.getItems().filter(x => routine.goalIDs.includes(x.id)));
            })
        },
        getItems(ids) {
            return this.routines = (ids) ? this.routines.find(x => ids.includes(x.id)) : this.routines;
        },
        getItem(id) {
            return this.routines.find(x => x.id == id);
        },
        getTaskRoutines() {
            let taskRoutines = this.routines.filter(x => x.isTaskRoutine);
            return taskRoutines;
        },
        getTaskRoutinesForDay(datetime) {
            let taskRoutines = this.routines.filter(routine => {
                let isActive = false;
                if (routine.isTaskRoutine) {
                    routine.repeats.forEach(repeat => {
                        if (+repeat.startDate.toDate() <= +datetime) {
                            if (!repeat.endDate) {
                                isActive = true;
                            } else if (+datetime <= +repeat.endDate.toDate()) {
                                isActive = true
                            }
                        }
                    })
                }
                return isActive;
            });
            return taskRoutines;
        },
        repositionItem(parentType, itemType, parentID, itemID, newPosition) {
            var data = { newPosition };
            data[`${parentType}ID`] = parentID;
            data.itemID = itemID;
        
            itemType = capitalize(itemType);
            parentType = capitalize(parentType);

            return postEndpoint(parentType, `Reposition${itemType}In${parentType}`, data);
        },
        refreshRepetitionForRepeat(id, repeatID) {
            refreshRepetitionForRepeat(id, repeatID);
        },
        saveRoutine(model) {
            return postEndpoint("Routine", "SaveRoutine", model)
            .then(response => response.result);
        },
        saveRepeat(repeat) {
            return postEndpoint("Routine", "SaveRoutineRepeat", { repeat })
            .then(response => response.result);
        },
        runUpdates(updates) {
            const hasRoutines = updates.routines?.length > 0;
            const hasRemovals = updates.routineIDsRemoved?.length > 0;
            if (!hasRoutines && !hasRemovals) return;

            let routines = [...this.routines];
            if (hasRoutines) {
                updates.routines.forEach(routine => replaceOrAddItem(routine, routines));
                this.initializeItems(updates.routines, routines);
            }
            if (hasRemovals) {
                updates.routineIDsRemoved.forEach(id => removeItemByID(id, routines));
            }
            deferUpdate(() => { this.routines = sortAsc(routines); });
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