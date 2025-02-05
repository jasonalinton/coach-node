<template>
    <div class="routine-event d-flex flex-column flex-grow-1">
        <!-- Header -->
        <div class="head d-flex flex-column px-3 pt-2">
            <span class="label text-start">{{ _event.text }}</span>
            <div class="d-flex flex-row">
                <span v-if="isToday" class="timeframe">Today</span>
                <span v-if="!isToday" class="timeframe">Day</span>
                <span class="dash">-</span>
                <span class="date">{{ date }}</span>
            </div>
            <span class="points text-start mt-1">{{ points.text }}</span>
        </div>
        <!-- Body -->
        <div v-if="_event" class="d-flex flex-column flex-grow-1 justify-content-between">
            <!-- Pending -->
            <ul v-if="incompleteIterations" class="item-list pending">
                <li v-for="(iteration, index) in incompleteIterations" v-bind:key="iteration.id" :style="{ 'z-index': -index }">
                    <ListItem :iteration="iteration" :parent="_event" :parentType="'routineEvent'"></ListItem>
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
import ListItem from '../component/ListItem.vue';
import { toShortWeekdayString, startOfDay, isToday } from '../../../../../utility/timeUtility';
import { replaceItem, removeItem, today, sortAsc } from '../../../../../utility';

export default {
    name: 'EventRoutinePanel',
    components: { ListItem },
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
        date() {
            if (this.eventt) {
                return toShortWeekdayString(this.eventt.startAt, true);
            }
            return "";
        },
        isToday() {
            if (this.eventt) {
                return isToday(this.eventt.startAt);
            }
            return undefined
        },
        points() {
            let complete = 0;
            let incomplete = 0;
            this.incompleteIterations.forEach(x => {
                if (x.points) {
                    incomplete += x.points
                }
            });
            this.completeIterations.forEach(x => {
                if (x.points) {
                    complete += x.points
                }
            });
            let total = complete + incomplete;
            return { complete, incomplete, total, text: `${complete}/${total}` };
        },
    },
    methods: {
        initIteration,
        addNewTask,
        cancelAddTask,
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

function cancelAddTask() {
    this.iterations.new = null;
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

span.timeframe {
    /* padding-left: 20px; */
    color: #3B99FC;
    font-size: 14px;
    font-weight: 500;
}
span.date {
    font-size: 14px;
    font-weight: 500;
}
span.dash {
    margin: 0 4px;
    line-height: 21px;
}
span.label {
    font-size: 18px;
    /* font-weight: 500; */
}

span.points {
    font-size: 14px;
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