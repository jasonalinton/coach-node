<template>
    <td :class="tdClass()">
        <img v-if="shouldShowExpander()" 
             :src="(isExpanded) ? `/icon/icon-expanded.png` : `/icon/icon-collapsed-right.png`"
             width="14" height="14"
             @click="showItems()" />
        <img v-if="column.iconName && (text.toLowerCase() != '')" 
             :src="`/icon/${iconSource()}.png`" 
             width="24" height="24" />
        <span>{{ text }}</span>
    </td>
</template>

<script>
/* Text item table cell represents the text property */
/* The whole item object is passed in, as opposed to just a property, because this property can be
   used to view mapped items */

export default {
    name: "TextItemTableCell",
    props: {
        column: Object,
        property: Object,
        text: String,
        isExpanded: Boolean
    },
    inject: [ 'parent', 'isParent', 'isChild' ],
    data: function() {
        return {
            shouldShowExpander1: this.shouldShowExpander(),
            tdClasss: this.tdClass()
        }
    },
    methods: {
        iconSource() {
            if (this.isChild) {
                return'child';
            } else if (this.isParent) {
                return `parent`
            } else {
                return this.column.iconName
            }
        },
        showItems() {
            this.$emit('showItems', 'Text');
        },
        shouldShowExpander() {
            if (this.property.parents.length > 0 ||
                this.property.children.length > 0 ||
                this.property.routines.length > 0 ||
                this.property.todos.length > 0) {
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

<style scoped>
    td:not(.expandable) {
        padding-left: 24px !important;
    }
</style>