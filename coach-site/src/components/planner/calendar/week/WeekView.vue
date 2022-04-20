<template>
    <div class="d-flex h-100">
        <div class="week-view d-flex flex-column h-100 w-100"
             ref="weekView"
             :style="{ 'min-width': `${64 * dayCount}px` }">
            <div class="header d-flex"
                 :style="{ 'padding-left': `${hour.labelWidth}px` }">
                <div v-for="(day, index) in dayModels"
                     :key="index"
                     class="head day-view d-flex flex-column flex-grow-1 h-100"
                     :class="day.pointInTime"
                     :style="{ 'flex-basis': 0 }">
                    <!-- Date Label -->
                    <div class="date-label d-flex flex-column justify-content-between">
                        <div class="dow">{{ day.dow }}</div> <!-- Day of Week -->
                        <div class="date-icon">{{ day.day }}</div><!-- Date -->
                    </div>
                    <TaskList :date="day.date"
                             :taskList="taskList(day)">
                              <!--  :minHeight="maxTasks * 22"> -->
                    </TaskList>
                </div>
            </div>
            <div class="body d-flex h-100 overflow-scroll">
                <div class="hour-labels overflow-scroll"
                     :style="{ 'min-width': `${hour.labelWidth}px`, height: 'fit-content' }">
                    <div v-for="(h, index) in hour.hours"
                         :key="index"
                         :style="{ 'min-height': `${hour.blockHeight}px` }">
                        <div v-if="index != 0">
                            <p class="hour-label">{{ h.twelveHourString }}</p>
                        </div>
                    </div>
                </div>
                <div v-if="dayModels.length > 0"
                     class="hour-blocks d-flex w-100 overflow-scroll"
                     ref="hourBlocks"
                     :style="{ height: 'fit-content' }"
                        @scroll="onScroll">
                    <HourBlocks v-for="(day, index) in dayModels"
                                :key="index"
                                class="day-view flex-grow-1"
                                :events="day.events"
                                :style="{ 'flex-basis': 0 }"
                                :blockHeight="hour.blockHeight"
                                    @selectEvent="$emit('selectEvent', $event)">
                    </HourBlocks>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import date from "date-and-time";
import TaskList from "../TaskList.vue";
import HourBlocks from "../event/HourBlocks.vue";
import { replaceItem, removeItem } from "../../../../../utility";
import { getHoursObjectArray } from "../../../../../utility/plannerUtility";
import { firstDayOfWeek, firstDayOfMonth, lastDayOfMonth, addDay } from "../../../../../utility/timeUtility";

export default {
    name: "WeekView",
    components: { TaskList, HourBlocks },
    props: {
        dayCount: Number,
        selectedDate: Date,
    },
    data: function () {
        return {
            padding: 60,
            days: [],
            dayModels: [],
            date,
            maxTasks: 0,
            width: 0,
            grid: "",
            hour: {
                hours: [],
                labelWidth: 50,
                blockHeight: 48,
            },
            events: [],
            tasks: [],
            firstDay: null,
            lastDay: null
        };
    },
    computed: {
        queryVariables() {
            return {
                startAt: firstDayOfWeek(firstDayOfMonth(this.selectedDate)),
                endAt: lastDayOfMonth(addDay(this.selectedDate, this.dayCount)),
            }
        }
    },
    beforeMount: function () {},
    mounted: function () {
        this.width = this.$refs.weekView.clientWidth;
        this.initTimeline();
        this.initHours();
    },
    apollo: {
        events: {
            query() {
                return require("../../../../graphql/query/planner/QueryEvents.gql");
            },
            variables() { return this.queryVariables },
            error: function (error) {
                this.errorMessage = "Error occurred while loading event query";
                console.log(this.errorMessage, error);
            },
            update(data) {
                this.dayModels.forEach((model) => {
                    model.events.length = 0;
                    let events = data.events.filter(
                        (_event) =>
                            model.dateString ==
                            new Date(_event.startAt).toDateString()
                    );
                    model.events.push(...events);
                });

                return data.events;
            },
            subscribeToMore: [
                {
                    document: require('../../../../graphql/subscription/planner/EventAdded.gql'),
                    variables() { return this.queryVariables },
                    updateQuery: (previousResult, { subscriptionData: { data: { eventAdded }} }) => {
                        previousResult.events.splice(0, 0, eventAdded);
                        return { events: previousResult.events };
                    },
                },
                {
                    document: require('../../../../graphql/subscription/planner/EventDeleted.gql'),
                    variables() { return this.queryVariables },
                    updateQuery: (previousResult, { subscriptionData: { data: { eventDeleted }} }) => {
                        removeItem(eventDeleted, previousResult.events);
                        return { events: previousResult.events };
                    },
                },
            ],
        },
        tasks: {
            query() {
                return require("../../../../graphql/query/planner/QueryIterations.gql");
            },
            variables() { return this.queryVariables },
            error: function (error) {
                this.errorMessage = "Error occurred while loading event query";
                console.log(this.errorMessage, error);
            },
            update(data) {
                this.dayModels.forEach((model) => {
                    let tasks = data.iterations.filter(_task => model.dateString == new Date(_task.startAt).toDateString());
                    tasks = tasks.filter(_task => _task.events.length == 0);
                    model.tasks.length = 0;
                    model.tasks.push(...tasks);
                });

                return data.iterations;
            },
            subscribeToMore: [
                {
                    document: require('../../../../graphql/subscription/planner/IterationAdded.gql'),
                    variables() { return this.queryVariables },
                    updateQuery: (previousResult, { subscriptionData: { data: { iterationAdded }} }) => {
                        previousResult.iterations.splice(0, 0, iterationAdded);
                        return { iterations: previousResult.iterations };
                    },
                },
                {
                    document: require('../../../../graphql/subscription/planner/IterationDeleted.gql'),
                    variables() { return this.queryVariables },
                    updateQuery: (previousResult, { subscriptionData: { data: { iterationDeleted }} }) => {
                        removeItem(iterationDeleted, previousResult.iterations);
                        return { iterations: previousResult.iterations };
                    },
                },
            ],
        },
    },
    methods: {
        initHours,
        initTimeline,
        iterationsToDays,
        newDay,
        replaceItem,
        removeItem,
        getHoursObjectArray,
        onScroll,
        taskList(day) {
            // If task is mapped to an event, don't add to task list
            return day.tasks.filter((_task) => !_task.isInEvent);
        },
    },
    watch: {
        dayCount() {
            this.initTimeline();
        },
        selectedDate() {
            this.initTimeline();
        },
    },
};

function initHours() {
    this.hour.hours = this.getHoursObjectArray();
}

function initTimeline() {
    let indexDate =
        this.dayCount == 7
            ? firstDayOfWeek(this.selectedDate)
            : new Date(this.selectedDate);

    this.firstDay = new Date(indexDate);
    this.days = [];
    let dayModels = [];
    for (let i = 0; i < this.dayCount; i++) {
        this.days.push(indexDate);
        dayModels.push(this.newDay(indexDate));
        indexDate = addDay(indexDate, 1);
    }

    this.lastDay = new Date(indexDate);
    this.dayModels = dayModels;
}

function newDay(day) {
    let tasks = this.tasks.filter(_task => day.toDateString() == new Date(_task.startAt).toDateString());
    tasks = tasks.filter(_task => _task.events.length == 0);
    let events = this.events.filter(_event => day.toDateString() == new Date(_event.startAt).toDateString());

    let pointInTime = "";
    if (day.getTime() < this.selectedDate.getTime()) {
        pointInTime = "past";
    } else if (day.getTime() == this.selectedDate.getTime()) {
        pointInTime = "present";
    } else if (day.getTime() > this.selectedDate.getTime()) {
        pointInTime = "future";
    }
    
    return {
        dow: date.format(day, "ddd"),
        day: date.format(day, "D"),
        date: new Date(day.getTime()),
        dateString: day.toDateString(),
        tasks,
        events,
        pointInTime
    };
}

function iterationsToDays() {
    let indexDate = new Date(this.selectedDate.toJSON());
    let self = this;

    let days = [];
    this.days.forEach((_day) => {
        const dateString = new Date(_day.toJSON()).toDateString();

        let iterations = self.iterations.filter((iteration) => {
            const start = new Date(iteration.startAt).toDateString();
            const end = new Date(iteration.endAt).toDateString();
            return (
                start == dateString ||
                (!iteration.startAt && iteration.endAt && end == dateString)
            );
        });

        let events = self.events.filter((_event) => {
            const start = new Date(_event.startAt).toDateString();
            return start == dateString;
        });

        let day = {
            tasks: iterations,
            events: events,
            text: date.format(_day, "ddd D"),
            dow: date.format(_day, "ddd"),
            day: date.format(_day, "D"),
            date: new Date(_day.getTime()),
        };
        if (_day.getTime() < indexDate.getTime()) {
            day.pointInTime = "past";
        } else if (_day.getTime() == indexDate.getTime()) {
            day.pointInTime = "present";
        } else if (_day.getTime() > indexDate.getTime()) {
            day.pointInTime = "future";
        }
        days.push(day);

        // this.maxTasks = (iterations.length > this.maxTasks) ? iterations.length : this.maxTasks;
        this.maxTasks = 5;
    });
    return days;
}

function onScroll() {
    // console.log(this.$refs.hourBlocks.scrollTop);
    // console.log("this.$refs.hourBlocks.scrollTop");
    // this.$refs.hourLabels.scrollTop = this.$refs.hourBlocks.scrollTop;
}
</script>

<style scoped>
.week-view {
    display: grid;
    grid-template-columns: auto auto auto auto auto auto auto;
}

.day-view {
    min-width: calc(100% / 7);
    border-left: 1px solid #D8D8D8;
    font-family: SF Pro Display;
}

.head {
    border-bottom: 1px solid #D8D8D8;
}

.dow {
    text-transform: uppercase;
    line-height: 14px;
    font-size: 12px;
    font-weight: 500;
    margin: 0 auto 2px auto;
    font-family: "Roboto", sans-serif;
}

.date-label {
    width: 48px;
    height: 64px;
    margin: 8px auto 4px auto;
    font-family: SF Pro Rounded, "Roboto", sans-serif;
}

.past .dow,
.future .dow {
    color: #747474;
}

.present .dow {
    color: #1a73e8;
}

.date-icon {
    width: 48px;
    height: 48px;
    border-radius: 24px;
    line-height: 48px;
    font-size: 24px;
    font-weight: 500;
    text-align: center;
}

.past .date-icon {
    color: #747474;
}

.present .date-icon {
    color: white;
    background-color: #1a73e8;
}

.future .date-icon {
    color: #565656;
}

.hour-labels::-webkit-scrollbar {
    display: none;
}

.hour-labels {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    font-size: 10px;
}

.hour-label {
    line-height: 10px;
    position: relative;
    top: -5px;
    color: #70757a;
}
</style>