<template>
    <div class="d-flex flex-column">
        <span class="form-head">{{ capitalize(title) }}</span>
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
            <div v-if="itemType == 'goal'">
                <GoalFormItem v-for="id in itemIDs" :key="id"
                              :id="id" :parentID="parentID" :parentType="parentType" 
                              :routineRepeatIDs="repeatIDs"/>
            </div>
            <div v-if="itemType == 'todo'">
                <TodoFormItem v-for="id in itemIDs" :key="id"
                              :id="id" :parentID="parentID" :parentType="parentType" 
                              :routineRepeatIDs="parentType == 'routine' ? repeatIDs : []"
                              :parentRepeatIDs="parentType == 'todo' ? repeatIDs : []"/>
            </div>
        </div>
    </div>
</template>

<script>
import { capitalize } from '../../../../../utility';
import GoalFormItem from '../goal/GoalFormItem.vue';
import TodoFormItem from '../todo/TodoFormItem.vue';

export default {
    name: "FormItemList",
    components: { GoalFormItem, TodoFormItem },
    props: {
        itemType: String,
        itemIDs: Array,
        parentID: Number,
        parentType: String,
        repeatIDs: Array, // For routine parent type
        isParent: Boolean,
        isChild: Boolean
    },
    data: function() {
        return {
            newItemText: "",
        }
    },
    computed: {
        title() {
            if (this.isParent) {
                return "Parents";
            } else if (this.isChild) {
                return "Children"
            } else {
                return `${this.itemType}s`
            }
        }
    },
    methods: {
        capitalize,
        addItem,
        addItemClicked
    },
}

function addItem() {
    let itemType = this.itemType;
    if (this.isParent) {
        itemType = "parent";
    } else if (this.isChild) {
        itemType = "child"
    } else {
        itemType = this.itemType
    }

    this.$emit("addItem", itemType, this.newItemText);
    this.newItemText = "";
}

function addItemClicked() {
    let itemType = this.itemType;
    if (this.isParent) {
        itemType = "parent";
    } else if (this.isChild) {
        itemType = "child"
    } else {
        itemType = this.itemType
    }

    this.$emit('addItemClicked', itemType);
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