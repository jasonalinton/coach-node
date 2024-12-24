import { defineStore } from 'pinia'
import { getSocketConnection } from './socket'
import { getRepetitiveTodoIterations } from '../api/todoAPI';
import { getAllIterationsInRange, getUnplannedIterations, updateIteration, rescheduleIteration, toggleTaskCompletion, 
    attemptIteration, deleteIteration } from '../api/plannerAPI'
import { removeItemByID, replaceOrAddItem, sortAsc } from '../../utility'

let initialized = false;

export const useIterationStore = defineStore('iteration', {
    state: () => ({
        iterations: [],
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
        getIteration(id) {
            return this.iterations.find(x => x.id = id);
        },
        getIterations() {
            return this.iterations;
        },
        getIterationsInRange(startAt, endAt, shouldRequestServer) {
            let _this = this;
            if (shouldRequestServer) {
                getAllIterationsInRange(startAt, endAt)
                .then(_iterations => {
                    _iterations.forEach(iteration => {
                        replaceOrAddItem(iteration, _this.iterations);
                    })
                    sortAsc(_this.iterations, 'startAt');
                });
            }
            return this.iterations.filter(iteration => {
                return (new Date(iteration.startAt)).getTime() >= startAt && (new Date(iteration.startAt)).getTime() <= endAt;
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
        getUnplannedIterations(shouldRequestServer) {
            let _this = this;
            if (shouldRequestServer) {
                getUnplannedIterations()
                .then(_iterations => {
                    _iterations.forEach(iteration => {
                        replaceOrAddItem(iteration, _this.iterations);
                    })
                    sortAsc(_this.iterations, 'startAt');
                });
            }
            return this.iterations.filter(iteration => {
                return (!iteration.startAt && 
                         iteration.idRoutine == null && iteration.idRoutineIteration == null);
            });
        },
        updateIteration(iterationID, text, points, startAt, endAt) {
            updateIteration(iterationID, text, points, startAt, endAt);
        },
        rescheduleIteration(iterationID, startAt, endAt) {
            rescheduleIteration(iterationID, startAt, endAt);
        },
        setCompletion(iterationID, attemptedAt, completedAt) {
            let iteration = this.iterations.find(x => x.id == iterationID);
            if (iteration) {
                iteration.attemptedAt = (attemptedAt) ? attemptedAt.toJSON() : null;
                iteration.completedAt = (completedAt) ? completedAt.toJSON() : null;

                toggleTaskCompletion(iterationID, attemptedAt, completedAt);
            }
        },
        // This is the wrong name. Technically it's not toggling, its setting the values
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