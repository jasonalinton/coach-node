import { defineStore } from 'pinia'
import { getTodos } from '../api/todoAPI';
import { repositionItem } from '../api/itemAPI';
import { replaceItem, sortAsc } from '../../utility';
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
        getItem(id) {
            return this.todos.find(x => x.id == id);
        },
        repositionItem(parentType, itemType, goalID, metricID, newPosition) {
            repositionItem(parentType, itemType, goalID, metricID, newPosition);
        },
        connectSocket() {
            if (!initialized) {
                let connection = getSocketConnection("todoHub");

                let _this = this;
                connection.on("UpdateTodos", todos => {
                    this.initializeItems(todos);
                    todos.forEach(todo => {
                        let exists = replaceItem(todo, _this.todos);
                        if (!exists) _this.todos.push(todo);
                    })
                    sortAsc(_this.todos);
                });

                connection.start();
            }
        }
    },
})