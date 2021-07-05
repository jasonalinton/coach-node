<template>
    <form id="goal-form">
        <!-- ID & Close Button -->
        <div class="d-flex flex-row justify-content-between mt-2">
            <span>{{ goal.id }}</span>
            <i class="btn btn-sm fas fa-times" @click="close"></i>
        </div>
        <!-- Title/Text -->
        <div class="form-group mt-2">
            <div class="form-floating">
                <input class="form-control form-control-lg" type="text" v-model.lazy.trim="goal.text" />
                <label>Title</label>
            </div>
        </div>
        <!-- Description -->
        <div class="form-group mt-2">
            <div class="form-floating">
                <textarea class="form-control form-control-sm" type="text" v-model="goal.description" />
                <label>Description</label>
            </div>
        </div>
        <!-- Metrics -->
        <ApolloQuery :query="require('../../../graphql/query/QueryMetrics.gql')">
            <template slot-scope="{ result: { error, data }, isLoading }">
                <div class="form-group mt-2">
                    <div class="d-flex justify-content-between align-items-center align-middle mb-1">
                        <h2>Metrics</h2>
                        <a class="btn btn-sm btn-link" type="button" 
                                data-bs-toggle="collapse" data-bs-target=".metrics.collapse" aria-controls="offcanvas-items">Edit</a>
                    </div>
                    <div class="metrics collapse">
                        <div v-if="isLoading" class="loading apollo">Loading...</div>
                        <div v-else-if="error" class="error apollo">An error occurred</div>
                        <SelectItem v-else-if="data" class="result apollo" :items="data['metrics']" :selectedItems="goal.metrics"></SelectItem>
                        <div v-else class="no-result apollo">No result :(</div>
                    </div>
                    <div class="list-group metrics collapse show">
                        <a href="#" class="list-group-item list-group-item-light list-group-item-action d-flex justify-content-between" v-for="metric in goal.metrics" v-bind:key="metric.id">
                            {{ metric.text }}
                            <i class="fas fa-times btn-sm" @click="unmapItem(goal, metric, 'metrics')"></i>
                        </a>
                    </div>
                </div>
            </template>
        </ApolloQuery>
        <!-- Todos -->
        <ApolloQuery :query="require('../../../graphql/query/QueryTodos.gql')">
            <template slot-scope="{ result: { error, data }, isLoading }">
                <div class="form-group mt-2">
                    <div class="d-flex justify-content-between align-items-center align-middle mb-1">
                        <h2>Todos</h2>
                        <a class="btn btn-sm btn-link" type="button" 
                                data-bs-toggle="collapse" data-bs-target=".todos.collapse" aria-controls="offcanvas-items">Edit</a>
                    </div>
                    <div class="todos collapse">
                        <div v-if="isLoading">Loading...</div>
                        <div v-else-if="error">An error occurred</div>
                        <SelectItem v-else-if="data" :items="data['todos']" :selectedItems="goal.todos"></SelectItem>
                        <div v-else>No result :(</div>
                    </div>
                    <div class="list-group todos collapse show">
                        <a href="#" class="list-group-item list-group-item-light list-group-item-action d-flex justify-content-between" v-for="todo in goal.todos" v-bind:key="todo.id">
                            {{ todo.text }}
                            <i class="fas fa-times btn-sm" @click="removeItem(todo, goal.todos)"></i>
                        </a>
                    </div>
                </div>
            </template>
        </ApolloQuery>
        <!-- Routines -->
        <ApolloQuery :query="require('../../../graphql/query/QueryRoutines.gql')">
            <template slot-scope="{ result: { error, data }, isLoading }">
                <div class="form-group mt-2">
                    <div class="d-flex justify-content-between align-items-center align-middle mb-1">
                        <h2>Routine</h2>
                        <a class="btn btn-sm btn-link" type="button" 
                                data-bs-toggle="collapse" data-bs-target=".routine.collapse" aria-controls="offcanvas-items">Edit</a>
                    </div>
                    <div class="routined collapse">
                        <div v-if="isLoading">Loading...</div>
                        <div v-else-if="error">An error occurred</div>
                        <SelectItem v-else-if="data" :items="data['routines']" :selectedItems="goal.routines"></SelectItem>
                        <div v-else>No result :(</div>
                    </div>
                    <div class="list-group routines collapse show">
                        <a href="#" class="list-group-item list-group-item-light list-group-item-action d-flex justify-content-between" v-for="routine in goal.routines" v-bind:key="routine.id">
                            {{ routine.text }}
                            <i class="fas fa-times btn-sm" @click="removeItem(routine, goal.routines)"></i>
                        </a>
                    </div>
                </div>
            </template>
        </ApolloQuery>
        <!-- Buttons -->
        <div class="form-group d-flex justify-content-end mt-2">
            <button class="btn btn-primary me-2" type="button" @click.prevent="save(goal)">Save</button>
            <button class="btn btn-warning" type="button" @click.prevent="close">Cancel</button>
        </div>
    </form>
</template>

<script>
import SelectItem from '../../controls/SelectItem.vue';
import { removeItem, unmapItem } from '../../../../utility';
import { addGoal, updateGoal } from '../../../resolvers/goal/goal-resolvers'

export default {
    name: 'GoalForm',
    components: { SelectItem },
    props: {
        goal: Object
    },
    methods: {
        save,
        addGoal,
        updateGoal,
        close,
        removeItem,
        unmapItem
    }
}

function save(goal) {
    var title = goal.text.trim();
    if (title == "") return;

    if (!goal.id) {
        this.addGoal(goal);
    } else {
        this.updateGoal(goal);
    }
    
    this.close();
}

function close() {
    this.$emit('closeForm');
}
</script>

<style scoped>
form {
    padding: 0px 10px
}

h2 {
    font-size: 16px;
    margin-bottom: 0px;
}
</style>