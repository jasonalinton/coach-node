<template>
    <ApolloQuery :query="require('../../../graphql/query/QueryTodos.gql')">
        <template slot-scope="{ result: { data } }">
            <div class="row g-0">
                <div class="col">
                    <table class="table table-striped table-hover">
                        <thead class="thead-light">
                            <tr>
                                <th>ID</th>
                                <th>Text</th>
                                <th>Description</th>
                                <th>Metrics</th>
                                <th>Goals</th>
                                <th>Routines</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="todo in data.todos" :key="todo.id">
                                <td>{{ todo.id }}</td>
                                <td>{{ todo.text }}</td>
                                <td>{{ todo.description }}</td>
                                <td class="d-none d-lg-table-cell">{{ listToString(todo.metrics) }}</td>
                                <td class="d-none d-lg-table-cell">{{ listToString(todo.goals) }}</td>
                                <td class="d-none d-lg-table-cell">{{ listToString(todo.routines) }}</td>
                                <td>
                                    <div>
                                        <!-- <button class="btn btn-primary btn-sm float-start" type="button" @click.prevent="edit(todo)">
                                            <i class="far fa-edit">Edit</i>
                                        </button> -->
                                        <button class="btn btn-secondary btn-sm float-end" type="button" @click.prevent="deleteMetric(todo)">
                                            <i class="far fa-trash-alt">Delete</i>
                                        </button>
                                    </div>
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>
        </template>
    </ApolloQuery>
    
</template>

<script>
export default {
    name: 'TodoItem',
    data: function() {
        return {
            todos: []
        }
    },
    methods: {
        listToString: function(objectArray) {
            let string = "";
            let index = 0;
            objectArray.forEach(object => {
                if (index++ !== 0)
                    string += ", ";

                string += object.text;
            });
            return string;
        }
    }
    // apollo: {  todos }
}
</script>

<style scoped>
table {
    text-align: start;
}

/* table th:nth-child(1) {
    width: 40px;
} */

/* table th:nth-child(2) {
    width: 100px;
} */

/* table th:nth-child(3) {
    width: 200px;
} */

table th:last-child {
    width: 130px;
}
</style>