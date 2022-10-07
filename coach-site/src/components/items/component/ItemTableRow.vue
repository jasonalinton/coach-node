<template>
    <tr :key="goal.id">
        <template v-for="column in columns">
            <TextItemTableCell v-if="column.type == 'Text'" :key="column.position"
                               :column="column"
                               :property="goal"
                               :text="text(column)"
                               @showItems="showItems" />
            <ArrayLengthItemTableCell v-if="column.type == 'ArrayLength'" :key="column.position"
                                      :column="column"
                                      :property="property(column)"
                                      :text="text(column)" />
            <NumberItemTableCell v-if="column.type == 'Number'" :key="column.position"
                                 :column="column"
                                 :property="property(column)"
                                 :text="text(column)" />
            <StringItemTableCell v-if="column.type == 'String'" :key="column.position"
                                 :column="column"
                                 :property="property(column)"
                                 :text="text(column)" />
            <ObjectArrayItemTableCell v-if="column.type == 'ObjectArray'" :key="column.position"
                               :column="(column != undefined) ? column : { iconName: null }"
                                      :property="property(column)"
                                      :text="text(column)" />

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
        goal: Object,
        row: Object,
        columns: Array
    },
    methods: {
        toCamelCase,
        property(column) {
            if (column.text == 'ID') {
                return this.goal.id;
            } else if (column.text == "Time") {
                return this.goal.timePairs;
            } else {
                return this.goal[toCamelCase(column.text)];
            }
        },
        text(column) {
            if (column.text == 'ID') {
                return this.row.id;
            } else {
                return this.row[toCamelCase(column.text)];
            }
        },
        showItems(propName) {
            this.row[`show${propName}`] = !this.row[`show${propName}`];
        },
    },
}
</script>

<style>

</style>