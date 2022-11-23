<template>
     <!-- Error -->
     <div v-if="errorMessage">{{ errorMessage }}</div>
    <!-- Loading -->
    <div v-else-if="isLoading == true && !parentItem">Loading...</div>
    <!-- Table -->
    <div v-else class="row g-0">
        <div :class="[itemType, 'table col-12']">
            <table :class="['item table table-sm table-borderless', (parentItem) ? 'child' : '']"
                   :style="{ 'width': `${tableWidth}px`}">
                <thead :class="[(!parentItem) ? 'sticky-top' : '']">
                    <th v-for="column in columns" :key="column.position"
                        :style="{ 'min-width': `${column.setWidth}px`, 'max-width': `${column.setWidth}px`}">
                        {{ column.text }}
                    </th>
                </thead>
                <tbody>
                    <template v-for="(item) in items">
                        <ItemTableRow :key="item.id"
                                      :item="item"
                                      :parent="parentItem"
                                      :columns="columns"
                                      @showItems="showItems"
                                      @keydown.alt="initializeMove(item)"
                                      @keyup.alt="moveIndex = 0"
                                      @keydown.alt.up="moveUp(item)"
                                      @keydown.alt.down="moveDown(item)"
                                      @moveItem="moveItem"/>
                        <tr :key="item.id + 1000000" class="child-row">
                            <td :colspan="columns.length">
                                <ItemTable v-if="options.dropItems.items.parents && states(item).text || states(item).parents"
                                           :itemType="itemType"
                                           :parentItem="item"
                                           :selectedColumns="selectedColumns" 
                                           :isParent="true"
                                           :level="level + 1" />
                                <ItemTable v-if="options.dropItems.items.children && states(item).text || states(item).children"
                                           :itemType="itemType"
                                           :parentItem="item"
                                           :selectedColumns="selectedColumns" 
                                           :isChild="true"
                                           :level="level + 1" />
                                <ItemTable v-if="options.dropItems.items.todos && states(item).text || states(item).todos"
                                           itemType="todo"
                                           :parentItem="item"
                                           :selectedColumns="getUpdatedSelectedColumns(selectedColumns, 'todo')" 
                                           :level="level + 1" />
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import ItemTableRow from '../../component/ItemTableRow.vue'; 
import { sortDesc, capitalizeFirstLetter, clone } from '../../../../../utility';
import { columnConfigs } from '../../../../config/item-table-column-config';

export default {
    components: { 
        ItemTableRow,
        ItemTable: () => import('../ItemTable.vue')
     },
    name: 'ItemTableByNone',
    props: {
        itemType: String,
        width: Number,
        selectedColumns: Array,
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
    },
    provide() {
        return {
            options: this.options,
        }
    },
    inject: [ 'level', 'levelPadding', 'parentItem', 'isParent', 'isChild' ],
    computed: {
        itemTypeCapitalized() { return capitalizeFirstLetter(this.itemType); },
        columns() {
            let columns = [];
            let i = 1;
            this.selectedColumns.forEach(column => {
                let columnConfig = clone(columnConfigs.find(x => x.text == column));
                columnConfig.position = i++;
                if (column == "Text" && !this.isParent && !this.isChild) {
                    columnConfig.iconName = `${this.itemType}-icon`;
                }
                columns.push(columnConfig);
            })
            this.setColumnWidths(columns);
            return columns;
        },
        items() {
            if (this.store) {
                let items = this.store[`${this.itemType}s`];

                if (this.parentItem) {
                    let childIDs;
                    if (this.isParent) {
                        childIDs = this.parentItem.parents.map(x => x.id);
                    } else if (this.isChild) {
                        childIDs = this.parentItem.children.map(x => x.id);
                    } else {
                        childIDs = this.parentItem[`${this.itemType}s`].map(x => x.id);
                    }
                    
                    items = items.filter(x => childIDs.includes(x.id));
                    
                    let items2 = [];
                    childIDs.forEach(id => {
                        let item = items.find(x => x.id == id);
                        if (item)
                            items2.push(item);
                    });
                    items = items2;
                } else {
                    if (this.options.showRootOnly) {
                        items = items.filter(x => x.parents.length == 0);
                    }
                    items = sortDesc(items, 'id');
                }

                this.refreshShownItems(items);

                return items;
            } else {
                return [];
            }
        }
    },
    data: function() {
        return {
            errorMessage: null,
            isLoading: false,
            itemTableVM: null,
            tableWidth: this.width,
            shownItems: [],
            store: null,
            todoStore: null,
            goalStore: undefined,
            move: {
                item: undefined,
                index: 0
            },
            moveIndex: 0
            // items: []
            // columns: null
        }
    },
    created: async function() {
        let storeObject = await import(`@/store/${this.itemType}Store`);
        let useStore = storeObject[`use${this.itemTypeCapitalized}Store`];
        this.store = useStore();
        
        let todoStore = await import(`@/store/todoStore`);
        this.todoStore = todoStore.useTodoStore();
        
        let goalStore = await import(`@/store/goalStore`);
        this.goalStore = goalStore.useGoalStore();
    },
    mounted: function() {
        // this.getGoals();
    },
    methods: {
        setColumnWidths,
        refreshShownItems,
        newStateModel,
        getGoals,
        getEndpoint,
        getEndpointData,
        getUpdatedSelectedColumns,
        // setItems,
        states(item) {
            return  this.shownItems.find(x => x.id === item.id).states;
        },
        showItems(id, prop) {
            let states = this.shownItems.find(x => x.id === id).states;
            states[prop.toLowerCase()] = !states[prop.toLowerCase()];
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
        },
        initializeMove,
        moveUp,
        moveDown,
        completeMove,
        moveItem
    },
    watch: {
        
    }
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

function refreshShownItems(items) {
    if (!this.showItems) {
        let shownItems = items.map(item => this.newStateModel(item))
        this.shownItems = sortDesc(shownItems, 'id'); 
    } else {
        let _this = this;
        items.forEach(item => {
            let shownItem = _this.shownItems.find(x => x.id == item.id);
            if (!shownItem) {
                _this.shownItems.push(this.newStateModel(item));
            }
        })
    }
}

function newStateModel(item) {
    let data = {
        id: item.id,
        states: {
            parents: false,
            children: false,
            metrics: false,
            routines: false,
            goals: false,
            todos: false,
            text: false
        }
    };
    delete data[`${this.itemType}s`];
    return data;
}

function getGoals() {
    this.isLoading = true;
    let controller = "Goal";
    // let controller = (!this.parentRow) ? "Goal" : this.parentRow.viewModel.modelType;
    let endpoint = this.getEndpoint();
    let data = this.getEndpointData(); 

    let _this = this;
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
            // _this.columns = data.columns;
            // _this.setItems();
            _this.itemTableVM = data;

        } else {
            _this.errorMessage = data.errorMessage;
        }
        _this.isLoading = false;
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

function getUpdatedSelectedColumns(selectedColumns, itemType) {
    let columns = [...selectedColumns];
    let index = columns.findIndex(x => x.toLowerCase() == `${itemType.toLowerCase()}s`);
    if (index >= 0) {
        columns[index] = `${capitalizeFirstLetter(this.itemType)}s`;
    }
    return columns;
}

function initializeMove(item) {
    item = this.items.find(x => x.id == 127);
    this.move.item = item;
    this.move.index = 0;
}

function moveUp(item) {
    // this.move.index--;

    console.log("Move up")

    item = this.items.find(x => x.id == 127);

    var index = this.items.findIndex(x => x.id == item.id);
    if (index > 0) {
        this.items.splice(index, 1);
        this.items.splice(index - 1, 0, item);
    }
}

function moveDown(item) {
    // this.move.index--;

    console.log("Move down")
    item = this.items.find(x => x.id == 127);

    var index = this.items.findIndex(x => x.id == item.id);
    if (index < this.items.length - 1) {
        this.items.splice(index, 1);
        this.items.splice(index + 1, 0, item);
    }
}

function completeMove(item) {
    this.move.item = item;
    this.move.index = 0;
}

// function moveItem(item, sibling, placement) {
//     var index_Sibling = this.items.findIndex(x => x.id == sibling.id);
//     var newPosition;

//     if (placement == "before") {
//         newPosition = sibling.position;
//     } else if (placement == "after") {
//         newPosition = sibling.position + 1;
//     }
// }

function moveItem(item, sibling, isBefore) {
    var newPosition;

    if (sibling.itemType == "todo") {
        newPosition = (isBefore) ? sibling.positon : sibling.positon + 1;
    } else {
        newPosition = (isBefore) ? sibling.position : sibling.position + 1;
    }

    if (this.parentItem && this.parentItem.itemType == "goal") {
        if (item.itemType == "todo") {
            this.goalStore.repositionTodo(this.parentItem.id, item.id, newPosition)
        }
    }
}
</script>

<style scoped>
    table {
        padding-left: 10px;
    }

    .table-borderless tr {
        border-bottom: 1px solid transparent; 
        border-top: 1px solid transparent; 
        /* border-bottom: none !important;  */
        vertical-align: middle;
        -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
        -moz-box-sizing: border-box;    /* Firefox, other Gecko */
        box-sizing: border-box;         /* Opera/IE 8+ */
    }

    .table-borderless tr.child-row {
        border: none;
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
    .item.table td, .item.table th {
        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 0 5px;
        font-size: 14px;
        border: none;
    }

    .item.table td {
        font-weight: 400;
        line-height: 29px;
    }

    /* .item.table td.column-expanded {
        padding-left: 30px;
    } */

    .item.table .child-row > td {
        padding: 0px;
    }
</style>