import { defineStore } from 'pinia'
import { getSocketConnection } from './socket'
import { getRepetitiveTodoIterations } from '../api/todoAPI';
import { getIterationsInRange, rescheduleIteration, toggleTaskCompletion, 
    attemptIteration, deleteIteration } from '../api/plannerAPI'
import { removeItemByID, replaceOrAddItem, sortAsc } from '../../utility'

let initialized = false;

export const useIterationStore = defineStore('iteration', {
    state: () => ({
        iterations: []
    }),
    getters: {
        
    },
    actions: {
        // async initialize() {
        async initialize() {
            // let promise = this.fill();
            this.connectSocket();
            initialized = true;
            // return promise;
        },
        // async fill() {
        //     return getIterations().then(res => this.iterations = res);
        // },
        getIterations() {
            return this.iterations;
        },
        getIterationsInRange(startAt, endAt, shouldRequestServer) {
            let _this = this;
            if (shouldRequestServer) {
                getIterationsInRange(startAt, endAt)
                .then(_iterations => {
                    _iterations.forEach(iteration => {
                        replaceOrAddItem(iteration, _this.iterations);
                    })
                    sortAsc(_this.iterations, 'startAt');
                });
            }
            return this.iterations.filter(iteration => {
                return (new Date(iteration.startAt)).getTime() >= startAt && (new Date(iteration.startAt)).getTime() <= endAt &&
                       iteration.idRoutine == null && iteration.idRoutineIteration == null;
            });
        },
        getRepetitiveTodoIterations(startAt, endAt) {
            let _this = this;
            getRepetitiveTodoIterations(startAt, endAt)
            .then(_iterations => {
                _iterations.forEach(iteration => {
                    replaceOrAddItem(iteration, _this.iterations);
                })
                sortAsc(_this.iterations, 'startAt');
            });
            return this.iterations.filter(iteration => {
                return (new Date(iteration.startAt)).getTime() >= startAt && (new Date(iteration.startAt)).getTime() <= endAt &&
                       iteration.idRoutine == null && iteration.idRoutineIteration == null;
            });
        },
        rescheduleIteration(iterationID, startAt, endAt) {
            rescheduleIteration(iterationID, startAt, endAt);
        },
        toggleCompletion(iterationID, attemptedAt, completedAt) {
            toggleTaskCompletion(iterationID, attemptedAt, completedAt);
        },
        attemptIteration(iterationID, attemptedAt) {
            attemptIteration(iterationID, attemptedAt);
        },
        deleteIteration(iterationID) {
            deleteIteration(iterationID);
        },
        connectSocket() {
            if (!initialized) {
                let connection = getSocketConnection("plannerHub");

                let _this = this;
                connection.on("UpdateIterations", iterations => {
                    // this.initializeItems(iterations);
                    iterations.forEach(iteration => {
                        replaceOrAddItem(iteration, _this.iterations);
                    })
                    sortAsc(_this.iterations);
                });
                connection.on("RemoveIterations", iterationIDs => {
                    iterationIDs.forEach(iterationID => {
                        removeItemByID(iterationID, _this.iterations);
                    })
                    sortAsc(_this.iterations);
                });
            }
        }
    },
})