<template>
    <div class="btn-group" role="group" :aria-label="`moment`">
        <input type="radio" class="btn-check" :id="`day-${container}`" v-model="picked" value="day" />
        <label class="btn btn-outline-primary" :for="`day-${container}`">Day</label>

        <input type="radio" class="btn-check" :id="`week-${container}`" v-model="picked" value="week" />
        <label class="btn btn-outline-primary" :for="`week-${container}`">Week</label>

        <input type="radio" class="btn-check" :id="`month-${container}`" v-model="picked" value="month" />
        <label class="btn btn-outline-primary" :for="`month-${container}`">Month</label>

        <input type="radio" class="btn-check" :id="`year-${container}`" v-model="picked" value="year" />
        <label class="btn btn-outline-primary" :for="`year-${container}`">Year</label>
    </div>
</template>

<script>
export default {
    name: 'TimeframeRadio',
    props: {
        timeframe: String,
        container: String
    },
    // data: function() {
    //     return {

    //      }
    // },
    computed: {
        picked: {
            get() { return this.timeframe },
            set(value) { this.$emit('timeframeSelected', value) }
        }
    },
}
</script>

<style scoped>
.btn-group {
    height: 24px;
}

.btn-group label {
    font-size: 14px;
    line-height: 24px;
    padding: 0px 4px;
    height: 22px;
    border: none;
    border-radius: initial;
    color: #565656;
}

.btn, .btn:focus {
    outline-style: none;
    box-shadow: none !important;
}

.btn-check:checked + .btn-outline-primary {
    color: #0D6EFD;
    background-color: #DEECF9;
}

.btn:hover {
    color: #343434;
    background-color: rgba(60, 64, 67, .08);
}
</style>