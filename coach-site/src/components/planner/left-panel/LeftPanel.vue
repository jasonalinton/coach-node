<template>
    <div class="left-panel d-flex flex-column mt-1 overflow-scroll" :class="{close:!isShown}">
        <ThumbnailCalendar :initialDate="firstDay" @dateChange="dateChange" />
        <AvatarPanel/>
    </div>
</template>

<script>
import ThumbnailCalendar from '../thumbnail/ThumbnailCalendar.vue'
import moment from 'moment';
import { addMonth } from '../../../../utility/timeUtility';
import AvatarPanel from '../../avatar/AvatarPanel.vue';

export default {
    name: 'LeftPanel',
    components: { ThumbnailCalendar, AvatarPanel },
    props: {
        isShown: {
            default: true,
            type: Boolean
        },
    },
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
    min-width: 242px;
    padding-left: 18px;
}

.left-panel.close { 
    visibility: collapse;
    min-width: 0px;
}
</style>