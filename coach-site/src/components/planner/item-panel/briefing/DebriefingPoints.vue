<template>
    <div class="debriefing-points d-flex flex-column p-2">
        <h4 class="text-start" @click="isShown = !isShown">Debriefing Points</h4>
        <div v-if="isShown" class="d-flex flex-column">
            <!-- Dates -->
            <div class="d-flex justify-content-end gap-2">
                <span v-for="(date, index) in dates" :key="index"
                      class="pill">{{ getMonthDate(date) }}</span>
            </div>
            <!-- Types -->
            <div v-for="(item, index) in items" :key="index"
                 class="d-flex">
                    <!-- Label -->
                    <div class="d-flex">
                        <span class="label" :style="{ 'padding-left': `${level * 10}px`}">{{ item.label }}</span>
                        <div v-if="item.showPoints" class="d-flex flex-row justify-content-between flex-grow-1 pe-2">
                            <span class="dot" :style="{ 'background-color': item.color || 'gray' }"></span>
                            <span class="dot" :style="{ 'background-color': item.color || 'gray' }"></span>
                        </div>
                    </div>
                    <!-- Points -->
                    <div class="d-flex justify-content-end gap-2 flex-grow-1">
                        <TypePointsTimeframe v-for="(date, index) in dates" :key="index"
                                             class="pill"
                                             :idTimeframe="idTimeframe" 
                                             :date="date" 
                                             :item="item"/>
                    </div>
            </div>
        </div>
    </div>
</template>

<script>
import { today, addDay, addWeek, addMonth, addYear, getMonthDate, firstDayOfWeek, firstDayOfMonth, firstDayOfYear } from '../../../../../utility/timeUtility';
import { TIMEFRAME } from '../../../../model/constants';
import TypePointsTimeframe from '../../../points/TypePointsTimeframe.vue';


export default {
    name: 'DebriefingPoints',
    components: { TypePointsTimeframe },
    props: {
        idTimeframe: {
            type: Number,
            default: () => TIMEFRAME.WEEK 
        },
    },
    data: function () {
        return {
            plannerStore: undefined,
            iterationStore: undefined,
            isShown: true,
            items: [
                { type: "goal", color: '#1EBA31',id: 333, ids: undefined, label: "Dopamine", showPoints: true, isExpanded: false }, // Learn to regulate dopamine
                { type: "goal", color: '#1EBA31',id: 334, ids: undefined, label: "Dating", showPoints: true, isExpanded: false }, // Start dating casually
                { type: "goal", color: '#1EBA31',id: 335, ids: undefined, label: "Frequency", showPoints: true, isExpanded: false }, // Get on the right frequency
                { type: "goal", color: '#1EBA31',id: 336, ids: undefined, label: "Videos", showPoints: true, isExpanded: false }, // Make videos for goals
                { type: "goal", color: '#1EBA31',id: 338, ids: undefined, label: "Mom", showPoints: true, isExpanded: false }, // Get Mom on a stable routine
                { type: "goal", color: '#1EBA31',id: 48, ids: undefined, label: "Coach", showPoints: true, isExpanded: false }, // Finish Coach 1.0
            ],
            // items: [
            //     {
            //         category: "All",
            //         label: "All",
            //         type: "iteration",
            //         color: '#FC3B3B',
            //         showPoints: true,
            //         isExpanded: true,
            //         id: undefined,
            //         ids: undefined,
            //         items: [
            //             {
            //                 category: "Year",
            //                 label: "Year",
            //                 type: "label",
            //                 color: undefined,
            //                 showPoints: true,
            //                 isExpanded: true,
            //                 items: [
            //                     { type: "goal", color: '#1EBA31',id: 333, ids: undefined, label: "Dopamine", showPoints: true, isExpanded: false }, // Learn to regulate dopamine
            //                     { type: "goal", color: '#1EBA31',id: 334, ids: undefined, label: "Dating", showPoints: true, isExpanded: false }, // Start dating casually
            //                     { type: "goal", color: '#1EBA31',id: 335, ids: undefined, label: "Frequency", showPoints: true, isExpanded: false }, // Get on the right frequency
            //                     { type: "goal", color: '#1EBA31',id: 336, ids: undefined, label: "Videos", showPoints: true, isExpanded: false }, // Make videos for goals
            //                     { type: "goal", color: '#1EBA31',id: 338, ids: undefined, label: "Mom", showPoints: true, isExpanded: false }, // Get Mom on a stable routine
            //                     { type: "goal", color: '#1EBA31',id: 48, ids: undefined, label: "Coach", showPoints: true, isExpanded: false }, // Finish Coach 1.0
            //                 ]
            //             },
            //             {
            //                 category: "Main",
            //                 label: "Main",
            //                 type: "label",
            //                 color: undefined,
            //                 showPoints: false,
            //                 isExpanded: false,
            //                 items: [
            //                     { type: "type", color: '#FC3B3B', id: 155, ids: undefined, label: "Nutrition", showPoints: true, isExpanded: false }, // Meal/Nutrition
            //                     { type: "type", color: '#F4511E', id: 158, ids: undefined, label: "Exercise", showPoints: true, isExpanded: false }, // Exercise
            //                     { type: "goal", color: '#4C6EF5',id: 80, ids: undefined, label: "Dance", showPoints: true, isExpanded: false }, // Dance/Become proficient at dance
            //                     { type: "goal", color: '#1EBA31',id: 48, ids: undefined, label: "Coach", showPoints: true, isExpanded: false }, // Finish Coach 1.0
            //                     { type: "goal", color: '#1a73e8',id: 347, ids: undefined, label: "Memorize", showPoints: true, isExpanded: false }, // Memorize Everything!
            //                 ]
            //             },
            //             {
            //                 category: "Metrics",
            //                 label: "Metrics",
            //                 type: "metric",
            //                 showPoints: false,
            //                 isExpanded: false,
            //                 id: undefined,
            //                 ids: [1,2,3,4,5],
            //                 items: [
            //                     { type: "metric", color: '#3B99FC', id: 1, ids: undefined, label: "Physical", showPoints: true, isExpanded: false}, // Physical
            //                     { type: "metric", color: '#FC3B3B', id: 2, ids: undefined, label: "Social", showPoints: true, isExpanded: false }, // Social
            //                     { type: "metric", color: '#F4511E', id: 3, ids: undefined, label: "Mental", showPoints: true, isExpanded: false }, // Mental
            //                     { type: "metric", color: '#4C6EF5', id: 4, ids: undefined, label: "Emotional", showPoints: true, isExpanded: false }, // Emotional
            //                     { type: "metric", color: '#1EBA31', id: 5, ids: undefined, label: "Financial", showPoints: true, isExpanded: false }, // Financial
            //                 ]
            //             },
            //         ]
            //     },
            // ],
            dateCount: 4
        }
    },
    created: async function() {
        let plannerStore = await import(`@/store/plannerStore`);
        this.plannerStore = plannerStore.usePlannerStore();

        let iterationStore = await import(`@/store/iterationStore`);
        this.iterationStore = iterationStore.useIterationStore();
    },
    computed: {
        selectedDate() {
            return (this.plannerStore) ? this.plannerStore.selectedDate : today();
        },
        start() {
            if (this.idTimeframe == TIMEFRAME.WEEK) {
                return firstDayOfWeek(this.selectedDate);
            } else if (this.idTimeframe == TIMEFRAME.MONTH) {
                return firstDayOfMonth(this.selectedDate);
            } else if (this.idTimeframe == TIMEFRAME.YEAR) {
                return firstDayOfYear(this.selectedDate);
            }
            return this.selectedDate;
        },
        dates() {
            let dates = [ this.start ];
            for (let i = 1; i <= this.dateCount - 1; i++) {
                if (this.idTimeframe == TIMEFRAME.WEEK) {
                    dates.push(addWeek(this.start, -i));
                } else if (this.idTimeframe == TIMEFRAME.MONTH) {
                    dates.push(addMonth(this.start, -i));
                } else if (this.idTimeframe == TIMEFRAME.YEAR) {
                    dates.push(addYear(this.start, -i));
                } else {
                    dates.push(addDay(this.start, -i));
                }
            }
            return dates.reverse();
        }
    },
    methods: {
        getMonthDate(date) {
            let monthDate = getMonthDate(date);
            return monthDate;
        }
    }
}

</script>

<style scoped>
.timeframe-points {
    padding: 0px 16px;
}

.pill {
    width: 34px;
    text-align: center;
}
</style>