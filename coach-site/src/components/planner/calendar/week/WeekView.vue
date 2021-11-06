<template>
    <!-- <div class="week-view" ref="weekView" :style="{ 'grid-template-columns': `${grid}`} "> -->
    <div class="week-view" ref="weekView" :style="{ 'min-width': `${64 * dayCount}px` } ">
        <div v-for="(day, index) in dayModels" :key="index" class="day-view flex-fill" :class="day.pointInTime"  :style="{ 'min-width': `${width / dayCount}px`, 'max-width': `${width / dayCount}px` }">
        <!-- <div v-for="(day, index) in dayModels" :key="index" class="day-view flex-fill" :class="day.pointInTime" > -->
            <!-- Head -->
            <div class="head d-flex flex-column">
                <!-- Date Label -->
                <div class="date-label d-flex flex-column justify-content-between">
                    <div class="dow">{{ day.dow }}</div> <!-- Day of Week -->
                    <div class="date-icon">{{ day.date }}</div><!-- Date -->
                </div>
                <div class="task-list d-flex flex-column" :style="{ 'min-height': `${maxTasks * 22}px` }">
                    <Task v-for="(task, index) in day.tasks" :key="index" :task="task"></Task>
                    
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import date from "date-and-time";
import Task from "../Task.vue";

export default {
    name: 'WeekView',
    components: { Task },
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
    created: function() {
        window.addEventListener("resize", () => {
            this.width = this.$refs.weekView.clientWidth;
        });
    },
    methods: {
        initTimeline,
        iterationsToDays,
        refresh
    },
    watch: {
        dayCount() { this.refresh(); },
        selectedDate() { this.refresh();  }
    }
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
            date: date.format(_day, "D"),
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
</script>

<style scoped>
.week-view {
    overflow-x: scroll;
    /* width: 100%; */
    height: 100%;
    display: grid;
    grid-template-columns: auto auto auto auto auto auto auto;
}

.day-view {
    /* min-width: 64px; */
    /* height: calc(100vh - 64px); */
    height: 100%;
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
</style>