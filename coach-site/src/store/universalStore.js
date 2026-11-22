import { defineStore } from 'pinia';
import moment from 'moment';
import { getSocketConnection, deferUpdate } from './socket';
import { replaceOrAddItem, sortAsc } from '../../utility';
import { getTimeframeEndpoints } from '../../utility/timeUtility';
import { postEndpoint } from '../api/api';
import { BLURBTYPE } from '../model/constants';

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
        getBlurb(id) {
            let blurb = this.blurbs.find(x => x.id == id);
            if (!blurb) {
                let _this = this;
                postEndpoint("Universal", "GetBlurb", { id })
                    .then(response => {
                        replaceOrAddItem(response.result, _this.blurbs);
                    });
            }
            return blurb;
        },
        getBlurbsWithID(ids) {
            let blurbs = this.blurbs.filter(b => ids.includes(b.id))
            if (blurbs.length != ids.length) {
                postEndpoint("Universal", "GetBlurbsWithIDs", { ids })
                    .then(response => {
                        response.result.forEach(blurb => {
                            replaceOrAddItem(blurb, this.blurbs);

                        })
                    });
            }
            return blurbs;
        },
        getBlurbs(idTimeframe, datetime) {
            let _this = this;
            postEndpoint("Universal", "GetBlurbs", { idTimeframe, datetime})
                .then(response => {
                    response.result.forEach(blurb => {
                        replaceOrAddItem(blurb, _this.blurbs);
                    });
                    // sortAsc(_this.blurbs);
                });
            let {start, end} = getTimeframeEndpoints(idTimeframe, datetime);

            return this.blurbs.filter(blurb => {
                return (new Date(blurb.datetime)).getTime() >= start && (new Date(blurb.datetime)).getTime() <= end;
            });
        },
        getBlurbsInMetric(idMetric, idTimeframe, datetime) {
            let _this = this;
            postEndpoint("Universal", "GetBlurbsInMetric", { idMetric, idTimeframe, datetime })
            .then(response => {
                let blurbs = [..._this.blurbs];
                response.result.forEach(blurb => replaceOrAddItem(blurb, blurbs));
                _this.blurbs = sortAsc(blurbs);
                return response.result;
            });

            let blurbs = this.blurbs.filter(blurb => blurb.idMetric == idMetric);
            return blurbs;
        },
        getBriefingBlurbs(idTimeframe, datetime) {
            let _this = this;
            postEndpoint("Universal", "GetBriefingBlurbs", { idTimeframe, datetime })
            .then(response => {
                let blurbs = [..._this.blurbs];
                response.result.forEach(blurb => replaceOrAddItem(blurb, blurbs));
                _this.blurbs = sortAsc(blurbs);
                return response.result;
            });

            let blurbs = this.blurbs.filter(blurb => blurb.idType == BLURBTYPE.BRIEFING || blurb.idType == BLURBTYPE.DEBRIEFING);
            return blurbs;
        },
        // datetime: when the note was written. briefingDatetime: any date in the briefing's period,
        // sent as local wall-clock time so the server files it under the user's day, not the UTC one
        addBriefingBlurb(text, datetime, briefingDatetime, idBlurbType, idMetric, idTimeframe, json) {
            briefingDatetime = moment(briefingDatetime).format('YYYY-MM-DDTHH:mm:ss');
            let data = { text, json, datetime, briefingDatetime, idBlurbType, idMetric, idTimeframe };
            return postEndpoint("Universal", "AddBriefingBlurb", data)
                .then(this.onResponse);
        },
        onResponse(response) {
            if (response.updates)
                this.runUpdates(response.updates);
            return response.result;
        },
        runUpdates(updates) {
            const hasBlurbs = updates.blurbs?.length > 0;
            const hasRemovals = updates.blurbIDsRemoved?.length > 0;
            if (!hasBlurbs && !hasRemovals) return;

            // Copy the list inside the deferred fn, so updates queued in the same tick build on each other
            // instead of each overwriting the list with its own stale copy
            deferUpdate(() => {
                let blurbs = [...this.blurbs];
                if (hasBlurbs) updates.blurbs.forEach(blurb => replaceOrAddItem(blurb, blurbs));
                if (hasRemovals) updates.blurbIDsRemoved.forEach(id => removeItemByID(id, blurbs));
                this.blurbs = sortAsc(blurbs);
            });
        },
        addMetricBlurb(idMetric, datetime, text, title, json) {
            return postEndpoint("Universal", "AddMetricBlurb", { idMetric, datetime, text, title, json })
                .then(response => response.result);
        },
        // idType: the blurb's primary type; undefined defaults to BLURBTYPE.BLURB
        addBlurb(idMappingType, typeIDs, text, title, datetime, mappings, json, idType) {
            let data = { idMappingType, idType, typeIDs, text, title, json, datetime, mappings };
            return postEndpoint("Universal", "AddBlurb", data)
                .then(this.onResponse);
        },
        // idType: the blurb's primary type (e.g. BLURBTYPE.BRIEFING/DEBRIEFING); undefined leaves it unchanged
        updateBlurb(idBlurb, idMappingType, typeIDs_Added, typeIDs_Removed, text, title, datetime, mappings_Added, mappings_Removed, json, idType) {
            let data = {
                idBlurb, idMappingType, idType, text, title, json, datetime,
                typeIDs_Added, typeIDs_Removed,
                mappings_Added, mappings_Removed
            };
            return postEndpoint("Universal", "UpdateBlurb", data)
                .then(this.onResponse);
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