<template>
    <div class="task-routine-panel">
        <div v-for="routine in routines" ::key="routine.id" 
             class="task-routine">
            <span>{{ routine.text }}</span>
        </div>
    </div>
</template>

<script>

export default {
    name: 'TaskRoutinePanel',
    components: {  },
    props: {
        
    },
    data: function () {
        return {
            plannerStore: undefined,
            routineStore: undefined,
        }
    },
    created: async function() {
        let plannerStore = await import(`@/store/plannerStore`);
        this.plannerStore = plannerStore.usePlannerStore();

        let routineStore = await import(`@/store/routineStore`);
        this.routineStore = routineStore.useRoutineStore();
    },
    computed: {
        selectedDate() {
            return (this.plannerStore) ? this.plannerStore.selectedDate : today();
        },
        routines() {
            if (this.routineStore){
                let routines = this.routineStore.getTaskRoutinesForDay(this.selectedDate);
                console.log(routines)
                return routines;
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