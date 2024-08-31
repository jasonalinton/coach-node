<template>
    <div class="thumbnail-calendar d-flex flex-column">
      <CalendarMonth v-for="(month, index) in months" :key="index"
                     class="mt-2"
                     :initialDate="month"
                     :selectedDate="selectedDate"
                        @dateChange="dateChange"
                        @previous="previousMonth"
                        @next="nextMonth"></CalendarMonth>
    </div>
</template>

<script>
import CalendarMonth from './CalendarMonth.vue'
import { addMonth, today } from '../../../../utility'

export default {
    name: 'ThumbnailCalendar',
    components: { CalendarMonth },
    props: {
        initialDate: Date
    },
    data: function() {
        return {
            date: this.initialDate,
            monthCount: 1,
            selectedDate: today().toLocaleString(),
        }
    },
    created: function() {
    },
    computed: {
        months() {
            let months = [];
            months.push(new Date(this.date));
            for (let i = 1; i < this.monthCount; i++) {
                months.push(addMonth(this.date, i));
            }
            return months;
        }
    },
    methods: {
        previousMonth() { this.date = addMonth(this.date, -1) },
        nextMonth() { this.date = addMonth(this.date, 1) },
        addMonth() { this.monthCount++ },
        subtractMonth() { this.monthCount-- },
        dateChange(date) {
            this.selectedDate = date.toLocaleString();
            this.$emit('dateChange', new Date(date));
        }
    }
}

</script>

<style scoped>

</style>