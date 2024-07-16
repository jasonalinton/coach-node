<template>
    <div class="default d-flex flex-column flex-grow-1 overflow-scroll">
        <!-- Toolbar -->
        <div class="toolbar d-flex flex-row justify-content-between align-items-center">
            <AddTaskButton @click="addNewTask"></AddTaskButton>
            <!-- <IconButton src="/icon/goal-icon.png" :width="32" :height="32" @click="show(showGoals)"></IconButton> -->
        </div>
        <div class="d-flex flex-column flex-grow-1">
            <!-- Pending -->
            <div class="d-flex flex-column flex-grow-1">
                <!-- Today -->
                <div class="d-flex flex-column">
                    <div class="d-flex flex-row">
                        <span v-if="isToday" class="timeframe">Today</span>
                        <span v-if="!isToday" class="timeframe">Day</span>
                        <span class="dash">-</span>
                        <span class="date">{{ date }}</span>
                    </div>
                    <ul class="item-list pending">
                        <li v-for="(vm, index) in todayPending" v-bind:key="vm.id" :style="{ 'z-index': -index }">
                            <HierarchicalListItem :viewModel="vm"
                                                  @onEdit="$emit('editIteration', $event)" />
                        </li>
                    </ul>
                </div>
                <!-- Week -->
                <div v-if="weekPending.length > 0" class="d-flex flex-column">
                    <div class="d-flex flex-row">
                        <span class="timeframe">Week</span>
                    </div>
                    <ul class="item-list pending">
                        <li v-for="(vm, index) in weekPending" v-bind:key="vm.id" :style="{ 'z-index': -index }">
                            <HierarchicalListItem :viewModel="vm"
                                                  :level="2"
                                                  @onEdit="$emit('editIteration', $event)" />
                        </li>
                    </ul>
                </div>

            </div>
            <!-- Complete  -->
            <div class="complete d-flex flex-column">
                <div class="header float-start">Completed ({{ completeCount }})</div>
                <!-- Today - Complete -->
                <div v-if="todayComplete.length > 0" class="d-flex flex-column">
                    <div class="d-flex flex-row justify-content-between">
                        <div class="d-flex flex-row">
                            <span v-if="isToday" class="timeframe">Today</span>
                            <span v-if="!isToday" class="timeframe">Day</span>
                            <span class="dash">-</span>
                            <span class="date">{{ date }}</span>
                        </div>
                        <!-- Points -->
                        <div class="d-flex flex-row">
                            <span class="points">{{ todayPoints.text }}</span>
                        </div>
                    </div>
                    <ul class="item-list">
                        <li v-for="(vm, index) in todayComplete" v-bind:key="vm.id" :style="{ 'z-index': -index }">
                            <HierarchicalListItem :viewModel="vm"
                                                  :level="2"
                                                  @onEdit="$emit('editIteration', $event)" />
                        </li>
                    </ul>
                </div>
                <!-- Week - Complete -->
                <div v-if="weekComplete.length > 0" class="d-flex flex-column">
                    <div class="d-flex flex-row">
                        <span class="timeframe">Week</span>
                    </div>
                    <ul class="item-list pending">
                        <li v-for="(vm, index) in weekComplete" v-bind:key="vm.id" :style="{ 'z-index': -index }">
                            <HierarchicalListItem :viewModel="vm"
                                                  :level="2"
                                                  @onEdit="$emit('editIteration', $event)" />
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AddTaskButton from '../component/AddTaskButton.vue'
// import IconButton from '../../../controls/button/IconButton.vue'
import HierarchicalListItem from '../component/HierarchicalListItem.vue'
import { sortAsc, sortTrueOnBottom, clone } from '../../../../../utility';
import { toShortWeekdayString, isToday, startOfDay, firstDayOfWeek, lastDayOfWeek, firstDayOfMonth, lastDayOfMonth } from '../../../../../utility/timeUtility';
import { TIMEFRAME } from '../../.././../model/constants';

export default {
    name: 'TodoPanelDefault',
    components: { AddTaskButton, HierarchicalListItem },
    props: {
        selectedDate: Date,
        showRepeat: Boolean,
        showTimeline: Boolean,
        showRecommended: Boolean,
        showHierarchy: Boolean,
    },
    data: function () {
        return {
            iterationStore: undefined,
            todoStore: undefined,
            TIMEFRAME: clone(TIMEFRAME)
        }
    },
    created: async function() {
        let todoStore = await import(`@/store/todoStore`);
        this.todoStore = todoStore.useTodoStore();
        let iterationStore = await import(`@/store/iterationStore`);
        this.iterationStore = iterationStore.useIterationStore();
        this.iterationStore.getIterationsInRange(this.startAt, this.endAt, true);
    },
    computed: {
        date() {
            return toShortWeekdayString(this.selectedDate, true);
        },
        start() { 
            // return firstDayOfMonth(this.selectedDate);
            return firstDayOfWeek(firstDayOfMonth(this.selectedDate));
        },
        end() { 
            return lastDayOfWeek(lastDayOfMonth(this.selectedDate));
        },
        isToday() {
            return isToday(this.selectedDate);
        },
        iterations() { 
            if (this.iterationStore) {
                let iterations = this.iterationStore.iterations;
                iterations = iterations.filter(iteration => {
                    return +(new Date(iteration.startAt)) >= +this.start && 
                           +(new Date(iteration.endAt)) <= +this.end &&
                           iteration.eventID == null // Not in an event
                });
                iterations = iterations.filter(iteration => iteration.idRoutine == null && iteration.routineIterationID == null);
                iterations = sortAsc(iterations, 'startAt');
                if (!this.showRepeat) {
                    iterations = iterations.filter(x => !x.isRepeat)
                }
                if (!this.showRecommended) {
                    iterations = iterations.filter(x => !x.isRecommended)
                }

                return iterations;
            } else {
                return [];
            }
        },
        todayPending() {
            if (this.iterations.length > 0) {
                return this.getViewModels(this.TIMEFRAME.DAY, false);
            } else {
                return [];
            }
        },
        todayComplete() {
            if (this.iterations.length > 0) {
                return this.getViewModels(this.TIMEFRAME.DAY, true);
            } else {
                return [];
            }
        },
        todayPoints() {
            let complete = 0;
            let incomplete = 0;
            this.todayPending.forEach(x => {
                x.iterations.forEach(y => {
                    if (y.points) {
                        incomplete += y.points
                    }
                })
            });
            this.todayComplete.forEach(x => {
                x.iterations.forEach(y => {
                    if (y.points) {
                        complete += y.points
                    }
                })
            });
            let total = complete + incomplete;
            return { complete, incomplete, total, text: `${complete}/${total}` };
        },
        weekPending() {
            if (this.iterations.length > 0) {
                return this.getViewModels(this.TIMEFRAME.WEEK, false);
            } else {
                return [];
            }
        },
        weekComplete() {
            if (this.iterations.length > 0) {
                return this.getViewModels(this.TIMEFRAME.WEEK, true);
            } else {
                return [];
            }
        },
        completeCount() {
            return this.todayComplete.length + this.weekComplete.length;
        }
    },
    methods: {
        addNewTask() {},
        getViewModels(timeframe, isComplete) {
            let _this = this;
            let start;
            let end;
            if (timeframe == this.TIMEFRAME.DAY) {
                start = this.selectedDate;
                end = this.selectedDate;
            }
            if (timeframe == this.TIMEFRAME.WEEK) {
                start = firstDayOfWeek(this.selectedDate);
                end = lastDayOfWeek(this.selectedDate);
            }
            if (timeframe == this.TIMEFRAME.MONTH) {
                start = firstDayOfMonth(this.selectedDate);
                end = lastDayOfMonth(this.selectedDate);
            }

            let repeatIDs = this.iterations.filter(x => x.isRepeat).map(x => x.repeatID);
            let viewModels = [];

            let iterations = this.iterations.filter(iteration => {
                return +(new Date(iteration.startAt)) == +start && 
                +startOfDay((new Date(iteration.endAt))) == +startOfDay(end)
            });
            if (isComplete){
                iterations = iterations.filter(iteration => iteration.attemptedAt);
            } else {
                iterations = iterations.filter(iteration => !iteration.attemptedAt);
            }
            iterations = sortTrueOnBottom(iterations, "isRecommended");
            iterations = sortTrueOnBottom(iterations, "isRepeat");
            iterations.forEach(iteration => {
                let vm = undefined;
                if (iteration.isRepeat) {
                    vm = viewModels.find(_vm => _vm.todoID == iteration.todo.id && _vm.repeatID == iteration.RepeatID);
                } else {
                    vm = viewModels.find(_vm => _vm.todoID == iteration.todo.id);
                }
                if (vm == undefined) {
                    vm = {
                        id: iteration.id,
                        timeframeID: undefined,
                        todoID: iteration.todo.id,
                        // todo: iteration.todo,
                        text: iteration.todo.text,
                        children: [],
                        iterationIDs: [],
                        // completeIDs: [],
                        // incompleteIDs: [],
                        iterations: [],
                        isChild: false,
                        repeatID: undefined,
                        isRepeatOwner: false,
                        isRepeatChild: false
                    };
                }
                viewModels.push(vm);
                vm.iterationIDs.push(iteration.id);
                vm.iterations.push(iteration);
                // if (iteration.attemptedAt) {
                //     vm.completeIDs.push(iteration.id);
                // } else {
                //     vm.incompleteIDs.push(iteration.id);
                // }

                if (iteration.isRepeat) {
                    let todo = _this.todoStore.getItem(vm.todoID);
                    let repeat = todo.repeats.find(x => x.id == iteration.repeatID);
                    vm.repeatID = repeat.id;
                    vm.timeframeID = repeat.idTimeframe;
                    vm.isRepeatOwner = (repeat.ownerID == vm.todoID);
                    vm.isRepeatChild = (repeat.parentID != null && repeatIDs.includes(repeat.id));
                }
            });

            if (_this.showHierarchy) {
                viewModels.forEach(vm => {
                    let todo = _this.todoStore.getItem(vm.todoID); 
                    todo.children.forEach(_child => {
                        let child = undefined;
                        if (vm.repeatID != undefined) {
                            child = viewModels.find(x => x.todoID == _child.id && x.repeatID == vm.repeatID);
                        } else {
                            child = viewModels.find(x => x.todoID == _child.id);
                        }
                        if (child != undefined) {
                            child.isChild = true;
                            vm.children.push(child);
                        }
                    });
                });
    
                let hierarchalVMs = viewModels.filter(x => x.isRepeatOwner || x.repeatID == undefined || !x.isChild);
                return hierarchalVMs;
            } else {
                return viewModels;
            }
        },
    },
}

</script>

<style scoped>
.toolbar {
    padding: 8px;
    z-index: 3;
    background-color: white;
}

span.timeframe {
    padding-left: 20px;
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

span.points {
    font-size: 14px;
}

ul {
    font-size: 14px;
    color: #3C4043;
    list-style: none;
    padding: 0px;
    margin: 0px;
    text-align: start;
}

.item-list {
    margin-bottom: 8px;
    z-index: 2;
}

.item-list li {
    position: relative;
}


.complete {
    /* position: absolute; */
    bottom: 0;
}

.header {
    color: #565656;
    margin-bottom: 8px;
}

.points {
    margin-right: 24px;
}

</style>