<template>
    <!-- Loading -->
    <div v-if="loadingQueriesCount == 1">Loading...</div>
    <!-- Error -->
    <div v-else-if="errorMessage">{{ errorMessage }}</div>
    <!-- Table -->
    <div v-else-if="items" class="row g-0">
        <div class="col-12">
            <div class="d-flex flex-row">
                <!-- Sort By Priority - Checkbox -->
                <div class="form-check">
                    <input :id="`sort-goals-by-priority-checkbox`" class="form-check-input" type="checkbox" v-model="shouldSortByPriority" >
                    <label class="form-check-label" :for="`sort-goals-by-priority-checkbox`">
                        Sort By Priority
                    </label>
                </div>
                <!-- Sorting -->
                <div class="sort">
                    <button v-if="!isSorting" class="btn btn-sm btn-secondary" @click="isSorting = true">Sort</button>
                    <button v-if="isSorting" class="btn btn-sm btn-success" @click="onDoneSorting">Done</button>
                </div>
            </div>
        </div>
        <div class="table col-12">
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
                    <template v-for="row in rows">
                        <tr :key="row.id" :class="{ selected: selectedItem && selectedItem.id == row.id, todosShown: row.todoRows }" 
                                @click.prevent="$emit('itemSelected', row.goal)">
                            <td>{{ row.goal.id }}</td>
                            <td>{{ row.goal.text }}</td>
                            <td>{{ row.goal.description }}</td>
                            <td>
                                <img v-if="row.goal.parents.length > 0" src="/icon/parent-icon.png" width="24" height="24"/>
                                <span>{{ listToString(row.goal.parents, 'text') }}</span>
                            </td>
                            <td>
                                <img v-if="row.goal.children.length > 0" src="/icon/child-icon.png" width="24" height="24"/>
                                <span>{{ listToString(row.goal.children, 'text') }}</span>
                            </td>
                            <td>
                                <span>{{ listToString(row.goal.metrics, 'text') }}</span>
                            </td>
                            <td>
                                <div @click.prevent.stop="onGoalClicked(row)">
                                    <img v-if="row.goal.todos.length > 0" src="/icon/task-icon.png" width="24" height="24"/>
                                    <span>{{ listToString(row.goal.todos, 'text') }}</span>
                                </div>
                            </td>
                            <td>
                                <img v-if="row.goal.routines.length > 0" src="/icon/routine-icon.png" width="24" height="24"/>
                                <span>{{ listToString(row.goal.routines, 'text') }}</span>
                            </td>
                            <td>
                                <div class="d-flex justufy-content-center">
                                    <button class="delete-btn btn btn-secondary btn-sm float-end" type="button" @click.prevent.stop="onDeleteItem(row.goal)">
                                        <i class="far fa-trash-alt"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr class="child-row" :key="row.id + 100000">
                            <td colspan="9">
                                <TodoTableView v-if="row.todoRows" class="todo-table"
                                               :todoRows="row.todoRows" :isSorting="isSorting"
                                                   @moveUp="moveUp" @moveDown="moveDown"></TodoTableView>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import { listToString, replaceItem, removeItem, sortAsc } from '../../../../utility';
import { addPropertyToCache, updatePropertyInCache, deletePropertyInCache } from '../../../resolvers/resolve.js'
import { saveGoalPositions } from '../../../resolvers/goal-resolvers.js'
import TodoTableView from '../todo/TodoTableView.vue';

/*
- The goal table is a list of rows
    - Rows have a property for the goal and for the child todoRows
        - todoRows have a property for the todo and a property for the position
            - When sorting is enabled, if a nested todo's order is changed todoRow.position will be updated and an update flag will be set
            - When sorting is done, the goal table will check for any rowTodos with updated positions, updated the todo.position and save the todo
*/

// Set position when saving todo
// Save updated positions

export default {
    components: { TodoTableView },
    name: 'GoalTable',
    props: {
        config: Object,
        selectedItem: Object
    },
    data: function() {
        return {
            items: [],
            rows: [],
            loadingQueriesCount: 0,
            errorMessage: null,
            shouldSortByPriority: true,
            isSorting: false
        }
    },
    apollo: {
        items: {
            query: require('../../../graphql/query/QueryItems.gql'),
            update(data) {
                this.initRows(data.items.goals);
                return data.items.goals;
            },
            loadingKey: 'loadingQueriesCount',
            error: function(error) {
                this.errorMessage = 'Error occurred while loading query';
                this.errorMessage = JSON.parse(JSON.stringify(error))
                console.log(this.errorMessage, error);
            },
            subscribeToMore: [
                {
                    document: require('../../../graphql/subscription/goal/GoalAdded.gql'),
                    updateQuery: (previousResult, { subscriptionData: { data: { goalAdded }} }) => {
                        previousResult.items.goals.splice(0, 0, goalAdded);
                        addPropertyToCache(goalAdded, 'goals', ['metrics', 'todos', 'routines'], previousResult);
                        return previousResult;
                    },
                },
                {
                    document: require('../../../graphql/subscription/goal/GoalUpdated.gql'),
                    updateQuery: (previousResult, { subscriptionData: { data: { goalUpdated }} }) => {
                        replaceItem(goalUpdated, previousResult.items.goals);
                        updatePropertyInCache(goalUpdated, 'goals', ['metrics', 'todos', 'routines'], previousResult);
                        return previousResult;
                    },
                },
                {
                    document: require('../../../graphql/subscription/goal/GoalDeleted.gql'),
                    updateQuery: (previousResult, { subscriptionData: { data: { goalDeleted }} }) => {
                        removeItem(goalDeleted, previousResult.items.goals);
                        deletePropertyInCache(goalDeleted, 'goals', ['metrics', 'todos', 'routines'], previousResult);
                        return previousResult;
                    },
                },
            ]
        },
    },
    mounted: function() {
        // An error gets thrown if pollInterval is set with the query
        // this.$apollo.queries.items.setOptions({
        //     fetchPolicy: 'cache-and-network',
        //     pollInterval: 50000,
        // })
    },
    methods: {
        columnData,
        initRows,
        sortGoalsByPriority,
        setTodos,
        getTodos,
        getTodosForGoal,
        sortTodos,
        moveUp,
        moveDown,
        onGoalClicked,
        listToString,
        onDoneSorting,
        onAddItem,
        onDeleteItem
    },
    watch: {
        shouldSortByPriority() {
            this.initRows(this.items);
        }
    }
}

function columnData(column, item) {
    if (column.type == 'objects') {
        return listToString(item[column.prop], 'text');
    } else {
        return item[column.prop];
    }
}

function initRows(goals) {
    let _this = this;
    let rows = [];
    goals = this.sortGoalsByPriority(goals);
    let todos = this.getTodos();
    goals.forEach(_goal => {
        let row = _this.rows.find(_row => _row.goal.id == _goal.id);

        let todosForGoal = (row && row.todoRows) ? _this.getTodosForGoal(_goal, todos) : null;
        if (todosForGoal) this.sortTodos(row.todoRows);

        rows.push({
            id: _goal.id,
            goal: _goal,
            // todos: todosForGoal
            todoRows: (row && row.todoRows) ? row.todoRows : null
        })
    })
    this.rows = [...rows];
}

function sortGoalsByPriority(goalsIn) {
    if (this.shouldSortByPriority) {
        let goals = [];
        goals = goals.concat(goalsIn.filter(_item => _item.type && _item.type.text.toLowerCase() == "primary"));
        goals = goals.concat(goalsIn.filter(_item => _item.type && _item.type.text.toLowerCase() == "secondary"));
        goals = goals.concat(goalsIn.filter(_item => _item.type && _item.type.text.toLowerCase() == "tertiary"));
        
        let ids = goals.map(_goal => _goal.id);
        goals = goals.concat(goalsIn.filter(_goal => !ids.includes(_goal.id)));
        
        return goals;
    } else {
        return goalsIn;
    }
}

function setTodos(row) {
    let todos = this.$apollo.getClient().cache.readQuery({
        query: require('../../../graphql/query/QueryItems.gql')
    })
    .items.todos;

    let todoIDs = row.goal.todos.map(_todo => _todo.id);
    todos = todos.filter(_todo => todoIDs.includes(_todo.id));

    let todoRows = todos.map(_todo => {
        let position = JSON.parse(_todo.position);
        position = (position) ? position[`goal_${row.goal.id}`] : null;
        return {
            id: _todo.id,
            todo: _todo,
            position
        }
    });

    row.todoRows = todoRows;
}

function getTodos() {
    let todos = this.$apollo.getClient().cache.readQuery({
        query: require('../../../graphql/query/QueryItems.gql')
    })
    .items.todos;

    return todos;
}

function getTodosForGoal(goal, todos) {
    let todoIDs = goal.todos.map(_todo => _todo.id);
    todos = todos.filter(_todo => todoIDs.includes(_todo.id));

    return todos;
}

function sortTodos(todoRows) {
    if (todoRows) {
        sortAsc(todoRows, 'position');
    }
}

function moveUp(row, index, rows) {
    if (index > 0) {
        --row.position;
        row.isUpdated = true;

        let previousRow = rows[index-1];
        ++previousRow.position;
        previousRow.isUpdated = true;

        this.sortTodos(rows);
    }
}

function moveDown(row, index, rows) {
    if (rows.length > index + 1) {
        ++row.position;
        row.isUpdated = true;

        let nextRow = rows[index+1];
        --nextRow.position;
        nextRow.isUpdated = true;

        this.sortTodos(rows);
    }
}

function onDoneSorting() {
    let itemPositions = [];

    this.rows.forEach(_row => {
        if (!_row.todoRows) return;
        let todoRows = _row.todoRows.filter(_todoRow => _todoRow.isUpdated);
        if (todoRows.length == 0) return;

        let goalPositions = {
            idParent: _row.id,
            todoPositions: []
        };

        todoRows.forEach(_todoRow => {
            goalPositions.todoPositions.push({
                idChild: _todoRow.id,
                position: _todoRow.position
            });
            delete _todoRow.isUpdated;
        });

        itemPositions.push(goalPositions);
    })

    saveGoalPositions(itemPositions, this.$apollo);
    this.isSorting = false;
}

function onGoalClicked(row) {
    if (!row.todoRows) {
        this.setTodos(row);
        this.sortTodos(row.todoRows);
    } else {
        row.todoRows = null;
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
    /* viewheight - navbar - tabstrip + toolbar */
    max-height: calc(100vh - 64px - 42px - 26px);
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
    line-height: 29px;
}

.table th:nth-child(1) {
    min-width: 40px;
}

.table th:nth-child(2) {
    min-width: 250px;
}

.table tbody tr:hover:not(.child-row) {
    background-color:#F5F5F5;
}

.table tbody tr.todosShown {
    background-color: #F5F5F5
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

tr.child-row {
    background-color: #DCDCDC;
}

.todo-table {
    padding: 10px 0px;
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