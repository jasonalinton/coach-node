<template>
    <!-- Loading -->
    <div v-if="loadingQueriesCount == 1">Loading...</div>
    <!-- Error -->
    <div v-else-if="errorMessage">{{ errorMessage }}</div>
    <!-- Table -->
    <div v-else-if="items" class="row g-0">
        <div class="col">
            <table class="table table-striped table-hover">
                <thead class="thead-light">
                    <tr>
                        <th v-for="column in config.table.columns" :key="column.id">{{ column.name }}</th>
                        <th  v-if="config.itemType != 'metric'"><button type="button" @click="onAddItem">Add</button></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in items" :key="item.id" @click.prevent="$emit('itemSelected', item)">
                        <td v-for="column in config.table.columns" :key="column.id">{{ columnData(column, item) }}</td>
                        <td v-if="config.itemType != 'metric'">
                            <div class="d-flex justufy-content-center">
                                <button class="btn btn-secondary btn-sm float-end" type="button" @click.prevent.stop="onDeleteItem(item)">
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
import { listToString } from '../../../utility';
// import { clone, listToString } from '../../../utility';

export default {
    name: 'ItemTable',
    props: {
        config: Object
    },
    data: function() {
        return {
            items: [],
            loadingQueriesCount: 0,
            errorMessage: null,
        }
    },
    apollo: {
        items: {
            query() { return this.config.query.document },
            variables: function() {
                return {
                    variables: { ...this.config.query.variables }
                }
            },
            loadingKey: 'loadingQueriesCount',
            // pollInterval: 2000,
            update(data) { return data[this.config.query.name] },
            error: function(error) {
                this.errorMessage = 'Error occurred while loading query'
                console.log(this.errorMessage, error);
            }
        },
    },
    methods: {
        columnData,
        listToString,
        onAddItem,
        onDeleteItem,
    }
}

function columnData(column, item) {
    if (column.type == 'objects') {
        return listToString(item[column.prop], 'text');
    } else {
        return item[column.prop];
    }
}

function onAddItem() {
    let item = this.config.newItem();
    // let item = clone(this.config.itemModel);
    this.$emit('itemSelected', item)
}

function onDeleteItem(item) {
    this.$emit('closeForm');
    this.config.deleteItem(item, this.$apollo);
}
</script>

<style scoped>
    td {
        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>