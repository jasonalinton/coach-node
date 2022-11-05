<template>
    <tr :key="item.id">
        <template v-for="column in columns">
            <TextItemTableCell v-if="column.type == 'Text'" :key="column.position"
                               :column="column"
                               :property="item"
                               @showItems="showItems" />
            <ArrayLengthItemTableCell v-if="column.type == 'ArrayLength'" :key="column.position"
                                      :column="column"
                                      :property="property(column)" />
            <NumberItemTableCell v-if="column.type == 'Number'" :key="column.position"
                                 :column="column"
                                 :property="property(column)" />
            <StringItemTableCell v-if="column.type == 'String'" :key="column.position"
                                 :column="column"
                                 :property="property(column)"/>
            <ObjectArrayItemTableCell v-if="column.type == 'ObjectArray'" :key="column.position"
                               :column="(column != undefined) ? column : { iconName: null }"
                                      :property="property(column)"/>

        </template>
    </tr>
</template>

<script>
import ArrayLengthItemTableCell from './table_cell/ArrayLengthItemTableCell.vue'
import NumberItemTableCell from './table_cell/NumberItemTableCell.vue'
import TextItemTableCell from './table_cell/TextItemTableCell.vue'
import StringItemTableCell from './table_cell/StringItemTableCell.vue'
import ObjectArrayItemTableCell from './table_cell/ObjectArrayItemTableCell.vue'
import { toCamelCase } from '../../../../utility';

export default {
    name: "ItemTableRow",
    components: { 
        ArrayLengthItemTableCell, 
        NumberItemTableCell, 
        TextItemTableCell, 
        StringItemTableCell, 
        ObjectArrayItemTableCell
    },
    props: {
        item: Object,
        columns: Array
    },
    data: function() {
        return {
        }
    },
    methods: {
        toCamelCase,
        property(column) {
            if (column.text == 'ID') {
                return this.item.id;
            } else if (column.text == "Time") {
                return this.item.timePairs;
            } else if (column.text == "Repeat") {
                return this.item.repeats;
            } else {
                return this.item[column.text.toLowerCase()];
            }
        },
        showItems(prop) {
            this.$emit('showItems', this.item.id, prop);
        },
    },
}
</script>

<style>

</style>