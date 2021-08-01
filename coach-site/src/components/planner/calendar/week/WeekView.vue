<template>
    <div class="week-view d-flex flex-row d-flex flex-row" ref="weekView">
        <div v-for="(day, index) in dayModels" :key="index" class="day-view flex-fill" :class="day.pointInTime"  :style="{ 'min-width': `${weekWidth}px`, 'max-width': `${weekWidth}px` }">
            <!-- Head -->
            <div class="head d-flex flex-column">
                <!-- Date Label -->
                <div class="date-label d-flex flex-column justify-content-between">
                    <div class="dow">{{ day.dow }}</div> <!-- Day of Week -->
                    <div class="date-icon">{{ day.date }}</div><!-- Date -->
                </div>
                <div class="task-list d-flex flex-column" :style="{ 'min-height': `${maxTasks * 22}px` }">
                    <div v-for="(task, index) in day.tasks" :key="index" class="task d-flex" :class="{ complete: task.attemptedAt, incomplete: !task.attemptedAt }">
                        <!-- <img src="/icon/task-icon-white.png" width="14" height="14"/> -->
                        <img class="check" :src="`/icon/task-icon-${(task.attemptedAt)?'black':'white'}.png`" width="14" height="14"/>
                        <div>{{ task.text }}</div>
                        <img class="next button" :src="`/icon/next-${(task.attemptedAt)?'dark':'lite'}.png`" 
                             width="14" height="14"
                             @click="toNextDay(task)"/>
                        <img class="attempted button" :src="`/icon/thumbs-up-${(task.attemptedAt)?'dark':'lite'}-2.png`"
                             width="14" height="14"
                             @click="markAttempted(task)"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import date from "date-and-time";
import { rescheduleIteration, attemptIteration } from "../../../../resolvers/todo-resolvers";
import { addDay } from "../../../../../utility";

export default {
    name: 'WeekView',
    props: {
        dayCount: Number
    },
    data: function() {
        return {
            padding: 60,
            days: [],
            dayModels: [],
            date,
            iterations: [],
            maxTasks: 0,
        }
    },
    beforeMount: function() {
        this.initTimeline();
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
    computed: {
        weekWidth() { return this.$refs.weekView.clientWidth / this.dayCount }
    },
    methods: {
        initTimeline,
        iterationsToDays,
        rescheduleIteration,
        toNextDay,
        attemptIteration,
        markAttempted
    },
    watch: {
        dayCount() { 
            this.initTimeline();
            this.dayModels = this.iterationsToDays();
        }
    }
}

function initTimeline() {
    this.days = [];

    let today = new Date(new Date().toLocaleDateString());
    today = date.addDays(today, -2);
    for (let i = 0; i < this.dayCount; i++) {
        this.days.push(today);
        today = date.addDays(today, 1);
    }
}

function iterationsToDays() {
    let today = new Date(new Date().toLocaleDateString());

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
            date: date.format(_day, "D"),
        };
        if (_day.getTime() < today.getTime()) {
            day.pointInTime = "past";
        } else if (_day.getTime() == today.getTime()) {
            day.pointInTime = "present";
        } else if (_day.getTime() > today.getTime()) {
            day.pointInTime = "future";
        }
        days.push(day);

        this.maxTasks = (iterations.length > this.maxTasks) ? iterations.length : this.maxTasks;
    });
    return days;
}

function toNextDay(iteration) {
    let nextDay = addDay(new Date(iteration.startAt));
    this.rescheduleIteration(iteration.id, nextDay, this.$apollo);
}

function markAttempted(iteration) {
    // let attemptedAt = (this.selected)
    this.attemptIteration(iteration.id, new Date(iteration.startAt), this.$apollo);
}
</script>

<style scoped>
.week-view {
    overflow-x: scroll;
    width: 100%;
}

.day-view {
    min-width: 64px;
    height: calc(100vh - 64px);
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

.task { 
    background-color: #F4501F;
    color: white;
    font-weight: 600;
    max-height: 20px;
    border-radius: 3px;
    margin-bottom: 2px;
    padding: 2px 8px 4px 8px;
    line-height: 14px;
    font-size: 12px;
    user-select: none;
    width: calc(100% - 8px);
    font-family: SF Pro Display, 'Roboto', sans-serif;
    position: relative;
}

.task.incomplete:hover {
    color: rgba(255, 255, 255, .25);
}

.task.complete { 
    background-color: rgb(252, 203, 188);
    /* opacity: .5; */
    text-decoration: line-through;
    color: rgba(32,33,36,0.38);
    font-weight: 500;
}

.task .check {
    color: white;
    padding: 4px 4px 2px 0px;
}

.task div { 
    overflow: hidden;
    white-space: nowrap;
}

.button {
    position: absolute;
    border-radius: 7px;
    visibility: hidden;
    margin-top: 1px
}

.task.incomplete:hover .button {
    visibility: visible;
}

.task.incomplete:hover .button:hover {
    background-color: rgba(0, 0, 0, .5);
}

.attempted {
    right: 18px;
}

.next {
    right: 2px;
}
</style>