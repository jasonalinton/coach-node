import { defineStore } from 'pinia'
import { getTodos, saveTodo, deleteTodo, createDefaultTask, createTask, mapItems, mapTypes, refreshRepetitionForRepeat, createAndMapItem,
    deleteFutureRepetitionsForRepeat, deleteOrArchiveRepeat, deleteTodoTimePair } from '../api/todoAPI';
import { repositionItem } from '../api/itemAPI';
import { replaceOrAddItem, removeItemByID, sortAsc } from '../../utility';
import { getSocketConnection } from './socket'
import { useMetricStore } from '@/store/metricStore'
import { useGoalStore } from '@/store/goalStore'
import { useRoutineStore } from '@/store/routineStore'

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
        createTask(todoID) {
            createTask(todoID);
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
        repositionItem(parentType, itemType, goalID, metricID, newPosition) {
            repositionItem(parentType, itemType, goalID, metricID, newPosition);
        },
        refreshRepetitionForRepeat(id, repeatID) {
            refreshRepetitionForRepeat(id, repeatID);
        },
        deleteFutureRepetitionsForRepeat(id, repeatID) {
            deleteFutureRepetitionsForRepeat(id, repeatID);
        },
        deleteOrArchiveRepeat(repeatID) {
            deleteOrArchiveRepeat(repeatID);
        },
        deleteTimePair(id) {
            deleteTodoTimePair(id);
        },
        connectSocket() {
            if (!initialized) {
                let connection = getSocketConnection("todoHub");

                let _this = this;
                connection.on("UpdateTodos", todos => {
                    todos.forEach(todo => {
                        replaceOrAddItem(todo, _this.todos);
                    });
                    this.initializeItems(todos);
                    sortAsc(_this.todos);
                });
                connection.on("RemoveTodos", todoIDs => {
                    todoIDs.forEach(todoID => {
                        removeItemByID(todoID, _this.todos);
                    })
                    sortAsc(_this.todos);
                });
            }
        }
    },
})