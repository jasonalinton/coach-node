<template>
    <div class="fitness-goal-todo d-flex flex-column">
        <div class="d-flex flex-column">
            <span class="todo-title text-start"
                  @click="showForm = !showForm">
                  {{ exerciseName }}
            </span>
            <div v-if="!showForm" class="d-flex gap-2">
                <span v-for="(pill, index) in pills" :key="index"
                      class="pill" :class="{'success': pill.isMet}">
                      {{ `${pill.amount} ${pill.prop}` }}
                </span>
            </div>
        </div>


        <!-- <div class="d-flex flex-column">
            <span class="text-start">{{ `Volume Reps: ${volume.reps}` }}</span>
            <span class="text-start">{{ `Volume Weight: ${volume.weight}` }}</span>
            <span class="text-start">{{ `Volume Time: ${volume.time}` }}</span>
        </div> -->

        <!-- Form -->
        <div v-if="showForm" class="form">
            <div class="form-floating mb-2">
                <input type="number" class="form-control" :id="`fitness-goal-todo-${timePairTodo.id}-frequency`" placeholder="Frequency"
                       v-model.lazy.trim="fitnessGoal.frequency">
                <label :for="`fitness-goal-todo-${timePairTodo.id}-frequency`">Frequency</label>
            </div>
            <div class="form-floating mb-2">
                <input type="number" class="form-control" :id="`fitness-goal-todo-${timePairTodo.id}-sets`" placeholder="Sets"
                       v-model.lazy.trim="fitnessGoal.sets">
                <label :for="`fitness-goal-todo-${timePairTodo.id}-sets`">Sets</label>
            </div>
            <div class="form-floating mb-2">
                <input type="number" class="form-control" :id="`fitness-goal-todo-${timePairTodo.id}-reps`" placeholder="Reps"
                       v-model.lazy.trim="fitnessGoal.reps">
                <label :for="`fitness-goal-todo-${timePairTodo.id}-reps`">Reps</label>
            </div>
            <div class="form-floating mb-2">
                <input type="number" class="form-control" :id="`fitness-goal-todo-${timePairTodo.id}-weight`" placeholder="Weight"
                       v-model.lazy.trim="fitnessGoal.weight">
                <label :for="`fitness-goal-todo-${timePairTodo.id}-weight`">Weight</label>
            </div>
            <div class="form-floating mb-2">
                <input type="number" class="form-control" :id="`fitness-goal-todo-${timePairTodo.id}-time`" placeholder="Time"
                       v-model.lazy.trim="fitnessGoal.time">
                <label :for="`fitness-goal-todo-${timePairTodo.id}-time`">Time</label>
            </div>
            <div class="d-flex">
                <button type="button" class="btn btn-primary btn-sm float-start mb-2 me-1"
                        @click="save">
                        Save
                </button>
                <button type="button" class="btn btn-warning btn-sm float-start mb-2"
                        @click="showForm = false">
                        Cancel
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { firstDayOfWeek, lastDayOfWeek, today, sum, sortAsc} from '../../../../../utility';


export default {
    name: 'FitnessGoalTodo',
    components: {  },
    props: {
        timePairTodo: Object
    },
    data: function () {
        return {
            plannerStore: undefined,
            todoStore: undefined,
            workoutStore: undefined,
            showForm: false
        }
    },
    created: async function() {
        let plannerStore = await import(`@/store/plannerStore`);
        this.plannerStore = plannerStore.usePlannerStore();
    
        let todoStore = await import(`@/store/todoStore`);
        this.todoStore = todoStore.useTodoStore();

        let workoutStore = await import(`@/store/workoutStore`);
        this.workoutStore = workoutStore.useWorkoutStore();
    },
    computed: {
        selectedDate() {
            return (this.plannerStore) ? this.plannerStore.selectedDate : today();
        },
        start() {
            return (this.plannerStore) ? firstDayOfWeek(this.selectedDate) : today()
        },
        end() {
            return (this.plannerStore) ? lastDayOfWeek(this.selectedDate) : today()
        },
        idTodo() {
            return this.timePairTodo.todoID;
        },
        exercise() {
            if (this.workoutStore) {
                let exercise = this.workoutStore.getExerciseForTodo(this.idTodo);
                return exercise;
            }
            return undefined;
        },
        exerciseName() {
            return (this.exercise) ? this.exercise.name : "";
        },
        idFitnessGoal() {
            return (this.fitnessGoals.length > 0) ? this.fitnessGoals[0].id : undefined;
        },
        fitnessGoal() {
            return (this.fitnessGoals.length > 0) ? this.fitnessGoals[0] : {
                frequency: undefined,
                sets: undefined,
                reps: undefined,
                weight: undefined,
                time : undefined
            };
        },
        fitnessGoals() {
            return this.timePairTodo.fitnessGoals;
        },
        pills() {
            let pills = [];
            if (!this.fitnessGoal.weight && !this.fitnessGoal.time) {
                let goal = this.fitnessGoal.reps * this.fitnessGoal.sets;
                let setHistory = sortAsc(this.setHistory, 'volumnReps');
                for (let x = 0; x < this.fitnessGoal.frequency; x++) {
                    let history = setHistory.shift();
                    pills.push({
                        amount: goal,
                        prop: "rep",
                        isMet: (history && history.volumeReps >= goal)
                    });
                }
            } else if (this.fitnessGoal.weight) {
                let goal = this.fitnessGoal.reps * this.fitnessGoal.weight * this.fitnessGoal.sets;
                let setHistory = sortAsc(this.setHistory, 'volumeWeight');
                for (let x = 0; x < this.fitnessGoal.frequency; x++) {
                    let history = setHistory.shift();
                    pills.push({
                        amount: goal,
                        prop: "lbs",
                        isMet: (history && history.volumeWeight >= goal)
                    });
                }
            } else if (this.fitnessGoal.time) {
                let goal = this.fitnessGoal.reps * this.fitnessGoal.time * this.fitnessGoal.sets;
                let setHistory = sortAsc(this.setHistory, 'volumeTime');
                for (let x = 0; x < this.fitnessGoal.frequency; x++) {
                    let history = setHistory.shift();
                    pills.push({
                        amount: goal,
                        prop: "sec",
                        isMet: (history && history.volumeTime >= goal)
                    });
                }
            }
            return pills;
        },
        setHistory() {
            let history = [];
            if (this.exercise) {
                history = this.workoutStore.getExerciseHistory(this.exercise.id);
                history = history.filter(x => {
                    let date = x.date.toDate()
                    return (+date >= this.start && +date <= this.end);
                });
            }
            return history;
        },
        volume() {
            let volume = {
                reps: 0,
                weight: 0,
                time: 0
            };
            if (this.exercise) {
                let history = this.workoutStore.getExerciseHistory(this.exercise.id);
                history = history.filter(x => {
                    let date = x.date.toDate()
                    if (+date >= this.start && +date <= this.end) {
                        return true;
                    } else {
                        return false;
                    }
                });
                volume.reps = sum(history, "volumeReps");
                volume.weight = sum(history, "volumeWeight");
                volume.time = sum(history, "volumeTime");
            }
            return volume;
        }
    },
    methods: {
        save
    },
}

function save() {
    let frequency = this.fitnessGoal.frequency || undefined;
    let sets = this.fitnessGoal.sets || undefined;
    let reps = this.fitnessGoal.reps || undefined;
    let weight = this.fitnessGoal.weight || undefined;
    let time = this.fitnessGoal.time || undefined;

    if (!this.idFitnessGoal) {
        this.workoutStore.createFitnessGoal(this.timePairTodo.id, frequency, sets, reps, weight, time);
    } else {
        this.workoutStore.saveFitnessGoal(this.idFitnessGoal, frequency, sets, reps, weight, time);
    }
    this.showForm = false;
}
</script>

<style scoped>
.todo-title {
    color: var(--dark-gray);
    font-weight: 500;
}

.pill { 
    border: solid 1px #979797;
    border-radius: 30px;
    padding: 0px 8px;
}

.pill.success {
    background-color: #D8D8D8;
}
</style>