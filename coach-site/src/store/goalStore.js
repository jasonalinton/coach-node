import { defineStore } from 'pinia'
import { getGoals } from '../api/goalAPI'

export const useGoalStore = defineStore('goal', {
    state: () => ({
        goals: []
    }),
    getters: {
        tableGoals: async (state) => {
            // let goals = await getGoals();
            return state.goals;
        },
    },
    actions: {
        async fill() {
            this.goals = await getGoals();
        },
        remove() {
            this.goals = this.goals.filter(x => x.id < 17);
        }
        // getGoals() {
        //     let goals = await getGoals();
        // },
    },
})