<template>
    <div class="goal-panel-by-timeframe">
        <TimeframeRadio :timeframeIDs="timeframeIDs" :isToggle="true" container="goal-by-timeframe"
                        @toggleTimeframe="toggleTimeframe" />
        <GoalsInTimeframe  v-for="id in timeframeIDs" :key="id"
                           class="pt-2"
                           :timeframeID="id" />
    </div>
</template>

<script>
import GoalsInTimeframe from './component/GoalsInTimeframe.vue';
import { timeframes } from '../../../../model/types';
import { clone } from '../../../../../utility';
import TimeframeRadio from '../component/TimeframeRadio.vue';

export default {
    name: 'GoalPanelByTimeframe',
    components: { GoalsInTimeframe, TimeframeRadio },
    props: {
        
    },
    data: function () {
        return {
            appStore: undefined,
            timeframes: clone(timeframes),
            timeframeIDs: []
        }
    },
    created: async function() {
        let appStore = await import(`@/store/appStore`);
        this.appStore = appStore.useAppStore();

        let timeframeIDs = this.timeframes.filter(x => x.isActive).map(x => x.id);
        this.timeframeIDs = (this.showReverse) ? timeframeIDs.reverse() : timeframeIDs;
    },
    computed: {
        showReverse() {
            return (this.appStore) ? this.appStore.itemPanel.goal.showReverse : undefined;
        },
        showTimeline() {
            return (this.appStore) ? this.appStore.itemPanel.goal.showTimeline : undefined;
        },
        showHierarchy() {
            return (this.appStore) ? this.appStore.itemPanel.goal.showHierarchy : undefined;
        },
    },
    methods: {
        toggleTimeframe(timeframeID) {
            let timeframe = this.timeframes.find(x => x.id == timeframeID);
            timeframe.isActive = !timeframe.isActive;
            let timeframeIDs = this.timeframes.filter(x => x.isActive).map(x => x.id);
            this.timeframeIDs = (this.showReverse) ? timeframeIDs.reverse() : timeframeIDs;
        }
    },
    watch: {
        timeframes: {
            handler(value) {
                let timeframeIDs = value.filter(x => x.isActive).map(x => x.id);
                this.timeframeIDs = (this.showReverse == true) ? timeframeIDs.reverse() : timeframeIDs;
            },
            deep: true
        },
        showReverse() {
            this.timeframeIDs = this.timeframeIDs.reverse();
        }
    }
}

</script>

<style scoped>

</style>