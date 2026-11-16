import { defineStore } from 'pinia'
import { markRaw, nextTick } from 'vue'
import { getTodos } from '../api/todoAPI';
import { replaceOrAddItem, removeItemByID, sortAsc, capitalize, indexByID, pickByID, getByID } from '../../utility';
import { getSocketConnection, deferUpdate } from './socket'
import { useMetricStore } from '@/store/metricStore'
import { useGoalStore } from '@/store/goalStore'
import { useRoutineStore } from '@/store/routineStore'
import { postEndpoint } from '../api/api';
import { TODOTYPE } from '../model/constants';
import Todo from '../model/item/Todo';
import { perfStart, perfEnd, perfMeasure } from '../perf';

let initialized = false;

// Todo IDs requested through requestTodo, batched into a single GetTodosWithIDs call
let requestedTodoIDs = new Set();
let pendingTodoIDs = [];

export const useTodoStore = defineStore('todo', {
    state: () => ({
        todos: [],
        todoModels: [],
        requests: [],
        draggedKanbanTask: null
    }),
    getters: {
        getDraggedKanbanTask: (state) => state.draggedKanbanTask,
        // id -> [index, item]; rebuilt only when the list changes
        todoIndex: (state) => indexByID(state.todos)
    },
    actions: {
        async initialize() {
            let promise = this.fill();
            this.connectSocket();
            initialized = true;
            return promise;
        },
        async fill() {
            return this.requestTodos();
        },
        initializeItems(todos, allTodos) {
            let metricStore = useMetricStore();
            let goalStore = useGoalStore();
            let routineStore = useRoutineStore();

            allTodos = allTodos || this.todos;
            todos = todos || allTodos;
            let start = perfStart();
            let todoIndex    = indexByID(allTodos);
            let metricIndex  = metricStore.metricIndex;
            let goalIndex    = goalStore.goalIndex;
            let routineIndex = routineStore.routineIndex;
            todos.forEach(todo => {
                todo.parents  = markRaw(pickByID(todo.parentIDs, todoIndex));
                todo.children = markRaw(pickByID(todo.childIDs, todoIndex));
                todo.metrics  = markRaw(pickByID(todo.metricIDs, metricIndex));
                todo.goals    = markRaw(pickByID(todo.goalIDs, goalIndex));
                todo.routines = markRaw(pickByID(todo.routineIDs, routineIndex));
            })
            perfEnd('todos:init', start, { count: todos.length, total: allTodos.length });
        },
        isRequestProcessing() {
            return this.requests.some(r => r.endpoint == "GetTodos" && r.isProcessing);
        },
        wasRequested(endpoint, props) {
            var wasRequested = this.requests.some(r => r.endpoint == endpoint && JSON.stringify(r.props) == JSON.stringify(props));
            return wasRequested;
        },
        // getTodos() {
        //     return postEndpoint("Todo", "GetTodos")
        //     .then(response => response.result);
        // },
        getItems() {
            return this.todos;
        },
        requestTodo(idTodo) {
            if (requestedTodoIDs.has(idTodo)) return;
            requestedTodoIDs.add(idTodo);
            pendingTodoIDs.push(idTodo);
            // Collect every ID requested in the same tick (e.g. a computed looping over a routine's todos)
            if (pendingTodoIDs.length == 1) {
                setTimeout(() => this.requestPendingTodos(), 0);
            }
        },
        requestPendingTodos() {
            let ids = pendingTodoIDs;
            pendingTodoIDs = [];

            let fetchStart = perfStart();
            // Default properties plus blurbIds (used by TodoForm); All-Properties also returns every iteration/event
            return postEndpoint("Todo", "GetTodosWithIDs", { ids }, { 'Include-Properties': JSON.stringify(['blurbs']) })
                .then(response => {
                    perfEnd('todos:fetchByID', fetchStart, { count: ids.length });
                    if (!response || !response.status || !response.status.success) {
                        ids.forEach(id => requestedTodoIDs.delete(id));
                        return;
                    }

                    let todos = response.result;
                    this.initializeItems(todos);

                    todos.forEach(todo => {
                        replaceOrAddItem(todo, this.todos);
                        replaceOrAddItem(new Todo(todo), this.todoModels);
                    });
                    
                    this.runUpdates(response);
                    return response;
                });
        },
        requestTodos() {
            let request = {
                endpoint: "GetTodos",
                props: undefined,
                time: new Date(),
                isProcessing: true
            };
            this.requests.push(request);
            let dropRequest = () => { this.requests = this.requests.filter(r => r !== request); };

            let fetchStart = perfStart();
            return postEndpoint("Todo", "GetTodos")
            .then(response => {
                perfEnd('todos:fetch', fetchStart);
                if (!response || !response.status || !response.status.success) {
                    dropRequest();
                    return;
                }
                
                let processStart = perfStart();
                let todos = [...this.todos];
                // Replace items
                response.result.forEach(todo => replaceOrAddItem(todo, todos));
                // Fill todo models
                todos.forEach(todo => {
                    this.todoModels.push(new Todo(todo));
                });
                this.todos = sortAsc(todos);
                perfEnd('todos:process', processStart, { count: response.result.length });
                this.trackRender(processStart);
                
                this.runUpdates(response);
                request.isProcessing = false;
                return response;
            })
            .catch(dropRequest);
        },
        getItemsByID(ids) {
            return pickByID(ids, this.todoIndex);
        },
        getItem(id) {
            let todo = getByID(id, this.todoIndex);
            // Fetch todos that aren't loaded, except while the initial GetTodos load is still in flight
            if (!todo && id > 0 && !this.isRequestProcessing()) {
                this.requestTodo(id);
            }
            return todo;
        },
        getItemModel(id) {
            this.requestTodo(id);
            return this.todoModels.find(x => x.id == id);
        },
        getMemorizationTodos(shouldRequestServer) {
            if (shouldRequestServer) {
                postEndpoint("Todo", "GetMemorizationTodos")
                    .then(response => this.runUpdates({ todos: response }));
            }

            let todos = this.todos
                .filter(todo => todo.typeID == TODOTYPE.MEMORIZATION);
            return todos;
        },
        getDescendantIDs(id) {
            let descentIDs = [];
            let todo = getByID(id, this.todoIndex);
            todo.childIDs.forEach(childID => {
                this.getDescendantIDsLopp(childID, descentIDs);
            })
            return descentIDs;
        },
        getDescendantIDsLopp(id, descentIDs) {
            let _id = descentIDs.includes(id);
            if (!_id) {
                descentIDs.push(id);
                let todo = getByID(id, this.todoIndex);
                if (todo == undefined) {
                    return; // Todo is deleted
                }
                todo.childIDs.forEach(childID => {
                    this.getDescendantIDsLopp(childID, descentIDs);
                })
            } else {
                return;
            }
        },
        newTodo() {
            let negativeIDs = this.todoModels.filter(x => x.id < 0).map(x => x.id);
            let nextID = (negativeIDs.length > 0) ? Math.min(...negativeIDs) + - 1 : -1;
            let newTodo = new Todo({ id: nextID });
            this.todoModels.push(newTodo);
            return newTodo.data;
        },
        removeVersion(id, component) {
            let todoModel = this.todoModels.find(x => x.id == id);
            if (todoModel) {
                todoModel.versions = todoModel.versions.filter(v => v.component !== component);
            }
        },
        removeNewTodo(id) {5
            removeItemByID(id, this.todos);
            removeItemByID(id, this.todoModels);
        },
        saveTodo(model) {
            return postEndpoint("Todo", "SaveTodo", model)
            .then(response => response.result);
        },
        deleteTodo(id) {
            return postEndpoint("Todo", "DeleteTodo", { id })
            .then(response => response.result);
        },
        createTask(todoID, datetime) {
            return postEndpoint("Todo", "CreateTaskForTodo", { todoID, datetime })
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
        addBlurb(idTodo, blurb) {
            let data = { ...blurb, idTodo, idBlurbType: blurb.idType };
            return postEndpoint("Todo", "AddBlurbToTodo", data).then(response => response.result);
        },
        updateBlurb(blurb) {
            let data = { ...blurb, idBlurb: blurb.id, idBlurbType: blurb.idType };
            return postEndpoint("Todo", "UpdateBlurbInTodo", data).then(response => response.result);
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
        setDraggedKanbanTask(item) {
            this.draggedKanbanTask = item;
        },
        clearDraggedKanbanTask() {
            this.draggedKanbanTask = null;
        },
        setKanbanTask(idParent, idDescendant, idTodo, idIteration, idColumn, idTimeframe, positionDescendant, date, dateAdded, dateRemoved) {
            let data = { idParent, idDescendant, idTodo, idIteration, idColumn, idTimeframe, positionDescendant, date, dateAdded, dateRemoved };
            return postEndpoint("Todo", "SetKanbanTask", data)
            .then(response => response.result);
        },
        removeKanbanTask(id, dateRemoved) {
            return postEndpoint("Todo", "RemoveKanbanTask", { id, dateRemoved })
            .then(response => response.result);
        },
        runUpdates(updates) {
            const hasTodos = updates.todos?.length > 0;
            const hasRemovals = updates.todoIDsRemoved?.length > 0;
            if (!hasTodos && !hasRemovals) return;

            let detail = { updated: updates.todos?.length || 0, removed: updates.todoIDsRemoved?.length || 0 };
            let todos = [...this.todos];
            perfMeasure('todos:update', () => {
                if (hasTodos) {
                    updates.todos.forEach(todo => replaceOrAddItem(todo, todos));
                    this.initializeItems(updates.todos, todos);
                }
                if (hasRemovals) {
                    updates.todoIDsRemoved.forEach(id => removeItemByID(id, todos));
                }
            }, detail);
            deferUpdate(() => {
                let start = perfStart();
                perfMeasure('todos:apply', () => { this.todos = sortAsc(todos); }, detail);
                this.trackRender(start, detail);
            });
        },
        // Measures from the todos assignment until Vue has finished re-rendering the components that depend on it
        trackRender(start, detail) {
            if (start !== undefined) {
                nextTick(() => perfEnd('todos:render', start, detail));
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