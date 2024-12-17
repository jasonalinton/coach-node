<template>
    <div class="goals-in-timeframe d-flex flex-column text-start">
        <div v-if="timeframeID == TIMEFRAME.DAY" class="d-flex flex-row">
            <span v-if="isToday" class="timeframe">Today</span>
            <span v-if="!isToday" class="timeframe">Day</span>
            <span class="dash">-</span>
            <span class="date">{{ date }}</span>
        </div>
        <span v-else class="timeframe">{{ timeframe }}</span>
        <span class="goal" v-for="goal in goals" :key="goal.id">{{ goal.text }}</span>
    </div>
</template>

<script>
import { TIMEFRAME } from '../../../../../model/constants';
import { timeframes } from '../../../../../model/types';
import { clone, today } from '../../../../../../utility';
import { isToday, toShortWeekdayString } from '../../../../../../utility/timeUtility';

export default {
    name: 'GoalsInTimeframe',
    components: {  },
    props: {
        timeframeID: Number,
    },
    data: function () {
        return {
            plannerStore: undefined,
            goalStore: undefined,
            timeframes: clone(timeframes),
            TIMEFRAME: clone(TIMEFRAME)
        }
    },
    created: async function() {
        let plannerStore = await import(`@/store/plannerStore`);
        this.plannerStore = plannerStore.usePlannerStore();

        let goalStore = await import(`@/store/goalStore`);
        this.goalStore = goalStore.useGoalStore();
    },
    computed: {
        selectedDate() {
            if (this.plannerStore) {
                return this.plannerStore.selectedDate;
            }
            return today;
        },
        date() {
            return toShortWeekdayString(this.selectedDate, true);
        },
        isToday() {
            return isToday(this.selectedDate);
        },
        timeframe() {
            var timeframe = this.timeframes.find(x => x.id == this.timeframeID);
            return (timeframe) ? timeframe.text : "";
        },
        goals() {
            if (this.goalStore) {
                let goals = this.goalStore.getGoalsInTimeframe(this.timeframeID, this.selectedDate);
                return goals;
            }
            return [];
        },
    },  
    methods: {
        
    },
}

</script>

<style scoped>
span.timeframe {
    padding-left: 20px;
    color: #3B99FC;
    font-size: 14px;
    font-weight: 500;
}
span.date {
    font-size: 14px;
    font-weight: 500;
}
span.dash {
    margin: 0 4px;
    line-height: 21px;
}

.goal {
    padding-left: 20px;
    color: #565656;
}
</style>