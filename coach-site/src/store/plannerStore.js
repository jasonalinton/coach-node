import { defineStore } from 'pinia'
import { today, startOfDay } from '../../utility'
import { dateOnly } from '../../utility/timeUtility';
import { postEndpoint } from '../api/api';
import { REPETITION, TIMEFRAME } from '../model/constants';

export const usePlannerStore = defineStore('planner', {
    state: () => ({
        currentTime: new Date(),
        selectedDate: today(new Date()),
        repeats: [],
        timePairs: []
    }),
    getters: {
        activeRepeats() {
            let repeats = this.repeats.filter(repeat => {
                // If start date is before selected date
                if (repeat.startDate && +repeat.startDate.toDate() <= +this.selectedDate) {
                    if (repeat.endDate) {
                        if (+repeat.endDate.toDate() >= +this.selectedDate) {
                            return true
                        }
                    } else {
                        return true; // If no end date
                    }
                }
            })
            return repeats;
        }
    },
    actions: {
        initialize() {
            this.getRepeatsAndTimePairs();
        },
        getRepeatsAndTimePairs() {
            return postEndpoint("Planner", "GetRepeatsAndTimepairs")
                .then(response => {
                    this.repeats = response.result.repeats;
                    this.timePairs = response.result.timePairs;
                });
        },
        getActiveRepeats(idTimeframe, selectedDate) {
            let idRepetition = 0;
            if (idTimeframe == TIMEFRAME.DAY) {
                idRepetition = REPETITION.DAILY;
            } else if (idTimeframe == TIMEFRAME.WEEK) {
                idRepetition = REPETITION.WEEKLY;
            } else if (idTimeframe == TIMEFRAME.MONTH) {
                idRepetition = REPETITION.MONTHLY;
            } else if (idTimeframe == TIMEFRAME.YEAR) {
                idRepetition = REPETITION.ANUALLY;
            }

            let repeats = this.repeats.filter(repeat => {
                if (repeat.idTimeframe != idRepetition) {
                    return false;
                }

                // TODO: HANDLE IRREGULAR TIMEFRAMES

                // If start date is before selected date
                if (repeat.startDate && +repeat.startDate.toDate() <= +selectedDate) {
                    if (repeat.endDate) {
                        if (+repeat.endDate.toDate() >= +selectedDate) {
                            return true
                        }
                    } else {
                        return true; // If no end date
                    }
                }
            })
            return repeats;
        },
        getActiveTimePairs(idTimeframe, selectedDate) {
            let timePairs = this.timePairs.filter(timePair => {
                if (idTimeframe) {
                    if (timePair.idTimeframe != idTimeframe) {
                        return false;
                    }
                }

                // TODO: HANDLE IRREGULAR TIMEFRAMES

                // If start date is before selected date
                if (timePair.startAt && +timePair.startAt.toDate() <= +selectedDate) {
                    if (timePair.endAt) {
                        if (+timePair.endAt.toDate() >= +selectedDate) {
                            return true
                        }
                    } else {
                        return true; // If no end date
                    }
                }
            })
            return timePairs;
        },
        isRepeatPlannedOnDate(id, selectedDate) {
            let repeat = this.repeats.find(x => x.id == id);
            let isActive = false;
            if (repeat.startDate && +repeat.startDate.toDate() <= +selectedDate) {
                if (repeat.endDate) {
                    if (+repeat.endDate.toDate() >= +selectedDate) {
                        isActive = true
                    }
                } else {
                    isActive = true; // If no end date
                }
            }
            if (!isActive) {
                return false;
            }
            if (repeat.idTimeframe == REPETITION.WEEKLY) {
                let dow = selectedDate.getDay() + 1;
                let isOnDay = repeat.dayIndecies.some(x => x == dow);
                return isOnDay;
            }
            if (repeat.idTimeframe == REPETITION.MONTHLY) {
                let date = selectedDate.getDate();
                let isOnDay = repeat.dayIndecies.some(x => x == date);
                return isOnDay;
            }
        },
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
        },
    },
})