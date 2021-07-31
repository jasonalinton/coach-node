<template>
    <div class="month d-flex flex-column d-flex flex-column" ref="monthView">
        <div v-for="(week, weekIndex) in weeks" :key="weekIndex" class="week d-flex flex-row" :class="{ first: weekIndex == 0 }">
            <div v-for="(day, dayIndex) in week.days" :key="dayIndex" class="day flex-fill" :class="day.pointInTime">
                <!-- Head -->
                <div class="head d-flex flex-column">
                    <!-- Date Label -->
                    <div class="date-label d-flex flex-column justify-content-between">
                        <div v-if="weekIndex == 0" class="dow">{{ day.dow }}</div> <!-- Day of Week -->
                        <div class="date-icon">{{ day.day }}</div><!-- Date -->
                    </div>
                </div>
                <div class="task-list d-flex flex-column" :style="{ 'min-height': `${weeks[weekIndex].maxTasks * 22}px` }">
                    <div v-for="(task, taskIndex) in day.tasks" :key="taskIndex" class="task d-flex flex-fill" :class="{ complete: task.completedAt }">
                        <img :src="`/icon/task-icon-${(task.completedAt)?'black':'white'}.png`" width="14" height="14"/>
                        <div>{{ task.text }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import date from "date-and-time";
import moment from "moment";
import { firstDayOfMonth, sunday, today } from "../../../../../utility";

export default {
    name: 'MonthView',
    props: {
        selectedDate: Date
    },
    data: function() {
        return {
            rows: 5,
            weeks: [],
            weekModels: [],
            moment,
            date,
            today: today()
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
                let iterations = data.todoIterations;
                this.iterations = iterations;
                this.iterationsToDays();
                return iterations
            }
        },
    },
    computed: {
        dayWidth() { return this.$refs.monthView.clientWidth / 7  }
    },
    methods: {
        initTimeline,
        iterationsToDays,
    },
    mounted: function() {
        // An error gets thrown if pollInterval is set with the query
        this.$apollo.queries.iterations.setOptions({
            fetchPolicy: 'cache-and-network',
            pollInterval: 50000,
        })
    },
    watch: {
        selectedDate() {
            this.initTimeline();
            this.iterationsToDays();
        }
    }
}

function initTimeline() {
    let _firstDayOfMonth = firstDayOfMonth(this.selectedDate);
    let _firstSunday = sunday(_firstDayOfMonth);

    
    this.weeks = [];
    let date = _firstSunday;
    for (let i = 0; i < this.rows; i++) {
        let week = { days: [] };
        for (let j = 0; j < 7; j++) {
            let day = {
                dow: this.date.format(date, "ddd"),
                day: date.getDate(),
                date: new Date(date.getTime()),
                tasks: []
            };

            if (date.getTime() < this.selectedDate.getTime()) {
                day.pointInTime = "past";
            } else if (date.getTime() == this.selectedDate.getTime()) {
                day.pointInTime = "present";
            } else if (date.getTime() > this.selectedDate.getTime()) {
                day.pointInTime = "future";
            }

            date = this.moment(date).add(1, 'day').toDate();
            week.days.push(day);
        }
        this.weeks.push(week);
    }
}

function iterationsToDays() {

    for (let i = 0; i < this.weeks.length; i++) {
        let week = this.weeks[i];
        week.days.forEach(day => {
            const dateString = new Date(day.date.toJSON()).toDateString();

            let iterations = this.iterations.filter(iteration => {
                const start = new Date(iteration.startAt).toDateString();
                const end = new Date(iteration.endAt).toDateString();
                return start == dateString || (!iteration.startAt && iteration.endAt && end == dateString);
            });

            day.tasks= iterations;
            
            week.maxTasks = (iterations.length > this.maxTasks) ? iterations.length : this.maxTasks;
        });
    }
    return this.weeks;
}
</script>

<style scoped>
.month {
    /* width: 100%; */
    min-width: 448px;
    height: calc(100vh - 64px);
    overflow-x: scroll;
}

.date-label {
    width: 48px;
    height: 33px;
    margin: 8px auto 4px auto;
    font-family: SF Pro Rounded, 'Roboto', sans-serif;
}

.week.first .date-label {
    height: 53px;
}

.day {
    /* min-width: 64px; */
    width: calc(100% / 7);
    height: calc((100vh - 64px) / 5);
    border-left: 1px solid #D8D8D8;
    border-bottom: 1px solid #D8D8D8;
    font-family: SF Pro Display;
    padding-right: 8px;
}

.dow {
    text-transform: uppercase;
    line-height: 14px;
    font-size: 12px;
    font-weight: 500;
    margin: 0 auto 2px auto;
    font-family: 'Roboto', sans-serif;
}

.past .dow, .future .dow {
    color: #747474;
}

.present .dow {
    color: #1A73E8;
}

.date-icon {
    width: 32px;
    height: 32px;
    margin: auto;
    border-radius: 16px;
    line-height: 32px;
    font-size: 12px;
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
    font-family: SF Pro Display, 'Roboto', sans-serif;
}

.task img {
    padding: 4px 4px 2px 0px;
}

.task.complete { 
    background-color: rgb(252, 203, 188);
    text-decoration: line-through;
    color: rgba(32,33,36,0.38);
    font-weight: 500;
}

.task div { 
    overflow: hidden;
    white-space: nowrap;
}

</style>