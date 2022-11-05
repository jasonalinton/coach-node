import { defineStore } from 'pinia'
import { getTodos } from '../api/todoAPI'

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
        async fill() {
            this.todos = await getTodos();
            console.log("wtf??")
        },
        remove() {
            this.todos = this.todos.filter(x => x.id < 17);
        }
    },
})