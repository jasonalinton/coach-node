<template>
    <div class="d-flex flex-column">
        <div class="d-flex flex-row justify-content-between">
            <label class="control-label" for="description">{{ (title) ? title : endpoint }}</label>
            <MomentSelector :moment="moment" :endpoint="endpoint" :type="type" @addTime="addTime" @removeTime="removeTime"></MomentSelector>
        </div>
        <TimeInput v-if="time" :time="time" :momentID="time.idMoment" @setTime="setTime"></TimeInput>
        <!-- Recommended -->
        <!-- <div class="form-check mt-2">
            <input id="flexCheckDefault" class="form-check-input" type="checkbox" value="" v-model="time.isRecommended">
            <label class="form-check-label float-start" for="flexCheckDefault">Recommended</label>
        </div> -->
    </div>
</template>

<script>
import MomentSelector from "./MomentSelector.vue"
import TimeInput from '../input/TimeInput.vue'
import { clone } from "../../../../utility"

var moments = [
    { id: 87, text: "Date" },
    { id: 88, text: "Time" },
    { id: 89, text: "DateTime" },
]

export default {
    name: 'TimeControl',
    components: { MomentSelector, TimeInput },
    props: {
        title: String,
        time: Object,
        endpoint: String,
        type: String
    },
    data: function () {
        return {
            moment: (this.time) ? clone(moments.find(x => x.id == this.time.idMoment)) : null,
        }
    },
    methods: {
        addTime: function() {
            this.$emit('addTime', this.endpoint, this.type);
        },
        setTime(time) {
            this.$emit("setTime", time, this.type, this.endpoint);
        },
        removeTime: function() {
            this.$emit('removeTime', this.time);
        },
    },
    watch: {
        time(value) { 
            this.moment = (value) ? clone(moments.find(x => x.id == this.time.idMoment)) : null;
        }
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
</style>
