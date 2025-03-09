<template>
    <div id="nutrient-chart" ref="nutrient-chart" class="mt-2"></div>
</template>

<script>
import { usePhysicalStore } from '@/store/physicalStore'
import { sortDateAsc, startOfDay, addMonth } from '../../../../../utility';
import { createChart  } from "lightweight-charts";

export default {
    name: 'NutrientChart',
    components: {  },
    props: {
        caloriesRecommended: {
            type: Number,
            default: 2000
        },
        waterRecommended: {
            type: Number,
            default: 140
        },
    },
    data: function () {
        return {
            physicalStore: undefined,
            mealData: [],
            chart: undefined,
            calorieSeries: undefined,
            calorieSeriesData: [],
            waterSeries: undefined,
            waterSeriesData: [],
            proteinSeries: undefined
        }
    },
    created: function() {
        this.physicalStore = usePhysicalStore();
    },
    mounted() {
        this.createNutrientChart();
    },
    computed: {
        startDate() {
            return addMonth(new Date(), -2);
        },
        mealHistories() {
            if (this.physicalStore) {
                let mealHistories = [];
                let meals = this.physicalStore.mealHistories;
                if (meals.length > 0) {
                    let nutrients = undefined;
                    meals = this.sortDateAsc(meals, 'dateTime');
                    let date = new Date(1970, 0, 1);
                    meals.forEach(meal => {
                        let mealDate = this.startOfDay(new Date(meal.dateTime));
                        if (+mealDate < +this.startDate) {
                            return;
                        } else if (+date == +mealDate) {
                            nutrients.calories += meal.calories;
                            nutrients.carbs += meal.carbs;
                            nutrients.protein += meal.protein;
                            nutrients.fat += meal.fat;
                        } else {
                            date = mealDate;
                            nutrients = {
                                calories: meal.calories,
                                carbs: meal.carbs,
                                protein: meal.protein,
                                fat: meal.fat
                            };
                            mealHistories.push({ date, nutrients });
                        }
                    });
                }
                return mealHistories;
            } else {
                return []
            }
        },
        waterHistories() {
            if (this.physicalStore) {
                let waterHistories = [];
                let waterLogs = this.physicalStore.waterLogs;
                if (waterLogs.length > 0) {
                    let amount = 0;
                    waterLogs = this.sortDateAsc(waterLogs, 'dateTime');
                    let date = new Date(1970, 0, 1);
                    waterLogs.forEach(water => {
                        let waterDate = this.startOfDay(new Date(water.dateTime));
                        if (+waterDate < +this.startDate) {
                            return;
                        } else if (+date == +waterDate) {
                            waterHistories[waterHistories.length-1].amount += water.amount;
                        } else {
                            date = waterDate;
                            amount = water.amount;
                            waterHistories.push({ date, amount });
                        }
                    });
                }
                return waterHistories;
            } else {
                return []
            }
        },
    },
    methods: {
        sortDateAsc,
        startOfDay,
        createChart,
        createNutrientChart,
        setCalorieSeries,
        setWaterSeries
    },
    watch: {
        mealHistories: {
            handler(value) {
                if (value.length && value.length > 0) {
                    this.setCalorieSeries();
                }
            },
            deep: true
        },
        waterHistories: {
            handler(value) {
                if (value.length && value.length > 0) {
                    this.setWaterSeries();
                }
            },
            deep: true
        }
    }
}

function createNutrientChart() {
    let chartOptions = {
        rightPriceScale: {
            visible: true,
        },
        leftPriceScale: {
            visible: true,
        },
        localization: {
            priceFormatter: p => p.toFixed(0),
        },
        // layout: {
        //     textColor: 'black',
        //     background: { type: 'solid', color: 'white' },
        // },
        width: 278, 
        height: 100
    };

    this.$refs['nutrient-chart'].replaceChildren();
    // const chart = createChart('nutrient-chart', { width: 278, height: 100 });
    const chart = createChart('nutrient-chart',  chartOptions);
    this.chart = chart;

    this.calorieSeries = chart.addLineSeries({
        priceScaleId: 'left',
        color: '#EA8919',
        lastValueVisible: false,
        priceLineVisible: false,
    });
    const calPriceLine = {
        price: this.caloriesRecommended,
        color: '#EA8919',
        lineWidth: 2,
        lineStyle: 2, // LineStyle.Dashed
        axisLabelVisible: true,
        // title: 'Cal Rec',
    };
    this.calorieSeries.createPriceLine(calPriceLine);

    this.waterSeries = chart.addLineSeries({
        priceScaleId: 'right',
        color: '#3B99FC',
        lastValueVisible: false,
        priceLineVisible: false,
    });
    const waterPriceLine = {
        price: this.waterRecommended,
        color: '#3B99FC',
        lineWidth: 2,
        lineStyle: 2, // LineStyle.Dashed
        axisLabelVisible: true,
        // title: 'Cal Rec',
    };
    this.waterSeries.createPriceLine(waterPriceLine);
    // this.chart.priceScale('right').applyOptions({
        
    // })
   
}

function setCalorieSeries() {
    let max = 0;
    let seriesData = this.mealHistories.map(meal => {
        if (meal.nutrients.calories > max) {  max = meal.nutrients.calories }
        return {
            datetime: meal.date,
            time: meal.date / 1000,
            value: parseInt(meal.nutrients.calories)
        }
    });
    this.calorieSeries.setData(seriesData);

    let maxValue = (max < this.caloriesRecommended) 
        ? this.caloriesRecommended : max
    this.calorieSeries.applyOptions({
        autoscaleInfoProvider: () => ({
            priceRange: {
                minValue: 0,
                maxValue
            },
        }),
    })

    this.chart.timeScale().fitContent();
    this.calorieSeriesData = seriesData;
}

function setWaterSeries() {
    let max = 0;
    let seriesData = this.waterHistories.map(water => {
        if (water.amount > max) {  max = water.amount }
        return {
            datetime: water.date,
            time: water.date / 1000,
            value: water.amount
        }
    });
    this.waterSeries.setData(seriesData);

    let maxValue = (max < this.waterRecommended) 
        ? this.waterRecommended + 10 : max + 10
    this.waterSeries.applyOptions({
        autoscaleInfoProvider: () => ({
            priceRange: {
                minValue: 0,
                maxValue
            },
        }),
    })

    this.chart.timeScale().fitContent();
    this.waterSeriesData = seriesData;
}

</script>

<style scoped>

</style>