<template>
    <div class="briefing-section-header d-flex flex-row align-items-center" @click="$emit('toggle')">
        <div class="caret-wrapper d-flex justify-content-center align-items-center">
            <img v-if="isShown" src='/icon/caret-down.png' width="8" height="5"/>
            <img v-else src='/icon/caret-right.png' width="5" height="8"/>
        </div>
        <span class="title">{{ title }}</span>
        <span v-if="count != undefined" class="count">{{ count }}</span>
    </div>
</template>

<script>
export default {
    name: 'BriefingSectionHeader',
    props: {
        title: String,
        count: Number,
        isShown: Boolean
    },
    emits: ['toggle']
}
</script>

<style scoped>
.briefing-section-header {
    gap: 8px;
    cursor: default;
    user-select: none;
}

.caret-wrapper {
    width: 10px;
    height: 10px;
}

.title {
    font-size: 18px;
    line-height: 24px;
    font-weight: 600;
}

.briefing-section-header:hover .title {
    color: var(--form-header-hover);
}

.count {
    padding: 1px 6px;
    font-size: 12px;
    line-height: 16px;
    font-weight: 500;
    color: #3B99FC;
    background-color: var(--pill-default);
    border-radius: 8px;
}
</style>
