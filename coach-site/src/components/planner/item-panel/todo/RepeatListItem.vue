<template>
    <div v-if="todo" class="repeat-list-item d-flex flex-column ps-4" :class="{ 'is-recommended': this.isRecommended}">
        <span>{{ `${points} pts` }}</span>
        <span v-if="pointsFamily">{{ `${pointsFamily} ptsFamily` }}</span>
        <span>{{ `${todo.text} - ${todo.id}` }}</span>
        <span>{{ `Repeat - ${repeat.id} ${(isOwner) ? 'Owner' : ''}` }}</span>
        <!-- Date-Time -->
        <div class="d-flex flex-column">
            <span v-if="startAt">{{ `Start: ${startAt}` }}</span>
            <span v-if="endAt">{{ `End: ${endAt}` }}</span>
        </div>
        <!-- Days -->
        <div class="days d-flex flex-row gap-2">
            <span v-for="dow in daysOfWeek" :key="dow.id">{{ dow.alt }}</span>
        </div>
        <!-- Children -->
        <div v-if="showChildren" class="d-flex flex-column">
            <RepeatListItem v-for="todoRepeat in childTodos_SameRepeat" :key="todoRepeat.id"
                :idRepeat="todoRepeat.idRepeat" :idTodo="todoRepeat.idTodo" :idTimeframe="idTimeframe" />
            <RepeatListItem v-for="todoRepeat in childTodos_InheritedRepeat" :key="todoRepeat.id"
                :idRepeat="todoRepeat.idRepeat" :idTodo="todoRepeat.idTodo" :idTimeframe="idTimeframe" />
        </div>
        <div v-if="childTodos_SameRepeat.length" class="d-flex flex-column">
            <span @click="showChildren_SameRepeat = !showChildren_SameRepeat">
                {{ `${childTodos_SameRepeat.length} Children From Same Repeat` }}
            </span>
            <div v-if="showChildren_SameRepeat" class="d-flex flex-column">
                <RepeatListItem v-for="todoRepeat in childTodos_SameRepeat" :key="todoRepeat.id"
                    :idRepeat="todoRepeat.idRepeat" :idTodo="todoRepeat.idTodo" :idTimeframe="idTimeframe" />
            </div>
        </div>
        <div v-if="childTodos_InheritedRepeat.length" class="d-flex flex-column">
            <span @click="showChildren_InheriterRepeat = !showChildren_InheriterRepeat">
                {{ `${childTodos_InheritedRepeat.length} Children From Inherited Repeats` }}
            </span>
            <div v-if="showChildren_InheriterRepeat" class="d-flex flex-column">
                <RepeatListItem v-for="todoRepeat in childTodos_InheritedRepeat" :key="todoRepeat.id"
                    :idRepeat="todoRepeat.idRepeat" :idTodo="todoRepeat.idTodo" :idTimeframe="idTimeframe" />
            </div>
        </div>
        <div v-if="iterations.length" class="d-flex flex-column">
            <span @click="showIterations = !showIterations">
                {{ `${iterations.length} Iterations` }}
            </span>
            <div v-if="showIterations" class="d-flex flex-column">
                <div class="d-flex flex-column">
                    <span v-for="iteration in iterations" :key="iteration.id">{{ iteration.text }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { clone, sortAsc, sum } from '../../../../../utility';
import { dow } from '../../../../model/types';



export default {
    name: 'RepeatListItem',
    components: {  },
    props: {
        idRepeat: Number,
        idTodo: Number,
        idTimeframe: Number
    },
    data: function () {
        return {
            plannerStore: undefined,
            todoStore: undefined,
            iterationStore: undefined,
            showChildren: false,
            showChildren_SameRepeat: false,
            showChildren_InheriterRepeat: false,
            showIterations: false
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
    methods: {
        repeatAt
    },
    computed: {
        selectedDate() {
            return (this.plannerStore) ? this.plannerStore.selectedDate : today();
        },
        repeat() {
            if (this.plannerStore) {
                let repeat = this.plannerStore.repeats.find(x => x.id == this.idRepeat);
                return repeat;
            }
            return undefined;
        },
        startAt() {
            return this.repeatAt("start");
        },
        endAt() {
            return this.repeatAt("end");
        },
        daysOfWeek() {
            if (this.repeat.dayIndecies.length > 0) {
                let cloned = clone(dow);
                let daysOfWeek = cloned.filter(d => this.repeat.dayIndecies.includes(d.index));
                daysOfWeek = sortAsc(daysOfWeek, 'index');
                return daysOfWeek;
            }
            return [];
        },
        unplannedCount() {

        },
        todo() {
            if (this.todoStore && this.repeat && (this.todoID)) {
                let todo = this.todoStore.getItem(this.todoID);
                return todo;
            }
        },
        todoID() {
            return  this.idTodo || this.repeat.idTodo;
        },
        todoChildIDs() {
            return (this.todo) ? this.todo.childIDs : [];
        },
        childTodos_SameRepeat() {
            let todoRepeats = this.repeat.todo_Repeats.filter(x => this.todoChildIDs.includes(x.idTodo));
            return todoRepeats;
        },
        childTodos_InheritedRepeat() {
            let todoRepeats = [];
            if (this.plannerStore) {
                let childRepeats = this.plannerStore.repeats.filter(x => x.idParent == this.idRepeat);
                childRepeats.forEach(childRepeat => {
                    let todoRepeats_Child = childRepeat.todo_Repeats.filter(x => {
                        // Is owner
                        if (x.isOwner && this.todoChildIDs.includes(x.idTodo)) {
                            // Is child repeat active on selected (day of week or day of month)?
                            let isActive = this.plannerStore.isRepeatPlannedOnDate(x.idRepeat, this.selectedDate);
                            return isActive;
                        } else {
                            return false;
                        }
                    });
                    todoRepeats = [...todoRepeats, ...todoRepeats_Child];
                })
            }
            return todoRepeats;
        },
        todoRepeat() {
            return this.repeat ? this.repeat.todo_Repeats.find(x => x.idTodo == this.todoID) : undefined;
        },
        isOwner() {
            return this.todoRepeat ? this.todoRepeat.isOwner : false;
        },
        isRecommended() {
            return this.todoRepeat ? this.todoRepeat.isRecommended : false;
        },
        points() {
            return this.todoRepeat.points || this.todo.points || 0;
        },
        pointsFamily() {
            let descendantIDs = this.todoStore.getDescendantIDs(this.todoID);
            if (this.iterationStore) {
                let iterations = this.iterationStore.getIterationsInTimeframe(this.idTimeframe, this.selectedDate);
                iterations = iterations.filter(x => descendantIDs.includes(x.todoID));
                iterations = iterations.filter(x => x.points);
                let descendantPoints = sum(iterations, 'points');
                let todoIterations = this.iterations.filter(x => x.points)
                let todoPoints = sum(todoIterations, 'points');
                return descendantPoints + todoPoints;
            }
            return this.todoRepeat.points || this.todo.points || 0;
        },
        iterations() {
            if (this.iterationStore) {
                let iterations = this.iterationStore.getIterationsInTimeframe(this.idTimeframe, this.selectedDate);
                iterations = iterations.filter(x => x.repeatID == this.idRepeat && x.todoID == this.todoID);
                return iterations;
            }
            return [];
        }
    }
}

function repeatAt(endpoint) {
    let datetime = ``;
    if (this.repeat[`${endpoint}Date`]) {
        datetime += this.repeat[`${endpoint}Date`];
    }
    if (this.repeat[`${endpoint}Date`] && this.repeat[`${endpoint}Time`]) {
        datetime += " ";
    }
    if (this.repeat[`${endpoint}Time`]) {
        datetime += this.repeat[`${endpoint}Time`];
    }

    return (!this.repeat[`${endpoint}Date`] && !this.repeat[`${endpoint}Time`]) ? undefined : datetime;
}


</script>

<style scoped>
.repeat-list-item {
    margin-top: 4px;
}

.repeat-list-item.is-recommended {
    opacity: .5;
}

span {
    font-size: 12px;
    text-align: start;
}

.days span {
    border-radius: 4px;
}

</style>