<template>
    <div class="custom d-flex flex-column flex-grow-1">
        <TimeframeRadio :timeframe="timeframe" @timeframeSelected="timeframe=$event" :container="'todoPanelCustom'"></TimeframeRadio>
        <!-- Toolbar -->
        <div class="toolbar d-flex flex-row justify-content-between align-items-center">
            <AddTaskButton @click="addNewTask"></AddTaskButton>
            <IconButton src="/icon/goal-icon.png" :width="32" :height="32" @click="show(showGoals)"></IconButton>
        </div>
        <!-- Body -->
        <div class="d-flex flex-column flex-grow-1 justify-content-start">
            <!-- Goals -->
            <div v-if="showGoals" class="complete d-flex flex-column">
                <div class="header">Goals ({{ goals.length }})</div>
                <ul class="item-list">
                    <li v-for="(goal, index) in goals" v-bind:key="index" :style="{ 'z-index': -index }">
                        {{ goal.text }}
                    </li>
                </ul>
            </div>
            <div class="d-flex flex-column flex-grow-1 justify-content-between">
                <!-- Pending -->
                <ul v-if="pending" class="item-list pending">
                    <li v-if="todos.new">
                        <!-- New Task -->
                        <div class="new-task d-flex flex-row align-items-center">
                            <ItemCheckbox :width="40" :height="40" @onChecked="markNewTaskComplete(todos.new)"></ItemCheckbox>
                            <input id="newTask" ref="newTask" class="form-control form-control-sm" type="text" 
                                v-model="todos.new.text"
                                v-on:keyup.enter="addTask(todos.new)"
                                v-on:keyup.esc="cancelAddTask()"
                                autofocus/>
                        </div>
                    </li>
                    <li v-for="(iteration, index) in pending" v-bind:key="iteration.id" :style="{ 'z-index': -index }">
                        <ListItem :iteration="iteration" @markComplete="toggleCompletion(iteration, $apollo)" @onDelete="deleteIteration(iteration.id, $apollo)"></ListItem>
                    </li>
                </ul>
                <!-- Complete  -->
                <div class="complete d-flex flex-column">
                    <div class="header">Completed ({{ complete.length }})</div>
                    <ul v-if="complete" class="item-list">
                        <li v-for="(iteration, index) in complete" v-bind:key="index" :style="{ 'z-index': -index }">
                            <ListItem class="complete" :iteration="iteration" @markIncomplete="toggleCompletion(iteration, $apollo)" @onDelete="deleteIteration(iteration.id, $apollo)"></ListItem>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import IconButton from '../../../controls/button/IconButton.vue'
import AddTaskButton from '../component/AddTaskButton.vue'
import ItemCheckbox from '../component/ItemCheckbox.vue';
import ListItem from '../component/ListItem.vue'
import { replaceItem, removeItem, today, sortAsc } from '../../../../../utility';
import { createDefaultTask, toggleCompletion, deleteIteration } from '../../../../resolvers/todo-resolvers';
import TimeframeRadio from '../component/TimeframeRadio.vue';
import { firstDayOfWeek, lastDayOfWeek, firstDayOfMonth, lastDayOfMonth } from '../../../../../utility/timeUtility';

export default {
    name: 'TodoPanelByCustom',
    components: { AddTaskButton, IconButton, ListItem, ItemCheckbox, TimeframeRadio, },
    props: {
        selectedDate: Date
    },
    data: function () {
        return {
            todos: {
                complete: [],
                pending: [],
                new: null
            },
            iterations: [],
            newItemID: -1,
            today: today(),
            allIterations: [],
            timeframe: 'day',
            showGoals: false,
            showRoutineTasks: false
        }
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
                return this.selectedDate;
            else if (this.timeframe == 'week')
                return lastDayOfWeek(this.selectedDate);
            else if (this.timeframe == 'month')
                return lastDayOfMonth(this.selectedDate);
            else
                return null
        },
        complete() { return (this.iterations) ? this.iterations.filter(iteration => iteration.attemptedAt) : [] },
        pending() { return (this.iterations) ? this.iterations.filter(iteration => !iteration.attemptedAt) : [] },
        goals() {
            let goals = this.iterations.map(_it => _it.todo).map(_todo => _todo.goals).flat();
            return goals;
        }
    },
    apollo: {
        iterations: {
            query() { return require('../../../../graphql/query/planner/QueryIterations.gql')},
            variables() {
                return {
                    type: 'todo',
                    startAt: this.start,
                    endAt: this.end
                }
            },
            error: function(error) {
                this.errorMessage = 'Error occurred while loading query'
                console.log(this.errorMessage, error);
            },
            update(data) { 
                let iterations = data.iterations;
                if (!this.showRoutineTasks)
                    iterations = data.iterations.filter(_iteration => _iteration.events.length == 0 )
                iterations = sortAsc(iterations, 'startAt');
                return iterations;
            },
            subscribeToMore: [
                {
                    document: require('../../../../graphql/subscription/planner/IterationAdded.gql'),
                    updateQuery: (previousResult, { subscriptionData: { data: { iterationAdded }} }) => {
                        previousResult.iterations.splice(0, 0, iterationAdded);
                        return { iterations: previousResult.iterations };
                    },
                },
                {
                    document: require('../../../../graphql/subscription/planner/IterationDeleted.gql'),
                    updateQuery: (previousResult, { subscriptionData: { data: { iterationDeleted }} }) => {
                        removeItem(iterationDeleted, previousResult.iterations);
                        return previousResult;
                    },
                },
            ]
        },
    },
    mounted: function() {
        // An error gets thrown if pollInterval is set with the query
        this.$apollo.queries.iterations.setOptions({
            fetchPolicy: 'cache-and-network',
            pollInterval: 50000,
        })
    },
    methods: {
        initIteration,
        addNewTask,
        addTask,
        cancelAddTask,
        markNewTaskComplete,
        createDefaultTask,
        toggleCompletion,
        deleteIteration,
        replaceItem,
        removeItem,
        show(value) {
            this.showGoals = (value) ? false : true;
            console.log(this.goals);
        },
        temp() {
            console.log("Temp")
        }
    },
}

function initIteration() {
    return {
        id: this.newItemID--,
        text: '',
        startAt: this.start,
        endAt: this.end,
        attemptedAt: null,
        completedAt: null,
        isRecommended: false,
    }
}

function addNewTask() {
    this.todos.new = this.initIteration();
    this.$nextTick(() => this.$refs.newTask.focus());
}

function addTask(iteration) {
    var title = iteration.text;
    if (title != "") {
        this.createDefaultTask(iteration, this.$apollo);
    }
    this.addNewTask();
}

function cancelAddTask() {
    this.todos.new = null;
}

function markNewTaskComplete(iteration) {
    var title = iteration.text;
    if (title != "") {
        let now = today();
        iteration.startAt = now;
        iteration.attemptedAt = now;
        iteration.completedAt = now;

        this.todos.new = null;

        this.createDefaultTask(iteration, this.$apollo);
    }
}
</script>

<style scoped>
.custom {
    height: calc(100vh - 64px);
    overflow: scroll;
}

.toolbar {
    padding: 8px;
    z-index: 3;
    background-color: white;
}

.item-list {
    margin-bottom: 8px;
    z-index: 2;
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

.new-task {
    background-color: white;
    position: relative;
    z-index: 1;
    padding-right: 12px;
}

/* .pending {
    overflow: scroll;
} */

.complete {
    /* position: absolute; */
    bottom: 0;
}

.complete .header {
    background-color: white;
    z-index: 3;
    padding: 0 8px;
}
</style>