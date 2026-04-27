<template>
    <div class="hour-block position-relative d-flex flex-wrap align-items-baseline" :style="{ 'height': `${blockHeight}px` }">
        <span v-if="isCurrentHour" class="time circle" :style="{ 'top': `${timeTop - 4}px`}"></span>
        <span v-if="isCurrentHour" class="time line" :style="{ 'top': `${timeTop}px`}"></span>
        <template v-for="(item, index) in items">
            <Event v-if="item.type == 'event'" :key="index"
                   :style="{'width': 100/events.length + '% !important'}"
                   :_event="item.data"
                   :minuteHeight="minuteHeight"
                   :zIndex="zIndex">
            </Event>
            <Task v-if="item.type == 'iteration'" :task="item.data"></Task>
        </template>
    </div>
</template>

<script>
import Event from './Event.vue'
import Task from '../Task.vue';
import { startOfDay } from '../../../../../utility/timeUtility';
import { TIMEFRAME } from '../../../../model/constants';

export default {
    components: { Event, Task },
    name: "HourBlock",
    props: {
        date: Date,
        hour: Object,
        blockHeight: Number,
        zIndex: Number
    },
    data: function () {
        return {
            plannerStore: undefined,
            eventStore: undefined,
            iterationStore: undefined,
        };
    },
    created: async function() {
        let plannerStore = await import(`@/store/plannerStore`);
        this.plannerStore = plannerStore.usePlannerStore();

        let eventStore = await import(`@/store/eventStore`);
        this.eventStore = eventStore.useEventStore();

        let iterationStore = await import(`@/store/iterationStore`);
        this.iterationStore = iterationStore.useIterationStore();
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
        items() {
            let items = [];
            if (this.events) {
                items = items.concat(this.events.map(event => {
                    return { type: "event", data: event }
                }));
            }
            if (this.iterations) {
                items = items.concat(this.iterations.map(iteration => {
                    return { type: "iteration", data: iteration }
                }));
            }
            return items;
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
                
                return events;
            } else {
                return [];
            }
        },
        iterations() {
            if (this.iterationStore) {
                let start = startOfDay(this.date);
                start.setHours(this.hour.military);
                let end = startOfDay(this.date);
                end.setHours(this.hour.military, 59, 59, 59);

                let iterations = this.iterationStore.getIterationsInTimeframe(TIMEFRAME.DAY, this.date);
                iterations = iterations.filter(x => +x.startAt.toDate().getTime() >= start && +x.startAt.toDate().getTime() <= end)

                return iterations;
            }
            return undefined;
        },
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