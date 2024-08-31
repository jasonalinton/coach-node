<template>
    <div class="left-panel d-flex flex-column mt-1 overflow-scroll" :class="{close:!isShown}">
        <ThumbnailCalendar :initialDate="firstDay" @dateChange="dateChange" />
        <TimeframePoints :selectedDate="selectedDate" />
        <AvatarPanel/>
    </div>
</template>

<script>
import ThumbnailCalendar from '../thumbnail/ThumbnailCalendar.vue'
import TimeframePoints from '../../points/TimeframePoints.vue';
import AvatarPanel from '../../avatar/AvatarPanel.vue';
import moment from 'moment';
// import { addMonth } from '../../../../utility/timeUtility';

export default {
    name: 'LeftPanel',
    components: { ThumbnailCalendar, AvatarPanel, TimeframePoints },
    props: {
        isShown: {
            default: true,
            type: Boolean
        },
        selectedDate: Date
    },
    data: function() {
        return {
            // firstDay: addMonth(moment().date(1).hour(0).minute(0).second(0).millisecond(0).toDate(), -2) // 2 months ago
            firstDay: moment().date(1).hour(0).minute(0).second(0).millisecond(0).toDate(),
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
    min-width: 242px;
    padding-left: 18px;
}

.left-panel.close { 
    visibility: collapse;
    min-width: 0px;
}
</style>