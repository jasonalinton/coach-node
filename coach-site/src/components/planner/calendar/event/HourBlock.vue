<template>
    <div class="hour-block position-relative" :style="{ 'height': `${blockHeight}px` }">
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
        hour: Object,
        blockHeight: Number,
        events: Array,
        zIndex: Number
    },
    computed: {
        minuteHeight() {
            return this.blockHeight / 60;
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
</style>