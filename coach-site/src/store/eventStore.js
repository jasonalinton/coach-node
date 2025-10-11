import { defineStore } from 'pinia'
import { postEndpoint } from '../api/api'
import { getEvent, getEvents } from '../api/eventAPI'
import { removeItemByID, replaceOrAddItem, sortAsc } from '../../utility'
import { getSocketConnection } from './socket'

let initialized = false;

export const useEventStore = defineStore('event', {
    state: () => ({
        events: []
    }),
    getters: {
    },
    actions: {
        async initialize() {
            this.connectSocket();
            initialized = true;
        },
        async fill() {
            this.events = await getEvents();
        },
        getEvent(id, shouldRequestServer) {
            const _this = this;
            if (shouldRequestServer) {
                getEvent(id)
                .then(event => {
                    replaceOrAddItem(event, _this.events);
                })
            }
            return this.events.find(_event => _event.id == id);
        },
        getEvents(start, end, shouldRequestServer) {
            const _this = this;
            if (shouldRequestServer) {
                getEvents(start, end)
                .then(events => {
                    events.forEach(event => {
                        replaceOrAddItem(event, _this.events);
                    });
                })
            }
            return this.events;
        },
        async updateEvent(eventID, text, start, end) {
            let _this = this;
            return postEndpoint("Event", "UpdateEvent", {eventID, text, start, end})
                .then(response => {
                    if (response.result) {
                        replaceOrAddItem(response.result, _this.events);
                    }
                    return response;
                })
                .then(this.onResponse);
        },
        onResponse(response) {
            if (response.updates)
                this.runUpdates(response.updates);
                return response.result;
        },
        runUpdates(updates) {
            let _this = this;
            if (updates.events) {
                updates.events.forEach(event => {
                    replaceOrAddItem(event, _this.events);
                })
                sortAsc(_this.events);
            }
            if (updates.iterations) {
                updates.iterations.forEach(iteration => {
                    _this.events.forEach(_event => {
                        var containsIteration = _event.iterations.some(_iteration => _iteration.id == iteration.id);
                        if (containsIteration) {
                            replaceOrAddItem(iteration, _event.iterations);
                            sortAsc(_event.iterations);
                        }
                    });                       
                });
            }
        },
        connectSocket() {
            if (!initialized) {
                let connection = getSocketConnection("plannerHub");

                let _this = this;
                connection.on("UpdateEvents", events => {
                    // this.initializeItems(events);
                    events.forEach(event => {
                        replaceOrAddItem(event, _this.events);
                    })
                    sortAsc(_this.events);
                });
                connection.on("RemoveEvents", eventIDs => {
                    eventIDs.forEach(eventID => {
                        removeItemByID(eventID, _this.events);
                    })
                    sortAsc(_this.events);
                });

                // Replace iteration in event
                connection.on("UpdateIterations", iterations => {
                    iterations.forEach(iteration => {
                        _this.events.forEach(_event => {
                            var containsIteration = _event.iterations.some(_iteration => _iteration.id == iteration.id);
                            if (containsIteration) {
                                replaceOrAddItem(iteration, _event.iterations);
                                sortAsc(_event.iterations);
                            }
                        });                       
                    });
                });
                // Remove iteration in event
                connection.on("RemoveIterations", iterationIDs => {
                    iterationIDs.forEach(iterationID => {
                        _this.events.forEach(_event => {
                            var containsIteration = _event.iterations.some(_iteration => _iteration.id == iterationID);
                            if (containsIteration) {
                                removeItemByID(iterationID, _event.iterations);
                                sortAsc(_event.iterations);
                            }
                        });
                    })
                });
            }
        }
    },
})