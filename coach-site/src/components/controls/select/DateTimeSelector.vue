<template>
    <input class="date-picker" type="datetime-local" :value="dateTimeString" @change="onChange" />
</template>

<script>
export default {
    name: "DateTimeSelector",
    props: {
        dateTime: String
    },
    data: function () {
        return {
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
    value = value.currentTarget.value;
    if (value) {
        let date = new Date(value);
        let time = date.toISOString();
        this.$emit("onChange", time);
    } else {
        this.$emit('onChange', null);
    }
}
</script>
