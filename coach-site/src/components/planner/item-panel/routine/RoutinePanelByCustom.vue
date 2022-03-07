<template>
    <div class="custom d-flex flex-column flex-grow-1">
         <!-- Toggle Panel - Checkbox -->
        <div class="d-flex flex-row justify-content-start">
            <input id="show-recommended" class="form-check-input mx-2" type="checkbox" v-model="showRecommended" >
            <label class="form-check-label" for="show-recommended">
                Show Recommended
            </label>
        </div>  
        <!-- Toolbar -->
        <!-- <div class="toolbar d-flex flex-row justify-content-between align-items-center">
            <AddTaskButton @click="addNewTask"></AddTaskButton>
            <IconButton src="/icon/goal-icon.png" :width="32" :height="32"></IconButton>
        </div> -->
        <!-- Body -->
        <div class="d-flex flex-column flex-grow-1 justify-content-between">
            <!-- Pending -->
            <ul v-if="iterations.pending" class="item-list pending">
                <!-- <li v-if="todos.new"> -->
                    <!-- New Task -->
                    <!-- <div class="new-task d-flex flex-row align-items-center">
                        <ItemCheckbox :width="40" :height="40" @onChecked="markNewTaskComplete(todos.new)"></ItemCheckbox>
                        <input id="newTask" ref="newTask" class="form-control form-control-sm" type="text" 
                               v-model="todos.new.text"
                               v-on:keyup.enter="addTask(todos.new)"
                               v-on:keyup.esc="cancelAddTask()"
                               autofocus/>
                    </div> -->
                <!-- </li> -->
                <li v-for="(iteration, index) in pending" v-bind:key="iteration.id" :class="{ recommended: iteration.isRecommended }" :style="{ 'z-index': -index }">
                    <ListItem :iteration="iteration" @markComplete="markComplete" @onDelete="removeIteration"></ListItem>
                </li>
            </ul>
            <!-- Complete  -->
            <div class="complete d-flex flex-column">
                <div class="header">Completed ({{ completeCount }} of {{ totalCount }}) {{ percentComplete }}%</div>
                <ul v-if="iterations.complete" class="item-list">
                    <li v-for="(iteration, index) in complete" v-bind:key="index" :class="{ recommended: iteration.isRecommended }" :style="{ 'z-index': -index }">
                        <ListItem class="complete" :iteration="iteration" @markIncomplete="markIncomplete" @onDelete="removeIteration"></ListItem>
                    </li>
                </ul>
            </div>
        </div>

    </div>
</template>

<script>
// import IconButton from '../../../controls/button/IconButton.vue'
// import AddTaskButton from '../component/AddTaskButton.vue'
// import ItemCheckbox from '../component/ItemCheckbox.vue';
import ListItem from '../component/ListItem.vue'
import { replaceItem, removeItem, today, Percent } from '../../../../../utility';
import { createDefaultTask, toggleCompletion, deleteIteration } from '../../../../resolvers/todo-resolvers';

export default {
    name: 'RoutinePanelByCustom',
    // components: { AddTaskButton, IconButton, ListItem, ItemCheckbox, },
    components: { ListItem, },
    props: {
        selectedDate: Date
    },
    data: function () {
        return {
            iterations: this.newIterations(),
            routineIterations: [],
            newItemID: -1,
            today: today(),
            showRecommended: false
        }
    },
    created: function() {
        let showRec_Store = (localStorage.getItem(`show-recc-routine-items-by-custom`) === 'true');
        if (showRec_Store) {
            this.showRecommended = Boolean(showRec_Store);
        } else {
            localStorage.setItem(`show-recc-routine-items-by-custom`, this.showRecommended);
            this.showRecommended = false;
        }
    },
    apollo: {
        iterations: {
            query() { return require('../../../../graphql/query/routine/QueryRoutineIterations.gql')},
            error: function(error) {
                this.errorMessage = 'Error occurred while loading query'
                console.log(this.errorMessage, error);
            },
            update(data) { 
                this.routineIterations = data.routineIterations;
                let routineIterations = this.getRoutineIterations(data.routineIterations, this.selectedDate);

                if (routineIterations[0]) {
                    let iterations = routineIterations[0].todoIterations
                    iterations.complete = iterations.filter(iteration => iteration.completedAt);
                    iterations.pending = iterations.filter(iteration => !iteration.completedAt);
                    return iterations
                } else {
                    return this.newIterations();
                }
            },
            subscribeToMore: [
                {
                    document: require('../../../../graphql/subscription/todo/IterationAdded.gql'),
                    updateQuery: function(previousResult, { subscriptionData: { data: { iterationAdded }} }) {
                        if (iterationAdded.routineIteration) {
                            let routineIterations = this.getRoutineIterations(previousResult.routineIterations, this.selectedDate);
                            if (routineIterations[0]) {
                                let todoIterations = routineIterations[0].todoIterations;
                                todoIterations.splice(0, 0, iterationAdded);
                            }
                        }
                        return previousResult;
                    },
                },
                {
                    document: require('../../../../graphql/subscription/todo/IterationUpdated.gql'),
                    updateQuery: function(previousResult, { subscriptionData: { data: { iterationUpdated }} }) {
                        let routineIterations = this.getRoutineIterations(previousResult.routineIterations, this.selectedDate);
                        if (routineIterations[0]) {
                            let todoIterations = routineIterations[0].todoIterations;
                            replaceItem(iterationUpdated, todoIterations);
                        }
                        return previousResult;
                    },
                },
                {
                    document: require('../../../../graphql/subscription/todo/IterationDeleted.gql'),
                    updateQuery: function(previousResult, { subscriptionData: { data: { iterationDeleted }} }) {
                        let routineIterations = this.getRoutineIterations(previousResult.routineIterations, this.selectedDate);
                        if (routineIterations[0]) {
                            let todoIterations = routineIterations[0].todoIterations;
                            removeItem(iterationDeleted, todoIterations);
                        }
                        return previousResult;
                    },
                },
            ]
        },
    },
    computed: {
        pendingCount() { return this.pending.length },
        completeCount() { return this.complete.length },
        totalCount() { return this.pendingCount + this.completeCount },
        percentComplete() { return Percent(this.completeCount, this.totalCount); },
        pending() {
            if (this.showRecommended) {
                return this.iterations.pending;
            } else {
                return this.iterations.pending.filter(i => !i.isRecommended);
            }
        },
        complete() {
            if (this.showRecommended) {
                return this.iterations.complete;
            } else {
                return this.iterations.complete.filter(i => !i.isRecommended);
            }
        },
    },
    // computed: {
    //     pendingCount() { return (this.iterations.pending) ? this.iterations.pending.length : 0},
    //     completeCount() { return (this.iterations.complete) ? this.iterations.complete.length : 0 },
    //     totalCount() { return this.pendingCount + this.completeCount },
    //     percentComplete() { return Percent(this.completeCount, this.totalCount); },
    // },
    methods: {
        initIteration,
        getRoutineIterations,
        addNewTask,
        addTask,
        cancelAddTask,
        markNewTaskComplete,
        markComplete,
        markIncomplete,
        createDefaultTask,
        toggleCompletion,
        removeIteration,
        deleteIteration,
        replaceItem,
        removeItem,
        newIterations,
    },
    mounted: function() {
        // An error gets thrown if pollInterval is set with the query
        this.$apollo.queries.iterations.setOptions({
            fetchPolicy: 'cache-and-network',
            pollInterval: 50000,
        })
    },
    watch: {
        selectedDate(value) {
            let routineIterations = this.routineIterations.filter(routineIteration => { 
                    return routineIteration.routineIteration.startAt == value.toJSON()
            });

            if (routineIterations.length > 0) {
                let iterations = routineIterations[0].todoIterations
                iterations.complete = iterations.filter(iteration => iteration.completedAt);
                iterations.pending = iterations.filter(iteration => !iteration.completedAt);
                this.iterations = iterations;
            } else {
                this.iterations = {
                complete: [],
                pending: [],
                new: null
            };
            }
        },
        showRecommended(value) {
            localStorage.setItem(`show-recc-routine-items-by-custom`, value);
        },
    }
}

function initIteration() {
    return {
        id: this.newItemID--,
        text: '',
        startAt: new Date(),
        endAt: null,
        attemptedAt: null,
        completedAt: null,
        isRecommended: false,
    }
}

function getRoutineIterations(routineIterations, date) {
    return routineIterations.filter(routineIteration => 
        routineIteration.routineIteration.startAt == date.toJSON());
}

function addNewTask() {
    this.todos.new = this.initIteration();
    this.$nextTick(() => this.$refs.newTask.focus());
}

function addTask(iteration) {
    var title = iteration.text;
    if (title != "") {
        this.createDefaultTask(iteration, this.$apollo);
    }
    this.addNewTask();
}

function cancelAddTask() {
    this.todos.new = null;
}

function markNewTaskComplete(iteration) {
    var title = iteration.text;
    if (title != "") {
        let now = new Date();
        iteration.startAt = now;
        iteration.attemptedAt = now;
        iteration.completedAt = now;

        this.todos.new = null;

        this.createDefaultTask(iteration, this.$apollo);
    }
}

function markComplete(iteration) {
    this.toggleCompletion(iteration, this.$apollo);
}

function markIncomplete(iteration) {
    this.toggleCompletion(iteration, this.$apollo);
}

function removeIteration(iteration) {
    this.deleteIteration(iteration.id, this.$apollo);
}

function newIterations() {
    return {
        complete: [],
        pending: [],
        new: null
    }
}
</script>

<style scoped>
.custom {
    height: calc(100% - 64px);
    overflow: scroll;
}

.toolbar {
    padding: 8px;
    z-index: 3;
    background-color: white;
}

.item-list {
    /* margin-bottom: 8px; */
    z-index: 2;
}

ul {
    font-size: 14px;
    color: #343434;
    list-style: none;
    padding: 0px;
    margin: 0px;
    text-align: start;
}

.item-list li {
    position: relative;
}

.item-list li.recommended {
    opacity: .38;
}

.new-task {
    background-color: white;
    position: relative;
    z-index: 1;
    padding-right: 12px;
}

/* .pending {
    overflow: scroll;
} */

.complete {
    /* position: absolute; */
    bottom: 0;
}

.complete .header {
    background-color: white;
    z-index: 3;
    padding: 0 16px;
    font-size: 14px;
    font-family: SF Pro Rounded, 'Roboto', sans-serif;
    border-top: 1px solid #D8D8D8;
    height: 48px;
}
</style>