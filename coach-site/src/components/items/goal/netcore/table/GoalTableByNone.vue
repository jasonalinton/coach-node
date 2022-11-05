<template>
    <!-- Error -->
    <div v-if="errorMessage">{{ errorMessage }}</div>
    <!-- Loading -->
    <div v-else-if="isLoading == true && !parentItemID">Loading...</div>
    <!-- Table -->
    <div v-else-if="goalTableVM" class="row g-0">
        <!-- <button v-if="!parentItem" class="btn-primary" @click="clickButton">Click Me</button> -->
        <div class="goal table col-12">
            <table :class="['table table-sm table-borderless', (parentItemID) ? 'child' : '']"
                   :style="{ 'width': `${tableWidth}px`}">
                <thead :class="[(!parentItemID) ? 'sticky-top' : '']">
                    <th v-for="column in columns" :key="column.position"
                        :style="{ 'min-width': `${column.setWidth}px`, 'max-width': `${column.setWidth}px`}">
                        {{ column.text }}
                    </th>
                </thead>
                <tbody>
                    <template v-for="item in items">
                        <ItemTableRow :key="item.id"
                                      :item="item"
                                      :columns="columns"
                                      @showItems="showItems"/>
                        <tr :key="item.id + 1000000" class="child-row">
                            <td :colspan="columns.length" >
                                <GoalTableCore v-if="options.dropItems.items.parents && state(item).text || state(item).parents" 
                                               :parentItem="item" 
                                               :selectedColumns="selectedColumns" 
                                               :isParent="true"
                                               :level="level + 1"></GoalTableCore>
                                <GoalTableCore v-if="options.dropItems.items.children && state(item).text || state(item).children" 
                                               :parentItem="item" 
                                               :selectedColumns="selectedColumns" 
                                               :isChild="true" 
                                               :level="level + 1"></GoalTableCore>
                                <!-- <TodoTableCore v-show="row.showText || row.showTodos" :parentItem="row" :selectedColumns="selectedColumns"></TodoTableCore>
                                <RoutineTableCore v-show="row.showText || row.showRoutines" :parentItem="row" :selectedColumns="selectedColumns"></RoutineTableCore> -->
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
import { useGoalStore } from '@/store/goalStore';

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
          default: () => ({ 
            showRootOnly: true,
            dropItems: {
                items: {
                    parents: false,
                    children: true,
                    metrics: true,
                    goals: true,
                    routines: true,
                    todos: true
                },
                planner: {
                    events: false,
                    iterations: false
                }
            }
         })
        },
        selectedColumns: Array,
        width: Number
    },
    provide() {
        return {
            options: this.options,
        }
    },
    inject: [ 'level', 'levelPadding', 'parentItem', 'isParent', 'isChild' ],
    computed: {
        columns() {
            let columns = this.goalTableVM.columns;
            this.setColumnWidths(columns);
            return columns; 
        },
        rows() { return sortDesc(this.goalTableVM.rows, 'id'); },
        items() {
            let goals = this.store.goals;
            this.populateShownItems(goals);
            if (this.parentItem) {
                let parentGoal = goals.find(x => x.id == this.parentItem.id);
                let childIDs = parentGoal.children.map(x => x.id);
                return sortDesc(goals.filter(x => childIDs.includes(x.id)), 'id');
            } else {
                return sortDesc(goals, 'id');
            }
        }
    },
    data: function() {
        return {
            parentItemID: (this.parentItem) ? this.parentItem.id : null,
            isLoading: true,
            goalTableVM: null,
            tableWidth: this.width,
            errorMessage: null,
            shownItems: [],
            goals: [],
            store: useGoalStore()
        }
    },
    created: async function() {
        this.isLoading = false;
    },
    mounted: function() {
        this.getGoals();
    },
    methods: {
        clickButton() {
            this.store.remove();
        },
        getGoals,
        getEndpoint,
        getEndpointData,
        setColumnWidths,
        showItems(id, prop) {
            let states = this.shownItems.find(x => x.id === id).states;
            states[prop.toLowerCase()] = !states[prop.toLowerCase()];
        },
        state(item) {
            return  this.shownItems.find(x => x.id === item.id)
                .states;
        },
        // populateShownItems(viewModel) {
        //     let shownItems = viewModel.rows.map(goal => {
        //         return {
        //             id: goal.id,
        //             states: {
        //                 parents: false,
        //                 children: false,
        //                 metrics: false,
        //                 routines: false,
        //                 goals: false,
        //                 todos: false,
        //                 text: false
        //             }
        //         }
        //     })
        //     this.shownItems = sortDesc(shownItems, 'id'); 
        // },
        populateShownItems(goals) {
            if (!this.showItems) {
                let shownItems = goals.map(goal => {
                    return {
                        id: goal.id,
                        states: {
                            parents: false,
                            children: false,
                            metrics: false,
                            routines: false,
                            goals: false,
                            todos: false,
                            text: false
                        }
                    }
                })
                this.shownItems = sortDesc(shownItems, 'id'); 
            } else {
                let _this = this;
                goals.forEach(goal => {
                    let shownItem = _this.shownItems.find(x => x.id == goal.id);
                    if (!shownItem) {
                        _this.shownItems.push({
                        id: goal.id,
                        states: {
                            parents: false,
                            children: false,
                            metrics: false,
                            routines: false,
                            goals: false,
                            todos: false,
                            text: false
                        }
                    })
                    }
                })
            }
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
        },
        goals(value) {
            this.populateShownItems(value);
        }
    }
}

function getGoals() {
    this.isLoading = true;
    let controller = "Goal";
    // let controller = (!this.parentItem) ? "Goal" : this.parentItem.viewModel.modelType;
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
            // this.populateShownItems(data)
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

function setColumnWidths(columns) {
    let containerWidth = this.width;
    let minTableWidth = columns.map(x => x.minWidth).reduce((prev, curr) => prev + curr);

    if (containerWidth <= minTableWidth) {
        columns.forEach(column => {
            column.setWidth = (column.width != null) ? column.width : column.minWidth;
        });        
    } else if (containerWidth > minTableWidth) {
        /* Set widths of columns with a specified width */
        let colsWithWidth = columns.filter(x => x.width != null);
        colsWithWidth.forEach(x => x.setWidth = x.width);

        let knownWidth = colsWithWidth.map(x => x.width).reduce((prev, curr) => prev + curr);
        let remainingWidth = containerWidth - knownWidth;
        
        /* Set widths of columns without a specified width */
        let colsNoWidth = columns.filter(x => x.width == null);
        let dynamicWidth = remainingWidth / colsNoWidth.length;
        colsNoWidth.forEach(x => x.setWidth = dynamicWidth);
    }

    this.tableWidth = columns.map(x => x.setWidth).reduce((prev, curr) => prev + curr);
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
        data.childID = this.parentItemID;
    } else if (this.isChild) {
        data.parentID = this.parentItemID;
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
        padding: 0 5px;
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
