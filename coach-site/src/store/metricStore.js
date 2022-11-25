import { defineStore } from 'pinia'
import { getMetrics } from '../api/metricAPI'
import { repositionItem } from '../api/itemAPI';
import { replaceItem, sortAsc } from '../../utility';
import { getSocketConnection } from './socket'

let initialized = false;

export const useMetricStore = defineStore('metric', {
    state: () => ({
        metrics: []
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
            this.metrics = await getMetrics();
        },
        getItems() {
            return this.metrics;
        },
        getItem(id) {
            return this.metrics.find(x => x.id == id);
        },
        repositionItem(parentType, itemType, goalID, metricID, newPosition) {
            repositionItem(parentType, itemType, goalID, metricID, newPosition);
        },
        connectSocket() {
            if (!initialized) {
                let connection = getSocketConnection("metricHub");

                let _this = this;
                connection.on("UpdateMetrics", metrics => {
                    metrics.forEach(metric => {
                        let exists = replaceItem(metric, _this.metrics);
                        if (!exists) _this.metrics.push(metric);
                    })
                    sortAsc(_this.metrics);
                });

                connection.start();
            }
        }
    },
})