<template>
    <div class="body d-flex flex-column flex-grow-1 overflow-scroll">
        <!-- Toolbar -->
        <TimeframeRadio class="sticky-top" :timeframe="timeframe" :isToggle="false" container="briefing-panel" segmented
                        @timeframeSelected="selectTimeframe" />
        <BriefingGoals :idTimeframe="idTimeframe" :goalGroups="goalGroups" />
        <BriefingBlurb :idTimeframe="idTimeframe" />
        <DebriefingPoints />
    </div>
</template>

<script>
import TimeframeRadio from '../component/TimeframeRadio.vue';
import BriefingGoals from './BriefingGoals.vue';
import BriefingBlurb from './BriefingBlurb.vue';
import DebriefingPoints from './DebriefingPoints.vue';
import { getGoalGroups } from './briefingUtility';
import { timeframes } from '../../../../model/types';
import { clone, today } from '../../../../../utility';

export default {
    name: 'BriefingClassic',
    components: { TimeframeRadio, BriefingGoals, BriefingBlurb, DebriefingPoints },
    data: function () {
        return {
            plannerStore: undefined,
            goalStore: undefined,
            idTimeframe: 43,
            timeframe: "day",
            timeframes: clone(timeframes),
        }
    },
    created: async function() {
        let goalStore = await import(`@/store/goalStore`);
        this.goalStore = goalStore.useGoalStore();

        let plannerStore = await import(`@/store/plannerStore`);
        this.plannerStore = plannerStore.usePlannerStore();
    },
    computed: {
        selectedDate() {
            return (this.plannerStore) ? this.plannerStore.selectedDate : today();
        },
        goalGroups() {
            return getGoalGroups(this.goalStore, this.idTimeframe, this.selectedDate);
        }
    },
    methods: {
        selectTimeframe
    },
}

function selectTimeframe(timeframeText) {
    let index = this.timeframes.findIndex(x => x.text.toLowerCase() == timeframeText.toLowerCase());
    let timeframe = this.timeframes[index];
    this.idTimeframe = timeframe.id;
    this.timeframe = timeframeText;
}

</script>

<style scoped>

</style>
