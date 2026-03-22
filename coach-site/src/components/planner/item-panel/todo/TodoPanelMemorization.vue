<template>
    <div class="todo-panel-memorization d-flex flex-column flex-grow-1 overflow-scroll ps-2 pe-2">
        <div v-if="!selectedTodoID" class="mt-2">
            <div class="d-flex flex-column">
                <h5>Active</h5>
                <MemorizationItemCard v-for="id in items.active" :key="id" 
                                      class="mb-2" 
                                      :id-todo="id"
                                      @click.prevent="selectedTodoID = id" />

            </div>
            <div class="d-flex flex-column">
                <h5>Missed</h5>
                <MemorizationItemCard v-for="id in items.missed" :key="id" 
                                      class="mb-2" 
                                      :id-todo="id"
                                      @click.prevent="selectedTodoID = id" />

            </div>
            <div class="d-flex flex-column">
                <h5>Pending</h5>
                <MemorizationItemCard v-for="id in items.pending" :key="id" 
                                      class="mb-2" 
                                      :id-todo="id"
                                      @click.prevent="selectedTodoID = id" />

            </div>
            <div class="d-flex flex-column">
                <h5>Backlog</h5>
                <MemorizationItemCard v-for="id in items.backlog" :key="id" 
                                      class="mb-2" 
                                      :id-todo="id"
                                      @click.prevent="selectedTodoID = id" />

            </div>
        </div>
        <TodoMemorizationItem v-if="selectedTodoID" :idTodo="selectedTodoID"
                              class="flex-grow-1"
                              @back="selectedTodoID = undefined" />
    </div>
</template>

<script>
import { sortDateAsc } from '../../../../../utility';
import { today } from '../../../../../utility/timeUtility';
import { TODOTYPE } from '../../../../model/constants';
import MemorizationItemCard from './component/MemorizationItemCard.vue';
import TodoMemorizationItem from './component/TodoMemorizationItem.vue';

export default {
    name: 'TodoPanelMemorization',
    components: { MemorizationItemCard, TodoMemorizationItem },
    props: {
        
    },
    data: function () {
        return {
            todoStore: undefined,
            iterationStore: undefined,
            selectedTodoID: undefined,
        }
    },
    created: async function() {
        let todoStore = await import(`@/store/todoStore`);
        this.todoStore = todoStore.useTodoStore();

        let iterationStore = await import(`@/store/iterationStore`);
        this.iterationStore = iterationStore.useIterationStore();

        this.todoStore.getMemorizationTodos(true);
        this.iterationStore.getIterationsOfTodoType(TODOTYPE.MEMORIZATION);
    },
    computed: {
        items() {
            let items = {
                active: [],
                pending: [],
                missed: [],
                backlog: []
            };

            if (this.iterationStore) {
                let todos = this.todoStore.getMemorizationTodos();
                let todoIDs_Mem = todos.map(todo => todo.id);
                let iterations = this.iterationStore.iterations.filter(iteration => todoIDs_Mem.includes(iteration.todoID));
                iterations = sortDateAsc(iterations, 'startAt');
                // Set missed, active, and pending todo ids
                iterations.forEach(iteration => {
                    if (!iteration.attemptedAt && !iteration.completedAt) {
                        // Missed
                        if (+iteration.startAt.toDate().startOfDay() < +today() && 
                            !items.missed.includes(iteration.todoID)) {
                                items.missed.push(iteration.todoID);
                        }
                        // Active
                        if (+iteration.startAt.toDate().startOfDay() == +today() && 
                            !items.active.includes(iteration.todoID)) {
                                items.active.push(iteration.todoID);
                        }
                        // Pending
                        if (+iteration.startAt.toDate().startOfDay() > +today() && 
                            !items.pending.includes(iteration.todoID)) {
                                items.pending.push(iteration.todoID);
                        }
                    }
                    let index = todoIDs_Mem.findIndex(x => x == iteration.todoID);
                    todoIDs_Mem.splice(index, 1);
                });
                // Set backlog todo ids
                items.backlog = [...todoIDs_Mem];
            }
            return items;
        },
    },
    methods: {

    },
}

</script>

<style scoped>

</style>