<template>
    <div class="d-flex flex-column"
         @mousemove="onMouseMove">
        <div v-for="(hour, index) in hours" :key="index" class="text-start">
            <component :is="useV2 ? 'HourBlock2' : 'HourBlock'"
                       :hour="hour"
                       :date="date"
                       :blockHeight="blockHeight"
                       :zIndex="index * 100">
            </component>
        </div>
    </div>
</template>

<script>
import HourBlock from "./HourBlock.vue"
import HourBlock2 from "./HourBlock2.vue"
import { getHoursObjectArray } from "../../../../../utility/plannerUtility"

export default {
    name: "HourBlocks",
    components: { HourBlock, HourBlock2 },
    props: {
        date: Date,
        blockHeight: Number,
        useV2: { type: Boolean, default: false },
    },
    created: async function() {
        this.initHours();

        let eventStore = await import(`@/store/eventStore`);
        this.eventStore = eventStore.useEventStore();
    },
    data: function() {
        return {
            hours: [],
            eventStore: undefined,
        }
    },
    methods: {
        initHours,
        getHoursObjectArray,
        onMouseMove
    }
}

function initHours() {
    this.hours = this.getHoursObjectArray();
}

function onMouseMove(ev) {
    this.eventStore.setMouseXY(ev.clientX, ev.clientY);
}
</script>

<style>

</style>