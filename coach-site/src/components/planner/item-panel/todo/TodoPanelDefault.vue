<template>
    <div class="default d-flex flex-column flex-grow-1 overflow-scroll">
        <!-- Toolbar -->
        <div class="toolbar d-flex flex-row justify-content-between align-items-center">
            <AddTaskButton @click="initNewTask"></AddTaskButton>
            <!-- <IconButton src="/icon/goal-icon.png" :width="32" :height="32" @clicked="show(showGoals)"></IconButton> -->
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
                        <li v-if="newTaskText != undefined">
                            <!-- New Task -->
                            <div class="new-task d-flex flex-row align-items-center">
                                <ItemCheckbox :width="40" :height="40" @onChecked="addTask(true)"></ItemCheckbox>
                                <input id="newTask" ref="newTask" class="form-control form-control-sm" type="text" 
                                    v-model="newTaskText"
                                    v-on:keyup.enter="addTask(false)"
                                    v-on:keyup.esc="newTaskText = undefined"
                                    autofocus/>
                            </div>
                        </li>
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
import ItemCheckbox from '../component/ItemCheckbox.vue';
import HierarchicalListItem from '../component/HierarchicalListItem.vue'
import { sortAsc, sortTrueOnBottom, clone } from '../../../../../utility';
import { toShortWeekdayString, isToday, startOfDay, firstDayOfWeek, lastDayOfWeek, firstDayOfMonth, lastDayOfMonth } from '../../../../../utility/timeUtility';
import { TIMEFRAME } from '../../.././../model/constants';

export default {
    name: 'TodoPanelDefault',
    components: { AddTaskButton, ItemCheckbox, HierarchicalListItem },
    props: {
        selectedDate: Date,
    },
    data: function () {
        return {
            appStore: undefined,
            iterationStore: undefined,
            todoStore: undefined,
            TIMEFRAME: clone(TIMEFRAME),
            newTaskText: undefined
        }
    },
    created: async function() {
        let appStore = await import(`@/store/appStore`);
        this.appStore = appStore.useAppStore();
        let todoStore = await import(`@/store/todoStore`);
        this.todoStore = todoStore.useTodoStore();
        let iterationStore = await import(`@/store/iterationStore`);
        this.iterationStore = iterationStore.useIterationStore();
        this.iterationStore.getIterationsInRange(this.start, this.end, true);
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
        },
        showRepeat() {
            return (this.appStore) ? this.appStore.itemPanel.todo.showRepeat : undefined;
        },
        showTimeline() {
            return (this.appStore) ? this.appStore.itemPanel.todo.showTimeline : undefined;
        },
        showRecommended() {
            return (this.appStore) ? this.appStore.itemPanel.todo.showRecommended : undefined;
        },
        showHierarchy() {
            return (this.appStore) ? this.appStore.itemPanel.todo.showHierarchy : undefined;
        },
    },
    methods: {
        initNewTask() {
            this.newTaskText = "";
            this.$nextTick(() => this.$refs.newTask.focus());
        },
        addTask(isComplete) {
            let text = this.newTaskText.trim();
            if (text != "") {
                let date = startOfDay(this.selectedDate)
                this.todoStore.createDefaultTask(text, isComplete, date);
                this.newTaskText = undefined;
            }
        },
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
                let todo = _this.todoStore.getItem(iteration.todoID);
                if (iteration.isRepeat) {
                    vm = viewModels.find(_vm => _vm.todoID == iteration.todoID && _vm.repeatID == iteration.RepeatID);
                } else {
                    vm = viewModels.find(_vm => _vm.todoID == iteration.todoID);
                }
                if (vm == undefined) {
                    if (todo == undefined) {
                        console.log("Todo undefined")
                    }
                    vm = {
                        id: iteration.id,
                        timeframeID: undefined,
                        todoID: iteration.todoID,
                        text: todo.text,
                        children: [],
                        iterationIDs: [],
                        // completeIDs: [],
                        // incompleteIDs: [],
                        iterations: [],
                        isChild: false,
                        repeatID: undefined,
                        repeatParentID: undefined,
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
                    if (repeat)
                    {
                        vm.repeatID = repeat.id;
                        vm.repeatParentID = repeat.parentID;
                        vm.timeframeID = repeat.idTimeframe;
                        vm.isRepeatOwner = (repeat.ownerID == vm.todoID);
                        vm.isRepeatChild = (repeat.parentID != null && repeatIDs.includes(repeat.id));
                    }
                    else
                    {
                        console.log(`Not repeat for todo, ${todo.text}`)
                    }
                }
            });

            if (_this.showHierarchy) {
                viewModels.forEach(vm => {
                    let todo = _this.todoStore.getItem(vm.todoID); 
                    todo.children.forEach(_child => {
                        let children = [];
                        if (vm.repeatID != undefined) {
                            children = viewModels.filter(x => x.todoID == _child.id 
                                && (x.repeatID == vm.repeatID || x.repeatParentID == vm.repeatID));
                        } else {
                            children = viewModels.filter(x => x.todoID == _child.id);
                        }
                        children.forEach(child => {
                            child.isChild = true;
                            vm.children.push(child);
                        })
                        // if (child != undefined) {
                        // }
                    });
                });
    
                let hierarchalVMs = viewModels.filter(x => (x.isRepeatOwner && !x.isChild) || x.repeatID == undefined || !x.isChild);
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

.new-task {
    background-color: white;
    position: relative;
    z-index: 1;
    padding-right: 12px;
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