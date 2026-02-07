<template>
    <div v-if="goal" class="goal d-flex flex-column justify-content-between align-items-center" 
        @click.stop="onGoalClicked">
        <!-- Head -->
        <div class="d-flex flex-row justify-content-between align-items-center w-100">
            <!-- Head Left (Exander, Text, Toolbar, Progress Bar) -->
            <div class="d-flex flex-column flex-grow-1">
                <!-- Text -->
                <div class="head d-flex flex-column justify-content-between">
                    <div class="d-flex flex-row align-items-center">
                        <span v-if="!showExpander" class="caret"></span>
                        <img v-if="showExpander" class="caret"
                              :src="(isExpanded) ? `/icon/icon-expanded.png` : `/icon/icon-collapsed-right.png`"
                              width="14" height="14"
                              @click.stop="expanderClicked" />
                        <div>{{ goal.text }}</div>
                    </div>
                </div>
                <div v-if="showToolbar" class="d-flex flex-column">
                    <!-- Toolbar -->
                    <div class="toolbar d-flex flex-row align-items-center gap-1">
                        <span class="points" :class="{ selected: showTasks }"
                            @click.stop="pointsClicked">{{`${points} pts`}}</span>
                        <img class="icon" :class="{ selected: showTodos }"
                            src="/icon/todo-icon.png"
                            width="18" height="18"
                            @click.stop="todosClicked" />
                        <img class="icon" :class="{ selected: showChildren }"
                            src="/icon/child-icon.png"
                            width="18" height="18"
                            @click.stop="childrenClicked" />
                        <!-- <div class="d-flex gap-1">
                            <img class="icon" :class="{ selected: showDay }"
                                src="/icon/calendar-day.png"
                                width="16" height="16"
                                @click.stop="showDay = !showDay" />
                            <img class="icon" :class="{ selected: showWeek }"
                                src="/icon/calendar-week.png"
                                width="16" height="16"
                                @click.stop="showWeek = !showWeek" />
                            <img class="icon" :class="{ selected: showMonth }"
                                src="/icon/calendar-month.png"
                                width="16" height="16"
                                @click.stop="showMonth = !showMonth" />
                        </div> -->
                    </div>
                    <!-- Progress Bar -->
                    <div class="progress-bar d-flex flex-row justify-content-start">
                        <span class="bar"></span>
                    </div>
                </div>
            </div>
            <!-- Head Right (Context) -->
            <img class="context icon me-3" width="3" height="15"
                src="/icon/dots-vertical.png"
                @click.stop="showContext = !showContext" />

        </div>
        <!-- Context Menu -->
        <div v-if="showContext" class="context-menu d-flex flex-column">
            <button class="context-item btn" type="button"
                    @click.stop="onNewTaskClicked">
                New Task
            </button>
            <button class="context-item btn" type="button"
                    @click.stop="onNewChildClicked">
                New Child
            </button>
            <button class="context-item btn" type="button"
                    @click.stop="onSetToTimeframe(TIMEFRAME.MONTH)">
                Set to Month
            </button>
            <button class="context-item btn" type="button"
                    @click.stop="onSetToTimeframe(TIMEFRAME.WEEK)">
                Set to Week
            </button>
            <button class="context-item btn" type="button"
                    @click.stop="onSetToTimeframe(TIMEFRAME.DAY)">
                Set to Day
            </button>
        </div>
        <!-- Body/Dropdown Items -->
        <div v-if="showToolbar" class="body d-flex flex-column w-100">
            <!-- Tasks -->
            <div v-if="showTasks" class="dropdown d-flex flex-column">
                <div class="ps-2 pe-2">
                    <input v-if="newTask != undefined" class="textbox text" type="text" placeholder="Title"
                           v-model.lazy.trim="newTask" 
                           v-on:keyup.enter="createTask"
                           v-on:keyup.esc="newTask = undefined"
                           spellcheck="true"
                           autofocus
                           @click.stop/>
                </div>
                <div v-for="task in iterations" :key="task.id" 
                    class="task d-flex flex-column" :class="{ attempted: task.attemptedAt || task.completedAt }">
                    <span class="points">{{ `${task.points} pts` }}</span>
                    <span class="text">{{ task.text }}</span>
                    <span class="start">{{ startAt(task) }}</span>
                </div>
            </div>
            <!-- Todos -->
            <div v-if="showTodos" class="dropdown d-flex flex-column">
                <GoalTimeframeTodoItem v-for="gtpt in goalTimePairTodos" :key="gtpt.id"
                                    :todoID="gtpt.todoID" 
                                    :goalTimePairTodoID="gtpt.id"
                                    :completedAt="gtpt.completedAt"
                                    @click.stop/>
            </div>
            <!-- Children -->
            <div v-if="showChildren" class="dropdown d-flex flex-column" :style="{ 'padding-left': `${level * 28}px`}">
                <GoalTimeframeItem v-for="id in childIDs" :key="id"
                            :goalID="id" :timeframeID="timeframeID" :level="level + 1" />
            </div>
        </div>
    </div>
</template>

<script>
import GoalTimeframeTodoItem from './GoalTimeframeTodoItem.vue';
import { today, getTimeframeEndpoints, getMonthDateYearShort } from '../../../../../../utility/timeUtility';
import { sum } from '../../../../../../utility';
import { TIMEFRAME, TIMETYPE, INHERITANCE } from '../../../../../model/constants';

export default {
    name: 'GoalTimeframeItem',
    components: { GoalTimeframeTodoItem },
    props: {
        goalID: Number,
        timeframeID: Number,
        level: {
            type: Number,
            default: () => 1
        }
    },
    data: function () {
        return {
            TIMEFRAME,
            plannerStore: undefined,
            goalStore: undefined,
            iterationStore: undefined,
            isExpanded: false,
            showToolbar: false,
            showContext: false,
            showTasks: false,
            showTodos: false,
            showChildren: false,
            showDay: false,
            showWeek: false,
            showMonth: false,
            newTask: undefined,
        }
    },
    created: async function() {
        let plannerStore = await import(`@/store/plannerStore`);
        this.plannerStore = plannerStore.usePlannerStore();

        let goalStore = await import(`@/store/goalStore`);
        this.goalStore = goalStore.useGoalStore();

        let iterationStore = await import(`@/store/iterationStore`);
        this.iterationStore = iterationStore.useIterationStore();
    },
    computed: {
        selectedDate() {
            if (this.plannerStore) {
                return this.plannerStore.selectedDate;
            }
            return today();
        },
        goal() {
            if (this.goalStore) {
                let goal = this.goalStore.getItem(this.goalID);
                return goal;
            }
            return undefined;
        },
        showExpander() {
            return (this.childIDs.length > 0);
        },
        // points() {
        //     if (this.goalStore) {
        //         let { start, end } = getTimeframeEndpoints(this.timeframeID, this.selectedDate);
        //         let iterationIDs = this.goalStore.getIterationIDs(this.goalID);
        //         let iterations = this.iterationStore.getIterationsInRange(start, end, false);
        //         iterations = iterations.filter(task => iterationIDs.includes(task.id));
        //         let iterations_Attempted = iterations.filter(task => task.completedAt || task.attemptedAt);
        //         let iterations_WithPoints = iterations_Attempted.filter(x => x.points);
        //         let points = sum(iterations_WithPoints, 'points');

        //         return points;
        //     }
        //     return undefined;
        // },
        points() {
            let iterations_Attempted = this.iterations.filter(task => task.completedAt || task.attemptedAt);
            let points = sum(iterations_Attempted, 'points');
            return points;
        },
        goalTimePairTodos() {
            if (this.goal) {
                var index = this.goal.timePairs.findIndex(timePair => {
                    if (timePair.idTimeframe != this.timeframeID) {
                        return false;
                    }

                    let start = (timePair.startTime) ? new Date(timePair.startTime.dateTime) : undefined
                    let end = (timePair.endTime) ? new Date(timePair.endTime.dateTime) : undefined
                    if ((start && +start <= +this.selectedDate) && (end && +end >= +this.selectedDate)) {
                        return true;
                    }
                    return false;
                });
                let timePair = this.goal.timePairs[index];
                return timePair.goalTimePairTodos;
            }
            return [];
        },
        childIDs() {
            let children = [];
            if (this.goalStore) {
                children = this.goalStore.goals.filter(x => this.goal.childIDs.includes(x.id));
            }
            return children.map(x => x.id);
        },
        iterations() {
            if (this.goalStore) {
                let { start, end } = getTimeframeEndpoints(this.timeframeID, this.selectedDate);
                let iterationIDs = this.goalStore.getIterationIDs(this.goalID);
                let iterations = this.iterationStore.getIterationsInRange(start, end, false);
                iterations = iterations.filter(task => iterationIDs.includes(task.id));
                let iterations_Attempted = iterations.filter(task => task.completedAt || task.attemptedAt);
                let iterations_WithPoints = iterations_Attempted.filter(x => x.points);
                return iterations_WithPoints;
            }
            return [];
        }
    },
    methods: {
        expanderClicked,
        onGoalClicked,
        pointsClicked,
        todosClicked,
        childrenClicked,
        startAt,
        createTask,
        onNewTaskClicked,
        onNewChildClicked,
        onSetToTimeframe,
    },
}

function expanderClicked() {
    if (this.isExpanded) {
        this.isExpanded = false;
        this.showTasks = false;
        this.showTodos = false;
        this.showChildren = false;
        this.showToolbar = false;
    } else {
        this.showTasks = false;
        this.showTodos = false;
        this.showChildren = true;
        this.showToolbar = true;
        this.isExpanded = true;
    }
}

function onGoalClicked() {
    this.showToolbar = !this.showToolbar;
    if (!this.showToolbar) {
        this.isExpanded = false;
    } else if (this.showTasks || this.showTodos || this.showChildren) {
        this.isExpanded = true;
    }
}

function pointsClicked() {
    this.showTodos = false;
    this.showChildren = false;
    
    this.showTasks = !this.showTasks;
    this.isExpanded = this.showTasks;
}

function todosClicked() {
    this.showTasks = false;
    this.showChildren = false;
    
    this.showTodos = !this.showTodos;
    this.isExpanded = this.showTodos;
}

function childrenClicked() {
    this.showTasks = false;
    this.showTodos = false;

    this.showChildren = !this.showChildren;
    this.isExpanded = this.showChildren;
}

function startAt(task) {
    if (task.startAt) {
        let date = getMonthDateYearShort(task.startAt.toDate());
        return date;
    }
    return "";
}

function createTask() {
    let text = this.newTask.trim();
    if (text != "") {
        this.goalStore.createIteration(this.goalID, text, this.selectedDate);
        this.newTask = undefined;
    }
}

function onNewTaskClicked() {
    this.showTodos = false;
    this.showChildren = false;
    this.showTasks = true;
    this.isExpanded = true;
    this.showContext = false;

    this.newTask = ""
}

function onNewChildClicked() {

    this.showContext = false;
}

function onSetToTimeframe(idTimeframe) {
    let { start, end } = getTimeframeEndpoints(idTimeframe, this.selectedDate);

    let model = {
        itemId: this.goalID,
        itemType: "goal",
        idTimeframe,
        idTimeType: TIMETYPE.SCHEDULED,
        idInheritance: INHERITANCE.SELF,
        isOwner: true,
        startTime: {
            value: {
                dateTime: start,
                idEndPoint: 84,
                idMoment: 87,
                idType: 80
            }
        },
        endTime: {
            value: {
                dateTime: end,
                idEndPoint: 84,
                idMoment: 87,
                idType: 80,
            }
        }
    }

    this.goalStore.saveTimePair(model);

    this.showContext = false;
}
</script>

<style scoped>
.goal {
    min-height: 40px;
    color: #565656;
    cursor: default;
    font-size: 14px;
    line-height: 22px;
    /* padding: 8px 0px; */
}

.goal:hover {
    background-color: var(--item-hover);
}

.goal:not(.expanded) {
    padding-bottom: 0px;
}

.head {
    padding-top: 8px;
    padding-left: 5px;
}

.caret {
    margin-right: 4px;
    min-width: 14px;
    min-height: 14px;
}

.toolbar {
    margin-left: 20px;
    padding-bottom: 8px;
}

.points {
    font-size: 10px;
    line-height: 18px;
    padding: 0px 4px;
}

.points.selected {
    background-color: #D4D4D4;
    border-radius: 3px;
}

.icon.selected {
    background-color: #D4D4D4;
    border-radius: 3px;
}

.progress-bar {
    background-color: rgba(13,110,253,.25);
    height: 3px;
    margin-left: 24px;
}

.progress-bar span {
    height: 3px;
}

.bar {
    width: 50%;
    background-color: #3B99FC;
}

img.context {
    visibility: hidden;
}

.goal:hover img.context {
    visibility: visible;
}

.task {
    padding: 4px 0px 4px 56px;
}

.task .points {
    padding-left: 0px;
}

.task.attempted .text {
    text-decoration: line-through;
}

.task .start {
    font-size: 10px;
    line-height: 18px;
}
</style>