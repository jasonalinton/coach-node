<template>
    <div class="thumbnail-calendar d-flex flex-column">
        <!-- Head -->
        <div class="d-flex flex-row justify-content-between">
            <div class="d-flex flex-row">
                <div class="month">{{ month }}</div>
                <div class="year">{{ year }}</div>
            </div>
            <div class="buttons d-flex flex-row">
                <icon-button :src="`icon/previous.png`" :width="22" :height="22" @click="previous"/>
                <button class="today" type="button" @click="goToday">Today</button>
                <icon-button :src="`icon/next.png`" :width="22" :height="22" @click="next"/>
            </div>
        </div>
        <!-- Week Labels -->
        <div class="d-flex flex-row">
            <div v-for="dayOfWeek in daysOfWeek" :key="dayOfWeek.id" class="dow pill">{{ dayOfWeek.altText }}</div>
        </div>
        <!-- Days -->
        <div v-for="(week, weekIndex) in weeks" :key="weekIndex" class="week d-flex flex-row">
            <DayPillMobile v-for="(day, dayIndex) in week.days" :key="dayIndex" :day="day" :date="day.date" />
        </div>
    </div>
</template>

<script>
import date from "date-and-time";
import moment from 'moment'
import { month_long, year_long, addMonth, subtractMonth, today } from "../../../../utility";
import { addDay, firstDayOfMonth, getDurationInDays, lastDayOfMonth, lastDayOfWeek, sunday } from "../../../../utility/timeUtility";
import IconButton from '../../controls/button/IconButton.vue';
import DayPillMobile from './DayPillMobile.vue';

const daysOfWeek = [
    { id: 1, text: 'Sunday', altText: 'S'},
    { id: 2, text: 'Monday', altText: 'M'},
    { id: 3, text: 'Tuesday', altText: 'T'},
    { id: 4, text: 'Wednesday', altText: 'W'},
    { id: 5, text: 'Thursday', altText: 'T'},
    { id: 6, text: 'Friday', altText: 'F'},
    { id: 7, text: 'Saturday', altText: 'S'},
]

export default {
    components: { IconButton, DayPillMobile },
    name: 'CalendarMobileMonth',
    props: {
        
    },
    data: function() {
        return {
            plannerStore: undefined,
            initialDate: undefined,
            weeks: [],
            days: [],
            month: "",
            year: 3000,
            daysOfWeek,
            date: null,
            date_and_time: date,
            today: today(),
            count: 1
        }
    },
    created: async function() {
        let plannerStore = await import(`@/store/plannerStore`);
        this.plannerStore = plannerStore.usePlannerStore();

        this.initialDate = this.plannerStore.selectedDate;

        this.initCalendar();
    },
    computed: {
        date1() { return new Date(this.initialDate) },
        firstDate() {
            let date = firstDayOfMonth(this.date1);
            return sunday(date);
        },
        lastDate() {
            let date = addMonth(this.date1, this.count - 1);
            date = lastDayOfMonth(date);
            return lastDayOfWeek(date);
        },
        firstSunday() { 
            let _firstDayOfMonth = firstDayOfMonth(this.initialDate);
            return sunday(_firstDayOfMonth);
        },
        lastSaturday() { return addDay(this.firstSunday, this.rows * 7 - 1); },
        rows() { 
            let dayCount = getDurationInDays(this.firstDate, this.lastDate);
            return dayCount / 7;
        },
    },
    methods: {
        initCalendar,
        refreshCalendar,
        month_long,
        year_long,
        goToday,
        addMonth,
        subtractMonth,
        previous,
        next
    },
    watch: {
        initialDate() {
            this.refreshCalendar();
        } 
    }
}

function initCalendar() {
    this.days = [];

    this.month = this.month_long(this.date1);
    this.year = this.year_long(this.date1);
    
    this.weeks = [];
    let date = this.firstDate;
    for (let i = 0; i < this.rows; i++) {
        let week = { days: [] };
        for (let j = 0; j < 7; j++) {
            let day = {
                dow: this.date_and_time.format(date, "ddd"),
                day: date.getDate(),
                date: new Date(date.getTime()).toLocaleString(),
                tasks: [],
                iterationCompletion: {
                    status: 'pending'
                }
            };

            if (moment(date).month() < moment(this.date1).month()) {
                day.pointInTime = "previous-month";
            } else if (this.today.getTime() == date.getTime()) {
                day.pointInTime = "present";
            } else if (moment(date).month() > moment(this.date1).month()) {
                day.pointInTime = "next-month";
            }

            date = moment(date).add(1, 'day').toDate();
            week.days.push(day);
        }
        this.weeks.push(week);
    }
}

function refreshCalendar() {
    this.initCalendar();
}

function goToday() {
    this.plannerStore.selectDate(this.today);
    this.initialDate = this.plannerStore.selectedDate;
}

function previous() {
    this.initialDate = subtractMonth(this.initialDate);
}

function next() {
    this.initialDate = addMonth(this.initialDate);
}

</script>

<style scoped>
.thumbnail-calendar {
    background-color: white;
    width: 224px;
    /* height: 192px; */
    margin: 0 auto;
    padding: 4px;
}

.month, .year {
    font-weight: 500;
    font-family: SF Pro Rounded, 'Roboto', sans-serif;
    font-size: 14px;
    color: #343434;
}

.month {
    margin-left: 10px;
    margin-right: 4px
}

.buttons {
    margin-right: 10px;
    font-size: 14px;
}

button.today {
    font-size: 12px;
    line-height: 12px;
    padding: 0px 4px;
    height: 22px;
    /* border: 1px solid #BCBCBC; */
    border: none;
    border-radius: 4px;
    color: #343434;
    background-color: white;
    margin: 0px 2px;
}

button.today:hover {
    background-color: rgba(60, 64, 67, .08);
}
.pill {
    width: 24px;
    height: 24px;
    border-radius: 12px;
    font-weight: 500;
    font-size: 10px;
    line-height: 24px;
    text-align: center;
    margin: 2px 3px;
    user-select: none;
}
</style>