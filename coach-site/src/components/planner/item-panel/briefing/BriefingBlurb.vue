<template>
    <div class="briefing-blurb d-flex flex-column p-2">
        <BriefingSectionHeader title="Blurbs" :count="blurbs.length" :isShown="isShown" @toggle="isShown = !isShown" />
        <div v-if="isShown" class="d-flex flex-column">
            <div v-for="entry in shownEntries" :key="entry.key" class="briefing-blurb-entry d-flex flex-column">
                <BlurbFormControl :ref="el => controls[entry.key] = el"
                                  :header="entry.title" :placeholder="entry.placeholder"
                                  :blurbs="entry.blurbs" :idBlurbType="BLURBTYPE.BRIEFING"
                                  class="mt-2"
                                  @addBlurb="addBlurb($event, entry.id)"
                                  @saveBlurb="saveBlurb" />
            </div>
            <!-- Entries with no blurbs -->
            <div v-if="emptyEntries.length > 0" class="empty-entries d-flex flex-row flex-wrap align-items-center">
                <span class="add-to">Add to</span>
                <span v-for="entry in emptyEntries" :key="entry.key"
                      class="app-pill d-flex flex-row align-items-center"
                      @click="openEntry(entry)">
                    <img src="/icon/button/add.png" width="10" height="10"/>{{ entry.title }}
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import BlurbFormControl from '../../../items/form/component/BlurbFormControl.vue';
import BriefingSectionHeader from './BriefingSectionHeader.vue';
import { today, clone } from '../../../../../utility';
import { BLURBTYPE, METRIC } from '../../../../model/constants';

export default {
    name: 'BriefingBlurb',
    components: { BlurbFormControl, BriefingSectionHeader },
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
            BLURBTYPE: clone(BLURBTYPE),
            isShown: false,
            // Keys of empty entries opened from the "Add to" pills
            openedEntryKeys: [],
        }
    },
    created: async function() {
        // BlurbFormControl instances by entry key, for opening the editor from the "Add to" pills
        this.controls = {};

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
            blurbs = blurbs.filter(x => x.idType == BLURBTYPE.BRIEFING );
            blurbs = blurbs.filter(x => +new Date(x.datetime) == +this.selectedDate );

            return blurbs;
        },
        entries() {
            // General blurbs aren't tied to a metric
            return [
                { id: null, title: "General" },
                { id: METRIC.PHYSICAL, title: "Physical" },
                { id: METRIC.SOCIAL, title: "Social" },
                { id: METRIC.MENTAL, title: "Mental" },
                { id: METRIC.EMOTIONAL, title: "Emotional" },
                { id: METRIC.FINANCIAL, title: "Financial" },
            ].map(entry => ({
                ...entry,
                key: entry.id ?? "general",
                placeholder: (entry.id == null) ? "Click to add a blurb not tied to a metric" : `Click to add ${entry.title} blurb`,
                // TODO: Sort
                blurbs: this.blurbs.filter(x => (x.idMetric ?? null) === entry.id)
            }));
        },
        shownEntries() {
            return this.entries.filter(x => x.blurbs.length > 0 || this.openedEntryKeys.includes(x.key));
        },
        emptyEntries() {
            return this.entries.filter(x => !this.shownEntries.includes(x));
        }
    },
    methods: {
        addBlurb(blurb, idMetric) {
            return this.universalStore.addBriefingBlurb(blurb.text, this.selectedDate, blurb.idBlurbType, idMetric, this.idTimeframe, blurb.json)
        },
        saveBlurb(blurb) {
            return this.universalStore.updateBlurb(blurb.id, undefined, [], [], blurb.text, blurb.title, undefined, [], [], blurb.json);
        },
        openEntry(entry) {
            this.openedEntryKeys.push(entry.key);
            this.$nextTick(() => this.controls[entry.key]?.onAddBlurb());
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
.briefing-blurb-entry :deep(.form-head) {
    font-size: 16px;
}

.empty-entries {
    gap: 6px;
    margin-top: 12px;
}

.add-to {
    font-size: 14px;
    color: #8A8A8A;
}

.app-pill {
    gap: 4px;
    padding: 4px 8px;
}
</style>
