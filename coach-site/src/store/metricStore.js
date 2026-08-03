import { defineStore } from 'pinia'
import { markRaw } from 'vue'
import { getMetrics, getLogItems, deleteLogEntry } from '../api/metricAPI'
import { replaceOrAddItem, sortAsc, clone, capitalize } from '../../utility';
import { getSocketConnection, deferUpdate } from './socket'
import { useGoalStore } from '@/store/goalStore'
import { useTodoStore } from '@/store/todoStore'
import { useRoutineStore } from '@/store/routineStore'
import { postEndpoint } from '../api/api';

let initialized = false;

export const useMetricStore = defineStore('metric', {
    state: () => ({
        metrics: [],
        logItems: [],
        draggedKanbanTask: null
    }),
    getters: {
        getDraggedKanbanTask: (state) => state.draggedKanbanTask
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
        initializeItems(metrics, allMetrics) {
            let goalStore = useGoalStore();
            let todoStore = useTodoStore();
            let routineStore = useRoutineStore();

            allMetrics = allMetrics || this.metrics;
            metrics = metrics || allMetrics;
            metrics.forEach(metric => {
                metric.parents  = markRaw(allMetrics.filter(x => metric.parentIDs.includes(x.id)));
                metric.children = markRaw(allMetrics.filter(x => metric.childIDs.includes(x.id)));
                metric.goals    = markRaw(goalStore.getItems().filter(x => metric.goalIDs.includes(x.id)));
                metric.todos    = markRaw(todoStore.getItems().filter(x => metric.todoIDs.includes(x.id)));
                metric.routines = markRaw(routineStore.getItems().filter(x => metric.routineIDs.includes(x.id)));
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
        createAndMapItem(metricID, itemType, itemText) {
            let data = { metricID, itemType, itemText };
            return postEndpoint("Metric", "CreateAndMapItemToMetric", data)
            .then(response => response.result);
        },
        mapItems(metricID, itemType, addedIDs, removedIDs) {
            let data = { metricID, itemType, addedIDs, removedIDs };
            return postEndpoint("Metric", "MapItemsToMetric", data)
            .then(response => response.result);
        },
        saveMetric(model) {
            return postEndpoint("Metric", "SaveMetric", model)
            .then(response => response.result);
        },
        saveDescription(metricID, description) {
            let model = {
                id: metricID,
                description: {
                    value: description
                }
            };
            this.saveMetric(model);
        },
        addBlurb(idMetric, blurb) {
            let data = {
                ...blurb,
                idMetric,
                idBlurbType: blurb.idType,
            }
            return postEndpoint("Metric", "AddBlurbToMetric", data)
            .then(response => response.result);
        },
        updateBlurb(blurb) {
            let data = {
                idBlurb: blurb.id,
                idBlurbType: blurb.idType,
                ...blurb
            }
            return postEndpoint("Metric", "UpdateBlurbInMetric", data)
            .then(response => response.result);
        },
        setDraggedKanbanTask(item) {
            this.draggedKanbanTask = item;
        },
        clearDraggedKanbanTask() {
            this.draggedKanbanTask = null;
        },
        setKanbanTask(idParent, idDescendant, idTodo, idIteration, idColumn, idTimeframe, positionDescendant, date, dateAdded, dateRemoved) {
            let data = { idParent, idDescendant, idTodo, idIteration, idColumn, idTimeframe, positionDescendant, date, dateAdded, dateRemoved };
            return postEndpoint("Metric", "SetKanbanTask", data)
            .then(response => response.result);
        },
        removeKanbanTask(id, dateRemoved) {
            return postEndpoint("Metric", "RemoveKanbanTask", { id, dateRemoved })
            .then(response => response.result);
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
            if (!updates.metrics?.length) return;

            let metrics = [...this.metrics];
            updates.metrics.forEach(metric => replaceOrAddItem(metric, metrics));
            this.initializeItems(updates.metrics, metrics);
            deferUpdate(() => { this.metrics = sortAsc(metrics); });
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