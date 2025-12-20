<template>
    <div class="emotional-view">
        <div class="d-flex flex-column flex-grow-1">
            <div class="hero">
                <img class="img-fluid" src="/metric/physical/Badass Workout Photo.jpg" />
            </div>
            <MetricTimeline class="posts" :idMetric="idMetric" />
        </div>
    </div>
</template>

<script>
import { usePlannerStore } from '@/store/plannerStore'
import { METRIC } from '../../../model/constants'
import MetricTimeline from '../component/blog/MetricTimeline.vue'

export default {
    name: 'EmotionalView',
    components: { MetricTimeline },
    props: {
        
    },
    data: function () {
        return {
            plannerStore: undefined,
            universalStore: undefined,
            idMetric: METRIC.EMOTIONAL,
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