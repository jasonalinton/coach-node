import { defineStore } from 'pinia';
import { getSocketConnection } from './socket';
import { getBriefingBlurbs, addBriefingBlurb } from '../api/universalAPI';
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