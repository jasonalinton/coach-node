<template>
    <div>
        <Datepicker v-if="type == 'Date'" :value="dateTimeString" :dayStr="daysOfWeek" :btnStr="btnStr" @input="onChange"></Datepicker>
        <Timepicker v-if="type == 'Time'" :value="dateTimeString" :timeStr="timeStr" :btnStr="btnStr" type="minute" @input="onChange"></Timepicker>
        <DatetimePicker v-if="type == 'DateTime'" :value="dateTimeString" :dayStr="daysOfWeek" :timeStr="timeStr" :btnStr="btnStr" timeType="minute" @input="onChange"></DatetimePicker>
    </div>
</template>

<script>
import { Datepicker, Timepicker, DatetimePicker } from '@livelybone/vue-datepicker';
import { toDateString, toTimeString, toDateTimeString, toTimezoneOffset } from '../../../../utility';

var momentTypes = [
    { id: 87, text: "Date" },
    { id: 88, text: "Time" },
    { id: 89, text: "DateTime" },
]

export default {
    name: 'TimeInput1',
    components: { Datepicker, Timepicker, DatetimePicker },
    props: {
        time: Object,
        momentID: Number
    },
    data: function () {
        return {
            daysOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            timeStr: ['hour', 'min', 'sec'],
            btnStr: "Done",
            momentTypes,
            dateTimeString: "",
            timezoneOffset: "",
        }
    },
    created: function() {
        this.dateTimeString = this.getDateTimeString();
        this.timezoneOffset = this.toTimezoneOffset(this.time.dateTime);
    },
    computed: {
        type() { return this.time.moment.text }
    },
    methods: {
        getMomentID,
        getDateTimeString,
        toDateString, 
        toTimeString, 
        toDateTimeString,
        toTimezoneOffset,
        onChange
    },
    watch: {
        momentID() {
            this.dateTimeString = this.getDateTimeString();
        }
    }
}

function getMomentID(momentType) {
    return this.momentTypes.find(_momentType => _momentType.text == momentType).id
}

function getDateTimeString() {
    if (this.type == "Date") {
        return this.toDateString(this.time.dateTime);
    } else if (this.type == "Time") {
        return this.toTimeString(this.time.dateTime);
    } else if (this.type == "DateTime") {
        return this.toDateTimeString(this.time.dateTime);
    }
}

function onChange(value) {
    if (this.type == "Date") {
        this.time.dateTime = value + "T00:00:00" + this.timezoneOffset;
    } else if (this.type == "Time") {
        let dateString = this.toDateString(new Date().toJSON());
        this.time.dateTime = `${dateString}T${value}:00${this.timezoneOffset}`;
    } else if (this.type == "DateTime") {
        let valueArray = value.split(" ");
        this.time.dateTime = `${valueArray[0]}T${valueArray[1]}:00${this.timezoneOffset}`;
    }
    this.dateTimeString = value;
    this.time.isUpdated = true;
}
</script>

<style scoped>
@import '../../../../node_modules/@livelybone/vue-datepicker/lib/css/index.css';

.datetime-picker .input-wrapper {
    border-radius: 0px;
}

.vue-input {
    color: #212529;
    height: 26px !important;
    padding-top: 1px !important;
}

.datetime-picker .input-wrapper:not(.accissible) {
    outline-style: none;
    -webkit-appearance: none;
    border: 1px solid rgba(0, 0, 0, .08);
    resize: none;
}

.datetime-picker .input-wrapper:not(.accissible):hover:not(:focus-within) {
    border: 1px solid rgba(0, 0, 0, .2);
}

.datetime-picker .input-wrapper:focus-within, .datetime-picker .input-wrapper:focus-within:hover  {
    border: 1px solid #039BE5;
    transition-property: border-color;
    transition-duration: 0.15s;
    transition-timing-function: ease-in-out;
    transition-delay: 0s;
    resize: vertical;
}

.input-wrapper .suffix {
    visibility: hidden;
}
</style>