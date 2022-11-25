<template>
    <td :class="tdClass()" :style="{'padding-left': `${leftPadding()}px`}">
        <img v-if="shouldShowExpander()" 
             :src="(isExpanded) ? `/icon/icon-expanded.png` : `/icon/icon-collapsed-right.png`"
             width="14" height="14"
             @click="showItems()" />
        <img v-if="column.iconName && (text.toLowerCase() != '') && column.iconName != 'metric-icon'" 
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
        property: {
            type: Object,
            default(rawProp) {
                return (rawProp) ? rawProp : {};
            }
        },
        isExpanded: {
            type: Boolean,
            default: false
        }
    },
    inject: [ 'parentItem', 'isParent', 'isChild', 'level', 'levelPadding', 'options' ],
    data: function() {
        return {
            tdClasss: this.tdClass()
        }
    },
    computed: {
        text() { return this.property.text; }
    },
    methods: {
        iconSource() {
            if (this.isChild) {
                return'child-icon';
            } else if (this.isParent) {
                return `parent-icon`
            } else {
                return this.column.iconName
            }
        },
        showItems() {
            this.$emit('showItems', 'text');
        },
        shouldShowExpander() {
            if ((this.options.dropItems.items.parents && this.property.parents && this.property.parents.length > 0) ||
                (this.options.dropItems.items.children && this.property.children && this.property.children.length > 0) ||
                (this.options.dropItems.items.metrics && this.property.metrics && this.property.metrics.length > 0) ||
                (this.options.dropItems.items.routines && this.property.routines && this.property.routines.length > 0) ||
                (this.options.dropItems.items.todos && this.property.todos && this.property.todos.length > 0) ||
                (this.options.dropItems.items.events && this.property.events && this.property.events.length > 0) ||
                (this.options.dropItems.items.iterations && this.property.iterations && this.property.iterations.length > 0)) {
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
        },
        leftPadding() {
            let padding = this.level * this.levelPadding;
            if (!this.shouldShowExpander()) {
                padding += 14;
            }
            return padding;
        }
    }
}
</script>

<style scoped>
img {
    margin-top: -2px;
}
</style>