<template>
    <div class="hour-block" :style="{ 'height': `${blockHeight}px`, 'overflow': 'hidden'}">
        <div v-for="(_event, index) in events" :key="index"
             class="event"
             :style="{ 'margin-top': marginTop(_event), 'height': `${duration(_event)}px`}">

        </div>
    </div>
</template>

<script>
import { getDurationInMinutes } from "../../../../../utility/timeUtility"

export default {
    name: "HourBlock",
    props: {
        hour: Object,
        blockHeight: Number,
        events: Array
    },
    computed: {
        minuteHeight() {
            return this.blockHeight / 60;
        },
    },
    methods: {
        marginTop,
        duration(_event) {
            return getDurationInMinutes(new Date(_event.startAt), new Date(_event.endAt));
        }
    }
}

function marginTop(_event) {
    let datetime = new Date(_event.startAt)
    let min = datetime.getMinutes();
    let marginTop = this.minuteHeight * min;
    return marginTop;
}
</script>

<style scoped>
.hour-block {
    border-bottom: solid 1px #DCDCDC;
}

.event {
    border: 1px black solid;
}
</style>