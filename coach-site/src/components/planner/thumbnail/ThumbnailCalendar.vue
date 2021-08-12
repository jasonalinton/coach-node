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
            <div v-for="(day, dayIndex) in week.days" :key="dayIndex" class="day pill" :class="[day.pointInTime, (selectedDate == day.date) ? 'selected' : '']"  @click="selectDate(day.date)">
                {{ day.day }}
            </div>
        </div>
    </div>
</template>

<script>
import date from "date-and-time";
import moment from 'moment'
import { month_long, year_long, addMonth, subtractMonth, firstDayOfMonth, sunday, today } from "../../../../utility";
import IconButton from '../../controls/button/IconButton.vue';

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
    components: { IconButton },
    name: 'ThumbnailCalendar',
    props: {
        firstDay: Date
    },
    data: function() {
        return {
            rows: 6,
            weeks: [],
            days: [],
            month: "",
            year: 3000,
            daysOfWeek,
            date: null,
            date_and_time: date,
            today: today(),
            selectedDate: today().toLocaleString(),
        }
    },
    created: function() {
        this.date = new Date(this.firstDay.toISOString());
        this.initCalendar();
    },
    computed: {
        firstSunday() { return moment(this.date).weekday(0); }
    },
    methods: {
        initCalendar,
        // initTimeline,
        refreshCalendar,
        month_long,
        year_long,
        next,
        goToday,
        previous,
        addMonth,
        subtractMonth,
        selectDate,
    },
}


    // // let today2 = Date.today();
    // console.log(moment([2007, 0, 29]).fromNow());
    // console.log(moment().date(1).hour(0).minute(0).second(0).millisecond(0).toLocaleString());
    // console.log(moment().day(24).toLocaleString());

// function initCalendar() {
//     this.days = [];

//     let date = this.firstSunday;
//     for (let i = 0; i < this.rows * 7; i++) {
//         this.days.push(date.date());
//         date.add(1, 'day');
//     }
    
// }

function initCalendar() {
    this.days = [];

    let _firstDayOfMonth = firstDayOfMonth(this.date);
    let _firstSunday = sunday(_firstDayOfMonth);

    this.month = this.month_long(this.date);
    this.year = this.year_long(this.date);
    
    this.weeks = [];
    let date = _firstSunday;
    for (let i = 0; i < this.rows; i++) {
        let week = { days: [] };
        for (let j = 0; j < 7; j++) {
            let day = {
                dow: this.date_and_time.format(date, "ddd"),
                day: date.getDate(),
                date: new Date(date.getTime()).toLocaleString(),
                tasks: []
            };

            if (moment(date).month() < moment(this.date).month()) {
                day.pointInTime = "previous-month";
            } else if (this.today.getTime() == date.getTime()) {
                day.pointInTime = "present";
            } else if (moment(date).month() > moment(this.date).month()) {
                day.pointInTime = "next-month";
            }

            date = moment(date).add(1, 'day').toDate();
            week.days.push(day);
        }
        this.weeks.push(week);
    }
}

function refreshCalendar(date) {
    this.date = date;
    this.initCalendar();
}

function selectDate(date) {
    this.selectedDate = date;
    this.$emit('dateChange', new Date(date));
}

function next() {
    this.refreshCalendar(this.addMonth(this.date));
}

function goToday() {
    this.selectedDate = this.today.toLocaleString();
    this.refreshCalendar(this.today);
    this.$emit('dateChange', this.today);
}

function previous() {
    this.refreshCalendar(this.subtractMonth(this.date));
}
</script>

<style scoped>
.thumbnail-calendar {
    background-color: white;
    width: 224px;
    height: 192px;
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

.day {
    color: rgba(0, 0, 0, .87);
}

.day:not(:hover) {
    color: rgba(0, 0, 0, .87);
    transition-property: background-color;
    transition-duration: .25s;
    transition-timing-function: ease-in-out;
    transition-delay: 0s;
}

.day:hover {
    background-color: #F1F3F4;
}

.day.present {
    background-color: #1A73E8;
    color: white;
    font-weight: 800;
}

.day.selected:not(.present) {
    background-color: #D2E3FC;
}

.day.selected:hover:not(.present) {
    background-color: #8AB4F8;
}

.day.selected:not(.hover) {
    transition-property: background-color;
    transition-duration: .25s;
    transition-timing-function: ease-in-out;
    transition-delay: 0s;
}

.day.selected.present {
    background-color: #0366E9;
}

.pill.previous-month, .pill.next-month {
    color: rgba(0, 0, 0, .6);
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
</style>