<template>
    <input class="date-picker" type="date" :value="dateTimeString" @change="setDateTime" />
</template>

<script>
import { toDateString, toTimezoneOffset } from '../../../../utility';

export default {
    name: "DateSelector",
    props: {
        date: String
    },
    data: function () {
        return {
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
    value = value.currentTarget.value;
    if (value) {
        let timezoneOffset = this.toTimezoneOffset(new Date(value).toJSON());
        let date = value + "T00:00:00" + timezoneOffset;
        this.$emit('onChange', date);
    } else {
        this.$emit('onChange', null);
    }
}
</script>
