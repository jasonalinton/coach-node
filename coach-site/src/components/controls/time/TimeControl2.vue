<template>
    <div class="d-flex flex-column">
        <div class="d-flex flex-row justify-content-between">
            <label class="control-label" :class="{ 'invalid': !isValid}" for="description"
                   @click="addTime">
                {{ (title) ? title : endpoint }}</label>
        </div>
        <TimeInput v-if="time" 
                   :time="time" :momentID="momentID" :canRemove="canRemove" :isValid="isValid"
                   @setTime="setTime" @removeTime="removeTime"></TimeInput>
    </div>
</template>

<script>
import TimeInput from '../input/TimeInput2.vue'

var moments = [
    { id: 87, text: "Date" },
    { id: 88, text: "Time" },
    { id: 89, text: "DateTime" },
]

export default {
    name: 'TimeControl2',
    components: {  TimeInput },
    props: {
        title: String,
        time: String,
        momentID: Number,
        endpoint: String,
        canRemove: {
            type: Boolean,
            default: true
        },
        isValid: {
            type: Boolean,
            default: true
        }
    },
    data: function () {
        return {
            moment: moments.find(x => x.id == this.momentID).text,
        }
    },
    methods: {
        addTime: function() {
            this.$emit('addTime', this.endpoint, this.moment);
        },
        setTime(time) {
            this.$emit("setTime", time, this.endpoint, this.moment);
        },
        removeTime: function() {
            this.$emit('removeTime', this.endpoint, this.moment);
        },
    }
}
</script>

<style scoped>
label {
    font-size: 14px;
    padding: 0px;
    line-height: 24px;
    height: 24px;
}

label.invalid {
    color: red;
}
</style>
