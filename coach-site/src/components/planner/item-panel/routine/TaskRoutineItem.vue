<template>
    <div v-if="routine" class="task-routine-item d-flex flex-column">
        <span class="text-start ps-2">{{ routine.text }}</span>
        <span v-for="todo in todos" :key="todo.id" 
              class="todo text-start ps-2">
              {{ todo.text }}
        </span>
    </div>
</template>

<script>

export default {
    name: 'TaskRoutineItem',
    components: {  },
    props: {
        idRoutine: Number
    },
    data: function () {
        return {
            routineStore: undefined,
            todoStore: undefined,
        }
    },
    created: async function() {
        let routineStore = await import(`@/store/routineStore`);
        this.routineStore = routineStore.useRoutineStore();

        let todoStore = await import(`@/store/todoStore`);
        this.todoStore = todoStore.useTodoStore();
    },
    computed: {
        routine() {
            if (this.routineStore) {
                let routine = this.routineStore.getItem(this.idRoutine);
                return routine;
            }
            return undefined;
        },
        todos() {
            if (this.todoStore && this.routine) {
                let todos = this.todoStore.getItemsByID(this.routine.todoIDs);
                return todos;
            }
            return [];
        }
    },
    methods: {
        
    },
}

</script>

<style scoped>
.todo { 
    color: var(--gray-text)
}
</style>