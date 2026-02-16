<template>
    <div v-if="todo" class="memorization-item-card d-flex flex-column">
        <div class="text-start mb-2">{{ todo.text }}</div>
        <TodoMemorizationTimeline :idTodo="idTodo" />
    </div>
</template>

<script>
import TodoMemorizationTimeline from './TodoMemorizationTimeline.vue';

export default {
    name: 'MemorizationItemCard',
    components: { TodoMemorizationTimeline },
    props: {
        idTodo: Number
    },
    data: function () {
        return {
            todoStore: undefined,
        }
    },
    created: async function() {
        let todoStore = await import(`@/store/todoStore`);
        this.todoStore = todoStore.useTodoStore();
    },
    computed: {
        todo() {
            if (this.todoStore) {
                let todo = this.todoStore.getItem(this.idTodo);
                return todo;
            }
            return undefined;
        },
    },
    methods: {
        
    },
}

</script>

<style scoped>

</style>