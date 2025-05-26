import { defineStore } from 'pinia';
import { getSocketConnection } from './socket';
import { getBlurbsInMetric, getBriefingBlurbs, addBriefingBlurb, addMetricBlurb } from '../api/universalAPI';
import { replaceOrAddItem } from '../../utility';

let initialized = false;

export const useUniversalStore = defineStore('universal', {
    state: () => ({
        blurbs: []
    }),
    getters: {
        
    },
    actions: {
        async initialize() {
            this.connectSocket();
            initialized = true;
        },
        async getBlurbsInMetric(idMetric, idTimeframe, datetime) {
            let _this = this;
            return getBlurbsInMetric(idMetric, idTimeframe, datetime)
                .then(result => {
                    result.forEach(blurb => {
                        replaceOrAddItem(blurb, _this.blurbs);
                    });
                    return result;
                });
            // return this.blurbs;
        },
        getBriefingBlurbs(idTimeframe, datetime) {
            let _this = this;
            getBriefingBlurbs(idTimeframe, datetime)
                .then(result => {
                    result.forEach(blurb => {
                        replaceOrAddItem(blurb, _this.blurbs);
                    })
                });
            return this.blurbs;
        },
        addBriefingBlurb(text, datetime, idBlurbType, idMetric, idTimeframe) {
            addBriefingBlurb(text, datetime, idBlurbType, idMetric, idTimeframe);
        },
        addMetricBlurb(idMetric, datetime, text, title) {
            addMetricBlurb(idMetric, datetime, text, title);
        },
        connectSocket() {
            if (!initialized) {
                let connection = getSocketConnection("plannerHub");

                let _this = this;
                connection.on("UpdateBlurbs", blurbs => {
                    blurbs.forEach(blurb => {
                        replaceOrAddItem(blurb, _this.blurbs);
                    })
                    // sortAsc(_this.blurbs);
                });
            }
        }
    },
})