<template>
    <div class="month d-flex flex-column d-flex flex-column" ref="monthView">
        <div v-for="(week, weekIndex) in weeks" :key="weekIndex" class="week d-flex flex-row" :class="{ first: weekIndex == 0 }">
            <div v-for="(day, dayIndex) in week.days" :key="dayIndex" class="day d-flex flex-column flex-fill" :class="day.pointInTime">
                <!-- Head -->
                <div class="head d-flex flex-column">
                    <!-- Date Label -->
                    <div class="date-label d-flex flex-column justify-content-between">
                        <div v-if="weekIndex == 0" class="dow">{{ day.dow }}</div> <!-- Day of Week -->
                        <div class="date-icon">{{ day.day }}</div><!-- Date -->
                    </div>
                </div>
                <TaskList :date="day.date"
                          :taskList="day.tasks">
                </TaskList>
            </div>
        </div>
    </div>
</template>

<script>
import date from "date-and-time";
import moment from "moment";
import { firstDayOfMonth, sunday, today } from "../../../../../utility/timeUtility";
import TaskList from '../TaskList.vue';

export default {
    name: 'MonthView',
    components: { TaskList },
    props: {
    },
    data: function() {
        return {
            plannerStore: undefined,
            rows: 5,
            weeks: [],
            weekModels: [],
            moment,
            date,
            today: today(),
            maxTasks: 6,
        }
    },
    beforeMount: function() {
        this.initTimeline();
    },
    created: async function() {
        let plannerStore = await import(`@/store/plannerStore`);
        this.plannerStore = plannerStore.usePlannerStore();
    },
    computed: {
        dayWidth() { return this.$refs.monthView.clientWidth / 7  },
        dayHeight() { return this.$refs.monthView.clientHeight  },
        selectedDate() {
            return (this.plannerStore) ? this.plannerStore.selectedDate : today();
        },
    },
    methods: {
        initTimeline,
    },
    watch: {
        selectedDate() {
            this.initTimeline();
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

</style>