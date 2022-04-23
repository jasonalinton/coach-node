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
                        <tr :key="row.id" :class="{ selected: selectedItem && selectedItem.id == row.id, todosShown: row.todos }" 
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
                                <TodoTableView v-if="row.todos" :todos="row.todos" class="todo-table"></TodoTableView>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import { listToString, replaceItem, removeItem } from '../../../../utility';
import { addPropertyToCache, updatePropertyInCache, deletePropertyInCache } from '../../../resolvers/resolve.js'
import TodoTableView from '../todo/TodoTableView.vue';

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
            shouldSortByPriority: true
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
        this.$apollo.queries.items.setOptions({
            fetchPolicy: 'cache-and-network',
            pollInterval: 50000,
        })
    },
    methods: {
        columnData,
        initRows,
        sortGoals,
        setTodos,
        getTodos,
        onGoalClicked,
        listToString,
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
    goals = this.sortGoals(goals);
    let todos = this.$apollo.getClient().cache.readQuery({
        query: require('../../../graphql/query/QueryItems.gql')
    })
    .items.todos;
    goals.forEach(_goal => {
        let row = _this.rows.find(_row => _row.goal.id == _goal.id);
        rows.push({
            id: _goal.id,
            goal: _goal,
            todos: (row && row.todos) ? _this.getTodos(_goal, todos) : null 
        })
    })
    this.rows = [...rows];
}

function sortGoals(goalsIn) {
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
    row.todos = todos;
}

function getTodos(goal, todos) {
    let todoIDs = goal.todos.map(_todo => _todo.id);
    todos = todos.filter(_todo => todoIDs.includes(_todo.id));
    return todos;
}

function onGoalClicked(row) {
    if (!row.todos) {
        this.setTodos(row);
    } else {
        row.todos = null;
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