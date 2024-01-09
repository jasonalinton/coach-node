import { defineStore } from 'pinia'
import { today } from '../../utility'

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
        },
        createRepeat() {
            return {
                id: null,
                routineRepeatID: null,
                startRepeat: {
                    id: null,
                    dateTime: today(new Date()).toISOString(),
                    type: 80,
                    endPoint: 84,
                    moment: 87,
                    idType: 80,
                    idEndPoint: 84,
                    idMoment: 87
                },
                endRepeat: null,
                startIteration: null,
                endIteration: null,
                // startDate: "2023-10-01T00:00:00Z",
                // endDate: "2023-11-04T00:00:00Z",
                // iterationStartTime: null,
                // iterationEndTime: null,
                duration: null,
                type: 80,
                timeframe: 63,
                moment: 0,
                position: null,
                isRecommended: false,
                isEventVisible: false,
                idInheritance: 142,
                idType: 80,
                idTimeframe: 63,
                idMoment: 0,
                // idTodo: 519,
                todoIDs: [],
                interval: 1,
                frequency: 1,
                pointInTime: null,
                pointInTimeIndex: 0,
                dayIndecies: [],
                routineRepeat: null,
                todoRepeats: [],
                positions: []
            }
        },
        createTimePair() {
            return {
                id: null,
                idTodo: null,
                idParent: null,
                idTimeType: 80,
                idInheritance: 142,
                idTimeframe: 63,
                startTime: {
                    id: null,
                    dateTime: today(new Date()).toISOString(),
                    idType: 81,
                    idEndPoint: 84,
                    idMoment: 89
                },
                endTime: {
                    id: null,
                    dateTime: today(new Date()).toISOString(),
                    idType: 81,
                    idEndPoint: 84,
                    idMoment: 89
                },
                isOwner: true,
                isRecommended: false,
                isEventVisible: false,
            }
        }
    },
})