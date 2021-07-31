<template>
    <div class="d-flex flex-column">
        <div class="d-flex flex-row justify-content-between">
            <label class="control-label" for="description">{{ endpoint }}</label>
            <MomentSelector :moment="moment" :endpoint="endpoint" @addTime="addTime" @removeTime="removeTime"></MomentSelector>
        </div>
        <TimeInput v-if="time" :time="time" :momentID="time.moment.id" @setTime="setTime"></TimeInput>
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

export default {
    name: 'TimeControl',
    components: { MomentSelector, TimeInput },
    props: {
        time: Object,
        endpoint: String
    },
    data: function () {
        return {
            moment: (this.time) ? this.time.moment : null,
        }
    },
    methods: {
        addTime(moment) {
            this.$emit('addTime', moment, this.endpoint)
        },
        removeTime() {
            this.$emit('removeTime', this.time)
        },
        setTime(dateTime) {
            this.$emit('setTime', dateTime, this.endpoint)
        },
    },
    watch: {
        time(value) { 
            if (value) {
                this.moment = this.time.moment;
            } else {
                this.moment = null;
            }
        }
    }
}
</script>

<style scoped>
label {
    font-size: 14px;
    padding: 0px 8px;
    line-height: 24px;
    height: 24px;
}
</style>
