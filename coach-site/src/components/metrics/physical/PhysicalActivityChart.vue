<template>
    <div class="physical-activity-chart d-flex flex-column overflow-scroll">
        <div class="header d-flex flex-column">
            <span class="title">Activity Trends</span>
            <span class="subtitle">Weekly points from exercise &amp; physical activity</span>
        </div>
        <div class="bar-chart d-flex flex-row" :style="{ maxWidth: (width - 100) + 'px' }">
            <div v-for="(week, index) in weeklyBuckets" :key="+week.weekStart"
                 class="bar-column d-flex flex-column align-items-center">
                <div class="stack d-flex flex-column-reverse">
                    <div class="segment physicalActivity" :data-points="week.physicalActivity"
                         :style="{ height: segmentHeight(week.physicalActivity) }"></div>
                    <div class="segment exercise" :data-points="week.exercise"
                         :style="{ height: segmentHeight(week.exercise) }"></div>
                </div>
                <span class="week-label" :class="{ 'is-current': index === weeklyBuckets.length - 1 }">
                    {{ week.label }}
                </span>
            </div>
        </div>
        <div class="legend d-flex flex-row justify-content-center">
            <div class="legend-item d-flex flex-row align-items-center">
                <span class="swatch exercise"></span>
                <span>{{ exerciseType.text }}</span>
            </div>
            <div class="legend-item d-flex flex-row align-items-center">
                <span class="swatch physicalActivity"></span>
                <span>{{ physicalActivityType.text }}</span>
            </div>
        </div>
        <hr />
        <div class="stat-grid d-flex flex-row flex-wrap">
            <div class="stat">
                <span class="stat-label">Current Velocity</span>
                <span class="stat-value current">{{ weeklyTotals.current }} pts</span>
                <span class="stat-desc">Est. output in current cycle</span>
            </div>
            <div class="stat">
                <span class="stat-label">Peak Capacity</span>
                <span class="stat-value peak">{{ weeklyTotals.peak }} pts</span>
                <span class="stat-desc">Max observed weekly load</span>
            </div>
            <div class="stat">
                <span class="stat-label">Growth Split</span>
                <span class="stat-value growth">&gt; {{ weeklyTotals.growthSplit }} pts</span>
                <span class="stat-desc">Min load required to progress</span>
            </div>
            <div class="stat">
                <span class="stat-label">Maintenance</span>
                <span class="stat-value maintenance">{{ weeklyTotals.maintenance }} pts</span>
                <span class="stat-desc">Min load to hold current level</span>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import { useAppStore } from '@/store/appStore'
import { usePhysicalStore } from '@/store/physicalStore'
import { TODO_ACTIVITY_TYPE } from '../../../model/constants'
import { todoActivityTypes } from '../../../model/types'
import { firstDayOfWeek, getMonthDate, addWeek } from '../../../../utility/timeUtility';

export default {
    name: 'PhysicalActivityChart',
    components: {  },
    props: {

    },
    data: function () {
        return {
            physicalStore: undefined,
            points: [],
            weekCount: 52
        }
    },
    created: async function() {
        this.appStore = useAppStore();
        this.physicalStore = usePhysicalStore();
        this.points = await this.physicalStore.getPhysicalTypePoints() || [];
    },
    computed: {
        width() {
            return (this.appStore && this.appStore.bodyOuterWidth) ? this.appStore.bodyOuterWidth : 0
        },
        exerciseType() {
            return todoActivityTypes.find(t => t.id === TODO_ACTIVITY_TYPE.EXERCISE);
        },
        physicalActivityType() {
            return todoActivityTypes.find(t => t.id === TODO_ACTIVITY_TYPE.PHYSICAL_ACTIVITY);
        },
        allWeeklyTotals() {
            let weekMap = {};
            this.points.forEach(point => {
                let weekStart = firstDayOfWeek(new Date(point.date));
                let key = +weekStart;
                if (!weekMap[key]) {
                    weekMap[key] = { weekStart, exercise: 0, physicalActivity: 0 };
                }
                if (point.idType === TODO_ACTIVITY_TYPE.EXERCISE) {
                    weekMap[key].exercise += point.points;
                } else if (point.idType === TODO_ACTIVITY_TYPE.PHYSICAL_ACTIVITY) {
                    weekMap[key].physicalActivity += point.points;
                }
            });
            return Object.values(weekMap)
                .map(week => week.exercise + week.physicalActivity)
                .sort((a, b) => a - b);
        },
        weeklyBuckets() {
            let weekMap = {};
            this.points.forEach(point => {
                let weekStart = firstDayOfWeek(new Date(point.date));
                let key = +weekStart;
                if (!weekMap[key]) {
                    weekMap[key] = { weekStart, exercise: 0, physicalActivity: 0 };
                }
                if (point.idType === TODO_ACTIVITY_TYPE.EXERCISE) {
                    weekMap[key].exercise += point.points;
                } else if (point.idType === TODO_ACTIVITY_TYPE.PHYSICAL_ACTIVITY) {
                    weekMap[key].physicalActivity += point.points;
                }
            });

            let buckets = [];
            let weekStart = firstDayOfWeek(new Date());
            for (let i = 0; i < this.weekCount; i++) {
                let key = +weekStart;
                let bucket = weekMap[key] || { weekStart, exercise: 0, physicalActivity: 0 };
                buckets.unshift({
                    weekStart,
                    exercise: bucket.exercise,
                    physicalActivity: bucket.physicalActivity,
                    // label: `W${moment(weekStart).week()}`
                    label: `${getMonthDate(weekStart)}`
                });
                weekStart = addWeek(weekStart, -1);
            }
            return buckets;
        },
        maxWeeklyTotal() {
            let totals = this.weeklyBuckets.map(week => week.exercise + week.physicalActivity);
            return Math.max(1, ...totals);
        },
        weeklyTotals() {
            // Placeholder heuristics: there is no capacity/goal data source yet,
            // so peak/growth/maintenance are derived from observed weekly totals.
            let totals = this.allWeeklyTotals;
            let current = this.weeklyBuckets.length
                ? (this.weeklyBuckets[this.weeklyBuckets.length - 1].exercise + this.weeklyBuckets[this.weeklyBuckets.length - 1].physicalActivity)
                : 0;
            let peak = totals.length ? totals[totals.length - 1] : 0;
            let average = totals.length ? totals.reduce((sum, total) => sum + total, 0) / totals.length : 0;
            let roundTo10 = value => Math.round(value / 10) * 10;

            return {
                current,
                peak,
                growthSplit: roundTo10((average + peak) / 2),
                maintenance: roundTo10(average * 0.65)
            };
        }
    },
    methods: {
        segmentHeight(value) {
            return `${(value / this.maxWeeklyTotal) * 100}%`;
        }
    },
}

</script>

<style scoped>
.physical-activity-chart {
    background-color: #fff;
    border-radius: 16px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    padding: 24px;
    width: 100%;
    /* max-width: 472px; */
}

.header .title {
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1a;
}

.header .subtitle {
    font-size: 13px;
    color: #767676;
    margin-top: 2px;
}

.bar-chart {
    margin-top: 20px;
    height: 130px;
    gap: 10px;
    overflow-x: auto;
}

.bar-column {
    flex: 1 1 0;
    min-width: 20px;
    height: 100%;
    justify-content: flex-end;
}

.stack {
    width: 60%;
    max-width: 36px;
    height: 100px;
    gap: 1px;
}

.segment {
    width: 100%;
    border-radius: 2px;
}

.segment.exercise {
    background-color: v-bind('exerciseType.color');
}

.segment.physicalActivity {
    background-color: v-bind('physicalActivityType.color');
}

.week-label {
    font-size: 11px;
    color: #767676;
    margin-top: 8px;
}

.week-label.is-current {
    color: #1a1a1a;
    font-weight: 700;
}

.legend {
    margin-top: 12px;
    gap: 24px;
}

.legend-item {
    font-size: 12px;
    color: #767676;
    gap: 6px;
}

.swatch {
    width: 8px;
    height: 8px;
    border-radius: 2px;
}

.swatch.exercise {
    background-color: v-bind('exerciseType.color');
}

.swatch.physicalActivity {
    background-color: v-bind('physicalActivityType.color');
}

hr {
    margin: 20px 0;
    border: none;
    border-top: 1px solid #e5e5e5;
}

.stat-grid {
    column-gap: 24px;
    row-gap: 20px;
}

.stat {
    display: flex;
    flex-direction: column;
    width: calc(50% - 12px);
}

.stat-label {
    font-size: 12px;
    font-weight: 600;
    color: #767676;
    text-transform: uppercase;
}

.stat-value {
    font-size: 22px;
    font-weight: 700;
    margin-top: 4px;
}

.stat-value.current {
    color: #14b8a6;
}

.stat-value.peak {
    color: #1a1a1a;
}

.stat-value.growth {
    color: #F4511E;
}

.stat-value.maintenance {
    color: #1a1a1a;
}

.stat-desc {
    font-size: 12px;
    color: #767676;
    margin-top: 2px;
}
</style>
