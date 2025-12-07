import { defineStore } from 'pinia'
import { getTodos, saveTodo, deleteTodo, createDefaultTask, createTask, mapItems, mapTypes, refreshRepetitionForRepeat, 
         createAndMapItem, deleteFutureRepetitionsForRepeat, deleteOrArchiveRepeat, deleteTodoTimePair, 
         toggleGoalTimePairTodoCompletion } from '../api/todoAPI';
import { replaceOrAddItem, removeItemByID, sortAsc, capitalize } from '../../utility';
import { getSocketConnection } from './socket'
import { useMetricStore } from '@/store/metricStore'
import { useGoalStore } from '@/store/goalStore'
import { useRoutineStore } from '@/store/routineStore'
import { postEndpoint } from '../api/api';

let initialized = false;

export const useTodoStore = defineStore('todo', {
    state: () => ({
        todos: []
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
            return getTodos()
                .then(res => this.todos = res);
        },
        initializeItems(todos) {
            let metricStore = useMetricStore();
            let goalStore = useGoalStore();
            let routineStore = useRoutineStore();

            todos = todos || this.todos;
            todos.forEach(todo => {
                todo.parents = this.todos.filter(x => todo.parentIDs.includes(x.id));
                todo.children = this.todos.filter(x => todo.childIDs.includes(x.id));
                todo.metrics = metricStore.getItems().filter(x => todo.metricIDs.includes(x.id));
                todo.goals = goalStore.getItems().filter(x => todo.goalIDs.includes(x.id));
                todo.routines = routineStore.getItems().filter(x => todo.routineIDs.includes(x.id));
            })
        },
        getItems() {
            return this.todos;
        },
        getItemsByID(ids) {
            return this.todos.filter(x => ids.includes(x.id));
        },
        getItem(id) {
            return this.todos.find(x => x.id == id);
        },
        saveTodo(model) {
            saveTodo(model);
        },
        deleteTodo(todoID) {
            deleteTodo(todoID);
        },
        createTask(todoID, date) {
            createTask(todoID, date);
        },
        createDefaultTask(text, isComplete, datetime) {
            createDefaultTask(text, isComplete, datetime);
        },
        createAndMapItem(todoID, itemType, itemText) {
            createAndMapItem(todoID, itemType, itemText);
        },
        saveText(todoID, text) {
            let model = {
                id: todoID,
                text: {
                    value: text
                }
            };
            saveTodo(model);
        },
        saveDescription(todoID, description) {
            let model = {
                id: todoID,
                description: {
                    value: description
                }
            };
            saveTodo(model);
        },
        savePoints(todoID, points) {
            let model = {
                id: todoID,
                points: {
                    value: points
                }
            };
            saveTodo(model);
        },
        saveType(todoID, typeID) {
            let model = {
                id: todoID,
                typeID: {
                    value: typeID
                }
            };
            saveTodo(model);
        },
        saveMedium(todoID, mediumID) {
            let model = {
                id: todoID,
                mediumID: {
                    value: mediumID
                }
            };
            saveTodo(model);
        },
        mapItems(todoID, itemType, addedIDs, removedIDs) {
            mapItems(todoID, itemType, addedIDs, removedIDs);
        },
        mapTypes(todoID, addedIDs, removedIDs) {
            mapTypes(todoID, addedIDs, removedIDs)
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
        toggleGoalTimePairTodoCompletion(goalTimePairTodoID, completedAt) {
            toggleGoalTimePairTodoCompletion(goalTimePairTodoID, completedAt);
        },
        deleteFutureRepetitionsForRepeat(id, repeatID, selectedDate) {
            deleteFutureRepetitionsForRepeat(id, repeatID, selectedDate);
        },
        deleteOrArchiveRepeat(todoID, repeatID) {
            deleteOrArchiveRepeat(todoID, repeatID);
        },
        deleteTimePair(id) {
            deleteTodoTimePair(id);
        },
        runUpdates(updates) {
            let _this = this;
            if (updates.todos && updates.todos.length > 0) {
                updates.todos.forEach(todo => {
                    replaceOrAddItem(todo, _this.todos);
                });
                this.initializeItems(updates.todos);
                sortAsc(_this.todos);
            }
            if (updates.todoIDsRemoved && updates.todoIDsRemoved.length > 0) {
                updates.todoIDsRemoved.forEach(todoID => {
                    removeItemByID(todoID, _this.todos);
                })
                sortAsc(_this.todos);
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