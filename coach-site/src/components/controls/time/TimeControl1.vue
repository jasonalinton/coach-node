<template>
    <div class="d-flex flex-column">
        <div class="d-flex flex-row justify-content-between">
            <label class="control-label" for="description">{{ (title) ? title : endpoint }}</label>
            <MomentSelector :moment="moment" :endpoint="endpoint" :type="type" @addTime="addTime" @removeTime="removeTime"></MomentSelector>
        </div>
        <TimeInput v-if="time" :time="time" :momentID="time.moment.id"></TimeInput>
        <!-- Recommended -->
        <!-- <div class="form-check mt-2">
            <input id="flexCheckDefault" class="form-check-input" type="checkbox" value="" v-model="time.isRecommended">
            <label class="form-check-label float-start" for="flexCheckDefault">Recommended</label>
        </div> -->
    </div>
</template>

<script>
import MomentSelector from "./MomentSelector1.vue"
import TimeInput from '../input/TimeInput1.vue'

export default {
    name: 'TimeControl1',
    components: { MomentSelector, TimeInput },
    props: {
        title: String,
        time: Object,
        endpoint: String,
        type: String
    },
    data: function () {
        return {
            moment: (this.time) ? this.time.moment : null,
        }
    },
    methods: {
        addTime: function(moment) {
            this.$emit('addTime', moment, this.endpoint, this.type)
        },
        removeTime: function() {
            this.$emit('removeTime', this.time)
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
