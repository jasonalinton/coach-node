<template>
    <div class="row g-0">
        <div class="col">
            <MetricTable @metricSelected="metricSelected"></MetricTable>
        </div>
        <div class="col-auto">
            <MetricForm v-if="selectedMetric" :metric="selectedMetric" @closeForm="selectedMetric = null"></MetricForm>
        </div>
    </div>
</template>

<script>
import MetricTable from './MetricTable.vue';
import MetricForm from './MetricForm.vue';

export default {
    components: { MetricTable, MetricForm },
    name: 'MetricItem',
    data: function() {
        return {
            metrics: [],
            selectedMetric: null,
        }
    },
    methods: {
        metricSelected
    }
}

function metricSelected(metric) {
    this.selectedMetric = metric;
}
</script>

<style scoped>
table {
    text-align: start;
}

table th:last-child {
    width: 130px;
}
</style>