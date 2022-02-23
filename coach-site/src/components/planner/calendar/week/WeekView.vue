<template>
    <div class="d-flex h-100">
        <div class="week-view d-flex flex-column h-100 w-100" ref="weekView" :style="{ 'min-width': `${64 * dayCount}px` } ">
            <div class="header d-flex" :style="{ 'padding-left': `${hour.labelWidth}px` }">
                <div v-for="(day, index) in dayModels" :key="index"  
                    class="head day-view d-flex flex-column flex-grow-1 h-100"
                    :class="day.pointInTime" :style="{ 'flex-basis': 0 }">
                    <!-- Date Label -->
                    <div class="date-label d-flex flex-column justify-content-between">
                        <div class="dow">{{ day.dow }}</div> <!-- Day of Week -->
                        <div class="date-icon">{{ day.day }}</div><!-- Date -->
                    </div>
                    <TaskList :date="day.date"
                              :taskList="day.tasks.filter(_task => !_task.isInEvent)">
                              <!-- :minHeight="maxTasks * 22"> -->
                    </TaskList>
                </div>
            </div>
            <div class="body d-flex h-100 overflow-scroll">
                <div class="hour-labels overflow-scroll" :style="{ 'min-width': `${hour.labelWidth}px`, 'height': 'fit-content' }" ref="hourLabels">
                    <div v-for="(h, index) in hour.hours" :key="index"
                        :style="{ 'min-height': `${hour.blockHeight}px` }">
                        <div v-if="index != 0">
                            <p class="hour-label">{{ h.twelveHourString }}</p>
                        </div>
                    </div>
                </div>
                <div v-if="dayModels.length > 0" class="hour-blocks d-flex w-100 overflow-scroll" 
                     ref="hourBlocks"
                     :style="{ 'height': 'fit-content' }"
                       @scroll="onScroll">
                    <HourBlocks v-for="(day, index) in dayModels" :key="index"
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
import HourBlocks from '../event/HourBlocks.vue';
import { replaceItem, removeItem } from '../../../../../utility';
import { getHoursObjectArray } from "../../../../../utility/plannerUtility"
import { firstDayOfWeek } from '../../../../../utility/timeUtility';

export default {
    name: 'WeekView',
    components: { TaskList, HourBlocks },
    props: {
        dayCount: Number,
        selectedDate: Date,
    },
    data: function() {
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
                blockHeight: 48
            },
            events: [],
            iterations: []
        }
    },
    // computed: {
    //     events() { return this.eventsAndIterations.events },
    //     iterations() { return this.eventsAndIterations.iterations }
    // },
    beforeMount: function() {
    },
    mounted: function() {
        this.width = this.$refs.weekView.clientWidth
        let grid = "";
        for (let i = 0; i < this.dayCount; i++)
            grid += "fr "
        this.dayCount.forEach
        this.grid = grid;
        this.initTimeline();
        this.initHours();
    },
    apollo: {
        eventsAndIterations: {
            query() { return require('../../../../graphql/query/planner/QueryEventsAndIterations.gql')},
            error: function(error) {
                this.errorMessage = 'Error occurred while loading event query'
                console.log(this.errorMessage, error);
            },
            update(data) {
                // this.eventsAndIterations = data.eventsAndIterations;
                this.iterations = data.eventsAndIterations.iterations;
                this.events = data.eventsAndIterations.events;
                this.dayModels = this.iterationsToDays();
                return data.eventsAndIterations
            },
            subscribeToMore: [
                {
                    document: require('../../../../graphql/subscription/todo/IterationAdded.gql'),
                    updateQuery: (previousResult, { subscriptionData: { data: { iterationAdded }} }) => {
                        previousResult.eventsAndIterations.iterations.splice(0, 0, iterationAdded);
                        return previousResult;
                    },
                },
                {
                    document: require('../../../../graphql/subscription/todo/IterationUpdated.gql'),
                    updateQuery: (previousResult, { subscriptionData: { data: { iterationUpdated }} }) => {
                        replaceItem(iterationUpdated, previousResult.eventsAndIterations.iterations);
                        return previousResult;
                    },
                },
                {
                    document: require('../../../../graphql/subscription/todo/IterationDeleted.gql'),
                    updateQuery: (previousResult, { subscriptionData: { data: { iterationDeleted }} }) => {
                        removeItem(iterationDeleted, previousResult.eventsAndIterations.iterations);
                        return previousResult;
                    },
                },
            ]
        },
    },
    methods: {
        initHours,
        initTimeline,
        iterationsToDays,
        refresh,
        replaceItem,
        removeItem,
        getHoursObjectArray,
        onScroll
    },
    watch: {
        dayCount() { this.refresh(); },
        selectedDate() { this.refresh();  }
    }
}

function initHours() {
    this.hour.hours = this.getHoursObjectArray();
}

function initTimeline() {
    this.days = [];

    let indexDate = new Date(this.selectedDate);

    if (this.dayCount == 7) {
        indexDate = firstDayOfWeek(this.selectedDate)
    }

    for (let i = 0; i < this.dayCount; i++) {
        this.days.push(indexDate);
        indexDate = date.addDays(indexDate, 1);
    }
}

function iterationsToDays() {
    let indexDate = new Date(this.selectedDate.toJSON());
    let self = this;

    let days = [];
    this.days.forEach(_day => {
        const dateString = new Date(_day.toJSON()).toDateString();

        let iterations = self.iterations.filter(iteration => {
             const start = new Date(iteration.startAt).toDateString();
             const end = new Date(iteration.endAt).toDateString();
            return start == dateString || (!iteration.startAt && iteration.endAt && end == dateString);
        });

        let events = self.events.filter(_event => {
             const start = new Date(_event.startAt).toDateString();
            return start == dateString;
        });

        let iterations1 = events.map(_event => _event.iterations).flat();
        let todoIterations = iterations1.filter(_iteration => _iteration.routineIteration == null);
        let routineIterations = iterations1.filter(_iteration => _iteration.routineIteration != null);
        let iterations3 = routineIterations.map(_iteration => _iteration.routineIteration.todoIterations).flat();

        iterations3 = todoIterations.concat(iterations3);

        let tasksWithEventsIDs = iterations3.map(_task => _task.id);

        // console.log(todoIterations.length)
        // console.log(iterations3.length)

        // let tasksWithEventsIDs = events.map(_event => _event.iterations).flat()
        //                                .map(_task => _task.id);
        iterations.forEach(_task => {
            if (tasksWithEventsIDs.includes(_task.id))
                _task.isInEvent = true;
        })

        let day = { 
            tasks: iterations,
            events: events,
            text: date.format(_day, "ddd D"),
            dow: date.format(_day, "ddd"),
            day: date.format(_day, "D"),
            date: new Date(_day.getTime())
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

function refresh() {
    this.initTimeline();
    this.dayModels = this.iterationsToDays();
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
    font-family: 'Roboto', sans-serif;
}

.date-label {
    width: 48px;
    height: 64px;
    margin: 8px auto 4px auto;
    font-family: SF Pro Rounded, 'Roboto', sans-serif;
}

.past .dow, .future .dow {
    color: #747474;
}

.present .dow {
    color: #1A73E8;
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
    background-color: #1A73E8;
}

.future .date-icon {
    color: #565656;
}

.hour-labels::-webkit-scrollbar {
    display: none;
}

.hour-labels {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
    font-size: 10px;
}

.hour-label {
    line-height: 10px;
    position: relative;
    top: -5px;
    color: #70757A;
}
</style>