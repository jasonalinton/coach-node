<template>
    <!-- Mini spark on collapsed goal cards -->
    <div v-if="mini" class="spark d-flex align-items-end">
        <div v-for="(period, index) in periods" :key="index" class="spark-bar"
             :class="{ current: period.isCurrent }"
             :style="{ height: `${barHeight(period.points, 6, 16)}px` }"></div>
    </div>
    <!-- Full period bars on the expanded goal card -->
    <div v-else class="bars d-flex align-items-end">
        <div v-for="(period, index) in periods" :key="index" class="period d-flex flex-column align-items-center"
             :class="{ current: period.isCurrent }">
            <span class="value">{{ period.points }}</span>
            <div class="bar" :style="{ height: `${barHeight(period.points, 8, 36)}px` }"></div>
            <span class="label">{{ period.label }}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'RethinkPointsBars',
    props: {
        // [{ label, points, isCurrent }], oldest first
        periods: { type: Array, default: () => [] },
        mini: Boolean,
    },
    computed: {
        max() {
            return Math.max(1, ...this.periods.map(x => x.points));
        }
    },
    methods: {
        barHeight(points, min, max) {
            return Math.round(min + (max - min) * (points / this.max));
        }
    },
}
</script>

<style scoped>
.spark {
    gap: 3px;
    height: 16px;
}

.spark-bar {
    width: 5px;
    border-radius: 1.5px;
    background-color: var(--rt-border);
}

.spark-bar.current {
    background-color: var(--rt-accent);
}

.bars {
    gap: 10px;
    padding-top: 4px;
}

.period {
    flex: 1 0 0;
    gap: 4px;
    min-width: 0;
}

.value {
    font-size: 11px;
    line-height: 14px;
    color: var(--rt-text-secondary);
}

.bar {
    width: 28px;
    border-radius: 3px;
    background-color: var(--rt-border);
}

.label {
    font-size: 10px;
    line-height: 12px;
    color: var(--rt-text-muted);
}

.period.current .value {
    font-weight: 600;
    color: var(--rt-accent);
}

.period.current .bar {
    background-color: var(--rt-accent);
}
</style>
