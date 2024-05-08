import { defineStore } from 'pinia'
import { getMetrics, getLogItems, logLogItem, deleteLogEntry } from '../api/metricAPI'
import { repositionItem } from '../api/itemAPI';
import { replaceOrAddItem, sortAsc, clone } from '../../utility';
import { getSocketConnection } from './socket'
import { useGoalStore } from '@/store/goalStore'
import { useTodoStore } from '@/store/todoStore'
import { useRoutineStore } from '@/store/routineStore'

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
        repositionItem(parentType, itemType, goalID, metricID, newPosition) {
            repositionItem(parentType, itemType, goalID, metricID, newPosition);
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
            return clone(this.logItems.find(x => x.id == id));
        },
        async logLogItem(model) {
            let _this = this;
            return logLogItem(model)
            .then((logItem) => {
                replaceOrAddItem(logItem, _this.logItems);
            });
        },
        async deleteLogEntry(logEntryID) {
            let _this = this;
            return deleteLogEntry(logEntryID)
            .then((logItem) => {
                replaceOrAddItem(logItem, _this.logItems);
            });
        },
        connectSocket() {
            if (!initialized) {
                let connection = getSocketConnection("metricHub");

                let _this = this;
                connection.on("UpdateMetrics", metrics => {
                    this.initializeItems(metrics);
                    metrics.forEach(metric => {
                        replaceOrAddItem(metric, _this.metrics);
                    })
                    sortAsc(_this.metrics);
                });
            }
        }
    },
})