<template>
    <div  class="weight-chart">
        <div id="weight-chart" ref="weight-chart" class="mt-2"></div>
    </div>
</template>

<script>
import { usePhysicalStore } from '@/store/physicalStore'
import { createChart  } from "lightweight-charts";
import { sortDateAsc, startOfDay } from '../../../../utility';

export default {
    name: '',
    components: {  },
    props: {
        
    },
    data: function () {
        return {
            physicalStore: undefined,
            chart: undefined,
            weightGoal: 185,
            weightSeries: undefined,
            caloriesRecommended: 2000,
            calorieSeries: undefined,
        }
    },
    created: function() {
        this.physicalStore = usePhysicalStore();
    },
    mounted() {
        this.createWeightChart();
    },
    computed: {
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
                            let weight = {
                                date: date,
                                weight: measurement.weight
                            }
                            weights.push(weight);
                            lastDate = date;
                        }
                    })
                }
            }
            return weights
        },
        mealHistories() {
            if (this.physicalStore) {
                let mealHistories = [];
                let meals = this.physicalStore.mealHistories;
                if (meals.length > 0) {
                    let nutrients = undefined;
                    meals = sortDateAsc(meals, 'dateTime');
                    let date = new Date(1970, 0, 1);
                    meals.forEach(meal => {
                        let mealDate = startOfDay(new Date(meal.dateTime));
                        // if (+mealDate < +this.startDate) {
                        //     return;
                        // } else 
                        if (+date == +mealDate) {
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
    },
    methods: {
        createWeightChart,
        setWeightSeries,
        setCalorieSeries
    },
    watch: {
        weightHistories: {
            handler(value) {
                if (value.length && value.length > 0) {
                    // this.setWeightSeries();
                }
            },
            deep: true
        },
    }
}

function createWeightChart() {
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
        // width: 278, 
        height: 500
    };

    this.$refs['weight-chart'].replaceChildren();
    const chart = createChart('weight-chart',  chartOptions);
    this.chart = chart;

    this.weightSeries = chart.addLineSeries({
        priceScaleId: 'left',
        color: '#EA8919',
        lastValueVisible: false,
        priceLineVisible: false,
    });
    const weightPriceLine = {
        price: this.weightGoal,
        color: '#EA8919',
        lineWidth: 2,
        lineStyle: 2, // LineStyle.Dashed
        axisLabelVisible: true,
        // title: 'Cal Rec',
    };
    this.weightSeries.createPriceLine(weightPriceLine);

    // this.calorieSeries = chart.addLineSeries({
    //     priceScaleId: 'right',
    //     color: '#EA8919',
    //     lastValueVisible: false,
    //     priceLineVisible: false,
    // });
    // const calPriceLine = {
    //     price: this.caloriesRecommended,
    //     color: '#EA8919',
    //     lineWidth: 2,
    //     lineStyle: 2, // LineStyle.Dashed
    //     axisLabelVisible: true,
    //     // title: 'Cal Rec',
    // };
    // this.calorieSeries.createPriceLine(calPriceLine);

    this.setWeightSeries();
    // this.setCalorieSeries();
}

function setWeightSeries() {
    let max = 0;
    let seriesData = this.weightHistories.map(weight => {
        if (weight.weight > max) {  max = weight.weight }
        return {
            datetime: weight.date,
            time: weight.date / 1000,
            value: parseInt(weight.weight)
        }
    });
    this.weightSeries.setData(seriesData);

    let maxValue = (max < this.weightGoal) 
        ? this.weightGoal : max
    this.weightSeries.applyOptions({
        autoscaleInfoProvider: () => ({
            priceRange: {
                minValue: 120,
                maxValue
            },
        }),
    })

    this.chart.timeScale().fitContent();
    // this.calorieSeriesData = seriesData;
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

    // let maxValue = (max < this.caloriesRecommended) 
    //     ? this.caloriesRecommended : max
    this.calorieSeries.applyOptions({
        autoscaleInfoProvider: () => ({
            priceRange: {
                minValue: 0,
                maxValue: 10000
            },
        }),
    })

    this.chart.timeScale().fitContent();
    // this.calorieSeriesData = seriesData;
}

</script>

<style scoped>

</style>