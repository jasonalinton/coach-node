<template>
    <div class="hour-block" :style="{ 'height': `${blockHeight}px`, 'overflow': 'hidden'}">
    </div>
</template>

<script>
export default {
    name: "HourBlock",
    props: {
        hour: Object,
        blockHeight: Number,
    }
}
</script>

<style scoped>
.hour-block {
    border-bottom: solid 1px #DCDCDC;
}
</style>