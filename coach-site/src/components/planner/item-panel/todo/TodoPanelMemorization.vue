<template>
    <div class="todo-panel-memorization d-flex flex-column flex-grow-1 overflow-scroll ps-2 pe-2">
        <div v-if="!selectedTodoID" class="mt-2">
            <MemorizationItemCard v-for="todoID in todoIDs" :key="todoID" 
                                  class="mb-2" 
                                  :id-todo="todoID"
                                  @click.prevent="selectedTodoID = todoID" />
        </div>
        <TodoMemorizationItem v-if="selectedTodoID" :idTodo="selectedTodoID"
                              class="flex-grow-1"
                              @back="selectedTodoID = undefined" />
    </div>
</template>

<script>
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
            selectedTodoID: undefined
        }
    },
    created: async function() {
        let todoStore = await import(`@/store/todoStore`);
        this.todoStore = todoStore.useTodoStore();
    },
    computed: {
        todoIDs() {
            if (this.todoStore) {
                let todos = this.todoStore.getMemorizationTodos();
                return todos.map(x => x.id);
            }
            return [];
        }
    },
    methods: {
        
    },
}

</script>

<style scoped>

</style>