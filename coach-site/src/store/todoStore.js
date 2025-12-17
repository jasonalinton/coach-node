import { defineStore } from 'pinia'
import { getTodos } from '../api/todoAPI';
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
            return postEndpoint("Todo", "SaveTodo", model)
            .then(response => response.result);
        },
        deleteTodo(id) {
            return postEndpoint("Todo", "DeleteTodo", { id })
            .then(response => response.result);
        },
        createTask(todoID, date) {
            return postEndpoint("Todo", "CreateTaskForTodo", { todoID, date })
            .then(response => response.result);
        },
        createDefaultTask(text, isComplete, datetime) {
            return postEndpoint("Todo", "CreateDefaultTask", { text, isComplete, datetime })
            .then(response => response.result);
        },
        createAndMapItem(todoID, itemType, itemText) {
            return postEndpoint("Todo", "CreateAndMapItemToTodo", { todoID, itemType, itemText })
            .then(response => response.result);
        },
        saveText(todoID, text) {
            let model = {
                id: todoID,
                text: {
                    value: text
                }
            };
            return this.saveTodo(model);
        },
        saveDescription(todoID, description) {
            let model = {
                id: todoID,
                description: {
                    value: description
                }
            };
            return this.saveTodo(model);
        },
        savePoints(todoID, points) {
            let model = {
                id: todoID,
                points: {
                    value: points
                }
            };
            return this.saveTodo(model);
        },
        saveType(todoID, typeID) {
            let model = {
                id: todoID,
                typeID: {
                    value: typeID
                }
            };
            return this.saveTodo(model);
        },
        saveMedium(todoID, mediumID) {
            let model = {
                id: todoID,
                mediumID: {
                    value: mediumID
                }
            };
            return this.saveTodo(model);
        },
        mapItems(todoID, itemType, addedIDs, removedIDs) {
            let data = { todoID, itemType, addedIDs, removedIDs };
            return postEndpoint("Todo", "MapItemsToTodo", data)
            .then(response => response.result);
        },
        mapTypes(todoID, addedIDs, removedIDs) {
            let data = { todoID, addedIDs, removedIDs };
            return postEndpoint("Todo", "MapTypesToTodo", data)
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
        refreshRepetitionForRepeat(id, repeatID) {
            let data = { id, repeatID };
            return postEndpoint("Todo", "RefreshRepetitionForTodo", data)
            .then(response => response.result);
        },
        toggleGoalTimePairTodoCompletion(goalTimePairTodoID, completedAt) {
            let data = { goalTimePairTodoID, completedAt };
            return postEndpoint("Todo", "ToggleGoalTimePairTodoCompletion", data)
            .then(response => response.result);
        },
        deleteFutureRepetitionsForRepeat(id, repeatID, selectedDate) {
            let data = { id, repeatID, selectedDate };
            return postEndpoint("Todo", "DeleteFutureRepetitionsForTodo", data)
            .then(response => response.result);
        },
        deleteOrArchiveRepeat(todoID, repeatID) {
            let data = { todoID, repeatID };
            return postEndpoint("Todo", "DeleteOrArchiveRepeat", data)
            .then(response => response.result);
        },
        deleteTimePair(id) {
            return postEndpoint("Todo", "DeleteTodoTimePair", { id })
            .then(response => response.result);
        },
        saveTimePair(timePair) {
            return postEndpoint("Todo", "SaveTodoTimePair", { timePair })
            .then(response => response.result);
        },
        saveRepeat(repeat) {
            return postEndpoint("Todo", "SaveTodoRepeat", { repeat })
            .then(response => response.result);
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