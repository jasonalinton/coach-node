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
                                     :states="states(item)"
                                     @showItems="showItems"
                                     @repositionItem="repositionItem"/>
                       <tr :key="item.id + 1000000" class="child-row">
                           <td :colspan="columns.length">
                               <ItemTable v-if="options.dropItems.items.parents && states(item).text || states(item).parents"
                                          :itemType="itemType"
                                          property="parents"
                                          :parentItem="item"
                                          :selectedColumns="selectedColumns" 
                                          :isParent="true"
                                          :level="level + 1" />
                               <ItemTable v-if="options.dropItems.items.children && states(item).text || states(item).children"
                                          :itemType="itemType"
                                          property="children"
                                          :parentItem="item"
                                          :selectedColumns="selectedColumns" 
                                          :isChild="true"
                                          :level="level + 1" />
                               <ItemTable v-if="(options.dropItems.items.todos && states(item).text 
                                          || states(item).metrics) && itemType != 'metric'"
                                          itemType="metric"
                                          property="metrics"
                                          :parentItem="item"
                                          :selectedColumns="getUpdatedSelectedColumns(selectedColumns, 'metric')" 
                                          :level="level + 1" />
                               <ItemTable v-if="(options.dropItems.items.goals && states(item).text 
                                          || states(item).goals) && itemType != 'goal'"
                                          itemType="goal"
                                          property="goals"
                                          :parentItem="item"
                                          :selectedColumns="getUpdatedSelectedColumns(selectedColumns, 'goal')" 
                                          :level="level + 1" />
                               <ItemTable v-if="(options.dropItems.items.routines && states(item).text 
                                          || states(item).routines) && itemType != 'routine'"
                                          itemType="routine"
                                          property="routines"
                                          :parentItem="item"
                                          :selectedColumns="getUpdatedSelectedColumns(selectedColumns, 'routine')" 
                                          :level="level + 1" />
                               <ItemTable v-if="(options.dropItems.items.todos && states(item).text 
                                          || states(item).todos) && itemType != 'todo'"
                                          itemType="todo"
                                          property="todos"
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
        property: String,
        selectedColumns: Array,
        searchTerm: {
          type: String,
          default: ""
        },
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
    inject: [ 'level', 'levelPadding', 'parentItem', 'isParent', 'isChild'],
    computed: {
        itemTypeCapitalized() { return capitalizeFirstLetter(this.itemType); },
        width() { return (this.itemTableStore) ? this.itemTableStore.containerWidth : 0 },
        showRootOnly() { return (this.options.showRootOnly && this.searchTerm == "") ? true : false },
        columns() {
            let columns = [];
            let i = 1;
            let _this = this;
            this.selectedColumns.forEach(column => {
                let columnConfig = clone(columnConfigs.find(x => x.text == column));
                columnConfig.position = i++;
                if (column == "Text" && !_this.isParent && !_this.isChild) {
                    columnConfig.iconName = `${this.itemType}-icon`;
                }
                columns.push(columnConfig);
            })
            this.setColumnWidths(columns);
            return columns;
        },
        items() {
            if (this.store) {
                let items = this.getStore(this.itemType).getItems();

                if (this.parentItem) {
                    let parent = this[`${this.parentItem.itemType}Store`].getItem(this.parentItem.id);

                    let childIDs = parent[this.property].map(x => x.id);
                    items = items.filter(x => childIDs.includes(x.id));

                    items = items.sort((a, b) => {
                        let positionA = a.positions
                            .find(x => x.parentType == parent.itemType && x.parentID == parent.id).position;
                        let positionB = b.positions
                            .find(x => x.parentType == parent.itemType && x.parentID == parent.id).position;
                        return  positionA - positionB;
                    })


                } else {
                    if (this.showRootOnly && this.itemType != 'metric') {
                        items = items.filter(x => x.parentIDs.length == 0);
                    }
                    items = sortDesc(items, 'id');
                }

                this.refreshShownItems(items);

                if (this.searchTerm == "") {
                    return items;
                } else {
                    let _this = this;
                    return items.filter(x => x.text.toLowerCase().includes(_this.searchTerm.toLowerCase()))
                }
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
            metricStore: undefined,
            goalStore: undefined,
            routineStore: undefined,
            todoStore: undefined,
            itemTableStore: undefined,
        }
    },
    created: async function() {
        let itemTableStore = await import(`@/store/itemTableStore`);
        this.itemTableStore = itemTableStore.useItemTableStore();
        
        let metricStore = await import(`@/store/metricStore`);
        this.metricStore = metricStore.useMetricStore();
        
        let goalStore = await import(`@/store/goalStore`);
        this.goalStore = goalStore.useGoalStore();
        
        let routineStore = await import(`@/store/routineStore`);
        this.routineStore = routineStore.useRoutineStore();
        
        let todoStore = await import(`@/store/todoStore`);
        this.todoStore = todoStore.useTodoStore();
        
        let storeObject = await import(`@/store/${this.itemType}Store`);
        let useStore = storeObject[`use${this.itemTypeCapitalized}Store`];
        this.store = useStore();
    },
    methods: {
        setColumnWidths,
        refreshShownItems,
        newStateModel,
        getUpdatedSelectedColumns,
        getStore(itemType) { return this[`${itemType}Store`]; },
        states(item) { return  this.shownItems.find(x => x.id === item.id).states; },
        showItems(id, prop) {
            let states = this.shownItems.find(x => x.id === id).states;
            let value = !states[prop.toLowerCase()];
            for (let _prop in states) { states[_prop] = false; }
            states[prop.toLowerCase()] = value;
        },
        itemPosition(item, parent) {
            return item.positions
                .find(x => x.parentType == parent.itemType && x.parentID == (parent.id || null)).position;
        },
        repositionItem
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

function getUpdatedSelectedColumns(selectedColumns, itemType) {
   let columns = [...selectedColumns];
   let index = columns.findIndex(x => x.toLowerCase() == `${itemType.toLowerCase()}s`);
   if (index >= 0) {
       columns[index] = `${capitalizeFirstLetter(this.itemType)}s`;
   }
   return columns;
}

function repositionItem(item, sibling, isBefore) {
    var position = this.itemPosition(sibling, this.parentItem);
    var newPosition = (isBefore) ? position : position + 1;

    if (this.parentItem) {
        let store = this.getStore(this.parentItem.itemType);
        store.repositionItem(this.parentItem.itemType, this.property, this.parentItem.id, item.id, newPosition);
    }
}

// function initializeMove(item) {
//    item = this.items.find(x => x.id == 127);
//    this.move.item = item;
//    this.move.index = 0;
// }

// function moveUp(item) {
//     // this.move.index--;

//     console.log("Move up")

//     item = this.items.find(x => x.id == 127);

//     var index = this.items.findIndex(x => x.id == item.id);
//     if (index > 0) {
//         this.items.splice(index, 1);
//         this.items.splice(index - 1, 0, item);
//     }
// }

// function moveDown(item) {
//     // this.move.index--;

//     console.log("Move down")
//     item = this.items.find(x => x.id == 127);

//     var index = this.items.findIndex(x => x.id == item.id);
//     if (index < this.items.length - 1) {
//         this.items.splice(index, 1);
//         this.items.splice(index + 1, 0, item);
//     }
// }

// function completeMove(item) {
//     this.move.item = item;
//     this.move.index = 0;
// }
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