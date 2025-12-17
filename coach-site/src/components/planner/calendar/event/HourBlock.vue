<template>
    <div class="hour-block position-relative" :style="{ 'height': `${blockHeight}px` }">
        <span v-if="isCurrentHour" class="time circle" :style="{ 'top': `${timeTop - 4}px`}"></span>
        <span v-if="isCurrentHour" class="time line" :style="{ 'top': `${timeTop}px`}"></span>
        <Event v-for="(_event, index) in events" :key="index"
               :_event="_event"
               :minuteHeight="minuteHeight"
               :zIndex="zIndex">
        </Event>
    </div>
</template>

<script>
import Event from './Event.vue'
import { startOfDay } from '../../../../../utility/timeUtility';

export default {
    components: { Event },
    name: "HourBlock",
    props: {
        date: Date,
        hour: Object,
        blockHeight: Number,
        zIndex: Number
    },
    computed: {
        timeTop() {
            return this.minuteHeight * this.minute
        },
        minuteHeight() {
            return this.blockHeight / 60;
        },
        currentTime() {
            if (this.plannerStore) {
                return this.plannerStore.currentTime;
            } else {
                return new Date();
            }
        },
        minute() {
            return this.currentTime.getMinutes();
        },
        isCurrentHour() {
            if (this.currentTime.toDateString() == this.date.toDateString() &&
                this.currentTime.getHours() == this.hour.military) {
                    return true;
            } else {
                return false;
            }
        },
        events() {
            if (this.eventStore) {
                let start = startOfDay(this.date);
                start.setHours(this.hour.military);
                let end = startOfDay(this.date);
                end.setHours(this.hour.military, 59, 59, 59);

                let events = this.eventStore.getEvents(start, end, false);
                events = events.filter(event => {
                    return (new Date(event.startAt)).getTime() >= start && (new Date(event.startAt)).getTime() <= end;
                });

                /* TEMP: Remove Moring Joy & Morning Routines */
                // events = events.filter(_event => {
                //     return _event.text != "Morning Joy" && _event.text != "Morning Routine";
                // });
                
                return events;
            } else {
                return [];
            }
        }
    },
    data: function () {
        return {
            plannerStore: undefined,
            eventStore: undefined
        };
    },
    created: async function() {
        let plannerStore = await import(`@/store/plannerStore`);
        this.plannerStore = plannerStore.usePlannerStore();

        let eventStore = await import(`@/store/eventStore`);
        this.eventStore = eventStore.useEventStore();
    },
    methods: {
        
    }
}
</script>

<style scoped>
.hour-block {
    border-bottom: solid 1px #DCDCDC;
}

.time {
    display: block;
    position: absolute;
    left: -6px;
    background-color: red;
    z-index: 1000000;
}

.time.circle {
    height: 12px;
    width: 12px;
    border-radius: 6px;
}

.time.line {
    height: 2px;
    width: 100%;
}
</style>