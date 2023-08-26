<template>
    <div class="timeframe" :class="{ selected: isSelected }"
         @click="select">
        {{ text }}
    </div>
</template>

<script>

export default {
    name: "TimeframeItem",
    props: {
        id: Number,
        text: String,
        isSelected: Boolean
    },
    methods: {
        select() {
            this.$emit("toggleTimeframe", { id: this.id, text: this.text, isSelected: !this.isSelected });
        }
    }
}
</script>

<style scoped>
.timeframe {
    border: 1px solid transparent;
}

.timeframe:hover {
    background-color: #EFF6FC;
}

.timeframe.selected {
    border: 1px solid #3B99FC;
}

.timeframe.selected:hover {
    border: 1px solid #3B99FC;
    background-color: #EFF6FC;
}
</style>