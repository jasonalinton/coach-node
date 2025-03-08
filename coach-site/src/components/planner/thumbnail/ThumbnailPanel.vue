<template>
    <div class="thumbnail-calendar d-flex flex-column">
        <!-- Head -->
        <div class="d-flex flex-row justify-content-between">
            <div class="d-flex flex-row">
                <div class="month">{{ month }}</div>
                <div class="year">{{ year }}</div>
            </div>
            <div class="buttons d-flex flex-row">
                <icon-button :src="`icon/previous.png`" :width="22" :height="22" @clicked="date = addMonth(date, -1)"/>
                <button class="today" type="button" @click="goToday">Today</button>
                <icon-button :src="`icon/next.png`" :width="22" :height="22" @clicked="date = addMonth(date, 1)"/>
            </div>
        </div>
        <!-- Week Labels -->
        <div class="d-flex flex-row">
            <div v-for="dayOfWeek in daysOfWeek" :key="dayOfWeek.id" class="dow pill">{{ dayOfWeek.altText }}</div>
        </div>
        <!-- Days -->
        <div v-for="(week, weekIndex) in weeks" :key="weekIndex" class="week d-flex flex-row">
            <div v-for="(day, dayIndex) in week.days" :key="dayIndex" class="day pill d-flex flex-column position-relative" 
                 :class="[day.pointInTime, (selectedDate && selectedDate.getTime() == day.date.getTime()) ? 'selected' : '', status(day.iterationCompletion)]"  @click="selectDate(day.date)">
                <span>{{ day.day }}</span>
                <span class="status position-absolute"></span>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import date from "date-and-time";
import { firstDayOfMonth, firstDayOfWeek, lastDayOfMonth, lastDayOfWeek, getDurationInDays, month_long, year_long, addMonth, today } from '../../../../utility/timeUtility';
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
    name: 'ThumbnailMonth',
    props: {
        initialDate: Date,
        selectDate: Date,
    },
    data: function() {
        return {
            date: new Date(this.initialDate),
            daysOfWeek,
            date_and_time: date,
        }
    },
    created: function() {
        
    },
    computed: {
        firstDate() { return firstDayOfWeek(firstDayOfMonth(this.date)) },
        lastDate() { return lastDayOfWeek(lastDayOfMonth(this.date)) },
        month() { return month_long(this.date) },
        year() { return  year_long(this.date) },
        weekCount() { return getDurationInDays(this.firstDate, this.lastDate) / 7 },
        weeks() { return this.getWeeks() }
    },
    methods: {
        getWeeks,
        addMonth,
        goToday
    }
}

function getWeeks() {
    let weeks = [];
    let date = this.firstDate;
    for (let i = 0; i < this.weekCount; i++) {
        let week = { days: [] };
        for (let j = 0; j < 7; j++) {
            let day = {
                dow: this.date_and_time.format(date, "ddd"),
                day: date.getDate(),
                date: new Date(date.getTime()),
                dateString: new Date(date.getTime()).toLocaleString(),
                tasks: [],
                iterationCompletion: {
                    status: 'pending'
                }
            };

            let dateMonth = moment(date).month();
            let thisDateMonth = moment(this.date).month();


            if (dateMonth < thisDateMonth) {
                day.pointInTime = "previous-month";
            } else if (today().getTime() == date.getTime()) {
                day.pointInTime = "present";
            } else if (dateMonth > thisDateMonth) {
                day.pointInTime = "next-month";
            }

            date = moment(date).add(1, 'day').toDate();
            week.days.push(day);
        }
        weeks.push(week);
    }
    return weeks;
}

function goToday() {
    this.selectedDate = this.today.toLocaleString();
    this.refreshCalendar(this.today);
    this.$emit('dateChange', this.today);
}
</script>

<style>

</style>