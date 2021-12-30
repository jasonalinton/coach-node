<template>
    <div v-if="events" class="d-flex flex-column">
        <div v-for="(hour, index) in hours" :key="index" class="text-start">
            <HourBlock :hour="hour" 
                       :blockHeight="blockHeight"
                       :events="getEventsForHour(hour)"
                       :zIndex="index * 100"
                        @selectEvent="$emit('selectEvent', $event)">
            </HourBlock>
        </div>
    </div>
</template>

<script>
import HourBlock from "./HourBlock.vue"
import { getHoursObjectArray } from "../../../../../utility/plannerUtility"
import { getHour } from '../../../../../utility/timeUtility';

export default {
    name: "HourBlocks",
    components: { HourBlock },
    props: {
        events: Array,
        blockHeight: Number,
    },
    created: function() {
        this.initHours();
    },
    data: function() {
        return {
            hours: [],
        }
    },
    methods: {
        initHours,
        getHoursObjectArray,
        getEventsForHour,
    }
}

function initHours() {
    this.hours = this.getHoursObjectArray();
}

function getEventsForHour(hourObject) {
    let events = this.events.filter(_event => {
        let hour = getHour(_event.startAt);
        return hourObject.military == hour;
    });

    return events;
}
</script>

<style>

</style>