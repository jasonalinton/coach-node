import { defineStore } from 'pinia'

export const useGoalStore = defineStore('goal', {
    state: () => ({
        goals: []
    }),
    getters: {
        getGoals: (state) => state.count * 2,
    },
    actions: {
        increment() {
        this.count++
        },
    },
})