<template>
    <div class="calendar-mobile" :class="{ week: calendarType == CALENDAR_TYPES.WEEK, month: calendarType == CALENDAR_TYPES.MONTH }">
        <CalendarWeekMobile v-if="calendarType == CALENDAR_TYPES.WEEK"/>
        <CalendarMonthMobile v-if="calendarType == CALENDAR_TYPES.MONTH"/>
    </div>
</template>

<script>
import { useAppStore } from '@/store/appStore'
import CalendarWeekMobile from './CalendarWeekMobile.vue';
import CalendarMonthMobile from './CalendarMonthMobile.vue';
import { CALENDAR_TYPES } from '../../../model/constants'


export default {
    name: 'CalendarMobile',
    components: { CalendarWeekMobile, CalendarMonthMobile },
    props: {
        
    },
    data: function () {
        return {
            appStore: undefined,
            CALENDAR_TYPES: { ...CALENDAR_TYPES }
        }
    },
    created: function() {
        this.appStore = useAppStore();
    },
    computed: {
        calendarType() {
            return (this.appStore) ? this.appStore.calendarMobile.type : undefined;
        }
    },
    methods: {
        
    },
}

</script>

<style scoped>
.calendar-mobile {
    transition: height .3s;
    height: 0px;
}

.calendar-mobile.week {
    height: 47px;
}

.calendar-mobile.month {
    height: 240px;
}
</style>