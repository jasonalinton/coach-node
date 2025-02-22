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
import { today, addMonth } from '../../../../utility/timeUtility'

export default {
    name: 'ThumbnailCalendar',
    components: { CalendarMonth },
    props: {
        initialDate: Date, // rename to rootDate
    },
    data: function() {
        return {
            plannerStore: undefined,
            date: this.initialDate,
            monthCount: 1,
            // rootCalendarIndex: 
                // ex. If monthCount == 3 and rootCalendarIndex = 2, 
                // the current day would be shown on the last(third) calendar
                // ex. If monthCount == 3 and rootCalendarIndex = 0, 
                // the current day would be shown on the first calendar
        }
    },
    created: async function() {
        let plannerStore = await import(`@/store/plannerStore`);
        this.plannerStore = plannerStore.usePlannerStore();
    },
    computed: {
        selectedDate() {
            return (this.plannerStore) ? this.plannerStore.selectedDate : today();
        },
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
        previousMonth() { this.date = addMonth(this.date, -1) }, // Changes root date (this might not be right)
        nextMonth() { this.date = addMonth(this.date, 1) },
        addMonth() { this.monthCount++ },
        subtractMonth() { this.monthCount-- }
    },
    watch: {
        selectedDate() {
            this.date = this.selectedDate;
        }
    }
}

</script>

<style scoped>

</style>