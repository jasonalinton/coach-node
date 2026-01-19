<template>
    <div class="timeframe-points d-flex flex-column">
        <div class="d-flex flex-column">
            <TypePoints v-for="(item, index) in items" :key="index" 
                        :item="item" :level="0" :iterations="iterations" />
        </div>
    </div>
</template>

<script>
import TypePoints from './TypePoints.vue';
import { firstDayOfWeek, lastDayOfWeek } from '../../../utility/timeUtility';

export default {
    name: 'TimeframePoints',
    components: { TypePoints },
    props: {
        selectedDate: Date,
    },
    data: function () {
        return {
            iterationStore: undefined,
            items: [
                {
                    category: "All",
                    label: "All",
                    type: "iteration",
                    color: '#FC3B3B',
                    showPoints: true,
                    isExpanded: true,
                    id: undefined,
                    ids: undefined,
                    items: [
                        {
                            category: "Year",
                            label: "Year",
                            type: "label",
                            color: undefined,
                            showPoints: true,
                            isExpanded: true,
                            items: [
                                { type: "goal", color: '#1EBA31',id: 333, ids: undefined, label: "Dopamine", showPoints: true, isExpanded: false }, // Learn to regulate dopamine
                                { type: "goal", color: '#1EBA31',id: 334, ids: undefined, label: "Dating", showPoints: true, isExpanded: false }, // Start dating casually
                                { type: "goal", color: '#1EBA31',id: 335, ids: undefined, label: "Frequency", showPoints: true, isExpanded: false }, // Get on the right frequency
                                { type: "goal", color: '#1EBA31',id: 336, ids: undefined, label: "Videos", showPoints: true, isExpanded: false }, // Make videos for goals
                                { type: "goal", color: '#1EBA31',id: 338, ids: undefined, label: "Mom", showPoints: true, isExpanded: false }, // Get Mom on a stable routine
                            ]
                        },
                        {
                            category: "Main",
                            label: "Main",
                            type: "label",
                            color: undefined,
                            showPoints: false,
                            isExpanded: false,
                            items: [
                                { type: "type", color: '#FC3B3B', id: 155, ids: undefined, label: "Nutrition", showPoints: true, isExpanded: false }, // Meal/Nutrition
                                { type: "type", color: '#F4511E', id: 158, ids: undefined, label: "Exercise", showPoints: true, isExpanded: false }, // Exercise
                                { type: "goal", color: '#4C6EF5',id: 80, ids: undefined, label: "Dance", showPoints: true, isExpanded: false }, // Dance/Become proficient at dance
                                { type: "goal", color: '#1EBA31',id: 48, ids: undefined, label: "Coach", showPoints: true, isExpanded: false }, // Finish Coach 1.0
                            ]
                        },
                        {
                            category: "Metrics",
                            label: "Metrics",
                            type: "metric",
                            showPoints: false,
                            isExpanded: false,
                            id: undefined,
                            ids: [1,2,3,4,5],
                            items: [
                                { type: "metric", color: '#3B99FC', id: 1, ids: undefined, label: "Physical", showPoints: true, isExpanded: false}, // Physical
                                { type: "metric", color: '#FC3B3B', id: 2, ids: undefined, label: "Social", showPoints: true, isExpanded: false }, // Social
                                { type: "metric", color: '#F4511E', id: 3, ids: undefined, label: "Mental", showPoints: true, isExpanded: false }, // Mental
                                { type: "metric", color: '#4C6EF5', id: 4, ids: undefined, label: "Emotional", showPoints: true, isExpanded: false }, // Emotional
                                { type: "metric", color: '#1EBA31', id: 5, ids: undefined, label: "Financial", showPoints: true, isExpanded: false }, // Financial
                            ]
                        },
                    ]
                },
            ]
        }
    },
    created: async function() {
        let iterationStore = await import(`@/store/iterationStore`);
        this.iterationStore = iterationStore.useIterationStore();
    },
    computed: {
        start() {
            return firstDayOfWeek(this.selectedDate);
        },
        end() {
            return lastDayOfWeek(this.selectedDate);
        },
        iterations() {
            let iterations = [];
            if (this.iterationStore) {
                iterations = this.iterationStore.iterations;
                iterations = iterations.filter(iteration => {
                    return +(new Date(iteration.startAt)) >= +this.start && 
                           +(new Date(iteration.endAt)) <= +this.end
                });
            }
            return iterations;
        }
    },
}

</script>

<style scoped>
.timeframe-points {
    padding: 0px 16px;
}
</style>