<template>
    <div class="custom d-flex flex-column flex-grow-1">
        <TimeframeRadio :timeframe="timeframe" @timeframeSelected="timeframe=$event" :container="'todoPanelRepetition'"></TimeframeRadio>
        <!-- Toolbar -->
        <!-- <div class="toolbar d-flex flex-row justify-content-between align-items-center">
            <AddTaskButton @click="addNewTask"></AddTaskButton>
            <IconButton src="/icon/goal-icon.png" :width="32" :height="32" @clicked="show(showGoals)"></IconButton>
        </div> -->
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
                <ul class="item-list pending">
                    <li v-for="(iteration, index) in pending" v-bind:key="iteration.id" :style="{ 'z-index': -index }">
                        <ListItem :iteration="iteration" 
                                  @onEdit="$emit('editIteration', iteration)">
                        </ListItem>
                    </li>
                </ul>
                <!-- Complete  -->
                <div class="complete d-flex flex-column">
                    <div class="header">Completed ({{ complete.length }})</div>
                    <ul v-if="complete" class="item-list">
                        <li v-for="(iteration, index) in complete" v-bind:key="index" :style="{ 'z-index': -index }">
                            <ListItem class="complete" 
                                      :iteration="iteration"
                                      @onEdit="$emit('editIteration', iteration)">
                            </ListItem>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ListItem from '../component/ListItem.vue'
import { replaceItem, removeItem, today, sortAsc } from '../../../../../utility';
import TimeframeRadio from '../component/TimeframeRadio.vue';
import { firstDayOfWeek, lastDayOfWeek, firstDayOfMonth, lastDayOfMonth, startOfDay, endOfDay } from '../../../../../utility/timeUtility';

export default {
    name: 'TodoPanelByRepetition',
    components: { ListItem, TimeframeRadio, },
    props: {
        selectedDate: Date
    },
    created: async function() {
        let iterationStore = await import(`@/store/iterationStore`);
        this.iterationStore = iterationStore.useIterationStore();
        this.iterationStore.getRepetitiveTodoIterations(this.start, this.end);
    },
    data: function () {
        return {
            iterationStore: undefined,
            tasks: {
                complete: [],
                pending: [],
                new: null
            },
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
                return endOfDay(this.selectedDate);
            else if (this.timeframe == 'week')
                return lastDayOfWeek(this.selectedDate);
            else if (this.timeframe == 'month')
                return lastDayOfMonth(this.selectedDate);
            else
                return null
        },
        iterations() { 
            if (this.iterationStore) {
                let iterations = this.iterationStore.iterations;
                iterations = iterations.filter(iteration => {
                    return +(new Date(iteration.startAt)) == +this.start && 
                           +startOfDay((new Date(iteration.endAt))) == +startOfDay(this.end) &&
                           iteration.isRepeat
                });
                iterations = iterations.filter(iteration => iteration.idRoutine == null && iteration.idRoutineIteration == null);
                iterations = sortAsc(iterations, 'startAt');

                return iterations;
            } else {
                return [];
            }
        },
        complete() { return this.iterations.filter(iteration => iteration.attemptedAt) },
        pending() { return this.iterations.filter(iteration => !iteration.attemptedAt) },
        goals() {
            let goals = this.iterations.map(_it => _it.todo).map(_todo => _todo.goals).flat();
            return goals;
        }
    },
    methods: {
        initIteration,
        replaceItem,
        removeItem,
        show(value) {
            this.showGoals = (value) ? false : true;
            console.log(this.goals);
        },
    },
    watch: {
        selectedDate() {
            this.iterationStore.getRepetitiveTodoIterations(this.start, this.end, true);
        },
        timeframe() {
            this.iterationStore.getRepetitiveTodoIterations(this.start, this.end, true);
        },
    }
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