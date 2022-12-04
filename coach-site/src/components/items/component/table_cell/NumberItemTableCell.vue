<template>
    <td>
        <img v-if="column.iconName && (text != '')" 
             :src="`/icon/${column.iconName}.png`" 
             width="24" height="24" />
        <span>{{ text }}</span>
    </td>
</template>

<script>
export default {
    name: "NumberItemTableCell",
    props: {
        column: Object,
        property: {
            type: Number,
            default: 0
        },
        showZero: {
            type: Boolean,
            default: true
        },
    },
    computed: {
        text() { return (!this.showZero && this.property == 0) ? "" : this.property }
    }
}
</script>

<style scoped>
/* td {
    text-align: center;
} */
</style>