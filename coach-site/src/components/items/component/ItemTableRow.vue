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
                                      :property="property(column)"
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
        columns: Array
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
        property(column) {
            if (column.text == 'ID') {
                return this.item.id;
            } else if (column.text == "Time") {
                return this.item.timePairs;
            } else if (column.text == "Order") {
                return this.item.position;
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
    let data = {
        item: this.item
    };
    data = JSON.stringify(data);

    console.log("Drag Started");
    ev.target.classList.add("drag");
    ev.dataTransfer.dropEffect = 'move';
    ev.dataTransfer.effectAllowed = 'move';
    ev.dataTransfer.setData("text", data);

    this.itemTableStore.setDraggedProps(this.item, this.parent);

    // ev.setDragImage(canvas, 25, 25);
}

function onDragOver(ev) {
    ev.preventDefault();
    this.position = "";

    var item = ev.currentTarget.__vue__.item;
    console.log(item);

    if (!ev.currentTarget.classList.contains("drag")) {
        ev.preventDefault();
        
        var rect = this.$refs.tr.getBoundingClientRect();
        
        var offset = ev.clientY - rect.y;
        var percent = offset / rect.height;

        if ((percent < .50)) {
            this.position = "before";
        } else {
            this.position = "after";
        }

        var dragged = this.itemTableStore.getDragged;

        /* Same Parent */
        if (this.parent == undefined && dragged.parent == undefined) {
            console.log("No parent");
        } else if ((this.parent && dragged.parent) && 
                    this.parent.itemType == dragged.parent.itemType && 
                    this.parent.id == dragged.parent.id) {
                     
            
            console.log("Same parent")
        }

        /* Different Parent */

        /* Child */
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
    
    let data = ev.dataTransfer.getData("text");
    data = JSON.parse(data);

    this.$emit('moveItem', data.item, this.item, (this.position == "before") ? true : false);
    
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
</script>

<style scoped>
.before {
    border-top: 1px solid black !important;
}

.after {
    border-bottom: 1px solid black !important;
}
</style>