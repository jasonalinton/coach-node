import { defineStore } from 'pinia'
import { getEvents } from '../api/eventAPI'
import { replaceOrAddItem, sortAsc } from '../../utility'
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
            this.fill();
            this.connectSocket();
            initialized = true;
        },
        async fill() {
            this.events = await getEvents();
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
            }
        }
    },
})