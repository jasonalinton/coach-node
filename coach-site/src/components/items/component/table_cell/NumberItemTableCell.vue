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
    },
    computed: {
        text() { return this.property }
    }
}
</script>

<style>

</style>