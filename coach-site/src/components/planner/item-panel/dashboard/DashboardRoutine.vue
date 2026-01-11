<template>
    <div class="dashboard-routine d-flex flex-grow-1 justify-content-between align-items-center gap-2 pe-2">
        <div class="d-flex flex-column flex-grow-1">
            <span class="text-start ms-2 mb-1">{{ routineName }}</span>
            <div class="d-flex flex-row justify-content-evenly flex-grow-1">
                <span v-for="iteration in todoIterations" :key="iteration.id"
                      class="dot" :class="{ complete: iteration.attemptedAt }"></span>
            </div>
        </div>
        <span class="verification" :class="{'verified': isVerified}"
              @click="toggleVerification">
        </span>
    </div>
</template>

<script>
import { endOfDay } from '../../../../../utility/timeUtility';

export default {
    name: 'DashboardRoutine',
    components: {  },
    props: {
        idRoutine: Number
    },
    data: function () {
        return {
            plannerStore: undefined,
            iterationStore: undefined,
            routineStore: undefined,
        }
    },
    created: async function() {
        let plannerStore = await import(`@/store/plannerStore`);
        this.plannerStore = plannerStore.usePlannerStore();

        let iterationStore = await import(`@/store/iterationStore`);
        this.iterationStore = iterationStore.useIterationStore();

        let routineStore = await import(`@/store/routineStore`);
        this.routineStore = routineStore.useRoutineStore();
    },
    computed: {
        selectedDate() {
            if (this.plannerStore) {
                return this.plannerStore.selectedDate;
            }
            return today();
        },
        routine() {
            if (this.routineStore) {
                let routine = this.routineStore.getItem(this.idRoutine);
                return routine;
            }
            return undefined;
        },
        routineName() {
            return (this.routine) ? this.routine.text : "";
        },
        routineIteration() {
            if (this.iterationStore) {
                let iterations = this.iterationStore.getIterationsInRange(this.selectedDate, endOfDay(this.selectedDate), false);
                let iteration = iterations.find(x => x.idRoutine == this.idRoutine);
                return iteration;
            }
            return undefined;
        },
        todoIterations() {
            if (this.routineIteration) {
                let iterations = this.iterationStore.iterations
                    .filter(x => x.routineIterationID == this.routineIteration.id);
                return iterations;
            }
            return [];
        },
        isVerified() {
            if (this.routineIteration) {
                return this.routineIteration.isVerified;
            }
            return false;
        }
    },
    methods: {
        toggleVerification
    },
}

function toggleVerification() {
    this.iterationStore.toggleVerification(this.routineIteration.id, !this.isVerified);
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

.verification {
    width: 20px;
    height: 20px;
    border-radius: 10px;
    border: solid #D8D8D8 1px;
}

.verification.verified {
    background-color: #46EA1B;
    border-color: #2FAB10;
}
</style>