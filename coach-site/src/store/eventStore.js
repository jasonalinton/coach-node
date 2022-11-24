import { defineStore } from 'pinia'
import { getEvents } from '../api/eventAPI'
import { replaceOrAddItem } from '../../utility'

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
                // let connection = new HubConnectionBuilder()
                //     .withUrl("https://localhost:7104/eventHub", {
                //         withCredentials: false,
                //         keepAliveIntervalInMilliseconds: 60000,
                //         serverTimeoutInMilliseconds: 120000,
                //        })
                //     .build();

                // let _this = this;
                // connection.on("UpdateEvents", events => {
                //     events.forEach(event => {
                //         let exists = replaceItem(event, _this.events);
                //         if (!exists) _this.events.push(event);
                //         sortAsc(_this.events);
                //     })
                // });

                // connection.start();
            }
        }
    },
})