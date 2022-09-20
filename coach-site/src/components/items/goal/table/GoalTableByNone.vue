<template>
    <!-- Error -->
    <div v-if="errorMessage">{{ errorMessage }}</div>
    <!-- Loading -->
    <div v-else-if="isLoading == true && !parentID">Loading...</div>
    <!-- Table -->
    <div v-else-if="goalTableVM" class="row g-0">
        <div class="table col-12">
            <table :class="['table table-sm table-borderless', (parentID) ? 'child' : '']">
                <!-- <thead v-if="!parentID" class="sticky-top"> -->
                <thead :class="[(!parentID) ? 'sticky-top' : '']">
                    <th v-for="column in columns" :key="column.position"
                        :style="(column.width) ? { 'width': `${column.width}`, 'min-width': `${column.width}` } : {}">{{ column.text }}</th>
                </thead>
                <tbody>
                    <template v-for="row in rows">
                        <tr :key="row.id">
                            <td v-for="column in columns" :key="column.position"
                                :class="(parent && parent[`show${column.text}`]) ? `column-expanded` : `column-collapsed`" >
                                <img v-if="column.type == 'Object' && (row[column.text.toLowerCase()] != '')" 
                                     :src="(row[`show${column.text}`]) ? `/icon/icon-expanded.png` : `/icon/icon-collapsed-right.png`" 
                                     width="14" height="14"
                                     @click="showItems(row, column)" />
                                <img v-if="column.iconName && (row[column.text.toLowerCase()] != '')" 
                                     :src="(column.text == 'Text' && parent) ? '/icon/child-icon.png' : `/icon/${column.iconName}.png`" width="24" height="24" />
                                <span>{{ row[column.text.toLowerCase()] }}</span>
                            </td>
                        </tr>
                        <tr class="child-row" :key="row.id + 100000">
                            <td :colspan="columns.length" >
                                <GoalTableCore v-show="row.showText" :parent="row" :selectedColumns="selectedColumns"></GoalTableCore>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>

        </div>
    </div>
</template>

<script>
import { sortDesc } from '../../../../../utility'
// import GoalTableCore from '../netcore/GoalTableCore.vue';

export default {
    components: { GoalTableCore: () => import('../netcore/GoalTableCore.vue') },
    name: 'GoalTableByNone',
    props: {
        options: Object,
        selectedColumns: Array,
        parent: Object

    },
    computed: {
        columns() { return this.goalTableVM.columns; },
        rows() { return sortDesc(this.goalTableVM.rows, 'id'); }
    },
    data: function() {
        return {
            parentID: (this.parent) ? this.parent.id : null,
            isLoading: true,
            goalTableVM: null,
            errorMessage: null
        }
    },
    created: function() {
        this.getGoals();
    },
    methods: {
        getGoals,
        showItems(row, column) {
            row[`show${column.text}`] = !row[`show${column.text}`];
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
    let endpoint = (this.parentID == undefined) ? 'GetGoalTableByNoneVM' : 'GetChildGoalTableByNoneVM';
    let data = (this.parentID == undefined) ? this.selectedColumns : { parentID: this.parentID, properties: this.selectedColumns } 

    fetch(`https://localhost:7104/api/Goal/${endpoint}`, {
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
        background-color: #F5F5F5;
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

    td, th {
        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 0 10px;
        font-size: 14px;
        border: none;
    }

    td {
        font-weight: 400;
        line-height: 29px;
    }

    .table tbody tr:hover:not(.child-row) {
        background-color:#F5F5F5;
    }

    td.column-expanded {
        padding-left: 30px;
    }

    .child-row > td {
        padding: 0px;
    }
</style>