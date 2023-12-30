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
            <ul v-if="incompleteIterations" class="item-list pending">
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
                <li v-for="(iteration, index) in incompleteIterations" v-bind:key="iteration.id" :style="{ 'z-index': -index }">
                    <ListItem :iteration="iteration" :parent="_event" :parentType="'routineEvent'" @onDelete="deleteIteration(iteration.id, $apollo)"></ListItem>
                </li>
            </ul>
            <!-- Complete  -->
            <div class="complete d-flex flex-column">
                <div class="header">Completed ({{ completeIterations.length }})</div>
                <ul v-if="completeIterations" class="item-list">
                    <li v-for="(iteration, index) in completeIterations" v-bind:key="index" :style="{ 'z-index': -index }">
                            <ListItem class="complete" :iteration="iteration" @onDelete="deleteIteration(iteration.id, $apollo)"></ListItem>
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
import { replaceItem, removeItem, today, sortAsc } from '../../../../../utility';
import { createDefaultTask, deleteIteration } from '../../../../resolvers/todo-resolvers';

export default {
    name: 'EventRoutinePanel',
    components: { ItemCheckbox, ListItem, AddTaskButton, IconButton },
    props: {
        _event: Object
    },
    data: function () {
        return {
            eventStore: undefined,
            iterations: { 
                complete: [],
                pending: [],
                new: null
            },
        }
    },
    created: async function() {
        let eventStore = await import(`@/store/eventStore`);
        this.eventStore = eventStore.useEventStore();
    },
    computed: {
        eventt() { 
            if (this.eventStore) {
                let event = this.eventStore.events.find(_event => _event.id == this._event.id);
                return event;
            } else {
                return undefined;
            }
        },
        completeIterations() { 
            if (this.eventt) {
                var complete = this.eventt.iterations.filter(task => task.attemptedAt && task.routineIterationID) 
                return sortAsc(complete, 'id');
            } else {
                return [];
            }
        },
        incompleteIterations() { 
            if (this.eventt) {
                var incomplete = this.eventt.iterations.filter(task => !task.attemptedAt && task.routineIterationID) 
                return sortAsc(incomplete, 'id');
            } else {
                return [];
            }
        },
    },
    methods: {
        initIteration,
        addNewTask,
        addTask,
        cancelAddTask,
        markNewTaskComplete,
        createDefaultTask,
        deleteIteration,
        replaceItem,
        removeItem,
        today,
        toShortWeekdayString,
        sortAsc
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