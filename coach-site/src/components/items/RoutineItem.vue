<template>
    <ApolloQuery :query="require('../../graphql/query/QueryRoutines.gql')">
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
                            <tr v-for="routine in data.routines" :key="routine.id">
                                <td>{{ routine.id }}</td>
                                <td>{{ routine.text }}</td>
                                <td>{{ routine.description }}</td>
                                <td class="d-none d-lg-table-cell">{{ listToString(routine.metrics) }}</td>
                                <td class="d-none d-lg-table-cell">{{ listToString(routine.goals) }}</td>
                                <td class="d-none d-lg-table-cell">{{ listToString(routine.routines) }}</td>
                                <td>
                                    <div>
                                        <button class="btn btn-primary btn-sm float-start" type="button" @click.prevent="edit(routine)">
                                            <i class="far fa-edit">Edit</i>
                                        </button>
                                        <button class="btn btn-secondary btn-sm float-end" type="button" @click.prevent="deleteMetric(routine)">
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
    name: 'RoutineItem',
    data: function() {
        return {
            routines: []
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
    // apollo: {  routines }
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