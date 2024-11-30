<template>
    <div class="week-toolbar d-flex flex-row flex-grow-1 justify-content-evenly">
        <div v-for="(dow, index) in daysOfWeek" :key="index" 
             class="dow d-flex flex-column" :class="[getPointInTime(dow), { 'selected': isSelected(dow)}]"
             @click="selectDate(dow.dateObject)">
            <span class="day">{{ dow.dow }}</span>
            <span class="date">{{ dow.date }}</span>
        </div>
    </div>
</template>

<script>
import { usePlannerStore } from '@/store/plannerStore'
import { startOfDay, endOfDay, today, firstDayOfWeek, getDayOfWeekShort, getMonthShort,
    getDate, addDay } from '../../../../utility/timeUtility';

export default {
    name: 'CalendarWeekMobile',
    components: {  },
    props: {
        
    },
    data: function () {
        return {
            plannerStore: undefined,
        }
    },
    created: function() {
        this.plannerStore = usePlannerStore();
    },
    computed: {
        initialDate() {
            let date = today(new Date());
            this.selectDate(date);
            return date;
        },
        daysOfWeek() {
            let date = firstDayOfWeek(this.initialDate);
            let daysOfWeek = [this.getDayObject(date)];
            for (let i = 1; i < 7; i++) {
                date = addDay(date);
                daysOfWeek.push(this.getDayObject(date));
            }
            return daysOfWeek;
        },
        selectedDate() {
            return (this.plannerStore) ? this.plannerStore.selectedDate : today();
        },
        currentDate() {
            return (this.plannerStore) ? startOfDay(this.plannerStore.currentTime) : today();
        }
    },
    methods: {
        getDayObject(date) {
            return {
                dateObject: date,
                dow: getDayOfWeekShort(date),
                date: `${getMonthShort(date)} ${getDate(date)}`
            }
        },
        selectDate(date) {
            this.plannerStore.selectDate(date);
        },
        getPointInTime(dow) {
            let end = endOfDay(this.currentDate);

            if (+dow.dateObject < +this.currentDate) {
                return "past";
            } else if (+dow.dateObject == +this.currentDate) {
                return "present";
            } else if (+dow.dateObject > +end) {
                return "future";
            }
        },
        // isCurrentDate(dow) {
        //     return +dow.dateObject == +this.currentDate
        // },
        isSelected(dow) {
            return +dow.dateObject == +this.selectedDate;
        },
    },
}
</script>

<style scoped>
.week-toolbar {
    cursor: default;
    user-select: none;
}

.date {
    font-size: 10px;
}
.dow:hover {
    background-color: #F1F3F4;
}

.dow.present {
    background-color: #1A73E8;
    color: white;
    font-weight: 800;
}

.dow.selected:not(.present) {
    background-color: #D2E3FC;
}

.dow.selected:hover:not(.present) {
    background-color: #8AB4F8;
}

.dow.selected:not(.hover) {
    transition-property: background-color;
    transition-duration: .25s;
    transition-timing-function: ease-in-out;
    transition-delay: 0s;
}

.dow.selected.present:not(.previous-month) {
    background-color: #0366E9;
}
</style>