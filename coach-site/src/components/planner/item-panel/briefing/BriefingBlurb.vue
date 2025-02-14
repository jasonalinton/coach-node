<template>
    <div class="briefing-blurb d-flex flex-column">
        <!-- Toolbar -->
        <TimeframeRadio :timeframe="timeframe" :isToggle="false" container="briefing-blurb"
                        @timeframeSelected="selectTimeframe" />
        <MetricSelector class="metric-selector" :selected="selectedMetrics"></MetricSelector>
        <BlurbFormControl title="Physical" placeholder="Click to add Physical blurb" :blurbs="physicalBlurbs" 
                          @addBlurb="addBlurb($event, METRIC.PHYSICAL)"
                          @saveBlurb="saveBlurb" />
        <BlurbFormControl title="Social" placeholder="Click to add Social blurb" :blurbs="socialBlurbs" 
                          @addBlurb="addBlurb($event, METRIC.SOCIAL)"
                          @saveBlurb="saveBlurb" />
    </div>
</template>

<script>
import MetricSelector from '../component/MetricSelector.vue';
import BlurbFormControl from '../../../items/form/component/BlurbFormControl.vue';
import { sortAsc, today, clone } from '../../../../../utility';
import { timeframes } from '../../../../model/types';
import { BLURBTYPE, METRIC } from '../../../../model/constants';
import TimeframeRadio from '../component/TimeframeRadio.vue';

export default {
    name: 'BriefingBlurb',
    components: { TimeframeRadio, MetricSelector, BlurbFormControl },
    props: {
        
    },
    data: function () {
        return {
            plannerStore: undefined,
            universalStore: undefined,
            timeframes: clone(timeframes),
            METRIC: clone(METRIC),
            BLURBTYPE: clone(BLURBTYPE),
            idTimeframe: 43,
            timeframe: "day",
            selectedMetrics: {
                physical: { selected: true},
                emotional: { selected: true},
                mental: { selected: true},
                social: { selected: true},
                financial: { selected: true}
            },
        }
    },
    created: async function() {
        let universalStore = await import(`@/store/universalStore`);
        this.universalStore = universalStore.useUniversalStore();

        let plannerStore = await import(`@/store/plannerStore`);
        this.plannerStore = plannerStore.usePlannerStore();

        this.timeframeIDs = this.timeframes.filter(x => x.isActive).map(x => x.id);

        this.universalStore.getBriefingBlurbs(this.idTimeframe, this.selectedDate);
    },
    computed: {
        selectedDate() {
            return (this.plannerStore) ? this.plannerStore.selectedDate : today();
        },
        blurbs() {
            let blurbs = [];
            if (this.universalStore) {
                blurbs = this.universalStore.blurbs;
            }
            // blurbs = blurbs.filter(x => x.idType == BLURBTYPE.BRIEFING && +new Date(x.datetime) == this.selectedDate );
            blurbs = blurbs.filter(x => x.idType == BLURBTYPE.BRIEFING );
            blurbs = blurbs.filter(x => +new Date(x.datetime) == +this.selectedDate );

            return blurbs;
        },
        physicalBlurbs() {
            // TODO: Sort
            let blurbs = this.blurbs.filter(x => x.idMetric == METRIC.PHYSICAL);
            return blurbs
        },
        socialBlurbs() {
            // TODO: Sort
            let blurbs = this.blurbs.filter(x => x.idMetric == METRIC.SOCIAL);
            return blurbs
        },
        nextPostition() {
            let count = this.physicalBlurbs.length;
            let nextPostition = (count > 0) ? this.physicalBlurbs[count -1].position + 1 : 1; 
            return nextPostition;
        },
        nextTempID() {
            let blurbs = sortAsc([...this.physicalBlurbs], 'id');
            let count = blurbs.length;
            let nextTempID = (count > 0 && blurbs[0].id < 0) ? blurbs[0].id - 1: -1; 
            return nextTempID;
        }
    },
    methods: {
        selectTimeframe(timeframeText) {
            let index = this.timeframes.findIndex(x => x.text.toLowerCase() == timeframeText.toLowerCase()); 
            let timeframe = this.timeframes[index];
            this.idTimeframe = timeframe.id;
            this.timeframe = timeframeText;
        },
        addBlurb(text, idMetric) {
            this.universalStore.addBriefingBlurb(text, new Date(), BLURBTYPE.BRIEFING, idMetric, this.idTimeframe)
        },
        saveBlurb(id, text) {
            let index = this.blurbs.findIndex(x => x.id == id);
            if (index > -1) {
                let blurb = this.blurbs[index];
                blurb.text = text;
            }
        }
    },
}

</script>

<style scoped>
.briefing-blurb {
    padding: 12px;
}

.metric-selector {
    margin-bottom: 16px;
}

</style>