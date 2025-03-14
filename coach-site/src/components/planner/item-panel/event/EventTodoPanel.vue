<template>
    <div class="todo-event d-flex flex-column flex-grow-1">
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
                <li v-for="(iteration, index) in incompleteIterations" v-bind:key="iteration.id" :style="{ 'z-index': -index }">
                    <ListItem :iteration="iteration"></ListItem>
                </li>
            </ul>
            <!-- Complete  -->
            <div class="complete d-flex flex-column">
                <div class="header">Completed ({{ completeIterations.length }})</div>
                <ul v-if="completeIterations" class="item-list">
                    <li v-for="(iteration, index) in completeIterations" v-bind:key="index" :style="{ 'z-index': -index }">
                        <ListItem class="complete" :iteration="iteration"></ListItem>
                    </li>
                </ul>
            </div>
        </div>

    </div>
</template>

<script>
import IconButton from '../../../controls/button/IconButton.vue';
import AddTaskButton from '../component/AddTaskButton.vue';
import ListItem from '../component/ListItem.vue';
import { toShortWeekdayString, startOfDay } from '../../../../../utility/timeUtility';
import { replaceItem, removeItem, today, sortAsc } from '../../../../../utility';

export default {
    name: 'EventTodoPanel',
    components: { ListItem, AddTaskButton, IconButton },
    props: {
        _event: Object
    },
    data: function () {
        return {
            eventStore: undefined,
            iterations: {
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
                var complete = this.eventt.iterations.filter(task => task.attemptedAt) 
                return sortAsc(complete, 'id');
            } else {
                return [];
            }
        },
        incompleteIterations() { 
            if (this.eventt) {
                var incomplete = this.eventt.iterations.filter(task => !task.attemptedAt) 
                return sortAsc(incomplete, 'id');
            } else {
                return [];
            }
        },
    },
    methods: {
        initIteration,
        addNewTask,
        cancelAddTask,
        replaceItem,
        removeItem,
        today,
        toShortWeekdayString
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

function cancelAddTask() {
    this.iterations.new = null;
}

</script>

<style scoped>
.todo-event {
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