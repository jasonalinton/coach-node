<template>
    <div class="nutrition-history-chart d-flex flex-column">
        <div class="header d-flex flex-row justify-content-between">
            <div class="d-flex flex-column">
                <span class="title">Nutrition History</span>
                <span class="subtitle">Daily macro &amp; nutrient totals</span>
            </div>
            <div class="timeframe-toggle d-flex flex-row me-2">
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
                    <div class="stack-wrap">
                        <span v-if="visibleBucketTotal(bucket) > 0"
                              class="bar-total"
                              :style="{ bottom: totalHeight(bucket) }">
                            {{ Math.round(bucket.calories) }} cal
                        </span>
                        <div class="stack d-flex flex-column-reverse">
                            <div v-for="macroId in macroOrder" v-show="!isHidden(macroId)" :key="macroId"
                                 class="segment has-tooltip"
                                 :data-tooltip="`${macroInfo(macroId).text}: ${bucketValue(bucket, macroId).toFixed(0)}g`"
                                 :style="{ height: segmentHeight(bucket, macroId), backgroundColor: macroInfo(macroId).color }"></div>
                        </div>
                    </div>
                    <span class="bucket-label"
                          :class="{ 'is-current': +bucket.bucketStart === currentPeriodKey }">
                        {{ bucket.label }}
                    </span>
                </div>
            </div>
            <button type="button" class="nav-btn" :disabled="isAtNewest" @click="pageForward">&rsaquo;</button>
        </div>
        <div class="legend d-flex flex-row justify-content-center">
            <div v-for="macroId in macroOrder" :key="macroId"
                 class="legend-item d-flex flex-row align-items-center"
                 :class="{ 'is-hidden': isHidden(macroId) }"
                 @click="toggleVisibility(macroId)">
                <span class="swatch" :style="{ backgroundColor: macroInfo(macroId).color }"></span>
                <span>{{ macroInfo(macroId).text }}</span>
            </div>
        </div>
        <hr />
        <div class="stat-grid d-flex flex-row flex-wrap justify-content-around">
            <div class="stat">
                <span class="stat-label">Avg Calories</span>
                <span class="stat-value calories">{{ periodTotals.avgCalories }} cal</span>
                <span class="stat-desc">Per {{ periodNoun }}, this window</span>
            </div>
            <div class="stat">
                <span class="stat-label">Peak Calories</span>
                <span class="stat-value peak">{{ periodTotals.peakCalories }} cal</span>
                <span class="stat-desc">Highest logged {{ periodNoun }}</span>
            </div>
            <div class="stat">
                <span class="stat-label">Avg Protein</span>
                <span class="stat-value protein">{{ periodTotals.avgProtein }}g</span>
                <span class="stat-desc">Per {{ periodNoun }}, this window</span>
            </div>
            <div class="stat">
                <span class="stat-label">Avg Water</span>
                <span class="stat-value water">{{ periodTotals.avgWater }} fl oz</span>
                <span class="stat-desc">Per {{ periodNoun }}, this window</span>
            </div>
        </div>
    </div>
</template>

<script>
import { useAppStore } from '@/store/appStore'
import { usePhysicalStore } from '@/store/physicalStore'
import { TIMEFRAME } from '../../../model/constants'
import { timeframes } from '../../../model/types'
import { startOfDay, firstDayOfWeek, firstDayOfMonth, addDay, addWeek, addMonth, addYear, getMonthDate } from '../../../../utility/timeUtility';

const TIMEFRAME_CONFIG = {
    [TIMEFRAME.DAY]: { start: startOfDay, step: addDay, noun: 'day' },
    [TIMEFRAME.WEEK]: { start: firstDayOfWeek, step: addWeek, noun: 'week' },
    [TIMEFRAME.MONTH]: { start: firstDayOfMonth, step: addMonth, noun: 'month' },
};

// Fixed stacking/legend order (bottom to top, matching .stack's flex-column-reverse DOM
// order). Colors are the validated categorical slots 1/2/3 from the dataviz palette.
const MACROS = [
    { id: 'carbs', text: 'Carbs', color: '#2a78d6' },
    { id: 'protein', text: 'Protein', color: '#eb6834' },
    { id: 'fat', text: 'Fat', color: '#1baf7a' },
];

export default {
    name: 'NutritionHistoryChart',
    components: {},
    props: {

    },
    data: function () {
        return {
            appStore: undefined,
            physicalStore: undefined,
            nutrientHistory: [],
            periodCount: 30,
            timeframe: TIMEFRAME.WEEK,
            revealedCount: 0,
            shiftCount: 10,
            macroOrder: MACROS.map(m => m.id),
            hiddenMacros: []
        }
    },
    created: async function () {
        this.appStore = useAppStore();
        this.physicalStore = usePhysicalStore();
        let now = new Date();
        this.nutrientHistory = await this.physicalStore.getNutrientHistory(addYear(now, -1), addDay(now, 1)) || [];
    },
    mounted: function () {
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
        periodNoun() {
            return this.periodConfig.noun;
        },
        currentPeriodKey() {
            return +this.periodConfig.start(new Date());
        },
        // Every day's nutrient totals grouped into buckets, keyed by bucket start — the
        // single source of truth for the bar chart and the stat grid.
        nutrientBucketMap() {
            let { start } = this.periodConfig;
            let map = {};
            this.nutrientHistory.forEach(day => {
                let bucketStart = start(new Date(day.date));
                let key = +bucketStart;
                if (!map[key]) {
                    map[key] = { bucketStart, values: { carbs: 0, protein: 0, fat: 0 }, calories: 0, water: 0 };
                }
                map[key].values.carbs += day.carbs || 0;
                map[key].values.protein += day.protein || 0;
                map[key].values.fat += day.fat || 0;
                map[key].calories += day.calories || 0;
                map[key].water += day.water || 0;
            });
            return map;
        },
        // How many periods back real data actually goes — the ceiling for "reveal more".
        earliestDataBucketCount() {
            let keys = Object.keys(this.nutrientBucketMap);
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
                let existing = this.nutrientBucketMap[key];
                buckets.unshift({
                    bucketStart,
                    values: existing ? existing.values : { carbs: 0, protein: 0, fat: 0 },
                    calories: existing ? existing.calories : 0,
                    water: existing ? existing.water : 0,
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
        periodTotals() {
            let buckets = this.visibleBuckets.filter(bucket => bucket.calories > 0 || bucket.water > 0);
            let round = value => Math.round(value || 0);
            if (!buckets.length) {
                return { avgCalories: 0, peakCalories: 0, avgProtein: 0, avgWater: 0 };
            }
            let calorieBuckets = buckets.filter(bucket => bucket.calories > 0);
            let avgCalories = calorieBuckets.length
                ? calorieBuckets.reduce((sum, bucket) => sum + bucket.calories, 0) / calorieBuckets.length
                : 0;
            let peakCalories = Math.max(...buckets.map(bucket => bucket.calories));
            let avgProtein = calorieBuckets.length
                ? calorieBuckets.reduce((sum, bucket) => sum + bucket.values.protein, 0) / calorieBuckets.length
                : 0;
            let waterBuckets = buckets.filter(bucket => bucket.water > 0);
            let avgWater = waterBuckets.length
                ? waterBuckets.reduce((sum, bucket) => sum + bucket.water, 0) / waterBuckets.length
                : 0;

            return {
                avgCalories: round(avgCalories),
                peakCalories: round(peakCalories),
                avgProtein: round(avgProtein),
                avgWater: round(avgWater)
            };
        }
    },
    methods: {
        macroInfo(macroId) {
            return MACROS.find(m => m.id === macroId);
        },
        isHidden(macroId) {
            return this.hiddenMacros.includes(macroId);
        },
        bucketValue(bucket, macroId) {
            return bucket.values[macroId] || 0;
        },
        visibleBucketTotal(bucket) {
            return this.macroOrder.reduce((sum, macroId) => {
                return sum + (this.isHidden(macroId) ? 0 : this.bucketValue(bucket, macroId));
            }, 0);
        },
        segmentHeight(bucket, macroId) {
            if (this.isHidden(macroId)) {
                return '0%';
            }
            return `${(this.bucketValue(bucket, macroId) / this.maxVisibleTotal) * 100}%`;
        },
        totalHeight(bucket) {
            return `${(this.visibleBucketTotal(bucket) / this.maxVisibleTotal) * 100}%`;
        },
        toggleVisibility(macroId) {
            this.hiddenMacros = this.isHidden(macroId)
                ? this.hiddenMacros.filter(id => id !== macroId)
                : [...this.hiddenMacros, macroId];
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
.nutrition-history-chart {
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
    height: 174px;
    gap: 10px;
}

.bar-column {
    flex: 0 0 46px;
    height: 100%;
    justify-content: flex-end;
}

.stack-wrap {
    position: relative;
    width: 60%;
    max-width: 36px;
    height: 100px;
}

.stack {
    width: 100%;
    height: 100%;
    gap: 2px;
}

.bar-total {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -100%);
    margin-bottom: 4px;
    font-size: 11px;
    font-weight: 600;
    color: #1a1a1a;
    white-space: nowrap;
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
    padding: 2px 6px;
    border-radius: 4px;
    cursor: default;
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
    max-width: 1200px;
    margin: 0 auto;
}

.stat {
    display: flex;
    flex-direction: column;
    width: 160px;
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

.stat-value.calories {
    color: #14b8a6;
}

.stat-value.peak {
    color: #1a1a1a;
}

.stat-value.protein {
    color: #eb6834;
}

.stat-value.water {
    color: #2a78d6;
}

.stat-desc {
    font-size: 12px;
    color: #767676;
    margin-top: 2px;
}
</style>
