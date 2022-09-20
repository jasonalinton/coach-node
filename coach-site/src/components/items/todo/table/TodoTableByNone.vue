<template>
    <!-- Loading -->
    <div v-if="loadingQueriesCount == 1">Loading...</div>
    <!-- Error -->
    <div v-else-if="errorMessage">{{ errorMessage }}</div>
    <!-- Table -->
    <div v-else-if="todoTableVM" class="row g-0">
        <div class="table col-12">
            <table class="table table-sm table-borderless">
                <thead class="sticky-top">
                    <th v-for="column in columns" :key="column.position">{{ column.text }}</th>
                </thead>
                <tbody>
                    <tr v-for="row in rows" :key="row.id">
                        <td v-for="column in columns" :key="column.position">{{ row[column.text.toLowerCase()] }}</td>
                    </tr>
                </tbody>
            </table>

        </div>
    </div>
</template>

<script>
import { sortDesc } from '../../../../../utility'

export default {
    name: 'TodoTableByNone',
    props: {
        options: Object,
        selectedColumns: Array,
    },
    computed: {
        columns() { return this.todoTableVM.columns; },
        rows() { return sortDesc(this.todoTableVM.rows, 'id'); }
    },
    data: function() {
        return {
            todoTableVM: null,
        }
    },
    created: function() {
        fetch('https://localhost:7104/api/Todo/GetTodoTableByNoneVM', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.selectedColumns)
        })
        .then((response) => response.json())
        .then((data) => {
            this.todoTableVM = data;
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
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
</style>