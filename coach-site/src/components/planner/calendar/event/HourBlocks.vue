<template>
    <div class="d-flex flex-column">
        <div v-for="(hour, index) in hours" :key="index" class="text-start">
            <HourBlock v-if="index != 8" :hour="hour" 
                       :blockHeight="blockHeight"></HourBlock>
            <HourBlock v-if="index == 8" :hour="hour" 
                       :blockHeight="blockHeight"
                       :events="events"></HourBlock>
        </div>
    </div>
</template>

<script>
import HourBlock from "./HourBlock.vue"
import { getHoursObjectArray } from "../../../../../utility/plannerUtility"

export default {
    name: "HourBlocks",
    components: { HourBlock },
    props: {
        blockHeight: Number,
    },
    created: function() {
        this.initHours();
    },
    data: function() {
        return {
            hours: [],
            events: [
                { 
                    startAt: "2021-11-25T00:05:00-05:00",
                    endAt: "2021-11-25T00:30:00-05:00",
                    }
            ]
        }
    },
    methods: {
        initHours,
        getHoursObjectArray,
    }
}

function initHours() {
    this.hours = this.getHoursObjectArray();
}
</script>

<style>

</style>