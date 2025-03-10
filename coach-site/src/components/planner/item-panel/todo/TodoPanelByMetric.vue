<template>
    <div class="row g-0">
        <TimeframeRadio :timeframe="timeframe" @timeframeSelected="timeframe=$event" :container="'todoPanelCustom'"></TimeframeRadio>
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
import { sortAsc } from '../../../../../utility';
import TimeframeRadio from '../component/TimeframeRadio.vue';
import { firstDayOfWeek, lastDayOfWeek, firstDayOfMonth, lastDayOfMonth, endOfDay } from '../../../../../utility/timeUtility';

export default {
    name: 'TodoPanelByMetric',
    components: { MetricSelector, IconButton, ListItem, TimeframeRadio },
    props: {
        selectedDate: Date
    },
    data: function() {
        return {
            iterationStore: undefined,
            todoStore: undefined,
            config: todoConfig,
            selectedMetrics: {
                physical: true,
                emotional: true,
                mental: true,
                social: true,
                financial: true
            },
            timeframe: 'day',
            metrics: []
        }
    },
    created: async function() {
        let iterationStore = await import(`@/store/iterationStore`);
        this.iterationStore = iterationStore.useIterationStore();
        this.iterationStore.getIterationsInRange(this.startAt, this.endAt, true);

        let todoStore = await import(`@/store/todoStore`);
        this.todoStore = todoStore.useTodoStore();
    },
    computed: {
        start() { 
            if (this.timeframe == 'day')
                return this.selectedDate;
            else if (this.timeframe == 'week')
                return firstDayOfWeek(this.selectedDate);
            else if (this.timeframe == 'month')
                return firstDayOfMonth(this.selectedDate);
            else
                return null
        },
        end() { 
            if (this.timeframe == 'day')
                return endOfDay(this.selectedDate);
            else if (this.timeframe == 'week')
                return lastDayOfWeek(this.selectedDate);
            else if (this.timeframe == 'month')
                return lastDayOfMonth(this.selectedDate);
            else
                return null
        },
        iterations2() { 
            if (this.iterationStore) {
                let iterations = this.iterationStore.iterations;
                iterations = iterations.filter(iteration => {
                    return +(new Date(iteration.startAt)) >= +this.start && 
                           +endOfDay((new Date(iteration.endAt))) <= +this.end &&
                           !iteration.isRepeat
                });
                iterations = iterations.filter(iteration => iteration.idRoutine == null && iteration.idRoutineIteration == null);
                iterations = sortAsc(iterations, 'startAt');

                return iterations;
            } else {
                return [];
            }
        },
        todos() {
            if (this.todoStore) {
                let todoIDs = this.iterations2.map(x => x.todo.id);
                let todos = this.todoStore.getItemsByID(todoIDs);
                return todos;
            } else {
                return [];
            }
        },
        physicalTodos() { return this.getMetricTodos('physical'); },
        emotionalTodos() { return this.getMetricTodos('emotional'); },
        mentalTodos() { return this.getMetricTodos('mental'); },
        socialTodos() { return this.getMetricTodos('social'); },
        financialTodos() { return this.getMetricTodos('financial'); },
    },
    methods: {
        getMetricTodos,
    },
    watch: {
        iterations2: {
            handler() {
                this.metrics = [
                    { id: 1, name: 'physical', todos: this.physicalTodos, selected: this.selectedMetrics.physical, collapsed: false },
                    { id: 2, name: 'emotional', todos: this.emotionalTodos, selected: this.selectedMetrics.emotional, collapsed: false },
                    { id: 3, name: 'mental', todos: this.mentalTodos, selected: this.selectedMetrics.mental, collapsed: false },
                    { id: 4, name: 'social', todos: this.socialTodos, selected: this.selectedMetrics.social, collapsed: false },
                    { id: 5, name: 'financial', todos: this.financialTodos, selected: this.selectedMetrics.financial, collapsed: false },
                ]
            },
            deep: true
        }
    }
}

function getMetricTodos(metric) {
    let iterations = [];
    if (this.iterations2) {
        this.todos.filter(todo => {
            if (todo.metrics.some(_metric => _metric.text.toLowerCase() == metric))
            {
                iterations.push(this.iterations2.filter(x => x.todo.id == todo.id));
            }
        })
    }
    return iterations.flat();
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