import { defineStore } from 'pinia'

export const usePlannerStore = defineStore('planner', {
    state: () => ({
        currentTime: new Date()
    }),
    getters: {
        
    },
    actions: {
        startClock() {
            this.currentTime = new Date();
            let seconds = this.currentTime.getSeconds();
            
            setTimeout(() => {
                this.currentTime = new Date();
                setInterval(() => {
                    this.currentTime = new Date();
                }, 60000);
            }, (60 - seconds) * 1000)
        }
    },
})