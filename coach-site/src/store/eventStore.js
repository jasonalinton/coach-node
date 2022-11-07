import { defineStore } from 'pinia'
import { getEvents } from '../api/eventAPI'
import { replaceOrAddItem } from '../../utility'

export const useEventStore = defineStore('event', {
    state: () => ({
        events: []
    }),
    getters: {
    },
    actions: {
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
    },
})