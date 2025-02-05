<template>
    <div class="row g-0">
        <!-- Toolbar -->
        <div class="metric-selector-wrapper col-12 d-flex flex-column justify-content-between">
            <MetricSelector class="metric-selector" :selected="selectedMetrics"></MetricSelector>
        </div>
        <!-- Body -->
        <div class="d-flex flex-column">
            <div v-for="metric in metrics" :key="metric.id" class="d-flex flex-column" :class="metric.name">
                <div v-show="metric.selected.selected">
                    <div class="metric-header d-flex flex-row justify-content-between align-items-center" @click="metric.collapsed = !metric.collapsed">
                        <h1>{{ metric.name }}</h1>
                        <IconButton v-if="!metric.collapsed" class="caret" src="/icon/icon-expanded.png" :width="24" :height="24"></IconButton>
                        <IconButton v-if="metric.collapsed" class="caret" src="/icon/icon-collapsed.png" :width="24" :height="24" ></IconButton>
                    </div>
                    <ul v-show="!metric.collapsed">
                        <li v-for="goal in metric.goals" :key="goal.id" class="goal">
                            <div class="d-flex flex-column">
                                <div class="goal-item">{{ goal.text }}</div>
                                <ul>
                                    <li v-for="todo in goal.todos" :key="todo.id" class="todo">
                                        <ListItem :iteration="todo" :parentType="'goal'" :parent="goal" :size="'sm'"></ListItem>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import IconButton from '../../../controls/button/IconButton.vue'
import MetricSelector from '../component/MetricSelector.vue'
import goalConfig from '../../../../config/items/goal-config';
import ListItem from '../component/ListItem.vue';

export default {
    name: 'GoalPanelByMetric',
    components: { MetricSelector, IconButton, ListItem },
    data: function() {
        return {
            config: goalConfig,
            selectedMetrics: {
                physical: { selected: true},
                emotional: { selected: true},
                mental: { selected: true},
                social: { selected: true},
                financial: { selected: true}
            },
            metrics: []
        }
    },
    created: function() {
    },
    computed: {
        physicalGoals() { return this.getMetricGoals('physical'); },
        emotionalGoals() { return this.getMetricGoals('emotional'); },
        mentalGoals() { return this.getMetricGoals('mental'); },
        socialGoals() { return this.getMetricGoals('social'); },
        financialGoals() { return this.getMetricGoals('financial'); },
    },
    methods: {
        getMetricGoals
    },
    watch: {
        goals() {
            this.metrics = [
                { id: 1, name: 'physical', goals: this.physicalGoals, selected: this.selectedMetrics.physical, collapsed: true },
                { id: 2, name: 'emotional', goals: this.emotionalGoals, selected: this.selectedMetrics.emotional, collapsed: false },
                { id: 3, name: 'mental', goals: this.mentalGoals, selected: this.selectedMetrics.mental, collapsed: false },
                { id: 4, name: 'social', goals: this.socialGoals, selected: this.selectedMetrics.social, collapsed: false },
                { id: 5, name: 'financial', goals: this.financialGoals, selected: this.selectedMetrics.financial, collapsed: false },
            ]
        },
    }
}

function getMetricGoals(metric) {
    if (this.goals) {
        return this.goals.filter(_goal => {
            let metrics = _goal.metrics.map(_metric => _metric.text.toLowerCase());
            return (metrics.includes(metric.toLowerCase())) ? true : false;
        });
    } else {
        return [];
    }
}
</script>

<style scoped>
.metric-selector-wrapper {
    padding: 0 8px;
}
.metric-selector {
    width: 264px;
    margin-top: 12px;
    margin-bottom: 16px;
    padding-left: 12px;
}

h1 {
    font-size: 14px;
    font-weight: 500;
    margin-left: 20px;
    margin-bottom: 0px;
    text-transform: capitalize;
    user-select: none;
}

.physical h1{
    color: #3B99FC;
}

.emotional h1{
    color: #4C6EF5;
}

.mental h1{
    color: #F4511E;
}

.social h1{
    color: #FC3B3B;
}

.financial h1{
    color: #1EBA31;
}

.metric-header {
    height: 40px;
}

.caret {
    margin-right: 20px;
}

ul {
    list-style: none;
    padding: 0px;
    margin: 0px;
    text-align: start;
}

li.goal { 
    /* min-height: 32px; */
    color: #565656;
    vertical-align: middle;
    padding: 2px 0px;
    /* font-weight: 300; */
}

.goal-item {
    padding:  4px 8px 4px 20px;
    font-size: 15px;
    font-weight: 500;
    line-height: 19px;
}

li.todo { 
    padding-left: 12px;
    font-weight: 300;
}
</style>