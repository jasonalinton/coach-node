<template>
    <div class="left-panel d-flex flex-column mt-1">
        <ThumbnailCalendar class="mt-3" :firstDay="firstDay" @dateChange="dateChange"></ThumbnailCalendar>
    </div>
</template>

<script>
import ThumbnailCalendar from '../thumbnail/ThumbnailCalendar.vue'
import moment from 'moment';

export default {
    name: 'LeftPanel',
    components: { ThumbnailCalendar },
    data: function() {
        return {
            firstDay: moment().date(1).hour(0).minute(0).second(0).millisecond(0).toDate()
            // firstDay: moment().startOf().toDate()
        }
    },
    methods: {
        dateChange
    }
}

function dateChange(date) {
    this.$emit('dateChange', date);
}
</script>

<style scoped>
.left-panel {
    height: calc(100vh - 64px);
    min-width: 262px;
    padding: 0px 19px;
}
</style>