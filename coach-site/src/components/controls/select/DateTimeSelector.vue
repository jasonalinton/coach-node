<template>
    <DatetimePicker :value="dateTimeString" :dayStr="daysOfWeek" :timeStr="timeStr" :btnStr="btnStr" timeType="minute" 
                    @input="onChange"/>
</template>

<script>
import { DatetimePicker } from '@livelybone/vue-datepicker';

export default {
    components: { DatetimePicker },
    props: {
        dateTime: String
    },
    data: function () {
        return {
            daysOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            timeStr: ['hour', 'min', 'sec'],
            btnStr: "Done",
        }
    },
    computed: {
        dateTimeString() {
            if (this.dateTime) {
                let date = new Date(this.dateTime);
                let dateTimeJSON = date.toJSON();
    
                let dateTimeArray = dateTimeJSON.split("T");
                let dateArray = dateTimeArray[0].split("-");
                let timeArray = dateTimeArray[1].split(":");
                return `${dateArray[0]}-${dateArray[1]}-${dateArray[2]} ${timeArray[0]}:${timeArray[1]}`;
            } else {
                return "";
            }
        }
    },
    methods: {
        onChange
    }
}

function onChange(value) {
    if (value) {
        let date = new Date(value);
        let time = date.toISOString();
        this.$emit("onChange", time);
    } else {
        this.$emit('onChange', null);
    }
}
</script>

<style scoped>
@import '../../../../node_modules/@livelybone/vue-datepicker/lib/css/index.css';
</style>