<template>
    <div class="calories-weight-chart" ref="calories-weight-chart-container">
        <div id="calories-weight-chart" ref="calories-weight-chart" class="mt-2"></div>
        <div v-if="tooltip.visible" class="chart-tooltip" :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }">
            <div class="tooltip-date">{{ tooltip.dateLabel }}</div>
            <div v-if="tooltip.calories != null" class="tooltip-row"><span class="swatch calories"></span>{{ tooltip.calories }} cal</div>
            <div v-if="tooltip.weight != null" class="tooltip-row"><span class="swatch weight"></span>{{ tooltip.weight }} lbs</div>
        </div>
    </div>
</template>

<script>
import { useAppStore } from '@/store/appStore'
import { usePhysicalStore } from '@/store/physicalStore'
import { createChart } from "lightweight-charts";
import { sortDateAsc, startOfDay } from '../../../../utility';
import { addDay, addYear, getMonthDate } from '../../../../utility/timeUtility';

export default {
    name: 'CaloriesWeightChart',
    components: {},
    props: {

    },
    data: function () {
        return {
            appStore: undefined,
            physicalStore: undefined,
            chart: undefined,
            nutrientHistory: [],
            weightSeries: undefined,
            caloriesSeries: undefined,
            tooltip: { visible: false, x: 0, y: 0, dateLabel: '', calories: 0, weight: null },
        }
    },
    created: async function () {
        this.appStore = useAppStore();
        this.physicalStore = usePhysicalStore();
        let now = new Date();
        this.nutrientHistory = await this.physicalStore.getNutrientHistory(addYear(now, -5), addDay(now, 1)) || [];
    },
    mounted() {
        this.createCaloriesWeightChart();
    },
    computed: {
        width() {
            return (this.appStore && this.appStore.bodyOuterWidth) ? this.appStore.bodyOuterWidth : 0
        },
        weightHistories() {
            let weights = [];
            if (this.physicalStore) {
                let measurements = this.physicalStore.getBodyMeasurements();
                if (measurements.length > 0) {
                    measurements = sortDateAsc(measurements, 'dateTime');
                    let lastDate = new Date(1970, 0, 1);
                    measurements.forEach(measurement => {
                        let date = startOfDay(new Date(measurement.dateTime));
                        if (+lastDate != +date) {
                            weights.push({ date, weight: measurement.weight });
                            lastDate = date;
                        }
                    })
                }
            }
            return weights;
        },
        calorieHistories() {
            return sortDateAsc(this.nutrientHistory, 'date')
                .map(day => ({ date: startOfDay(new Date(day.date)), calories: day.calories || 0 }));
        }
    },
    methods: {
        createCaloriesWeightChart,
        setWeightSeries,
        setCaloriesSeries,
        handleCrosshairMove
    },
    watch: {
        weightHistories: {
            handler(value) {
                if (value.length > 0) {
                    this.setWeightSeries();
                }
            },
            deep: true
        },
        calorieHistories: {
            handler(value) {
                if (value.length > 0) {
                    this.setCaloriesSeries();
                }
            },
            deep: true
        },
        width() {
            this.createCaloriesWeightChart();
        }
    }
}

function createCaloriesWeightChart() {
    let width = this.width;

    let chartOptions = {
        rightPriceScale: {
            visible: true,
            borderVisible: false,
        },
        leftPriceScale: {
            visible: true,
        },
        localization: {
            priceFormatter: p => p.toFixed(0),
        },
        width,
        height: 500
    };

    this.$refs['calories-weight-chart'].replaceChildren();
    const chart = createChart('calories-weight-chart', chartOptions);
    this.chart = chart;

    // Calories render as bars confined to the bottom band of the chart, on their own
    // scale, so the weight line reads clearly in the band above them.
    this.caloriesSeries = chart.addHistogramSeries({
        priceScaleId: 'right',
        color: '#2a78d6',
        priceLineVisible: false,
        lastValueVisible: false,
    });
    chart.priceScale('right').applyOptions({
        scaleMargins: { top: 0.3, bottom: 0.02 },
    });

    this.weightSeries = chart.addLineSeries({
        priceScaleId: 'left',
        color: '#EA8919',
        lineWidth: 2,
        lastValueVisible: false,
        priceLineVisible: false,
    });
    chart.priceScale('left').applyOptions({
        scaleMargins: { top: 0.05, bottom: 0 },
    });

    chart.subscribeCrosshairMove(param => this.handleCrosshairMove(param));

    this.setCaloriesSeries();
    this.setWeightSeries();
}

function handleCrosshairMove(param) {
    let container = this.$refs['calories-weight-chart-container'];
    if (!param.point || !param.time || !container) {
        this.tooltip.visible = false;
        return;
    }

    let caloriesPoint = param.seriesData.get(this.caloriesSeries);
    let weightPoint = param.seriesData.get(this.weightSeries);
    if (!caloriesPoint && !weightPoint) {
        this.tooltip.visible = false;
        return;
    }

    // Keep the tooltip fully inside the chart on every edge, following the cursor.
    let tooltipWidth = 140;
    let tooltipHeight = 60;
    let x = Math.min(Math.max(param.point.x + 12, 4), container.clientWidth - tooltipWidth - 4);
    let y = Math.min(Math.max(param.point.y - tooltipHeight - 12, 4), container.clientHeight - tooltipHeight - 4);

    this.tooltip = {
        visible: true,
        x,
        y,
        dateLabel: getMonthDate(new Date(param.time * 1000)),
        calories: caloriesPoint ? Math.round(caloriesPoint.value) : null,
        weight: weightPoint ? Math.round(weightPoint.value) : null
    };
}

function setWeightSeries() {
    let max = 0;
    let min = Infinity;
    let seriesData = this.weightHistories.map(weight => {
        if (weight.weight > max) { max = weight.weight }
        if (weight.weight < min) { min = weight.weight }
        return {
            time: weight.date / 1000,
            value: parseInt(weight.weight)
        }
    });
    this.weightSeries.setData(seriesData);

    if (seriesData.length > 0) {
        this.weightSeries.applyOptions({
            autoscaleInfoProvider: () => ({
                priceRange: {
                    minValue: min - (max - min || 10),
                    maxValue: max
                },
            }),
        })
    }

    this.chart.timeScale().fitContent();
}

function setCaloriesSeries() {
    let max = 0;
    let seriesData = this.calorieHistories.map(day => {
        if (day.calories > max) { max = day.calories }
        return {
            time: day.date / 1000,
            value: Math.round(day.calories)
        }
    });
    this.caloriesSeries.setData(seriesData);

    this.caloriesSeries.applyOptions({
        autoscaleInfoProvider: () => ({
            priceRange: {
                minValue: 0,
                maxValue: max || 1
            },
        }),
    })

    this.chart.timeScale().fitContent();
}

</script>

<style scoped>
.calories-weight-chart {
    position: relative;
}

.chart-tooltip {
    position: absolute;
    z-index: 10;
    pointer-events: none;
    background-color: #1a1a1a;
    color: #fff;
    font-size: 12px;
    padding: 8px 10px;
    border-radius: 6px;
    white-space: nowrap;
}

.tooltip-date {
    font-size: 11px;
    color: #c3c2b7;
    margin-bottom: 4px;
}

.tooltip-row {
    display: flex;
    align-items: center;
    font-weight: 600;
}

.tooltip-row + .tooltip-row {
    margin-top: 2px;
}

.tooltip-row .swatch {
    width: 8px;
    height: 8px;
    border-radius: 2px;
    margin-right: 6px;
}

.swatch.calories {
    background-color: #2a78d6;
}

.swatch.weight {
    background-color: #EA8919;
}
</style>
