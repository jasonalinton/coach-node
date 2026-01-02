<template>
    <div class="briefing-todos d-flex flex-column p-2">
        <h4 class="text-start" @click="isShown = !isShown">Todos</h4>
    </div>
</template>

<script>

export default {
    name: 'BriefingTodos',
    components: {  },
    props: {
        idTimeframe: {
            type: Number,
            default: () => 55
        },
        todoIDs: Array
    },
    data: function () {
        return {
            plannerStore: undefined,
            todoStore: undefined,
            isShown: false,
        }
    },
    created: async function() {
        let plannerStore = await import(`@/store/plannerStore`);
        this.plannerStore = plannerStore.usePlannerStore();

        let todoStore = await import(`@/store/todoStore`);
        this.todoStore = todoStore.useTodoStore();
    },
    computed: {
        selectedDate() {
            return (this.plannerStore) ? this.plannerStore.selectedDate : today();
        },
    },
    methods: {
        
    },
}

</script>

<style scoped>

</style>