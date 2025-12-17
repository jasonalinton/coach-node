import { defineStore } from 'pinia'
import { today, startOfDay } from '../../utility'
import { dateOnly } from '../../utility/timeUtility';

export const usePlannerStore = defineStore('planner', {
    state: () => ({
        currentTime: new Date(),
        selectedDate: today(new Date())
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
        selectDate(date) {
            this.selectedDate = startOfDay(new Date(date));
        },
        createRepeat() {
            return {
                id: null,
                routineRepeatID: null,
                startDate: dateOnly(new Date()),
                endDate: undefined,
                startTime: undefined,
                endTime: undefined,
                startRepeat: {
                    id: null,
                    dateTime: today(new Date()).toJSON(),
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
                duration: null,
                type: 80,
                timeframe: 63,
                moment: 0,
                points: null,
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
                idInheritance: 140,
                // idTimeframe: 43,
                idTimeframe: null,
                points: null,
                startTime: {
                    id: null,
                    dateTime: today(new Date()).toJSON(),
                    idType: 81,
                    idEndPoint: 84,
                    idMoment: 89
                },
                endTime: {
                    id: null,
                    dateTime: today(new Date()).toJSON(),
                    idType: 81,
                    idEndPoint: 84,
                    idMoment: 89
                },
                isOwner: true,
                isRecommended: false,
                isEventVisible: false,
                todoIDs: [],
            }
        }
    },
})