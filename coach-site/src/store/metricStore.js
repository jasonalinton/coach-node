import { defineStore } from 'pinia'
import { getMetrics, getLogItems, deleteLogEntry } from '../api/metricAPI'
import { replaceOrAddItem, sortAsc, clone, capitalize } from '../../utility';
import { getSocketConnection } from './socket'
import { useGoalStore } from '@/store/goalStore'
import { useTodoStore } from '@/store/todoStore'
import { useRoutineStore } from '@/store/routineStore'
import { postEndpoint } from '../api/api';

let initialized = false;

export const useMetricStore = defineStore('metric', {
    state: () => ({
        metrics: [],
        logItems: []
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
            return getMetrics().then(res => this.metrics = res);
        },
        initializeItems(metrics) {
            let goalStore = useGoalStore();
            let todoStore = useTodoStore();
            let routineStore = useRoutineStore();

            metrics = metrics || this.metrics;
            metrics.forEach(metric => {
                metric.parents = this.metrics.filter(x => metric.parentIDs.includes(x.id));
                metric.children = this.metrics.filter(x => metric.childIDs.includes(x.id));
                metric.goals = goalStore.getItems().filter(x => metric.goalIDs.includes(x.id));
                metric.todos = todoStore.getItems().filter(x => metric.todoIDs.includes(x.id));
                metric.routines = routineStore.getItems().filter(x => metric.routineIDs.includes(x.id));
            })
        },
        getItems() {
            return this.metrics;
        },
        getItem(id) {
            return this.metrics.find(x => x.id == id);
        },
        repositionItem(parentType, itemType, parentID, itemID, newPosition) {
            var data = { newPosition };
            data[`${parentType}ID`] = parentID;
            data.itemID = itemID;
        
            itemType = capitalize(itemType);
            parentType = capitalize(parentType);

            return postEndpoint(parentType, `Reposition${itemType}In${parentType}`, data);
        },
        initializeLogItems() {
            let _this = this;
            getLogItems()
            .then(logItems => {
                _this.logItems = logItems;
            })
        },
        getLogItems() {
            return clone(this.logItems);
        },
        getLogItem(id) {
            let logItem = this.logItems.find(x => x.id == id)
            return logItem ? clone(this.logItems.find(x => x.id == id)) : undefined;
        },
        async logLogItem(model) {
            let _this = this;
            return postEndpoint("Metric", "LogLogItem", model)
                .then((response) => {
                    if (response.result)
                        replaceOrAddItem(response.result, _this.logItems);
                });
        },
        async deleteLogEntry(logEntryID) {
            let _this = this;
            return deleteLogEntry(logEntryID)
            .then((logItem) => {
                replaceOrAddItem(logItem, _this.logItems);
            });
        },
        runUpdates(updates) {
            let _this = this;
            if (updates.metrics && updates.metrics.length > 0) {
                updates.metrics.forEach(metric => {
                    replaceOrAddItem(metric, _this.metrics);
                })
                this.initializeItems(updates.metrics);
                sortAsc(this.metrics);
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