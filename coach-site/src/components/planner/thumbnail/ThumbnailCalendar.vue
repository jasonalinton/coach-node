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
        initialDate: Date,
    },
    data: function() {
        return {
            plannerStore: undefined,
            date: this.initialDate,
            monthCount: 1,
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
        // selectDate(date) {
        //     this.plannerStore.selectDate(date);
        // },
        previousMonth() { this.date = addMonth(this.date, -1) },
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