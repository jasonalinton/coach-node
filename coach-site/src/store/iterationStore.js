import { defineStore } from 'pinia'
import { getSocketConnection } from './socket'
import { getRepetitiveTodoIterations } from '../api/todoAPI';
import { getAllIterationsInRange, getUnplannedIterations } from '../api/plannerAPI'
import { removeItemByID, replaceOrAddItem, sortAsc } from '../../utility'
import { postEndpoint } from '../api/api';

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
        updateIteration(iterationID, text, blurb, points, startAt, endAt) {
            let data = { iterationID, text, blurb, points, startAt, endAt };
            return postEndpoint("Planner", "UpdateIteration", data)
            .then(response => response.result);
        },
        rescheduleIteration(iterationID, startAt, endAt) {
            let data = { iterationID, startAt, endAt };
            return postEndpoint("Planner", "RescheduleIteration", data)
            .then(response => response.result);
        },
        // This is the wrong name. Technically it's not toggling, its setting the values
        toggleCompletion(iterationID, attemptedAt, completedAt) {
            let data = { iterationID, attemptedAt, completedAt };
            return postEndpoint("Planner", "ToggleTaskCompletion", data)
            .then(response => response.result);
        },
        attemptIteration(iterationID, attemptedAt) {
            let data = { iterationID, attemptedAt };
            return postEndpoint("Planner", "AttemptIteration", data)
            .then(response => response.result);
        },
        toggleVerification(iterationID, isVerified) {
            return postEndpoint("Planner", "ToggleIterationVerification", { iterationID, isVerified })
            .then(response => response.result);
        },
        deleteIteration(iterationID) {
            return postEndpoint("Planner", "DeleteIteration", { iterationID })
            .then(response => response.result);
        },
        runUpdates(updates) {
            let _this = this;
            if (updates.iterations && updates.iterations.length > 0) {
                updates.iterations.forEach(iteration => {
                    replaceOrAddItem(iteration, _this.iterations);
                })
                sortAsc(_this.iterations);
            }
            if (updates.iterationIDsRemoved && updates.iterationIDsRemoved.length > 0) {
                updates.iterationIDsRemoved.forEach(iterationID => {
                    removeItemByID(iterationID, _this.iterations);
                })
                sortAsc(_this.iterations);
            }
        },
        connectSocket() {
            if (!initialized) {
                let coachConnection = getSocketConnection("coachHub");
                coachConnection.on("SendUpdates", updateModel => {
                    this.runUpdates(updateModel);
                });
            }
        }
    },
})