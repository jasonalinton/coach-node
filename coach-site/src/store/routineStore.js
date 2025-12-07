import { defineStore } from 'pinia'
import { getRoutines, refreshRepetitionForRepeat, saveRoutine } from '../api/routineAPI'
import { capitalize, replaceOrAddItem, sortAsc } from '../../utility';
import { ROUTINETYPES } from '../model/constants';
import { getSocketConnection } from './socket'
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
        getItems(ids) {
            return this.routines = (ids) ? this.routines.find(x => ids.includes(x.id)) : this.routines;
        },
        getItem(id) {
            return this.routines.find(x => x.id == id);
        },
        getTaskRoutines() {
            let taskRoutines = this.routines.filter(x => x.types.findIndex(x => x.id == ROUTINETYPES.TASKROUTINE) > -1);
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
            saveRoutine(model);
        },
        toggleIsTaskRoutine() {

        },
        runUpdates(updates) {
            let _this = this;
            if (updates.routines && updates.routines.length > 0) {
                updates.routines.forEach(routine => {
                    replaceOrAddItem(routine, _this.routines);
                })
                this.initializeItems(updates.routines);
                sortAsc(_this.routines);
            }
            if (updates.routineIDsRemoved && updates.routineIDsRemoved.length > 0) {
                updates.routineIDsRemoved.forEach(routineID => {
                    removeItemByID(routineID, _this.routines);
                })
                sortAsc(_this.routines);
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