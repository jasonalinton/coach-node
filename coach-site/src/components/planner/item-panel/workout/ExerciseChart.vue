<template>
    <div class="exercise-chart d-flex flex-column">
        <h4>{{ capitalize(setProp) }}</h4>
        <div :id="name" :ref="name" class="mt-2"></div>
    </div>
</template>

<script>
import { createChart  } from "lightweight-charts";
import { capitalize, sortDateAsc } from "../../../../../utility";

export default {
    name: 'ExerciseChart',
    components: {  },
    props: {
        setProp: String,
        history: Array
    },
    data: function () {
        return {
            chart: undefined,
            propSeries: undefined,
        }
    },
    created: function() {
       
    },
    mounted() {
        this.createExerciseChart();
        this.setPropSeries();
    },
    computed: {
        name() {
            return `${this.setProp}-chart`;
        }
    },
    methods: {
        createExerciseChart,
        setPropSeries,
        capitalize
    },
}

function createExerciseChart() {
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
        width: 330, 
        height: 100
    };

    this.$refs[this.name].replaceChildren();
    // const chart = createChart('nutrient-chart', { width: 278, height: 100 });
    const chart = createChart(this.name,  chartOptions);
    this.chart = chart;

    this.propSeries = chart.addLineSeries({
        priceScaleId: 'left',
        color: '#EA8919',
        lastValueVisible: false,
        priceLineVisible: false,
    });
    // const propLine = {
    //     // price: this.caloriesRecommended,
    //     color: '#EA8919',
    //     lineWidth: 2,
    //     lineStyle: 2, // LineStyle.Dashed
    //     axisLabelVisible: true,
    //     // title: 'Cal Rec',
    // };
    // this.propSeries.createPriceLine(propLine);
}

function setPropSeries() {
    let prop = capitalize(this.setProp);
    let max = 0;
    let history = this.history.filter(x => x[`max${prop}`]);
    history = sortDateAsc(history, "date");
    let seriesData = history.map(x => {
        return {
            datetime: new Date(x.date),
            time: new Date(x.date) / 1000,
            value: x[`max${prop}`]
        }
    });
    this.propSeries.setData(seriesData);

    // let maxValue = (max < this.waterRecommended) 
    //     ? this.waterRecommended + 10 : max + 10
    // this.waterSeries.applyOptions({
    //     autoscaleInfoProvider: () => ({
    //         priceRange: {
    //             minValue: 0,
    //             maxValue
    //         },
    //     }),
    // })

    this.chart.timeScale().fitContent();
}

</script>

<style scoped>

</style>