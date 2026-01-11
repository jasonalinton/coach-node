<template>
    <div class="dashboard-meal d-flex flex-grow-1 justify-content-between align-items-center gap-2 pe-2">
        <div class="d-flex flex-column flex-grow-1">
            <span class="text-start ms-2 mb-1">{{ mealName }}</span>
            <div class="d-flex flex-row justify-content-evenly flex-grow-1">
                <span v-for="iteration in iterations" :key="iteration.id"
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
    name: 'DashboardMeal',
    components: {  },
    props: {
        idTodo: Number
    },
    data: function () {
        return {
            plannerStore: undefined,
            todoStore: undefined,
            iterationStore: undefined,
        }
    },
    created: async function() {
        let plannerStore = await import(`@/store/plannerStore`);
        this.plannerStore = plannerStore.usePlannerStore();

        let todoStore = await import(`@/store/todoStore`);
        this.todoStore = todoStore.useTodoStore();

        let iterationStore = await import(`@/store/iterationStore`);
        this.iterationStore = iterationStore.useIterationStore();
    },
    computed: {
        selectedDate() {
            if (this.plannerStore) {
                return this.plannerStore.selectedDate;
            }
            return today();
        },
        todo() {
            if (this.todoStore) {
                let todo = this.todoStore.getItem(this.idTodo);
                return todo;
            }
            return undefined;
        },
        mealName() {
            return (this.todo) ? this.todo.text : "";
        },
        iterations() {
            if (this.iterationStore && this.todoStore) {
                let iterations = this.iterationStore.getIterationsInRange(this.selectedDate, endOfDay(this.selectedDate), false);
                iterations = iterations.filter(x => x.todoID == this.idTodo);
                return iterations;
            }
            return [];
        },
        isVerified() {
            let hasFalse = false;
            this.iterations.forEach(iteration => {
                if (!iteration.isVerified) {
                    hasFalse = true;
                }
            });
            return !hasFalse;
        }
    },
    methods: {
        toggleVerification
    },
}

function toggleVerification() {
    this.iterations.forEach(iteration => {
        this.iterationStore.toggleVerification(iteration.id, !this.isVerified);
    })
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