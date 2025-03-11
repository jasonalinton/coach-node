<template>
    <div class="d-flex flex-column">
        <div v-for="(hour, index) in hours" :key="index" class="text-start">
            <HourBlock :hour="hour" 
                       :date="date"
                       :blockHeight="blockHeight"
                       :zIndex="index * 100">
            </HourBlock>
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
        date: Date,
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
        getHoursObjectArray
    }
}

function initHours() {
    this.hours = this.getHoursObjectArray();
}
</script>

<style>

</style>