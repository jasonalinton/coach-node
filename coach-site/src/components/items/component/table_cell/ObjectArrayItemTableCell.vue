<template>
    <td :class="[ tdClass(), (isExpanded) ? 'expandable' : '']">
        <img v-if="shouldShowExpander()" 
             :class="[ 'expander', (isExpanded) ? 'expanded' : 'collapsed']"
             :style="{ 'margin-right': (!hasIcon) ? '2px' : '0px'}"
             :src="(isExpanded) ? '/icon/icon-expanded.png' : '/icon/icon-collapsed-right.png'"
             width="14" height="14"
             @click="showItems()" />
        <img v-if="hasIcon"
        
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
        property: {
            type: Array,
            default(rawProps) {
                return (rawProps) ? rawProps : [];
            }
        },
        isExpanded: {
            type: Boolean,
            default: false
        }
    },
    inject: [ 'parentItem', 'isParent', 'isChild' ],
    computed: {
        text() { return (this.property) ? listToString(this.property, "text") : ""; },
        hasIcon() { return this.column.iconName && (this.text.toLowerCase() != '') }
    },
    methods: {
        showItems() {
            this.$emit('showItems', this.column.text);
        },
        shouldShowExpander() {
            if (!this.property) {
                return false;
            } else if (this.property.length > 0) {
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
    },
}
</script>

<style scoped>
.expander.collapsed {
    visibility: hidden;
}

.expandable:hover .expander.collapsed {
    visibility: visible;
}

img {
    margin-top: -2px;
}
</style>