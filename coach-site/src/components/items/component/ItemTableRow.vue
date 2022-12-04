<template>
    <tr :key="item.id"
        ref="tr"
        draggable @dragenter.prevent
        :class="position"
        @dragstart="onDragStart($event)" @dragend="onDragEnd($event)"
        @drop="onDrop($event)" @dragover="onDragOver($event)" @dragleave="onDragLeave($event)">
        <template v-for="column in columns">
            <TextItemTableCell v-if="column.type == 'Text'" :key="column.position"
                               :column="column"
                               :property="item"
                               :isExpanded="states.text"
                               @showItems="showItems" />
            <ArrayLengthItemTableCell v-if="column.type == 'ArrayLength'" :key="column.position"
                                      :column="column"
                                      :property="property(column)" />
            <NumberItemTableCell v-if="column.type == 'Number'" :key="column.position"
                                 :column="column"
                                 :property="property(column)"
                                 :showZero="(column.text == 'Order') ? false : true" />
            <StringItemTableCell v-if="column.type == 'String'" :key="column.position"
                                 :column="column"
                                 :property="property(column)"/>
            <ObjectArrayItemTableCell v-if="column.type == 'ObjectArray'" :key="column.position"
                                      :column="(column != undefined) ? column : { iconName: null }"
                                      :property="property(column)"
                                      :isExpanded="states[column.text.toLowerCase()]"
                                      @showItems="showItems"/>

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
        parent: Object,
        columns: Array,
        states: Object
    },
    inject: [ 'draggedItem' ],
    data: function() {
        return {
            itemTableStore: undefined,
            position: ""
        }
    },
    created: async function() {
        let itemTableStore = await import(`@/store/itemTableStore`);
        this.itemTableStore = itemTableStore.useItemTableStore();
    },
    methods: {
        toCamelCase,
        getPosition,
        onDragStart,
        onDragOver,
        onDrop,
        onDragLeave,
        onDragEnd,
        hasSameParent,
        property(column) {
            if (column.text == 'ID') {
                return this.item.id;
            } else if (column.text == "Time") {
                return this.item.timePairs;
            } else if (column.text == "Order") {
                if (this.parent) {
                    return this.item.positions
                        .find(x => x.parentType == this.parent.itemType && x.parentID == this.parent.id).position;
                }
            } else if (column.text == "Repeat") {
                return this.item.repeats;
            } else {
                return this.item[column.text.toLowerCase()];
            }
        },
        showItems(prop) {
            this.$emit('showItems', this.item.id, prop);
        },
    }
}

function onDragStart(ev) {
    console.log("Drag Started");
    ev.target.classList.add("drag");
    ev.dataTransfer.dropEffect = 'move';
    ev.dataTransfer.effectAllowed = 'move';

    this.itemTableStore.setDraggedProps(this.item, this.parent);

    // ev.setDragImage(canvas, 25, 25);
}

function onDragOver(ev) {
    ev.preventDefault();
    this.position = "";

    // var item = ev.currentTarget.__vue__.item;

    if (!ev.currentTarget.classList.contains("drag")) {
        ev.preventDefault();

        if (this.hasSameParent()) {
            var rect = this.$refs.tr.getBoundingClientRect();
            var offset = ev.clientY - rect.y;
            var percent = offset / rect.height;

            if ((percent < .50)) {
                this.position = "before";
            } else {
                this.position = "after";
            }
        }
    }
}

function getPosition(ev) {
    var rect = this.$refs.tr.getBoundingClientRect();
    var offset = ev.clientY - rect.y;
    var percent = offset / rect.height;
    
    if (percent < .50) {
        ev.currentTarget.classList.add("before");
    } else {
        ev.currentTarget.classList.add("after");
    }
}

function onDrop(ev) {
    ev.preventDefault();

    var dragged = this.itemTableStore.getDragged
    
    if (this.hasSameParent()) {
        this.$emit('repositionItem', dragged.item, this.item, (this.position == "before") ? true : false);
    }
    
    this.position = "";
}

function onDragLeave() {
    this.position = "";
}

function onDragEnd(ev) {
    ev.target.classList.remove("drag");
    this.position = "";

    this.itemTableStore.clearDraggedProps();
}

/* Do the dragged item and hoved item have the same parent? */
function hasSameParent() {
    var dragged = this.itemTableStore.getDragged;
    if ((this.parent == undefined && dragged.parent == undefined) ||
        ((this.parent && dragged.parent) && 
            this.parent.itemType == dragged.parent.itemType && this.parent.id == dragged.parent.id)) {
                return true;
    } else {
        return false;
    }
}
</script>

<style scoped>
.before {
    border-top: 1px solid black !important;
}

.after {
    border-bottom: 1px solid black !important;
}
</style>