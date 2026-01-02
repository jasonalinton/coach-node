<template>
    <div class="row g-0 h-100">
        <div class="col h-100 d-flex flex-column">
            <div class="briefing-panel d-flex flex-column flex-grow-1 overflow-hidden">
                <ItemPanelNavbar v-show="showHead" />
                <div class="body d-flex flex-column flex-grow-1 overflow-scroll">
                    <!-- Toolbar -->
                    <TimeframeRadio class="sticky-top" :timeframe="timeframe" :isToggle="false" container="briefing-panel"
                                    @timeframeSelected="selectTimeframe" />
                    <BriefingGoals :idTimeframe="idTimeframe" :goalIDs="goalIDs" />
                    <BriefingBlurb :idTimeframe="idTimeframe" />
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
import { timeframes } from '../../../../model/types';
import { clone, today } from '../../../../../utility';

export default {
    name: 'BriefingPanel',
    components: { ItemPanelNavbar, TimeframeRadio, BriefingGoals, BriefingBlurb },
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
        goalIDs() {
            if (this.goalStore) {
                let goals = this.goalStore.getGoalsInTimeframe(this.idTimeframe, this.selectedDate);
                return goals.map(x => x.id);
            }
            return [];
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