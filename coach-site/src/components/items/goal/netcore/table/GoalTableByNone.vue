<template>
    <!-- Error -->
    <div v-if="errorMessage">{{ errorMessage }}</div>
    <!-- Loading -->
    <div v-else-if="isLoading == true && !parentRowID">Loading...</div>
    <!-- Table -->
    <div v-else-if="goalTableVM" class="row g-0">
        <div class="goal table col-12">
            <table :class="['table table-sm table-borderless', (parentRowID) ? 'child' : '']">
                <thead :class="[(!parentRowID) ? 'sticky-top' : '']">
                    <th v-for="column in columns" :key="column.position"
                        :style="(column.width) ? { 'width': `${column.width}`, 'min-width': `${column.width}` } : {}">{{ column.text }}</th>
                </thead>
                <tbody>
                    <template v-for="row in rows">
                        <ItemTableRow :key="row.id"
                                      :goal="row.goal"
                                      :row="row.viewModel"
                                      :columns="columns"
                                      :parentRow="row"/>
                        <tr :key="row.id + 1000000" class="child-row">
                            <td :colspan="columns.length" >
                                <GoalTableCore v-if="row.viewModel.showText || row.viewModel.showParents" 
                                               :parentRow="row" 
                                               :selectedColumns="selectedColumns" 
                                               :isParent="true"
                                               :level="level + 1"></GoalTableCore>
                                <GoalTableCore v-if="row.viewModel.showText || row.viewModel.showChildren" 
                                               :parentRow="row" 
                                               :selectedColumns="selectedColumns" 
                                               :isChild="true" 
                                               :level="level + 1"></GoalTableCore>
                                <!-- <TodoTableCore v-show="row.showText || row.showTodos" :parentRow="row" :selectedColumns="selectedColumns"></TodoTableCore>
                                <RoutineTableCore v-show="row.showText || row.showRoutines" :parentRow="row" :selectedColumns="selectedColumns"></RoutineTableCore> -->
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>

        </div>
    </div>
</template>

<script>
import { sortDesc } from '../../../../../../utility'
import ItemTableRow from '../../../component/ItemTableRow.vue';
// import GoalTableCore from '../netcore/GoalTableCore.vue';

export default {
    components: { 
        ItemTableRow,
        GoalTableCore: () => import('../GoalTableCore.vue'),
        // TodoTableCore: () => import('../../../todo/netcore/TodoTableCore.vue'),
        // RoutineTableCore: () => import('../../../routine/netcore/RoutineTableCore.vue')
    },
    name: 'GoalTableByNone',
    props: {
        options: {
          type: Object,
          default: () => ({ ShowRootOnly: true })
        },
        selectedColumns: Array,
    },
    inject: [ 'level', 'levelPadding', 'parentRow', 'isParent', 'isChild' ],
    computed: {
        columns() { return this.goalTableVM.columns; },
        rows() { return sortDesc(this.goalTableVM.rows, 'id'); }
    },
    data: function() {
        return {
            parentRowID: (this.parentRow) ? this.parentRow.id : null,
            isLoading: true,
            goalTableVM: null,
            errorMessage: null,
        }
    },
    created: function() {
        this.getGoals();
    },
    methods: {
        getGoals,
        getEndpoint,
        getEndpointData,
        showItems(row, column) {
            row[`show${column.text}`] = !row[`show${column.text}`];
        },
        iconSource(column) {
            let iconSource;
            if (column.text == 'Text' && this.isChild) {
                iconSource = '/icon/child-icon.png';
            } else if (column.text == 'Text' && this.isParent) {
                iconSource = `/icon/parent-icon.png`
            } else {
                iconSource = `/icon/${column.iconName}.png`
            }
            return iconSource;
        }
    },
    watch: {
        selectedColumns() {
            this.getGoals();
        }
    }
}

function getGoals() {
    this.isLoading = true;
    let controller = (!this.parentRow) ? "Goal" : this.parentRow.viewModel.modelType;
    let endpoint = this.getEndpoint();
    let data = this.getEndpointData(); 

    fetch(`https://localhost:7104/api/${controller}/${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then((response) => response.json())
    .then((data) => {
        if (!data.errorMessage) {
            this.goalTableVM = data;
        } else {
            this.errorMessage = data.errorMessage;
        }
        this.isLoading = false;
    })
    .catch((error) => {
        this.isLoading = false;
        console.error('Error:', error);
    });
}

function getEndpoint() {
    let endpoint;

    if (this.isParent) {
        endpoint = 'GetParentGoalTableByNoneVM';
    } else if (this.isChild) {
        endpoint = 'GetChildGoalTableByNoneVM';
    } else {
        endpoint = 'GetGoalTableByNoneVM';
    }

    return endpoint;
}

function getEndpointData() {
    let data = {
        properties: this.selectedColumns,
        options: this.options
    };

    if (this.isParent) {
        data.childID = this.parentRowID;
    } else if (this.isChild) {
        data.parentID = this.parentRowID;
    }

    return data;
}
</script>

<style scoped>
    table {
        padding-left: 10px;
    }

    .table-borderless tr {
        border-bottom: none !important; 
        vertical-align: middle;
    }

    .table {
        /* viewheight - navbar - tabstrip + toolbar */
        max-height: calc(100vh - 64px - 42px - 32px);
        overflow-y: scroll;
    }

    .table th {
        background-color: white;
        /* background-color: #F5F5F5; */
        color: #565656;
        font-weight: 300;
        /* font-size: 12px; */
        table-layout: fixed;
    }

    /* .table th:nth-child(1) {
        min-width: 40px;
    } */

    /* .table.child thead {
        display: none;
    } */

    .table.child {
        margin-top: -29px;
    }

   

    .table tbody tr:hover:not(.child-row) {
        background-color:#F5F5F5;
    }
</style>

<style>
    .goal.table td, .goal.table th {
        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 0 10px;
        font-size: 14px;
        border: none;
    }

    .goal.table td {
        font-weight: 400;
        line-height: 29px;
    }

    /* .goal.table td.column-expanded {
        padding-left: 30px;
    } */

    .goal.table .child-row > td {
        padding: 0px;
    }
</style>
