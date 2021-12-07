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
                            :taskList="day.tasks"
                            :minHeight="maxTasks * 22">
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
                <div class="hour-blocks d-flex w-100 overflow-scroll" 
                     ref="hourBlocks"
                     :style="{ 'height': 'fit-content' }"
                       @scroll="onScroll">
                    <HourBlocks v-for="(day, index) in dayModels" :key="index"
                                class="day-view flex-grow-1"
                                :style="{ 'flex-basis': 0 }"
                                :blockHeight="hour.blockHeight">
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
import { getHoursObjectArray } from "../../../../../utility/plannerUtility"

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
            iterations: [],
            maxTasks: 0,
            width: 0,
            grid: "",
            hour: {
                hours: [],
                labelWidth: 50,
                blockHeight: 48
            }
        }
    },
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
        iterations: {
            query() { return require('../../../../graphql/query/todo/QueryTodoIterations.gql')},
            error: function(error) {
                this.errorMessage = 'Error occurred while loading query'
                console.log(this.errorMessage, error);
            },
            update(data) { 
                console.log(this.$refs.weekView.clientWidth)
                let iterations = data.todoIterations;
                this.iterations = iterations;
                this.dayModels = this.iterationsToDays();
                return iterations
            }
        },
    },
    // created: function() {
    //     // window.addEventListener("resize", () => {
    //     //     this.width = this.$refs.weekView.clientWidth;
    //     // });
    // },
    methods: {
        initHours,
        initTimeline,
        iterationsToDays,
        refresh,
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

    let indexDate = date.addDays(this.selectedDate, -2);
    for (let i = 0; i < this.dayCount; i++) {
        this.days.push(indexDate);
        indexDate = date.addDays(indexDate, 1);
    }
}

function iterationsToDays() {
    let indexDate = new Date(this.selectedDate.toJSON());

    let days = [];
    this.days.forEach(_day => {
        const dateString = new Date(_day.toJSON()).toDateString();

        let iterations = this.iterations.filter(iteration => {
             const start = new Date(iteration.startAt).toDateString();
             const end = new Date(iteration.endAt).toDateString();
            return start == dateString || (!iteration.startAt && iteration.endAt && end == dateString);
        });

        let day = { 
            tasks: iterations,
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

        this.maxTasks = (iterations.length > this.maxTasks) ? iterations.length : this.maxTasks;
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