import { defineStore } from 'pinia'
import { getTodos } from '../api/todoAPI'
import { replaceItem, sortAsc } from '../../utility';
import { getSocketConnection } from './socket'

let initialized = false;

export const useTodoStore = defineStore('todo', {
    state: () => ({
        todos: []
    }),
    getters: {
        tableTodos: async (state) => {
            // let todos = await getTodos();
            return state.todos;
        },
    },
    actions: {
        async initialize() {
            this.fill();
            this.connectSocket();
            initialized = true;
        },
        async fill() {
            this.todos = await getTodos();
        },
        getItems() {
            return this.todos;
        },
        getItem(id) {
            return this.todos.find(x => x.id == id);
        },
        connectSocket() {
            if (!initialized) {
                let connection = getSocketConnection("todoHub");

                let _this = this;
                connection.on("UpdateTodos", todos => {
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