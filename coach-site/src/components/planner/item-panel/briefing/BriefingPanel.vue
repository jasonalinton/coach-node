<template>
    <div class="row g-0 h-100">
        <div class="col h-100 d-flex flex-column">
            <div class="briefing-panel d-flex flex-column flex-grow-1 overflow-hidden">
                <ItemPanelNavbar v-show="showHead" />
                <div class="body d-flex flex-column flex-grow-1 overflow-scroll">
                    <!-- Toolbar -->
                    <TimeframeRadio class="sticky-top" :timeframe="timeframe" :isToggle="false" container="briefing-panel" segmented
                                    @timeframeSelected="selectTimeframe" />
                    <BriefingGoals :idTimeframe="idTimeframe" :goalGroups="goalGroups" />
                    <BriefingBlurb :idTimeframe="idTimeframe" />
                    <DebriefingPoints />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ItemPanelNavbar from '../../../mobile/navbar/ItemPanelNavbar.vue';
import TimeframeRadio from '../component/TimeframeRadio.vue';
import BriefingGoals from './BriefingGoals.vue';
import BriefingBlurb from './BriefingBlurb.vue';
import DebriefingPoints from './DebriefingPoints.vue';
import { timeframes } from '../../../../model/types';
import { TIMEFRAME } from '../../../../model/constants';
import { clone, today } from '../../../../../utility';

// Goals in the selected timeframe are shown along with goals in every longer timeframe
const GOAL_TIMEFRAMES = [ TIMEFRAME.DAY, TIMEFRAME.WEEK, TIMEFRAME.MONTH, TIMEFRAME.YEAR ];

export default {
    name: 'BriefingPanel',
    components: { ItemPanelNavbar, TimeframeRadio, BriefingGoals, BriefingBlurb, DebriefingPoints },
    props: {
        showHead: {
            type: Boolean,
            default: true
        }
    },
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
            if (!this.goalStore) return [];

            let index = GOAL_TIMEFRAMES.indexOf(this.idTimeframe);
            let timeframeIDs = GOAL_TIMEFRAMES.slice((index > -1) ? index : 0);

            // A goal in more than one timeframe is only shown in the shortest one
            let shownIDs = [];
            let groups = timeframeIDs.map(idTimeframe => {
                let goalIDs = this.goalStore.getGoalsInTimeframe(idTimeframe, this.selectedDate)
                    .map(x => x.id)
                    .filter(id => !shownIDs.includes(id));
                shownIDs.push(...goalIDs);
                return { idTimeframe, goalIDs };
            });
            return groups.filter(x => x.goalIDs.length > 0);
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

</style>./BriefingGoals.vue