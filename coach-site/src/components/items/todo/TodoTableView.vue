<template>
    <!-- Loading -->
    <div v-if="loadingQueriesCount == 1">Loading...</div>
    <!-- Error -->
    <div v-else-if="errorMessage">{{ errorMessage }}</div>
    <!-- Table -->
    <div v-else-if="todoRows" class="row g-0">
        <div class="table col">
            <table class="table table-sm table-borderless" :class="{ 'sort': isSorting }">
                <thead class="sticky-top">
                    <tr>
                        <th v-if="isSorting" >Sort</th>
                        <th v-for="column in config.table.columns" :key="column.id">{{ column.name }}</th>
                        <th  v-if="config.itemType != 'metric'">
                            <button class="add-btn my-auto" type="button" @click="onAddItem">
                                <img class="m-auto" src="/icon/button/add.png" width="10" height="10"/>
                            </button>
                        </th>
                    </tr>
                </thead>
                <tbody is="transition-group" :name="`item-list`" v-cloak>
                    <tr v-for="(row, index) in todoRows" :key="row.todo.id" :class="{ selected: selectedItem && selectedItem.id == row.todo.id }" @click.prevent="$emit('itemSelected', row.todo)">
                        <td v-if="isSorting">
                            <div class="d-flex flex-row justify-content-between">
                                <button class="btn btn-sm" type="button" @click="$emit('moveUp', row, index, todoRows)">
                                    <img class="m-auto" src="/icon/icon-collapsed.png" width="10" height="14"/>
                                </button>
                                <button class="btn btn-sm" type="button" @click="$emit('moveDown', row, index, todoRows)">
                                    <img class="m-auto" src="/icon/icon-expanded.png" width="10" height="14"/>
                                </button>
                            </div>
                        </td>
                       <td v-for="column in config.table.columns" :key="column.id">
                            <div class="d-flex flex-row align-items-center">
                                <img v-if="columnData(column, row.todo) && column.icon" :src="column.icon" width="24" height="24"/>
                                {{ columnData(column, row.todo) }}
                            </div>
                        </td>
                        <td>
                            <div class="d-flex justufy-content-center">
                                <button class="delete-btn btn btn-secondary btn-sm float-end" type="button" @click.prevent.stop="onDeleteItem(row.todo)">
                                    <i class="far fa-trash-alt"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import { listToString } from '../../../../utility';
import TodoConfig from '../../../config/items/todo-config';
import ItemConfigModel from '../../../config/items/item-config'

export default {
    name: 'TodoTableView',
    props: {
        selectedItem: Object,
        todoRows: Array,
        isSorting: Boolean
    },
    data: function() {
        return {
            config: new ItemConfigModel(TodoConfig),
            loadingQueriesCount: 0,
            errorMessage: null,
        }
    },
    methods: {
        columnData,
        listToString,
        onAddItem,
        onDeleteItem
    }
}

function columnData(column, item) {
    if (column.type == 'objects') {
        return listToString(item[column.prop], 'text');
    } else if (column.type == 'length') {
        let lenth = item[column.prop].length;
        return (lenth > 0) ? lenth : '';
    } else {
        return item[column.prop];
    }
}

function onAddItem() {
    let item = this.config.newItem();
    this.$emit('itemSelected', item)
}

function onDeleteItem(item) {
    this.$emit('closeForm');
    this.config.deleteItem(item, this.$apollo);
}
</script>

<style scoped>
[v-cloak] {
    display: none;
}

.item-list-leave-to, .item-list-enter {
    opacity: 0;
    transform: translateY(30px);
}

.item-list-enter-active {
    transition: all 1s;
}

.item-list-leave-active {
    transition: all .1s;
}

table {
    padding-left: 10px;
}

.table-borderless tr {
    border-bottom: none !important; 
    vertical-align: middle;
}

.table {
    background-color: white;
    max-height: calc(100vh - 64px - 42px);
    overflow-y: scroll;
}

.table th {
    background-color: #F5F5F5;
    color: #565656;
    font-weight: 300;
    /* font-size: 12px; */
}


td, th {
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0 10px;
    font-size: 14px;
}

td {
    font-weight: 400;
}

.table th:nth-child(1) {
    min-width: 40px;
}

.table th:nth-child(2) {
    min-width: 250px;
}

.table.sort th:nth-child(2) {
    min-width: 40px;
}

.table.sort th:nth-child(3) {
    min-width: 250px;
}

.table tbody tr:hover {
    background-color:#F5F5F5;
}

.table tbody tr.selected {
    background-color: rgb(239, 246, 252);
    color: rgb(0, 90, 158);
}

.add-btn {
    width: 30px;
}

.delete-btn {
    background-color: transparent;
    border: none;
}

.delete-btn i {
    color: #D50000;
}
</style>