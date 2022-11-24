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
        property: {
            type: Array,
            default(rawProps) {
                return (rawProps) ? rawProps : [];
            }
        },
        isShowZero: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        text() { 
            let length = this.property.length;
            if (length != 0 || this.isShowZero) {
                return length;
            } else {
                return ""
            }
         }
    }
}
</script>

<style>

</style>