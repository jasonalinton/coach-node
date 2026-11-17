import { defineStore } from 'pinia'
import { getSocketConnection, deferUpdate } from './socket'
import { getRepetitiveTodoIterations } from '../api/todoAPI';
import { getAllIterationsInRange, getUnplannedIterations } from '../api/plannerAPI'
import { removeItemByID, replaceOrAddItem, sortAsc, indexByID, pickByID, getByID } from '../../utility'
import { attemptPostEndpoint, postEndpoint } from '../api/api';
import { getTimeframeEndpoints } from '../../utility/timeUtility';

let initialized = false;

export const useIterationStore = defineStore('iteration', {
    state: () => ({
        iterations: [],
        requests: [],
    }),
    getters: {
        // id -> [index, item]; rebuilt only when the list changes
        iterationIndex: (state) => indexByID(state.iterations),
        // todoID -> that todo's iterations, in list order
        iterationsByTodoID: (state) => {
            let groups = new Map();
            state.iterations.forEach(iteration => {
                if (iteration.todoID == null) return;
                let todoID = Number(iteration.todoID);
                if (!groups.has(todoID)) groups.set(todoID, []);
                groups.get(todoID).push(iteration);
            });
            return groups;
        }
    },
    actions: {
        // async initialize() {
        async initialize() {
            // let promise = this.fill();
            this.connectSocket();
            this.getIterationsInRange(new Date().firstDayOfMonth(), new Date().lastDayOfMonth());
            initialized = true;
            // return promise;
        },
        // async fill() {
        //     return getIterations().then(res => this.iterations = res);
        // },
        isRangeLoaded(startAt, endAt, endpoint = "GetIterationsInRange") {
            let start = +new Date(startAt);
            let end = +new Date(endAt);
            let covers = (s, e) => +new Date(s) <= start && +new Date(e) >= end;

            return this.requests.some(r =>
                r.endpoint == endpoint && r.requestProps
                && covers(r.requestProps.startAt, r.requestProps.endAt));
        },
        getIteration(id) {
            let iteration = getByID(id, this.iterationIndex);
            if (!iteration) {
                attemptPostEndpoint("Planner", "GetIteration", { id })
                .then(response => {
                    if (response?.result) {
                        iteration = response.result;
                        replaceOrAddItem(iteration, this.iterations)
                        this.iterations = sortAsc(this.iterations);
                    }
                    
                    this.runUpdates(response);
                    return response;
                });
            }
            return iteration;
        },
        getIterations() {
            return this.iterations;
        },
        /** Iterations by id, regardless of date range - e.g. a goal/todo's descendant tree, which can
         * reach outside whatever date window is currently loaded. Mirrors universalStore.getBlurbsWithID:
         * returns what's already cached, and kicks off a batched fetch for whatever's missing. */
        getIterationsWithIDs(ids) {
            let iterations = pickByID(ids, this.iterationIndex);
            if (iterations.length != ids.length) {
                postEndpoint("Planner", "GetIterations", { ids })
                    .then(response => {
                        if (!response?.status?.success) return;
                        let all = [...this.iterations];
                        response.result.forEach(iteration => replaceOrAddItem(iteration, all));
                        this.iterations = sortAsc(all);
                    });
            }
            return iterations;
        },
        /** Like getIterationsWithIDs, but only returns iterations that are already loaded (no fetch) */
        getLoadedIterationsWithIDs(ids) {
            return pickByID(ids, this.iterationIndex);
        },
        getIterationsInRange(startAt, endAt) {
            this.requestIterationsInRange("GetIterationsInRange", startAt, endAt);
            return this.iterations.filter(iteration => {
                return iteration.startAt && +iteration.startAt.toDate() >= startAt && +iteration.startAt.toDate() <= endAt;
            });
        },
        /** Like getIterationsInRange, but the server also returns routine iterations and the todo iterations mapped to them */
        getAllIterationsInRange(startAt, endAt) {
            this.requestIterationsInRange("GetAllIterationsInRange", startAt, endAt);
            return this.iterations.filter(iteration => {
                return iteration.startAt && +iteration.startAt.toDate() >= startAt && +iteration.startAt.toDate() <= endAt;
            });
        },
        requestIterationsInRange(endpoint, startAt, endAt) {
            if (!this.isRangeLoaded(startAt, endAt, endpoint)) {
                let request = {
                    endpoint,
                    requestProps: { startAt, endAt },
                    requestTime: new Date(),
                    isProcessing: true
                };
                this.requests.push(request);
                
                let dropRequest = () => { this.requests = this.requests.filter(r => r !== request); };

                postEndpoint("Planner", endpoint, { startAt, endAt })
                .then(response => {
                    if (!response || !response.status || !response.status.success) {
                        dropRequest();
                        return;
                    }
                    
                    let iterations = [...this.iterations];
                    response.result.forEach(iteration => replaceOrAddItem(iteration, iterations));
                    this.iterations = sortAsc(iterations);
                    
                    this.runUpdates(response);
                    request.isProcessing = false;
                    return response;
                })
                .catch(dropRequest);
            }
        },
        // getIterationsInRange(startAt, endAt, shouldRequestServer) {
        //     let _this = this;
        //     if (shouldRequestServer) {
        //         getAllIterationsInRange(startAt, endAt)
        //         .then(_iterations => {
        //             let iterations = [..._this.iterations];
        //             _iterations.forEach(iteration => replaceOrAddItem(iteration, iterations));
        //             _this.iterations = sortAsc(iterations, 'startAt');
        //         });
        //     }
        //     return this.iterations.filter(iteration => {
        //         return +iteration.startAt.toDate() >= startAt && +iteration.startAt.toDate() <= endAt;
        //     });
        // },
        getIterationsInTimeframe(idTimeframe, selectedDate) {
            var { start, end } = getTimeframeEndpoints(idTimeframe, selectedDate);
            return this.iterations.filter(iteration => {
                return (new Date(iteration.startAt)).getTime() >= start && (new Date(iteration.startAt)).getTime() <= end
                    && iteration.idTimeframe && iteration.idTimeframe == idTimeframe;
            });
        },
        getRepetitiveTodoIterations(startAt, endAt) {
            let _this = this;
            getRepetitiveTodoIterations(startAt, endAt)
            .then(_iterations => {
                let iterations = [..._this.iterations];
                _iterations.forEach(iteration => replaceOrAddItem(iteration, iterations));
                _this.iterations = sortAsc(iterations, 'startAt');
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
                    let iterations = [..._this.iterations];
                    _iterations.forEach(iteration => replaceOrAddItem(iteration, iterations));
                    _this.iterations = sortAsc(iterations, 'startAt');
                });
            }
            return this.iterations.filter(iteration => {
                return (!iteration.startAt && 
                         iteration.idRoutine == null && iteration.idRoutineIteration == null);
            });
        },
        getIterationsForTodo(todoID) {
            if (todoID == null) return this.iterations.filter(x => x.todoID == todoID);
            // Copy, since callers sort the result in place
            return [...(this.iterationsByTodoID.get(Number(todoID)) || [])];
        },
        getIterationsOfTodoType(idType, startAt, endAt) {
            let data = { idType, startAt, endAt };
            return postEndpoint("Planner", "GetIterationsOfTodoType", data)
            .then(response => {
                let iterations = [...this.iterations];
                response.result.forEach(iteration => replaceOrAddItem(iteration, iterations));
                this.iterations = sortAsc(iterations, 'startAt');
                return response.result;
            })
            .then(response => response.result);
        },
        newTask(todo, repeat) {
            let negativeIDs = this.iterations.filter(x => x.id < 0).map(x => x.id);
            let nextID = (negativeIDs.length > 0) ? Math.min(...negativeIDs) + - 1 : -1;
            let newTask = { 
                id: nextID, 
                text: todo ? todo.text : "", 
                points: todo?.points,
                startAt: undefined, 
                endAt: undefined, 
                idTodo: todo?.id,
                repeatID: repeat?.id
            };
            this.iterations.push(newTask);
            return newTask;
        },
        updateIteration(iterationID, text, points, startAt, endAt, idTimeframe, action, actionAt) {
            let data = { iterationID, text, points, startAt, endAt, idTimeframe, action, actionAt };
            return postEndpoint("Planner", "UpdateIteration", data)
            .then(response => response.result);
        },
        addBlurb(idIteration, blurb) {
            let data = { ...blurb, idIteration, idBlurbType: blurb.idType };
            return postEndpoint("Planner", "AddBlurbToIteration", data).then(response => response.result);
        },
        updateBlurb(blurb) {
            let data = { ...blurb, idBlurb: blurb.id, idBlurbType: blurb.idType };
            return postEndpoint("Planner", "UpdateBlurbInIteration", data).then(response => response.result);
        },
        rescheduleIteration(iterationID, startAt, endAt) {
            let data = { iterationID, startAt, endAt };
            return postEndpoint("Planner", "RescheduleIteration", data)
            .then(response => response.result);
        },
        completeTimePairIteration(idTodo, idTimePair, text, points, datetime, startAt, endAt) {
            let data = { idTodo, idTimePair, text, points, datetime, startAt, endAt };
            return postEndpoint("Planner", "CompleteTimePairIteration", data)
            .then(response => response.result);
        },
        completeRepeatIteration(idTodo, idRepeat, text, points, datetime, startAt, endAt) {
            let data = { idTodo, idRepeat, text, points, datetime, startAt, endAt };
            return postEndpoint("Planner", "CompleteRepeatIteration", data)
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
        completeAndCreatSibling(iterationID, completedAt, newText, newStart, newEnd, points, blurb, blurbJson) {
            let data = { iterationID, completedAt, newText, newStart, newEnd, points, blurb, blurbJson };
            return postEndpoint("Planner", "CompleteAndCreatSibling", data)
            .then(response => response.result);
        },
        toggleVerification(iterationID, isVerified) {
            return postEndpoint("Planner", "ToggleIterationVerification", { iterationID, isVerified })
            .then(response => {
                // Apply the result now instead of waiting on the socket, which may be slow or disconnected
                if (response?.status?.success && response.result) {
                    this.runUpdates({ iterations: [response.result] });
                }
                return response?.result;
            });
        },
        deleteIteration(iterationID) {
            return postEndpoint("Planner", "DeleteIteration", { iterationID })
            .then(response => response.result);
        },
        runUpdates(updates) {
            const hasIterations = updates.iterations?.length > 0;
            const hasRemovals = updates.iterationIDsRemoved?.length > 0;
            if (!hasIterations && !hasRemovals) return;

            // Copy the list inside the deferred fn, so updates queued in the same tick build on each other
            // instead of each overwriting the list with its own stale copy
            deferUpdate(() => {
                let iterations = [...this.iterations];
                if (hasIterations) {
                    updates.iterations.forEach(iteration => replaceOrAddItem(iteration, iterations));
                }
                if (hasRemovals) {
                    updates.iterationIDsRemoved.forEach(id => removeItemByID(id, iterations));
                }
                this.iterations = sortAsc(iterations);
            });
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