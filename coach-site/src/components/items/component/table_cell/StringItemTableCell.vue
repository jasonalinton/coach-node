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
    name: "StringItemTableCell",
    props: {
        column: Object,
        property: String
    },
    computed: {
        text() { return this.property; }
    },
}
</script>

<style>

</style>