<template>
    <div class="left-panel d-flex flex-column mt-1">
        <!-- <ThumbnailPanel class="mt-3" :firstDay="firstDay" :initialDate="firstDay" @dateChange="dateChange"></ThumbnailPanel> -->
        <ThumbnailCalendar class="mt-3" :initialDate="firstDay" @dateChange="dateChange"></ThumbnailCalendar>
    </div>
</template>

<script>
// import ThumbnailPanel from '../thumbnail/ThumbnailPanel.vue'
import ThumbnailCalendar from '../thumbnail/ThumbnailCalendar.vue'
import moment from 'moment';
import { addMonth } from '../../../../utility/timeUtility';

export default {
    name: 'LeftPanel',
    // components: { ThumbnailPanel },
    components: { ThumbnailCalendar },
    data: function() {
        return {
            firstDay: addMonth(moment().date(1).hour(0).minute(0).second(0).millisecond(0).toDate(), -2)
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