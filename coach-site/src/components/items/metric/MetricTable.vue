<template>
    <!-- Loading -->
    <div v-if="loadingQueriesCount == 1">Loading...</div>
    <!-- Error -->
    <div v-else-if="errorMessage">{{ errorMessage }}</div>
    <!-- Table -->
    <div v-else-if="items" class="row g-0">
        <div class="table col">
            <table class="table table-sm table-borderless">
                <thead class="sticky-top">
                    <tr>
                        <th v-for="column in config.table.columns" :key="column.id">{{ column.name }}</th>
                        <th  v-if="config.itemType != 'metric'">
                            <button class="add-btn my-auto" type="button" @click="onAddItem">
                                <img class="m-auto" src="/icon/button/add.png" width="10" height="10"/>
                            </button>
                        </th>
                    </tr>
                </thead>
                <tbody is="transition-group" :name="`item-list`" v-cloak>
                    <tr v-for="item in items" :key="item.id" :class="{ selected: selectedItem && selectedItem.id == item.id }" @click.prevent="$emit('itemSelected', item)">
                        <td v-for="column in config.table.columns" :key="column.id">
                            <div class="d-flex flex-row align-items-center">
                                <img v-if="columnData(column, item) && column.icon" :src="column.icon" width="24" height="24"/>
                                {{ columnData(column, item) }}
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
// import { listToString, replaceItem } from '../../../../utility';
// import { updatePropertyInCache,  } from '../../../resolvers/resolve.js'

export default {
    name: 'MetricTable',
    props: {
        config: Object,
        selectedItem: Object
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
            query: require('../../../graphql/query/QueryItems.gql'),
            loadingKey: 'loadingQueriesCount',
            update(data) { 
                return data.items.metrics;
            },
            error: function(error) {
                this.errorMessage = 'Error occurred while loading query';
                this.errorMessage = JSON.parse(JSON.stringify(error))
                console.log(this.errorMessage, error);
            },
            // subscribeToMore: [
            //     {
            //         document: require('../../../graphql/subscription/metric/MetricUpdated.gql'),
            //         updateQuery: (previousResult, { subscriptionData: { data: { metricUpdated }} }) => {
            //             replaceItem(metricUpdated, previousResult.items.todos);
            //             updatePropertyInCache(metricUpdated, 'metrics', ['goals', 'todos', 'routines'], previousResult);
            //             return previousResult;
            //         },
            //     },
            // ]
        },
    },
    mounted: function() {
        // An error gets thrown if pollInterval is set with the query
        this.$apollo.queries.items.setOptions({
            fetchPolicy: 'cache-and-network',
            pollInterval: 50000,
        })
    },
    methods: {
        columnData,
        listToString
    }
}

function columnData(column, item) {
    if (column.type == 'objects') {
        return listToString(item[column.prop], 'text');
    } else {
        return item[column.prop];
    }
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
    max-height: calc(100vh - 64px - 42px);
    overflow-y: scroll;
}

.table th {
    background-color: white;
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

.table tbody tr:hover {
    background-color:#F5F5F5;
}

.table tbody tr.selected {
    background-color: rgb(239, 246, 252);
    color: rgb(0, 90, 158);
    /* background-color: rgba(3, 155, 229, .1); */
    /* color: rgb(3, 155, 229); */
}

/* .table tbody tr:nth-of-type(2n+1) {
    background-color:#F5F5F5;
} */

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