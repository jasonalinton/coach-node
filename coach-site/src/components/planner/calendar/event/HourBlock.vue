<template>
    <div class="hour-block position-relative" :style="{ 'height': `${blockHeight}px` }">
        <span v-if="isCurrentHour" class="time circle" :style="{ 'top': `${timeTop - 4}px`}"></span>
        <span v-if="isCurrentHour" class="time line" :style="{ 'top': `${timeTop}px`}"></span>
        <Event v-for="(_event, index) in events" :key="index"
               :_event="_event"
               :minuteHeight="minuteHeight"
               :zIndex="zIndex"
                @selectEvent="$emit('selectEvent', $event)">
        </Event>
    </div>
</template>

<script>
import Event from './Event.vue'

export default {
    components: { Event },
    name: "HourBlock",
    props: {
        dateString: String,
        hour: Object,
        blockHeight: Number,
        events: Array,
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
            if (this.currentTime.toDateString() == this.dateString &&
                this.currentTime.getHours() == this.hour.military) {
                    return true;
            } else {
                return false;
            }
        }
    },
    data: function () {
        return {
            plannerStore: undefined
        };
    },
    created: async function() {
        let plannerStore = await import(`@/store/plannerStore`);
        this.plannerStore = plannerStore.usePlannerStore();
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