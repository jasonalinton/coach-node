<template>
    <td :class="tdClass()">
        <img v-if="shouldShowExpander()" 
             :src="(isExpanded) ? '/icon/icon-expanded.png' : '/icon/icon-collapsed-right.png'"
             width="14" height="14"
             @click="showItems()" />
        <img v-if="column.iconName && (text.toLowerCase() != '')" 
             :src="`/icon/${column.iconName}.png`" 
             width="24" height="24" />
        <span>{{ text }}</span>
    </td>
</template>

<script>
import { listToString } from '../../../../../utility'

export default {
    name: "ObjectArrayItemTableCell",
    props: {
        column: Object,
        property: Array,
        isExpanded: Boolean
    },
    inject: [ 'parentItem', 'isParent', 'isChild' ],
    computed: {
        text() { return listToString(this.property, "text"); }
    },
    methods: {
        showItems() {
            this.$emit('showItems', this.column.text);
        },
        shouldShowExpander() {
            if (!this.property) {
                console.log("stop")
            }
            if (this.property.length > 0) {
                return true;
            } else {
                return false;
            }
        },
        tdClass() {
            if (this.shouldShowExpander()) {
                return (this.isExpanded) ? 'column-expanded expandable' : 'column-collapsed expandable';
            } else {
                return '';
            }
        }
    }
}
</script>

<style>

</style>