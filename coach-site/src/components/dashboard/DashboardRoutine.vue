<template>
    <div class="dashboard-routine d-flex flex-column">
        <span class="text-start ms-2 mb-1">{{ routineName }}</span>
        <div class="d-flex flex-row justify-content-evenly flex-grow-1">
            <span v-for="iteration in iterations" :key="iteration.id"
                  class="dot" :class="{ complete: iteration.attemptedAt }"></span>
        </div>
    </div>
</template>

<script>

export default {
    name: 'DashboardRoutine',
    components: {  },
    props: {
        _event: Object
    },
    data: function () {
        return {
            eventStore: undefined,
        }
    },
    created: async function() {
        let eventStore = await import(`@/store/eventStore`);
        this.eventStore = eventStore.useEventStore();
    },
    computed: {
        eventt() { 
            if (this.eventStore) {
                let event = this.eventStore.events.find(_event => _event.id == this._event.id);
                return event;
            } else {
                return undefined;
            }
        },
        routineName() {
            return (this.eventt) ? this.eventt.text : "";
        },
        iterations() {
            let iterations = [];
            if (this.eventt) {
                iterations = this.eventt.iterations.filter(task => task.routineIterationID);
            }
            return iterations;
        },
        // completeIterations() { 
        //     if (this.eventt) {
        //         var complete = this.eventt.iterations.filter(task => task.attemptedAt && task.routineIterationID)
        //         return sortAsc(complete, 'id');
        //     } else {
        //         return [];
        //     }
        // },
        // incompleteIterations() { 
        //     if (this.eventt) {
        //         var incomplete = this.eventt.iterations.filter(task => !task.attemptedAt && task.routineIterationID) 
        //         return sortAsc(incomplete, 'id');
        //     } else {
        //         return [];
        //     }
        // },
    },
    methods: {
        
    },
}

</script>

<style scoped>
.dot {
    width: 10px;
    height: 10px;
    border-radius: 5px;
    border: solid #D8D8D8 1px;
}

.dot.complete {
    background-color: #46EA1B;
    border-color: #2FAB10;
}
</style>