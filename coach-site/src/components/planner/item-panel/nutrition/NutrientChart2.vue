<template>
    <div class="d-flex flex-column">
        <div id="nutrient-chart" ref="nutrient-chart" class="mt-2"></div>
        <div id="calorie-chart" ref="calorie-chart" class="mt-2"></div>
        <div id="protein-chart" ref="protein-chart" class="mt-2"></div>
        <div id="water-chart" ref="water-chart" class="mt-2"></div>

    </div>
</template>

<script>
import { usePhysicalStore } from '@/store/physicalStore'
import { sortDateAsc, startOfDay, clone, float } from '../../../../../utility';
import { createChart  } from "lightweight-charts";

export default {
    name: 'NutrientChart',
    components: {  },
    props: {
        caloriesRecommended: {
            type: Number,
            default: 2000
        },
        proteinRecommended: {
            type: Number,
            default: 150
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
            calorieChart: undefined,
            proteinChart: undefined,
            waterChart: undefined,
            calorieSeries: undefined,
            // calorieSeriesData: [],
            proteinSeries: undefined,
            // proteinSeriesData: [],
            waterSeries: undefined,
            // waterSeriesData: [],
            histogramSeries: undefined,
        }
    },
    created: function() {
        this.physicalStore = usePhysicalStore();
    },
    mounted() {
        // this.createNutrientChart();
        this.createCharts();
    },
    computed: {
        mealHistories() {
            if (this.physicalStore) {
                let mealHistories = [];
                let meals = this.physicalStore.mealHistories;
                if (meals.length > 0) {
                    let nutrients = undefined;
                    meals = this.sortDateAsc(meals, 'dateTime');
                    let date = new Date(1970, 0, 1);
                    let startDate = new Date(2024, 0, 1);
                    meals.forEach(meal => {
                        let mealDate = this.startOfDay(new Date(meal.dateTime));
                        if (+mealDate < +startDate) {
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
                    let startDate = new Date(2024, 0, 1);
                    waterLogs.forEach(water => {
                        let waterDate = this.startOfDay(new Date(water.dateTime));
                        if (+waterDate < +startDate) {
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
        calorieSeriesData() {
            return this.mealHistories.map(meal => {
                return {
                    datetime: meal.date,
                    time: meal.date / 1000,
                    value: parseInt(meal.nutrients.calories),
                    color: '#EA8919',
                }
            });
        },
        calorieSeriesMax() {
            let max = 0;
            this.calorieSeriesData.forEach(x => {
                if (x.value > max) {  max = x.value }
            });
            return (max < this.caloriesRecommended) 
                ? this.caloriesRecommended : max
        },
        proteinSeriesData() {
            return this.mealHistories.map(meal => {
                return {
                    datetime: meal.date,
                    time: meal.date / 1000,
                    value: parseInt(meal.nutrients.protein)
                }
            });
        },
        proteinSeriesMax() {
            let max = 0;
            this.proteinSeriesData.forEach(x => {
                if (x.value > max) {  max = x.value }
            })
            return (max < this.proteinRecommended) 
                ? this.proteinRecommended : max
        },
        waterSeriesData() {
            return this.waterHistories.map(water => {
                return {
                    datetime: water.date,
                    time: water.date / 1000,
                    value: water.amount,
                    color: '#3B99FC',
                }
            });
        },
        waterSeriesMax() {
            let max = 0;
            this.waterSeriesData.forEach(x => {
                if (x.value > max) {  max = x.value }
            })
            return (max < this.waterRecommended) 
                ? this.waterRecommended + 10 : max + 10
        }
    },
    methods: {
        sortDateAsc,
        startOfDay,
        createChart,
        createNutrientChart,
        createCharts,
        addLineSeries,
        addHistogramSeries,
        setCalorieSeries,
        setProteinSeries,
        setWaterSeries,
        setHistogramSeries
    },
    watch: {
        mealHistories() {
            this.setCalorieSeries();
            this.setProteinSeries();
            // if (this.waterHistories.length > 0) {
            //     this.setHistogramSeries();        
            // }
        },
        waterHistories() {
            this.setWaterSeries();
            // if (this.mealHistories.length > 0) {
            //     this.setHistogramSeries();                
            // }
        },
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

   this.addLineSeries(chart);
//    this.addHistogramSeries(chart);
}

function addLineSeries(chart) {
    /* Calorie Series */
    this.calorieSeries = chart.addLineSeries({
        priceScaleId: 'left',
        // color: '#EA8919',
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

    /* Water Series */
    this.waterSeries = chart.addLineSeries({
        priceScaleId: 'right',
        // color: '#3B99FC',
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

    /* Protein Series */
    // this.proteinSeries = chart.addLineSeries({
    //     priceScaleId: 'left',
    //     color: '#EA8919',
    //     lastValueVisible: false,
    //     priceLineVisible: false,
    // });
    // const proteinPriceLine = {
    //     price: this.proteinRecommended,
    //     color: '#EA8919',
    //     lineWidth: 2,
    //     lineStyle: 2, // LineStyle.Dashed
    //     axisLabelVisible: true,
    //     // title: 'Cal Rec',
    // };
    // this.proteinSeries.createPriceLine(proteinPriceLine);
}

function createCharts() {
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

    this.$refs['calorie-chart'].replaceChildren();
    this.calorieChart = createChart('calorie-chart',  chartOptions);
    this.$refs['protein-chart'].replaceChildren();
    this.proteinChart = createChart('protein-chart',  chartOptions);
    this.$refs['water-chart'].replaceChildren();
    this.waterChart = createChart('water-chart',  chartOptions);

    /* Calorie Series */
    this.calorieSeries = this.calorieChart.addLineSeries({
        priceScaleId: 'left',
        // color: '#EA8919',
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

    /* Protein Series */
    this.proteinSeries = this.proteinChart.addLineSeries({
        priceScaleId: 'left',
        color: '#EA8919',
        lastValueVisible: false,
        priceLineVisible: false,
    });
    const proteinPriceLine = {
        price: this.proteinRecommended,
        color: '#EA8919',
        lineWidth: 2,
        lineStyle: 2, // LineStyle.Dashed
        axisLabelVisible: true,
        // title: 'Cal Rec',
    };
    this.proteinSeries.createPriceLine(proteinPriceLine);

    /* Water Series */
    this.waterSeries = this.waterChart.addLineSeries({
        priceScaleId: 'right',
        // color: '#3B99FC',
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
}

function addHistogramSeries(chart) {
    this.histogramSeries = chart.addHistogramSeries({
        priceScaleId: 'left',
        // color: '#EA8919',
        lastValueVisible: false,
        priceLineVisible: false,
    });
    const calPriceLine = {
        price: 100,
        color: '#EA8919',
        lineWidth: 2,
        lineStyle: 2, // LineStyle.Dashed
        axisLabelVisible: true,
        // title: 'Cal Rec',
    };
    this.histogramSeries.createPriceLine(calPriceLine);

    /* Calorie Series */
    // this.calorieSeries = chart.addHistogramSeries({
    //     priceScaleId: 'left',
    //     // color: '#EA8919',
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

    // /* Water Series */
    // this.waterSeries = chart.addHistogramSeries({
    //     priceScaleId: 'right',
    //     // color: '#3B99FC',
    //     // baseLineWidth: 6,
    //     // baseLineStyle: 3,
    //     lastValueVisible: false,
    //     priceLineVisible: false,
    // });
    // const waterPriceLine = {
    //     price: this.waterRecommended,
    //     color: '#3B99FC',
    //     lineWidth: 2,
    //     lineStyle: 2, // LineStyle.Dashed
    //     axisLabelVisible: true,
    //     // title: 'Cal Rec',
    // };
    // this.waterSeries.createPriceLine(waterPriceLine);
}

function setCalorieSeries() {
    this.calorieSeries.setData(this.calorieSeriesData);
    this.calorieSeries.applyOptions({
        autoscaleInfoProvider: () => ({
            priceRange: {
                minValue: 0,
                maxValue: this.calorieSeriesMax
            },
        }),
    })

    this.calorieChart.timeScale().fitContent();
}

function setProteinSeries() {
    this.proteinSeries.setData(this.proteinSeriesData);
    this.proteinSeries.applyOptions({
        autoscaleInfoProvider: () => ({
            priceRange: {
                minValue: 0,
                maxValue: this.proteinSeriesMax
            },
        }),
    })

    this.proteinChart.timeScale().fitContent();
}

function setWaterSeries() {
    this.waterSeries.setData(this.waterSeriesData);
    this.waterSeries.applyOptions({
        autoscaleInfoProvider: () => ({
            priceRange: {
                minValue: 0,
                maxValue: this.waterSeriesMax
            },
        }),
    })

    this.waterChart.timeScale().fitContent();
}

// function setHistogramSeries() {
//     let seriesData = [];
//     this.mealHistories.forEach(x => {
//         // let calorieData = this.calorieSeriesData.find(y => y.time == (x.date / 1000));
//         // if (calorieData) { 
//         //     // calorieData.time = calorieData.time + 1
//         //     seriesData.push(calorieData); 
//         // }
//         // let proteinData = this.proteinSeriesData.find(y => y.time == (x.date / 1000));
//         // if (proteinData) { 
//         //     proteinData.time = proteinData.time + 1000
//         //     seriesData.push(proteinData); 
//         // }
//         let waterData = this.waterSeriesData.find(y => y.time == (x.date / 1000));
//         if (waterData) { 
//             waterData = clone(waterData);
//             waterData.time = waterData.time + 1000
//             seriesData.push(waterData); 
//         }
//     });
//     let x = 0;
//     this.histogramSeries.setData([seriesData[x++]],[seriesData[x++]],[seriesData[x++]],[seriesData[x++]],[seriesData[x++]],[seriesData[x++]],[seriesData[x++]],[seriesData[x++]] )
// }

function setHistogramSeries() {
    let seriesData = [];
    this.mealHistories.forEach(x => {
        let calorieData = this.calorieSeriesData.find(y => y.time == (x.date / 1000));
        if (calorieData) { 
            calorieData = clone(calorieData);
            calorieData.value =  Number(float(calorieData.value / this.caloriesRecommended));
            seriesData.push(calorieData); 
        }
        let proteinData = this.proteinSeriesData.find(y => y.time == (x.date / 1000));
        if (proteinData) { 
            proteinData = clone(proteinData);
            proteinData.time = proteinData.time + 1000;
            proteinData.value =  Number(float(proteinData.value / this.proteinRecommended));
            seriesData.push(proteinData); 
        }
        let waterData = this.waterSeriesData.find(y => y.time == (x.date / 1000));
        if (waterData) { 
            waterData = clone(waterData);
            waterData.time = waterData.time + 2000;
            waterData.value = Number(float(waterData.value / this.waterRecommended))
            seriesData.push(waterData); 
        }
    });
    // let x = 3;
    this.histogramSeries.setData(seriesData)
    // this.histogramSeries.setData([seriesData[x++],seriesData[x++],seriesData[x++],seriesData[x++],seriesData[x++],seriesData[x++],seriesData[x++]])
}

</script>

<style scoped>

</style>