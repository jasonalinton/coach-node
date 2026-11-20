import { defineStore } from 'pinia'
import { postEndpoint } from '../api/api'
import { getEvent, getEvents } from '../api/eventAPI'
import { removeItemByID, replaceOrAddItem, sortAsc } from '../../utility'
import { getSocketConnection, deferUpdate } from './socket'

let initialized = false;

export const useEventStore = defineStore('event', {
    state: () => ({
        events: [],
        mouseX: undefined,
        mouseY: undefined,
        startY: undefined
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
        setMouseXY(x, y) {
            this.mouseX = x;
            this.mouseY = y;
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
        newID() {
            let negativeIDs = this.events.filter(x => x.id < 0).map(x => x.id);
            let nextID = (negativeIDs.length > 0) ? Math.min(...negativeIDs) + - 1 : -1;
            return nextID;
        },
        async saveEvent(clientId, text, start, end, isAllDay, isRecommended) {
            const response = await postEndpoint("Event", "SaveEvent", { clientId, text, start, end, isAllDay, isRecommended });
            if (!response?.status?.success) return;

            // Swap the client-side (negative ID) event for the saved one, keeping its loaded tasks
            const saved = response.result.event;
            const clientEvent = this.events.find(e => e.id == response.result.clientId);
            if (clientEvent && (!saved.iterations || saved.iterations.length == 0)) {
                saved.iterations = clientEvent.iterations;
            }
            // Keep the routine repeat so the planner can match it to its phantom
            if (clientEvent?.repeat) saved.repeat = clientEvent.repeat;
            let events = [...this.events];
            removeItemByID(response.result.clientId, events);
            replaceOrAddItem(saved, events);
            this.events = sortAsc(events);
            return saved;
        },
        async updateEvent(eventID, text, start, end) {
            return postEndpoint("Event", "UpdateEvent", {eventID, text, start, end});
        },
        replaceOrAddEvent(event) {
            replaceOrAddItem(event, this.events);
        },
        async deleteEvent(eventID) {
            return postEndpoint("Event", "DeleteEvent", { eventID });
        },
        runUpdates(updates) {
            let _this = this;
            const deferred = [];

            const hasEvents = updates.events?.length > 0;
            const hasEventsRemoved = updates.eventIDRemoved?.length > 0;
            if (hasEvents || hasEventsRemoved) {
                let events = [..._this.events];
                if (hasEvents) updates.events.forEach(event => replaceOrAddItem(event, events));
                if (hasEventsRemoved) updates.eventIDRemoved.forEach(id => removeItemByID(id, events));
                deferred.push(() => { _this.events = sortAsc(events); });
            }
            // Iterations updated inside events
            if (updates.iterations?.length > 0) {
                updates.iterations.forEach(iteration => {
                    _this.events.forEach(_event => {
                        if (_event.iterations.some(i => i.id == iteration.id)) {
                            let iters = [..._event.iterations];
                            replaceOrAddItem(iteration, iters);
                            deferred.push(() => { _event.iterations = sortAsc(iters); });
                        }
                    });
                });
            }
            // Iteration IDs removed from events
            if (updates.iterationIDsRemoved?.length > 0) {
                updates.iterationIDsRemoved.forEach(iterationID => {
                    _this.events.forEach(_event => {
                        if (_event.iterations.some(i => i.id == iterationID)) {
                            let iters = [..._event.iterations];
                            removeItemByID(iterationID, iters);
                            deferred.push(() => { _event.iterations = sortAsc(iters); });
                        }
                    });
                });
            }

            deferred.forEach(fn => deferUpdate(fn));
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