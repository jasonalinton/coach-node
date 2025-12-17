<template>
    <div class="d-flex flex-column flex-grow-1">
        <div class="hero">
            <!-- <img class="img-fluid" src="/metric/physical/Badass Workout Photo.jpg" /> -->
            <WeightChart />
        </div>
        <div class="cards d-flex flex-row justify-content-center overflow-scroll">
            <div class="card">
                <div class="height d-flex flex-row">
                    <span class="feet">6</span>
                    <span class="ft">ft</span>
                    <span class="inch">0</span>
                    <span class="in">in</span>
                </div>
                <div class="weight d-flex flex-row">
                    <span>145lbs</span>
                </div>
            </div>
            <div class="card"></div>
            <div class="card"></div>
            <div class="card"></div>
            <div class="card"></div>
            <div class="card"></div>
        </div>
        <MetricTimeline class="posts" :idMetric="idMetric" />
        <div class="blurbs d-flex flex-column">
            <div v-for="blurb in blurbs" :key="blurb.id"
                 class="blurb d-flex flex-column">
                <span class="date">{{ blurb.date }}</span>
                <span class="time">{{ blurb.time }}</span>
                <span v-if="blurb.title" class="title">{{ blurb.title }}</span>
                <span class="text">{{ blurb.text }}</span>
                <div class="d-flex flex-row">
                    <span v-for="(tag, index) in blurb.tags" :key="index" class="tag">{{ tag }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { usePlannerStore } from '@/store/plannerStore'
import { METRIC } from '../../../model/constants'
import MetricTimeline from '../component/blog/MetricTimeline.vue'
import WeightChart from './WeightChart.vue';

export default {
    name: 'PhysicalView',
    components: { MetricTimeline, WeightChart },
    props: {
        
    },
    data: function () {
        return {
            plannerStore: undefined,
            universalStore: undefined,
            idMetric: METRIC.PHYSICAL,
            blurbs: [],
        }
    },
    created: async function() {
        this.plannerStore = usePlannerStore();
    },
    methods: {

    },
}

</script>

<style scoped>
.hero img {
    max-height: 800px;
}

.card {
    min-width: 170px;
    min-height: 170px;
    background-color: gray;
}

.card .height {
    margin: 10px auto 0 auto;
}

.card .feet, .card .inch {
    font-size: 68px;
}

.card .weight {
    margin: 0 auto;
    font-size: 48px;
}

.card .ft, .card .in {
    font-size: 28px;
}

.posts {
    padding: 0 12px;
}
</style>