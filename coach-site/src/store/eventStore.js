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
            let events = this.events.filter(event => {
                return (new Date(event.startAt)).getTime() >= start && (new Date(event.startAt)).getTime() <= end;
            });
            return events;
        },
        async updateEvent(eventID, text, start, end) {
            return postEndpoint("Event", "UpdateEvent", {eventID, text, start, end});
        },
        runUpdates(updates) {
            let _this = this;
            // Events updated
            if (updates.events && updates.events.length > 0) {
                updates.events.forEach(event => {
                    replaceOrAddItem(event, _this.events);
                })
                sortAsc(_this.events);
            }
            // Event IDs removed
            if (updates.eventIDRemoved && updates.eventIDRemoved.length > 0) {
                updates.eventIDRemoved.forEach(eventID => {
                    removeItemByID(eventID, _this.events);
                })
                sortAsc(_this.events);
            }
            // Iterations updated
            if (updates.iterations && updates.iterations.length > 0) {
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
            // Iteration IDs removed
            if (updates.iterationIDsRemoved && updates.iterationIDsRemoved.length > 0) {
                updates.iterationIDsRemoved.forEach(iterationID => {
                    _this.events.forEach(_event => {
                        var containsIteration = _event.iterations.some(_iteration => _iteration.id == iterationID);
                        if (containsIteration) {
                            removeItemByID(iterationID, _event.iterations);
                            sortAsc(_event.iterations);
                        }
                    });
                })
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