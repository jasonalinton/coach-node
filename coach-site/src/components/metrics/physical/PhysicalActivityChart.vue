<template>
    <div class="physical-activity-chart d-flex flex-column">
        <div class="header d-flex flex-column">
            <span class="title">Activity Trends</span>
            <span class="subtitle">Points from exercise &amp; physical activity</span>
            <div class="timeframe-toggle d-flex flex-row">
                <button v-for="option in timeframeOptions" :key="option.id"
                        type="button"
                        class="toggle-option"
                        :class="{ selected: timeframe === option.id }"
                        @click="timeframe = option.id">
                    {{ option.text }}
                </button>
            </div>
        </div>
        <div class="chart-row d-flex flex-row align-items-center">
            <button type="button" class="nav-btn" :disabled="isAtOldest" @click="pageBack">&lsaquo;</button>
            <div class="bar-chart d-flex flex-row flex-grow-1 overflow-scroll" ref="bar-chart" :style="{ maxWidth: (width - 100) + 'px' }">
                <div v-for="bucket in visibleBuckets" :key="+bucket.bucketStart"
                     class="bar-column d-flex flex-column align-items-center">
                    <div class="stack d-flex flex-column-reverse">
                        <div v-for="typeId in segmentOrder" v-show="!isHidden(typeId)" :key="typeId"
                             class="segment has-tooltip"
                             :data-tooltip="`${bucketValue(bucket, typeId)} pts`"
                             :style="{ height: segmentHeight(bucket, typeId), backgroundColor: typeInfo(typeId).color }"></div>
                    </div>
                    <span class="bucket-label has-tooltip"
                          :class="{ 'is-current': +bucket.bucketStart === currentPeriodKey }"
                          :data-tooltip="`${visibleBucketTotal(bucket)} pts`"
                          @click="selectDate(bucket.bucketStart)">
                        {{ bucket.label }}
                    </span>
                </div>
            </div>
            <button type="button" class="nav-btn" :disabled="isAtNewest" @click="pageForward">&rsaquo;</button>
        </div>
        <div class="legend d-flex flex-row justify-content-center">
            <div v-for="typeId in segmentOrder" :key="typeId"
                 class="legend-item d-flex flex-row align-items-center"
                 :class="{ 'is-hidden': isHidden(typeId), 'is-dragging': draggedTypeId === typeId }"
                 draggable="true"
                 @click="toggleVisibility(typeId)"
                 @dragstart="onLegendDragStart($event, typeId)"
                 @dragover.prevent
                 @drop="onLegendDrop($event, typeId)"
                 @dragend="onLegendDragEnd">
                <span class="swatch" :style="{ backgroundColor: typeInfo(typeId).color }"></span>
                <span>{{ typeInfo(typeId).text }}</span>
            </div>
        </div>
        <hr />
        <div class="stat-grid d-flex flex-row flex-wrap">
            <div class="stat">
                <span class="stat-label">Current Velocity</span>
                <span class="stat-value current">{{ periodTotals.current }} pts</span>
                <span class="stat-desc">Est. output in current cycle</span>
            </div>
            <div class="stat">
                <span class="stat-label">Peak Capacity</span>
                <span class="stat-value peak">{{ periodTotals.peak }} pts</span>
                <span class="stat-desc">Max observed load</span>
            </div>
            <div class="stat">
                <span class="stat-label">Growth Split</span>
                <span class="stat-value growth">&gt; {{ periodTotals.growthSplit }} pts</span>
                <span class="stat-desc">Min load required to progress</span>
            </div>
            <div class="stat">
                <span class="stat-label">Maintenance</span>
                <span class="stat-value maintenance">{{ periodTotals.maintenance }} pts</span>
                <span class="stat-desc">Min load to hold current level</span>
            </div>
        </div>
    </div>
</template>

<script>
import { useAppStore } from '@/store/appStore'
import { usePhysicalStore } from '@/store/physicalStore'
import { usePlannerStore } from '@/store/plannerStore'
import { TIMEFRAME } from '../../../model/constants'
import { todoActivityTypes, timeframes, getActivityTypeColor } from '../../../model/types'
import { startOfDay, firstDayOfWeek, firstDayOfMonth, addDay, addWeek, addMonth, getMonthDate } from '../../../../utility/timeUtility';

const TIMEFRAME_CONFIG = {
    [TIMEFRAME.DAY]: { start: startOfDay, step: addDay },
    [TIMEFRAME.WEEK]: { start: firstDayOfWeek, step: addWeek },
    [TIMEFRAME.MONTH]: { start: firstDayOfMonth, step: addMonth },
};

export default {
    name: 'PhysicalActivityChart',
    components: {  },
    props: {

    },
    data: function () {
        return {
            appStore: undefined,
            physicalStore: undefined,
            plannerStore: undefined,
            points: [],
            periodCount: 30,
            timeframe: TIMEFRAME.WEEK,
            revealedCount: 0,
            shiftCount: 10,
            // Bottom-to-top stacking order (bottom = first, matching the .stack's
            // flex-column-reverse DOM order) — reorderable by dragging legend items.
            // Populated from the API's physicalActivityTypeIDs, not hardcoded, since the
            // set of activity types battery data covers is server-determined.
            segmentOrder: [],
            hiddenTypes: [],
            draggedTypeId: null
        }
    },
    created: async function() {
        this.appStore = useAppStore();
        this.physicalStore = usePhysicalStore();
        this.plannerStore = usePlannerStore();
        let batteryData = await this.physicalStore.getPhysicalBatteryData(true);
        this.points = batteryData?.todoTypePoints || [];
        this.segmentOrder = batteryData?.physicalActivityTypeIDs || [];
    },
    mounted: function() {
        this.scrollToLatest();
    },
    computed: {
        width() {
            return (this.appStore && this.appStore.bodyOuterWidth) ? this.appStore.bodyOuterWidth : 0
        },
        timeframeOptions() {
            return timeframes.filter(t => [TIMEFRAME.DAY, TIMEFRAME.WEEK, TIMEFRAME.MONTH].includes(t.id));
        },
        periodConfig() {
            return TIMEFRAME_CONFIG[this.timeframe];
        },
        currentPeriodKey() {
            return +this.periodConfig.start(new Date());
        },
        // Every actual data point grouped into buckets, keyed by bucket start — the single
        // source of truth for both the bar chart and the (window-independent) stat grid.
        // Each bucket's `values` is keyed by idType so it works for any series, not just two.
        pointBucketMap() {
            let { start } = this.periodConfig;
            let map = {};
            this.points.forEach(point => {
                let bucketStart = start(new Date(point.date));
                let key = +bucketStart;
                if (!map[key]) {
                    map[key] = { bucketStart, values: {} };
                }
                map[key].values[point.idType] = (map[key].values[point.idType] || 0) + point.points;
            });
            return map;
        },
        // How many periods back real data actually goes — the ceiling for "reveal more".
        earliestDataBucketCount() {
            let keys = Object.keys(this.pointBucketMap);
            if (!keys.length) {
                return this.periodCount;
            }
            let { start, step } = this.periodConfig;
            let earliestKey = Math.min(...keys.map(Number));
            let cursor = start(new Date());
            let count = 1;
            while (+cursor > earliestKey && count < 5000) {
                cursor = step(cursor, -1);
                count++;
            }
            return Math.max(this.periodCount, count);
        },
        // Nav buttons grow/shrink how much history is loaded into the chart. Floor is the
        // `periodCount` default; ceiling is however far back real data actually goes.
        effectiveRevealedCount() {
            return Math.min(this.earliestDataBucketCount, Math.max(this.periodCount, this.revealedCount));
        },
        visibleBuckets() {
            let { start, step } = this.periodConfig;
            let buckets = [];
            let bucketStart = start(new Date());
            for (let i = 0; i < this.effectiveRevealedCount; i++) {
                let key = +bucketStart;
                let existing = this.pointBucketMap[key];
                buckets.unshift({
                    bucketStart,
                    values: existing ? existing.values : {},
                    label: getMonthDate(bucketStart)
                });
                bucketStart = step(bucketStart, -1);
            }
            return buckets;
        },
        maxVisibleTotal() {
            let totals = this.visibleBuckets.map(bucket => this.visibleBucketTotal(bucket));
            return Math.max(1, ...totals);
        },
        isAtNewest() {
            return this.effectiveRevealedCount <= this.periodCount;
        },
        isAtOldest() {
            return this.effectiveRevealedCount >= this.earliestDataBucketCount;
        },
        allPeriodTotals() {
            return Object.values(this.pointBucketMap)
                .map(bucket => this.visibleBucketTotal(bucket))
                .sort((a, b) => a - b);
        },
        periodTotals() {
            // Placeholder heuristics: there is no capacity/goal data source yet,
            // so peak/growth/maintenance are derived from observed period totals.
            let totals = this.allPeriodTotals;
            let currentBucket = this.pointBucketMap[this.currentPeriodKey];
            let current = currentBucket ? this.visibleBucketTotal(currentBucket) : 0;
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
        selectDate(date) {
            this.plannerStore.selectDate(date);
        },
        typeInfo(typeId) {
            // physicalActivityTypeIDs can include child types under "Physical Activity" that
            // aren't in the static todoActivityTypes list — fall back rather than break.
            let known = todoActivityTypes.find(t => t.id === typeId);
            return {
                id: typeId,
                text: known ? known.text : `Type ${typeId}`,
                color: getActivityTypeColor(typeId, this.segmentOrder)
            };
        },
        isHidden(typeId) {
            return this.hiddenTypes.includes(typeId);
        },
        bucketValue(bucket, typeId) {
            return bucket.values[typeId] || 0;
        },
        visibleBucketTotal(bucket) {
            return this.segmentOrder.reduce((sum, typeId) => {
                return sum + (this.isHidden(typeId) ? 0 : this.bucketValue(bucket, typeId));
            }, 0);
        },
        segmentHeight(bucket, typeId) {
            if (this.isHidden(typeId)) {
                return '0%';
            }
            return `${(this.bucketValue(bucket, typeId) / this.maxVisibleTotal) * 100}%`;
        },
        toggleVisibility(typeId) {
            this.hiddenTypes = this.isHidden(typeId)
                ? this.hiddenTypes.filter(id => id !== typeId)
                : [...this.hiddenTypes, typeId];
        },
        onLegendDragStart(event, typeId) {
            this.draggedTypeId = typeId;
            event.dataTransfer.effectAllowed = 'move';
        },
        onLegendDrop(event, targetTypeId) {
            event.preventDefault();
            if (this.draggedTypeId === null || this.draggedTypeId === targetTypeId) {
                return;
            }
            // Removing the dragged item shifts every later index down by one, so when
            // moving forward it must land *after* the target's post-removal position —
            // otherwise it re-inserts right back where it started.
            let movingForward = this.segmentOrder.indexOf(this.draggedTypeId) < this.segmentOrder.indexOf(targetTypeId);
            let order = this.segmentOrder.filter(id => id !== this.draggedTypeId);
            let insertionIndex = order.indexOf(targetTypeId) + (movingForward ? 1 : 0);
            order.splice(insertionIndex, 0, this.draggedTypeId);
            this.segmentOrder = order;
        },
        onLegendDragEnd() {
            this.draggedTypeId = null;
        },
        pageBack() {
            this.revealedCount = Math.min(this.earliestDataBucketCount, this.effectiveRevealedCount + this.shiftCount);
        },
        pageForward() {
            this.revealedCount = Math.max(0, this.effectiveRevealedCount - this.shiftCount);
        },
        scrollToLatest() {
            this.$nextTick(() => {
                let barChart = this.$refs['bar-chart'];
                if (barChart) {
                    barChart.scrollLeft = barChart.scrollWidth;
                }
            });
        }
    },
    watch: {
        timeframe() {
            this.revealedCount = 0;
            this.scrollToLatest();
        }
    }
}

</script>

<style scoped>
.physical-activity-chart {
    background-color: #fff;
    border-radius: 16px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    padding: 24px;
    width: 100%;
    text-align: start;
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

.timeframe-toggle {
    margin-top: 16px;
    background-color: #F5F5F5;
    border-radius: 20px;
    padding: 2px;
    width: fit-content;
}

.toggle-option {
    border: none;
    background: transparent;
    border-radius: 18px;
    padding: 6px 14px;
    font-size: 13px;
    color: #767676;
    cursor: pointer;
}

.toggle-option.selected {
    background-color: #1a1a1a;
    color: #fff;
    font-weight: 600;
}

.chart-row {
    margin-top: 20px;
    gap: 8px;
}

.nav-btn {
    flex: 0 0 auto;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1px solid #e5e5e5;
    background-color: #fff;
    color: #1a1a1a;
    font-size: 18px;
    line-height: 1;
    cursor: pointer;
}

.nav-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.bar-chart {
    /* Extra height (beyond the 130px bars need) reserves room, via flex-end alignment,
       for tooltips to pop up without being clipped by this container's horizontal scroll. */
    height: 174px;
    gap: 10px;
}

.bar-column {
    flex: 0 0 46px;
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

.has-tooltip {
    position: relative;
}

.has-tooltip::after,
.has-tooltip::before {
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.1s ease;
    position: absolute;
    left: 50%;
    z-index: 10;
}

.has-tooltip::after {
    content: attr(data-tooltip);
    bottom: calc(100% + 8px);
    transform: translateX(-50%);
    background-color: #1a1a1a;
    color: #fff;
    font-size: 12px;
    font-weight: 600;
    padding: 6px 10px;
    border-radius: 6px;
    white-space: nowrap;
}

.has-tooltip::before {
    content: '';
    bottom: calc(100% + 2px);
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: #1a1a1a;
}

.has-tooltip:hover::after,
.has-tooltip:hover::before {
    opacity: 1;
}

.bucket-label {
    font-size: 11px;
    color: #767676;
    margin-top: 8px;
}

.bucket-label.is-current {
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
    cursor: pointer;
    user-select: none;
    border-radius: 4px;
    padding: 2px 4px;
}

.legend-item.is-hidden {
    opacity: 0.4;
}

.legend-item.is-hidden .swatch {
    background-color: transparent !important;
    border: 1.5px solid #767676;
}

.legend-item.is-dragging {
    opacity: 0.3;
}

.swatch {
    width: 8px;
    height: 8px;
    border-radius: 2px;
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
