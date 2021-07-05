<template>
    <ApolloQuery :query="require('../../../graphql/query/QueryGoals.gql')" @result="(res)=>goals=res.data.goals">
        <template slot-scope="{ result: { error, data }, isLoading }">
            <!-- Loading -->
            <div v-if="isLoading">Loading...</div>
            <!-- Error -->
            <div v-else-if="error">An error occurred</div>
            <div v-else-if="data" class="row g-0 h-100">
                <div class="col h-100">
                    <table class="table table-striped table-hover h-100">
                        <thead id="goal-thead" class="thead-light">
                            <tr>
                                <th>ID</th>
                                <th>Text</th>
                                <th>Description</th>
                                <th class="d-none d-lg-table-cell">Metrics</th>
                                <th class="d-none d-lg-table-cell">Routines</th>
                                <th class="d-none d-lg-table-cell">Todos</th>
                                <th><button type="button" @click="addGoal">Add</button></th>
                            </tr>
                        </thead>
                        <tbody :style="{ 'height': `${bodyHeight}px`}">
                            <tr v-for="goal in data.goals" :key="goal.id" @click.prevent="$emit('goalSelected', goal)">
                                <td>{{ goal.id }}</td>
                                <td>{{ goal.text }}</td>
                                <td>{{ goal.description }}</td>
                                <td class="d-none d-lg-table-cell">{{ listToString(goal.metrics, 'text') }}</td>
                                <td class="d-none d-lg-table-cell">{{ listToString(goal.routines, 'text') }}</td>
                                <td class="d-none d-lg-table-cell">{{ listToString(goal.todos, 'text') }}</td>
                                <td>
                                    <div class="d-flex justufy-content-center">
                                        <button class="btn btn-secondary btn-sm float-end" type="button" @click.prevent.stop="onDeleteGoal(goal)">
                                            <i class="far fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>
            <!-- No result -->
            <div v-else class="no-result apollo">No result :(</div>
        </template>
        <ApolloSubscribeToMore :document="require('../../../graphql/subscription/GoalDeleted.gql')" :updateQuery="unmapGoal">
        </ApolloSubscribeToMore>
        <ApolloSubscribeToMore 
            :document="require('../../../graphql/subscription/MetricUpdated.gql')"
            :updateQuery="metricUpdated">
        </ApolloSubscribeToMore>
    </ApolloQuery>
</template>

<script>
import $ from "jquery";
import { listToString, removeItem } from '../../../../utility';
import deleteGoal from '../../../remote/mutations/delete-goal'

export default {
    name: 'GoalTable',
    props: {
        newGoals: []
    },
    data: function() {
        return {
            goals: [],
            bodyHeight: undefined
        }
    },
    mounted: function() {
        this.onResize();
    },
    
    created: function () {
        window.addEventListener('resize', this.onResize);
    },
    methods: {
        listToString,
        onResize,
        deleteGoal,
        onDeleteGoal,
        unmapGoal,
        addGoal,
        metricUpdated,
    }
}

function onResize() {
    this.bodyHeight = $('#goal-table').height() - $('#goal-thead').height();
}

function onDeleteGoal(goal) {
    this.$emit('closeForm');
    this.deleteGoal(goal);
}

function unmapGoal(previousResult, { subscriptionData }) {
    let id = subscriptionData.data.goalDeleted.id
    let goal = previousResult.goals.find(goal => goal.id == id);
    removeItem(goal, previousResult.goals);
}

function addGoal() {
    let goal = {
        text: "",
        description: "",
        parents: [],
        children: [],
        metrics: [],
        todos: [],
        routines: []
    };

    this.$emit('goalSelected', goal)
}

function metricUpdated(previousResult, { subscriptionData }) {
    let metric = subscriptionData.data.metricUpdated;
    let id = metric.id;

    metric.goals.forEach(_goal => {
        let goal = this.goals.find(goal => goal.id == _goal.id);
        if (!goal.metrics.some(_metric => _metric.id == id)) {
            goal.metrics.push(metric);
        }

    })
}
</script>

<style scoped>
    table {
        text-align: start;
    }

    table th:last-child {
        width: 50px;
    }

    th {
        position: sticky;
        top: 0
    }

    td {
        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>