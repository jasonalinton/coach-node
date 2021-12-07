<template>
  
</template>

<script>
import { getDurationInMinutes } from "../../../../../utility/timeUtility"

export default {
    name: "Event",
    props: {
        _event: Object
    },
    computed: {
        duration() {
            return this.getDurationInMinutes(new Date(this._event.startAt), new Date(this._event.endAt));
        }
    },
    methods: {
        getDurationInMinutes
    }
}
</script>

<style scoped>
.event {
    border: 1px black solid;
}
</style>