<template>
    <div class="todo-panel-memorization d-flex flex-column flex-grow-1 overflow-scroll ps-2 pe-2">
        <div v-if="!selectedTodoID" class="mt-2">
            <div class="d-flex flex-column">
                <h5>Active</h5>
                <MemorizationItemCard v-for="data in activeItems" :key="data.id" 
                                      class="mb-2" 
                                      :id-todo="data.id"
                                      @click.prevent="selectedTodoID = data.id" />

            </div>
            <div class="d-flex flex-column">
                <h5>Pending</h5>
                <MemorizationItemCard v-for="data in pendingItems" :key="data.id" 
                                      class="mb-2" 
                                      :id-todo="data.id"
                                      @click.prevent="selectedTodoID = data.id" />

            </div>
            <div class="d-flex flex-column">
                <h5>Missed</h5>
                <MemorizationItemCard v-for="data in missedItems" :key="data.id" 
                                      class="mb-2" 
                                      :id-todo="data.id"
                                      @click.prevent="selectedTodoID = data.id" />

            </div>
            <div class="d-flex flex-column">
                <h5>Backlog</h5>
                <MemorizationItemCard v-for="data in backlogItems" :key="data.id" 
                                      class="mb-2" 
                                      :id-todo="data.id"
                                      @setStatus="setStatus(data, $event)"
                                      @click.prevent="selectedTodoID = data.id" />

            </div>
        </div>
        <TodoMemorizationItem v-if="selectedTodoID" :idTodo="selectedTodoID"
                              class="flex-grow-1"
                              @back="selectedTodoID = undefined" />
    </div>
</template>

<script>
import { sortDateDesc } from '../../../../../utility';
import { today } from '../../../../../utility/timeUtility';
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

    },
    computed: {
        todoDatas() {
            let todoDatas = [];
            if (this.todoStore && this.iterationStore) {
                let todos = this.todoStore.getMemorizationTodos();
                todos.forEach(todo => {
                    let iterations = this.iterationStore.iterations.filter(task => task.todoID == todo.id);
                    iterations = sortDateDesc(iterations, 'startAt');
                    if (iterations.length > 0) {
                        if (+iterations[0].startAt.toDate().startOfDay() < +today()) {
                            /* Missed */
                            let lastFour = iterations[0].text.substring(iterations[0].text.length - 4);
                            if (lastFour != "(D30)") {
                                todoDatas.push({
                                    id: todo.id,
                                    status: "missed"
                                });
                            }
                        } else if (+iterations[0].startAt.toDate().startOfDay() == +today()) {
                            /* Active */
                            if (!iterations[0].attemptedAt) {
                                todoDatas.push({
                                    id: todo.id,
                                    status: "active"
                                })
                            }
                        } else if (!iterations[0].attemptedAt) {
                            /* Pending */
                            todoDatas.push({
                                id: todo.id,
                                status: "pending"
                            })
                        }
                    } else {
                        /* Backlog */
                        todoDatas.push({
                            id: todo.id,
                            status: "backlog"
                        });
                    }
                });
            }
            return todoDatas;
        },
        activeItems() { 
            return this.todoDatas.filter(x => x.status == 'active'); 
        },
        pendingItems() { 
            return this.todoDatas.filter(x => x.status == 'pending'); 
        },
        missedItems() { 
            return this.todoDatas.filter(x => x.status == 'missed'); 
        },
        backlogItems() { 
            return this.todoDatas.filter(x => x.status == 'backlog'); 
        },
    },
    methods: {

    },
}

</script>

<style scoped>

</style>