import { defineStore } from 'pinia';
import { getSocketConnection } from './socket';
import { getBriefingBlurbs } from '../api/universalAPI';
import { replaceOrAddItem } from '../../utility';
import { postEndpoint } from '../api/api';

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
            let data = { text, datetime, idBlurbType, idMetric, idTimeframe };
            return postEndpoint("Universal", "AddBriefingBlurb", data)
                .then(this.onResponse);
        },
        onResponse(response) {
            if (response.updates)
                this.runUpdates(response.updates);
            return response.result;
        },
        runUpdates(updates) {
            let _this = this;
            if (updates.blurbs && updates.blurbs.length > 0) {
                updates.blurbs.forEach(blurb => {
                    replaceOrAddItem(blurb, _this.blurbs);
                })
                sortAsc(_this.blurbs);
            }
            if (updates.blurbIDsRemoved && updates.blurbIDsRemoved.length > 0) {
                updates.blurbIDsRemoved.forEach(blurbID => {
                    removeItemByID(blurbID, _this.blurbs);
                })
                sortAsc(_this.blurbs);
            }
        },
        addMetricBlurb(idMetric, datetime, text, title) {
            addMetricBlurb(idMetric, datetime, text, title);
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