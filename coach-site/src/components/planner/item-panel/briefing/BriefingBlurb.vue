<template>
    <div class="briefing-blurb d-flex flex-column p-2">
        <h4 class="text-start" @click="isShown = !isShown">Blurbs</h4>
        <div v-if="isShown" class="d-flex flex-column">
            <MetricSelector class="metric-selector mt-1" :selected="selectedMetrics"></MetricSelector>
            <BlurbFormControl v-for="metric in metrics" :key="metric.id" :header="metric.title" :placeholder="`Click to add ${metric.title} blurb`" :blurbs="metric.prop"
                              class="mt-2" 
                              @addBlurb="addBlurb($event, metric.id)"
                              @saveBlurb="saveBlurb" />
        </div>
    </div>
</template>

<script>
import MetricSelector from '../component/MetricSelector.vue';
import BlurbFormControl from '../../../items/form/component/BlurbFormControl.vue';
import TimeframeRadio from '../component/TimeframeRadio.vue';
import { sortAsc, today, clone } from '../../../../../utility';
import { BLURBTYPE, METRIC } from '../../../../model/constants';

export default {
    name: 'BriefingBlurb',
    components: { TimeframeRadio, MetricSelector, BlurbFormControl },
    props: {
        idTimeframe: {
            type: Number,
            default: () => 55
        }
    },
    data: function () {
        return {
            plannerStore: undefined,
            universalStore: undefined,
            METRIC: clone(METRIC),
            BLURBTYPE: clone(BLURBTYPE),
            selectedMetrics: {
                physical: false,
                emotional: false,
                mental: false,
                social: false,
                financial: false
            },
            isShown: false,
        }
    },
    created: async function() {
        let universalStore = await import(`@/store/universalStore`);
        this.universalStore = universalStore.useUniversalStore();

        let plannerStore = await import(`@/store/plannerStore`);
        this.plannerStore = plannerStore.usePlannerStore();

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
        metrics() {
            return [
                {
                    id: this.METRIC.PHYSICAL,
                    title: "Physical",
                    prop: this.physicalBlurbs,
                },
                {
                    id: this.METRIC.SOCIAL,
                    title: "Social",
                    prop: this.socialBlurbs,
                },
                {
                    id: this.METRIC.MENTAL,
                    title: "Mental",
                    prop: this.mentalBlurbs,
                },
                {
                    id: this.METRIC.EMOTIONAL,
                    title: "Emotional",
                    prop: this.emotionalBlurbs,
                },
                {
                    id: this.METRIC.FINANCIAL,
                    title: "Financial",
                    prop: this.financialBlurbs,
                },
            ]
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
        mentalBlurbs() {
            // TODO: Sort
            let blurbs = this.blurbs.filter(x => x.idMetric == METRIC.MENTAL);
            return blurbs
        },
        emotionalBlurbs() {
            // TODO: Sort
            let blurbs = this.blurbs.filter(x => x.idMetric == METRIC.EMOTIONAL);
            return blurbs
        },
        financialBlurbs() {
            // TODO: Sort
            let blurbs = this.blurbs.filter(x => x.idMetric == METRIC.FINANCIAL);
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
        addBlurb(blurb, idMetric) {
            this.universalStore.addBriefingBlurb(blurb.text, this.selectedDate, BLURBTYPE.BRIEFING, idMetric, this.idTimeframe)
        },
        saveBlurb(blurb) {
            let index = this.blurbs.findIndex(x => x.id == blurb.id);
            if (index > -1) {
                let _blurb = this.blurbs[index];
                _blurb.text = blurb.text;
            }
        }
    },
    watch: {
        idTimeframe(value) {
            this.universalStore.getBriefingBlurbs(value, this.selectedDate);
        }
    }
}

</script>

<style scoped>
.metric-selector {
    margin-bottom: 16px;
}

</style>