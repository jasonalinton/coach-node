<template>
    <div class="week-toolbar d-flex flex-row flex-grow-1 justify-content-evenly">
        <div v-for="(dow, index) in daysOfWeek" :key="index" 
             class="day-of-week d-flex flex-column"
             @click="selectDate(dow.dateObject)">
            <span class="day">{{ dow.dow }}</span>
            <span class="date">{{ dow.date }}</span>
        </div>
    </div>
</template>

<script>
import { usePlannerStore } from '@/store/plannerStore'
import { today, firstDayOfWeek, getDayOfWeekShort, getMonthShort,
    getDate, addDay } from '../../../utility/timeUtility';

export default {
    name: 'CalendarToolbar',
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
            // if (this.plannerStore) {
            //     return this.plannerStore.selectedDate;
            // } else {
                let date = today(new Date());
                this.selectDate(date);
                return date;
            // }
        },
        daysOfWeek() {
            let date = firstDayOfWeek(this.initialDate);
            let daysOfWeek = [this.getDayObject(date)];
            for (let i = 1; i < 7; i++) {
                date = addDay(date);
                daysOfWeek.push(this.getDayObject(date));
            }
            return daysOfWeek;
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
            this.$emit('selectDate', date);
        }
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
</style>