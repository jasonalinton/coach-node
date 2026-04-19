<template>
    <div class="time-pair-list-item d-flex">
        <span v-if="todo">{{ todo.text }}</span>
    </div>
</template>

<script>

export default {
    name: 'TimePairListItem',
    components: {  },
    props: {
        idTimePair: Number
    },
    data: function () {
        return {
            plannerStore: undefined,
            todoStore: undefined,
        }
    },
    created: async function() {
        let plannerStore = await import(`@/store/plannerStore`);
        this.plannerStore = plannerStore.usePlannerStore();

        let todoStore = await import(`@/store/todoStore`);
        this.todoStore = todoStore.useTodoStore();
    },
    methods: {
        timeAt(timePair, endpoint) {
            return (timePair[`${endpoint}At`]) ? timePair[`${endpoint}At`] : undefined
        }
    },
    computed: {
        timePair() {
            if (this.plannerStore) {
                let timePair = this.plannerStore.timePairs.find(x => x.id == this.idTimePair);
                console.log(timePair)
                return timePair;
            }
            return undefined;
        },
        todo() {
            if (this.todoStore && this.timePair && this.timePair.idTodo) {
                let todo = this.todoStore.getItem(this.timePair.idTodo);
                return todo;
            }
        },
    }
}

</script>

<style scoped>

</style>