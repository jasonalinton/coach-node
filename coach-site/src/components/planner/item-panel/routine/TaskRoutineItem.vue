<template>
    <div v-if="routine" class="task-routine-item d-flex flex-column">
        <span class="text-start ps-2">{{ routine.text }}</span>
        <TaskRoutineListItem v-for="id in todoIDs" :key="id" 
                             :idTodo="id" :idTodo_Root="id"
                             :level="1" :idRoutineRepeat="repeatID" />
    </div>
</template>

<script>
import TaskRoutineListItem from './TaskRoutineListItem.vue';

export default {
    name: 'TaskRoutineItem',
    components: { TaskRoutineListItem },
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
        todoIDs() {
            return (this.routine) ? this.routine.todoIDs : [];
        },
        repeatID() {
            return (this.routine) ? this.routine.repeats[0].id : undefined;
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