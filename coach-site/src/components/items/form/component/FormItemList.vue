<template>
    <div class="d-flex flex-column">
        <span class="form-head">{{ capitalize(`${itemType}s`) }}</span>
        <!-- Quick Add Item -->
        <div class="d-flex justify-content-between mt-1 mb-1">
            <button class="add-btn my-auto" type="button" @click="addItemClicked">
                <img src="/icon/button/add.png" width="10" height="10"/>Add
            </button>
            <input class="add textbox" type="text" 
                   v-model="newItemText"
                   v-on:keyup.enter="addItem"
                   :style="{'width': 'calc(100% - 55px)'}"/>
        </div>
        <div class="d-flex flex-column">
            <div v-if="itemType == 'todo'">
                <TodoFormItem v-for="id in itemIDs" :key="id"
                              :id="id" :parentID="parentID" :parentType="parentType" 
                              :routineRepeatIDs="repeatIDs"/>
            </div>
        </div>
    </div>
</template>

<script>
import { capitalize } from '../../../../../utility';
import TodoFormItem from '../todo/TodoFormItem.vue';

export default {
    name: "FormItemList",
    components: { TodoFormItem },
    props: {
        itemType: String,
        itemIDs: Array,
        parentID: Number,
        parentType: String,
        repeatIDs: Array, // For routine parent type
    },
    data: function() {
        return {
            newItemText: "",
        }
    },
    methods: {
        capitalize,
        addItem,
        addItemClicked
    },
}

function addItem() {
    this.$emit("addItem", this.itemType, this.newItemText);
    this.newItemText = "";
}

function addItemClicked() {
    this.$emit('addItemClicked');
}
</script>

<style scoped>
.form-head {
    font-size: 20px;
    text-align: start;
    width: 100%;
    display: inline-block;
}
</style>