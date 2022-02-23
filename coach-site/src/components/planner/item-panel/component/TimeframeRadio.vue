<template>
    <div class="btn-group" role="group" :aria-label="`moment`">
        <input type="radio" class="btn-check" :id="'day'" v-model="picked" value="day" />
        <label class="btn btn-outline-primary" :for="'day'">Day</label>

        <input type="radio" class="btn-check" :id="'week'" v-model="picked" value="week" />
        <label class="btn btn-outline-primary" :for="'week'">Week</label>

        <input type="radio" class="btn-check" :id="'month'" v-model="picked" value="month" />
        <label class="btn btn-outline-primary" :for="'month'">Month</label>
    </div>
</template>

<script>
export default {
    name: 'TimeframeRadio',
    props: {
        timeframe: String
    },
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