<template>
    <div class="d-flex flex-column">
        <CalendarToolbar class="mt-2 mb-2" @selectDate="selectDate" />
        <DashboardRoutine :_event="morningRoutineEvent" />
    </div>
</template>

<script>
import CalendarToolbar from './CalendarToolbar.vue';
import DashboardRoutine from './DashboardRoutine.vue';
import { isSameDate } from '../../../utility/timeUtility';

export default {
    name: 'DashboardView',
    components: { CalendarToolbar, DashboardRoutine },
    props: {
        
    },
    data: function () {
        return {
            eventStore: undefined,
            selectedDate: undefined
        }
    },
    created: async function() {
        let eventStore = await import(`@/store/eventStore`);
        this.eventStore = eventStore.useEventStore();
    },
    computed: {
        morningRoutineEvent() {
            if (this.eventStore && this.selectedDate) {
                let event = this.eventStore.events.find(x => {
                    let sameName = (x.text == "Morning");
                    let sameDate = (isSameDate(this.selectedDate, new Date(x.startAt)));
                    return (sameName && sameDate);
                });
                return event;
            } else {
                return undefined;
            }
        }
    },
    methods: {
        selectDate(date) {
            this.selectedDate = date;
        }
    },
}

</script>

<style scoped>

</style>