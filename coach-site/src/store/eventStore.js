import { defineStore } from 'pinia'
import { postEndpoint } from '../api/api'
import { getEvent, getEvents } from '../api/eventAPI'
import { removeItemByID, replaceOrAddItem, sortAsc } from '../../utility'
import { getSocketConnection, deferUpdate } from './socket'

let initialized = false;
const pendingSaves = new Map();

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
        async saveEvent(clientId, text, start, end, { idType, idRepeat, isAllDay, isRecommended } = {}) {
            const response = await postEndpoint("Event", "SaveEvent", 
                { clientId, text, start, end, idType, idRepeat, isAllDay: !!isAllDay, isRecommended: !!isRecommended });
            if (!response?.status?.success) return;

            const saved = response.result.event;
            let events = [...this.events];
            removeItemByID(response.result.clientId, events);
            replaceOrAddItem(saved, events);
            this.events = sortAsc(events);
            return saved;
        },
        /* Creates the event if it only exists client-side (negative ID), otherwise updates it. Resolves to the saved event.
         * Saves of the same unsaved event share one request, so e.g. Start + a task toggle don't create two events */
        async saveOrUpdateEvent(event, { idType, idRepeat } = {}) {
            if (event.id > 0) {
                await this.updateEvent(event.id, event.text, event.startAt, event.endAt);
                return event;
            }

            const key = idRepeat ?? event.id;
            if (!pendingSaves.has(key)) {
                const promise = this.saveEvent(event.id, event.text, event.startAt, event.endAt, 
                    { idType, idRepeat, isAllDay: event.isAllDay, isRecommended: event.isRecommended })
                    .finally(() => pendingSaves.delete(key));
                pendingSaves.set(key, promise);
            }
            return pendingSaves.get(key);
        },
        async mapIterationToEvent(idEvent, idIteration) {
            return postEndpoint("Event", "MapIterationToEvent", { idEvent, idIteration })
            .then(response => response?.result);
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