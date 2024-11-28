<template>
    <div class="thumbnail-calendar d-flex flex-column">
      <CalendarMonth v-for="(month, index) in months" :key="index"
                     class="mt-2"
                     :initialDate="month"
                     @previous="previousMonth"
                     @next="nextMonth" />
    </div>
</template>

<script>
import CalendarMonth from './CalendarMonth.vue'
import { addMonth } from '../../../../utility'

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
        subtractMonth() { this.monthCount-- }
    }
}

</script>

<style scoped>

</style>