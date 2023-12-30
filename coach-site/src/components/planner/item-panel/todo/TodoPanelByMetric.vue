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
                        <li v-for="todo in metric.todos" :key="todo.id" class="todo">
                            <ListItem :iteration="todo"></ListItem>
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
import todoConfig from '../../../../config/items/todo-config';
import ListItem from '../component/ListItem.vue';
import { removeItem } from '../../../../../utility';
import { createDefaultTask } from '../../../../resolvers/todo-resolvers';

export default {
    name: 'TodoPanelByMetric',
    components: { MetricSelector, IconButton, ListItem },
    data: function() {
        return {
            config: todoConfig,
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
    apollo: {
        iterations: {
            query() { return require('../../../../graphql/query/todo/QueryTodoIterations.gql')},
            error: function(error) {
                this.errorMessage = 'Error occurred while loading query'
                console.log(this.errorMessage, error);
            },
            update(data) { 
                return data.todoIterations;
            },
            subscribeToMore: [
                {
                    document: require('../../../../graphql/subscription/planner/IterationAdded.gql'),
                    updateQuery: (previousResult, { subscriptionData: { data: { iterationAdded }} }) => {
                        previousResult.todoIterations.splice(0, 0, iterationAdded);
                        return previousResult;
                    },
                },
                {
                    document: require('../../../../graphql/subscription/planner/IterationDeleted.gql'),
                    updateQuery: (previousResult, { subscriptionData: { data: { iterationDeleted }} }) => {
                        removeItem(iterationDeleted, previousResult.todoIterations);
                        return previousResult;
                    },
                },
            ]
        },
    },
    created: function() {
    },
    mounted: function() {
        // An error gets thrown if pollInterval is set with the query
        this.$apollo.queries.iterations.setOptions({
            fetchPolicy: 'cache-and-network',
            pollInterval: 50000,
        })
    },
    computed: {
        physicalTodos() { return this.getMetricTodos('physical'); },
        emotionalTodos() { return this.getMetricTodos('emotional'); },
        mentalTodos() { return this.getMetricTodos('mental'); },
        socialTodos() { return this.getMetricTodos('social'); },
        financialTodos() { return this.getMetricTodos('financial'); },
    },
    methods: {
        getMetricTodos,
        createDefaultTask
    },
    watch: {
        iterations() {
            this.metrics = [
                { id: 1, name: 'physical', todos: this.physicalTodos, selected: this.selectedMetrics.physical, collapsed: false },
                { id: 2, name: 'emotional', todos: this.emotionalTodos, selected: this.selectedMetrics.emotional, collapsed: false },
                { id: 3, name: 'mental', todos: this.mentalTodos, selected: this.selectedMetrics.mental, collapsed: false },
                { id: 4, name: 'social', todos: this.socialTodos, selected: this.selectedMetrics.social, collapsed: false },
                { id: 5, name: 'financial', todos: this.financialTodos, selected: this.selectedMetrics.financial, collapsed: false },
            ]
        },
    }
}

function getMetricTodos(metric) {
    if (this.iterations) {
        let todos = this.iterations.map(iteration => iteration.todo);
        let filtered = todos.filter(_todo => {
            if (_todo) {
                let metrics = _todo.metrics.map(_metric => _metric.text.toLowerCase());
                return (metrics.includes(metric.toLowerCase())) ? true : false;
            } else {
                return false;
            }
        });
        return filtered;
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
    font-size: 14px;
    color: #3C4043;
    list-style: none;
    padding: 0px;
    margin: 0px;
    text-align: start;
}

.item-list li {
    position: relative;
}

li.todo { 
    min-height: 32px;
    vertical-align: middle;
    padding: 2px 0px;
    font-weight: 300;
}

.todo-item {
    padding:  4px 0px 4px 20px;
}
</style>