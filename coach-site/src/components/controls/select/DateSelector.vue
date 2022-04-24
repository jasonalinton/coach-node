<template>
    <Datepicker :value="dateTimeString" :dayStr="daysOfWeek" :btnStr="btnStr"
                    @input="setDateTime" />
</template>

<script>
import { Datepicker } from '@livelybone/vue-datepicker';
import { toDateString, toTimezoneOffset } from '../../../../utility';

export default {
    components: { Datepicker },
    props: {
        date: String
    },
    data: function () {
        return {
            daysOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            btnStr: "Done",
        }
    },
    computed: {
        dateTimeString() { return (this.date) ? this.toDateString(this.date) : ""; }
    },
    methods: {
        setDateTime,
        toDateString,
        toTimezoneOffset
    }
}

function setDateTime(value) {
    if (value) {
        let timezoneOffset = this.toTimezoneOffset(new Date(value).toJSON());
        let date = value + "T00:00:00" + timezoneOffset;
        this.$emit('onChange', date);
    } else {
        this.$emit('onChange', null);
    }
}
</script>

<style scoped>
@import '../../../../node_modules/@livelybone/vue-datepicker/lib/css/index.css';
</style>