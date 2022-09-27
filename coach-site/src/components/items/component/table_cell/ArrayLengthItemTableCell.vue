<template>
    <td>
        <img v-if="column != undefined && column.iconName && (text != '')" 
             :src="`/icon/${column.iconName}-icon.png`" 
             width="24" height="24" />
        <span>{{ text }}</span>
    </td>
</template>

<script>
export default {
    name: "ArrayLengthItemTableCell",
    props: {
        column: Object,
        property: Array,
        text: Number
    }
}
</script>

<style>

</style>