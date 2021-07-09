<template>
    <!-- Loading -->
    <div v-if="loadingQueriesCount == 1">Loading...</div>
    <!-- Error -->
    <div v-else-if="errorMessage">{{ errorMessage }}</div>
    <!-- Table -->
    <div v-else-if="items" class="row g-0">
        <div class="table col">
            <table class="table table-striped table-hover">
                <thead class="thead-light">
                    <tr>
                        <th v-for="column in config.table.columns" :key="column.id">{{ column.name }}</th>
                        <th  v-if="config.itemType != 'metric'">
                            <button class="btn btn-primary btn-sm" type="button" @click="onAddItem">
                                <i class="fas fa-plus"></i>
                            </button>
                        </th>
                    </tr>
                </thead>
                <tbody is="transition-group" :name="`item-list`" v-cloak>
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
            update(data) { return data[this.config.query.name] },
            error: function(error) {
                this.errorMessage = 'Error occurred while loading query'
                console.log(this.errorMessage, error);
            }
        },
    },
    mounted: function() {
        this.config.subscriptions.forEach(sub => {
            this.$apollo.addSmartSubscription(sub.name, sub.object);
        });

        this.$apollo.queries.items.setOptions({
            fetchPolicy: 'cache-and-network',
            pollInterval: 2000,
        })
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

    td {
        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>