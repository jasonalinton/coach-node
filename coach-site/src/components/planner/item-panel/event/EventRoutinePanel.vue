<template>
    <div class="routine-event d-flex flex-column flex-grow-1">
        <!-- Header -->
        <div class="head d-flex flex-column px-3 pt-2">
            <span class="title text-start">{{ toShortWeekdayString(_event.startAt) }}</span>
            <span class="date text-start">{{ _event.text }}</span>
        </div>
        <!-- Toolbar -->
        <div class="toolbar d-flex flex-row justify-content-between align-items-center">
            <AddTaskButton @click="addNewTask"></AddTaskButton>
            <IconButton src="/icon/goal-icon.png" :width="32" :height="32"></IconButton>
        </div>
        <!-- Body -->
        <div v-if="_event" class="d-flex flex-column flex-grow-1 justify-content-between">
            <!-- Pending -->
            <ul v-if="iterations.pending" class="item-list pending">
                <li v-if="iterations.new">
                    <!-- New Task -->
                    <div class="new-task d-flex flex-row align-items-center">
                        <ItemCheckbox :width="40" :height="40" @onChecked="markNewTaskComplete(iterations.new)"></ItemCheckbox>
                        <input id="newTask" ref="newTask" class="form-control form-control-sm" type="text" 
                               v-model="iterations.new.text"
                               v-on:keyup.enter="addTask(iterations.new)"
                               v-on:keyup.esc="cancelAddTask()"
                               autofocus/>
                    </div>
                </li>
                <li v-for="(iteration, index) in iterations.pending" v-bind:key="iteration.id" :style="{ 'z-index': -index }">
                    <ListItem :iteration="iteration" @markComplete="toggleCompletion(iteration, $apollo)" @onDelete="deleteIteration(iteration.id, $apollo)"></ListItem>
                    <!-- <ListItem :iteration="iteration" @markComplete="markComplete" @onDelete="removeIteration"></ListItem> -->
                </li>
            </ul>
            <!-- Complete  -->
            <div class="complete d-flex flex-column">
                <div class="header">Completed ({{ iterations.complete.length }})</div>
                <ul v-if="iterations.complete" class="item-list">
                    <li v-for="(iteration, index) in iterations.complete" v-bind:key="index" :style="{ 'z-index': -index }">
                            <ListItem class="complete" :iteration="iteration" @markIncomplete="toggleCompletion(iteration, $apollo)" @onDelete="deleteIteration(iteration.id, $apollo)"></ListItem>
                        <!-- <ListItem class="complete" :iteration="iteration" @markIncomplete="markIncomplete" @onDelete="removeIteration"></ListItem> -->
                    </li>
                </ul>
            </div>
        </div>

    </div>
</template>

<script>
import IconButton from '../../../controls/button/IconButton.vue';
import AddTaskButton from '../component/AddTaskButton.vue';
import ItemCheckbox from '../component/ItemCheckbox.vue';
import ListItem from '../component/ListItem.vue';
import { toShortWeekdayString, startOfDay } from '../../../../../utility/timeUtility';
import { replaceItem, removeItem, today, sortDesc } from '../../../../../utility';
import { createDefaultTask, toggleCompletion, deleteIteration } from '../../../../resolvers/todo-resolvers';

export default {
    name: 'EventRoutinePanel',
    components: { ItemCheckbox, ListItem, AddTaskButton, IconButton },
    props: {
        _event: Object
    },
    data: function () {
        return {
            iterations: { 
                complete: [],
                pending: [],
                new: null
            },
        }
    },
    created: function() {
        this.refreshIterations(this._event);
    },
    apollo: {
        eventt: {
            query() { return require('../../../../graphql/query/planner/QueryEvent.gql')},
            variables() {
                return { id: this._event.id }
            },
            error: function(error) {
                this.errorMessage = 'Error occurred while loading query'
                console.log(this.errorMessage, error);
            },
            update(data) { 
                this.refreshIterations(data.event);
                return data.event;
            },
            subscribeToMore: [
                {
                    document: require('../../../../graphql/subscription/planner/EventAdded.gql'),
                    updateQuery: (previousResult, { subscriptionData: { data: { eventAdded }} }) => {
                        if (previousResult.event.id == eventAdded.id)
                            return previousResult;
                    },
                },
                {
                    document: require('../../../../graphql/subscription/planner/EventUpdated.gql'),
                    updateQuery: (previousResult, { subscriptionData: { data: { eventUpdated }} }) => {
                        if (previousResult.event.id == eventUpdated.id)
                            return previousResult;
                    },
                },
                {
                    document: require('../../../../graphql/subscription/planner/EventDeleted.gql'),
                    updateQuery: (previousResult, { subscriptionData: { data: { eventDeleted }} }) => {
                        if (previousResult.event.id == eventDeleted.id) {
                            previousResult.event = null
                            return previousResult;
                        }
                    },
                },
                {
                    document: require('../../../../graphql/subscription/todo/IterationUpdated.gql'),
                    updateQuery: (previousResult, { subscriptionData: { data: { iterationUpdated }} }) => {
                        replaceItem(iterationUpdated, previousResult.event.iterations);
                        previousResult.event.iterations.forEach(_iteration => {
                            if (_iteration.routineIteration != null) {
                                replaceItem(iterationUpdated, _iteration.routineIteration.todoIterations);
                            }
                        })
                        // this.refreshIterations(previousResult.event);
                        return previousResult.event;
                    },
                },
                {
                    document: require('../../../../graphql/subscription/todo/IterationDeleted.gql'),
                    updateQuery: (previousResult, { subscriptionData: { data: { iterationDeleted }} }) => {
                        removeItem(iterationDeleted, previousResult.event.iterations);
                        previousResult.event.iterations.forEach(_iteration => {
                            if (_iteration.routineIteration != null) {
                                removeItem(iterationDeleted, _iteration.routineIteration.todoIterations);
                            }
                        })
                        // this.refreshIterations(previousResult.event);
                        return previousResult.event;
                    },
                },
            ]
        },
    },
    methods: {
        initIteration,
        addNewTask,
        addTask,
        cancelAddTask,
        markNewTaskComplete,
        markComplete,
        markIncomplete,
        createDefaultTask,
        toggleCompletion,
        deleteIteration,
        replaceItem,
        removeItem,
        removeIteration,
        today,
        toShortWeekdayString,
        refreshIterations,
        sortDesc
    },
    watch: {
        _event() {
            this.refreshIterations(this._event);
        }
    }
}

function initIteration() {
    return {
        id: this.newItemID--,
        text: '',
        startAt: startOfDay(this._event.startAt),
        endAt: null,
        attemptedAt: null,
        completedAt: null,
        isRecommended: false,
    }
}

function addNewTask() {
    this.iterations.new = this.initIteration();
    this.$nextTick(() => this.$refs.newTask.focus());
}

function addTask(iteration) {
    if (!iteration.events) iteration.events = [];
    iteration.events.push({ 
        id: this._event.id,
        text: this._event.text
    });

    var title = iteration.text;
    if (title != "") {
        this.createDefaultTask(iteration, this.$apollo);
    }
    this.addNewTask();
}

function cancelAddTask() {
    this.iterations.new = null;
}

function markNewTaskComplete(iteration) {
    var title = iteration.text;
    if (title != "") {
        let now = today();
        iteration.startAt = now;
        iteration.attemptedAt = now;
        iteration.completedAt = now;

        this.iterations.new = null;

        this.createDefaultTask(iteration, this.$apollo);
    }
}

function markComplete(iteration) {
    replaceItem(iteration, this.iterations.pending);
    this.toggleCompletion(iteration, this.$apollo);
}

function markIncomplete(iteration) {
    replaceItem(iteration, this.iterations.complete);
    this.toggleCompletion(iteration, this.$apollo);
}

function removeIteration(iteration) {
    let list = (iteration.attemptedAt) ? this.iterations.complete : this.iterations.pending;
    removeItem(iteration, list);
    this.deleteIteration(iteration.id, this.$apollo);
}

function refreshIterations(_event) {
        let complete = [];
        let pending = [];

        complete = complete.concat(_event.iterations.filter(iteration => iteration.routineIteration == null && iteration.attemptedAt));
        pending = pending.concat(_event.iterations.filter(iteration => iteration.routineIteration == null && !iteration.attemptedAt));

        let routineIterations = _event.iterations.filter(iteration => iteration.routineIteration != null).flat();
        routineIterations = routineIterations.map(iteration => iteration.routineIteration);
        let todoIterations = routineIterations.map(iteration => iteration.todoIterations).flat();
        complete = complete.concat(todoIterations.filter(iteration => iteration.attemptedAt));
        pending = pending.concat(todoIterations.filter(iteration => !iteration.attemptedAt));

        this.iterations.complete = sortDesc(complete, 'id');
        this.iterations.pending = sortDesc(pending, 'id');
}
</script>

<style scoped>
.routine-event {
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