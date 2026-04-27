<template>
    <div v-if="todo && isShown">
        <div class="time-pair-list-item d-flex flex-row justify-content-between align-items-center" 
                :class="[{ complete: isComplete, recommended: isRecommended }]">
            <div class="d-flex flex-row align-items-center flex-grow-1 justify-content-between">
                <div class="d-flex flex-row">
                    <ItemCheckbox class="checkbox align-self-start" 
                                    :style="{ 'padding-left': `${(level-2)*padding}px` }"
                                    :isComplete="isComplete" 
                                    @onChecked="markComplete" 
                                    @onUnchecked="markIncomplete"
                                    @onDelete="onDelete">
                    </ItemCheckbox>
                    <div class="d-flex" :class="{ 'flex-column': points}">
                        <span v-if="points" class="points">{{ points }} pts</span>
                        <div class="d-flex flex-row align-items-center"
                                @click="showChildren = ! showChildren">
                            <!-- <div v-if="childTodos_SameRepeat.length || childTodos_InheritedRepeat.length" class="caret d-flex flex-row me-2">
                                <img v-if="!showChildren" class="caret-right" 
                                        src='/icon/caret-right.png' width="5" height="8"/>
                                <img v-if="showChildren" class="caret-down" 
                                        src='/icon/caret-down.png' width="8" height="5"/>
                            </div> -->
                            <span class="text flex-fill">{{ text }}</span>
                        </div>           
                    </div>
                </div>
            </div>
            <div class="button-group d-flex flex-column justify-content-between">
                <img class="icon-button" 
                    src='/icon/edit-button.png' width="16" height="16"
                    @click="onEdit"/>
                <img class="icon-button" 
                    src='/icon/delete-button.png' width="16" height="16"
                    @click="onDelete"/>
            </div>
        </div>
        <!-- <div v-if="showChildren" class="children d-flex flex-column">
            <RepeatListItem v-for="todoRepeat in childTodos_SameRepeat" :key="todoRepeat.id"
                :idRepeat="todoRepeat.idRepeat" :idTodo="todoRepeat.idTodo" :idTimeframe="idTimeframe" :level="level+1"/>
            <RepeatListItem v-for="todoRepeat in childTodos_InheritedRepeat" :key="todoRepeat.id"
                :idRepeat="todoRepeat.idRepeat" :idTodo="todoRepeat.idTodo" :idTimeframe="idTimeframe" :level="level+1"/>
        </div> -->
    </div>
</template>

<script>
import { clone, sum } from '../../../../../utility';
import ItemCheckbox from '../component/ItemCheckbox.vue';

export default {
    name: 'TimePairListItem',
    components: { ItemCheckbox },
    props: {
        idTimePair: Number,
        idTodo: Number,
        idTimeframe: Number,
        level: {
            type: Number,
            default: () => 2
        },
        showComplete: {
            type: Boolean,
            default: () => false
        }
    },
    data: function () {
        return {
            plannerStore: undefined,
            todoStore: undefined,
            iterationStore: undefined,
            showChildren: false,
            showChildren_SameRepeat: false,
            showChildren_InheriterRepeat: false,
            showIterations: false,
            padding: 12
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
            return (this.plannerStore) ? this.plannerStore.selectedDate : today();
        },
        isShown() {
            if (this.iterations == undefined) {
                return false;
            }
            if (!this.showComplete) {
                if (this.iteration && this.iteration.attemptedAt) { // If has attempted iteration
                    return false;
                } else { // If no iteration, or if iteration is incomlete
                    return true;
                }
            } else {
                if (this.iteration && this.iteration.attemptedAt) { // If has attempted iteration
                    return true;
                } else { // If no iteration, or if iteration is incomlete
                    return false;
                }
            }
        },
        timePair() {
            if (this.plannerStore) {
                let timePair = this.plannerStore.timePairs.find(x => x.id == this.idTimePair);
                return timePair;
            }
            return undefined;
        },
        unplannedCount() {

        },
        todo() {
            if (this.todoStore && this.timePair && this.todoID) {
                let todo = this.todoStore.getItem(this.todoID);
                return todo;
            }
        },
        todoID() {
            return  this.idTodo || this.timePair.idTodo;
        },
        text() {
            return (this.iteration) ? this.iteration.text : this.todo.text;
        },
        todoChildIDs() {
            return (this.todo) ? this.todo.childIDs : [];
        },
        startAt() {
            return this.timeAt("start");
        },
        endAt() {
            return this.timeAt("end");
        },
        // childTodos_SameTimePair() {
        //     let todoRepeats = this.repeat.todo_Repeats.filter(x => this.todoChildIDs.includes(x.idTodo));
        //     return todoRepeats;
        // },
        // childTodos_InheritedTimePair() {
        //     let todoRepeats = [];
        //     if (this.plannerStore) {
        //         let childRepeats = this.plannerStore.repeats.filter(x => x.idParent == this.idRepeat);
        //         childRepeats.forEach(childRepeat => {
        //             let todoRepeats_Child = childRepeat.todo_Repeats.filter(x => {
        //                 // Is owner
        //                 if (x.isOwner && this.todoChildIDs.includes(x.idTodo)) {
        //                     // Is child repeat active on selected (day of week or day of month)?
        //                     let isActive = this.plannerStore.isRepeatPlannedOnDate(x.idRepeat, this.selectedDate);
        //                     return isActive;
        //                 } else {
        //                     return false;
        //                 }
        //             });
        //             todoRepeats = [...todoRepeats, ...todoRepeats_Child];
        //         })
        //     }
        //     return todoRepeats;
        // },
        isOwner() {
            return this.timePair ? this.timePair.isOwner : false;
        },
        isRecommended() {
            return this.timePair ? this.timePair.isRecommended : false;
        },
        points() {
            return this.timePair.points || this.todo.points || 0;
        },
        pointsFamily() {
            let descendantIDs = this.todoStore.getDescendantIDs(this.todoID);
            if (this.iterationStore && this.iterations) {
                let iterations = this.iterationStore.getIterationsInTimeframe(this.idTimeframe, this.selectedDate);
                iterations = iterations.filter(x => descendantIDs.includes(x.todoID));
                iterations = iterations.filter(x => x.points);
                let descendantPoints = sum(iterations, 'points');
                let todoIterations = this.iterations.filter(x => x.points)
                let todoPoints = sum(todoIterations, 'points');
                return descendantPoints + todoPoints;
            }
            return this.timePair.points || this.todo.points || 0;
        },
        iterations() {
            if (this.iterationStore) {
                let iterations = this.iterationStore.getIterationsInTimeframe(this.idTimeframe, this.selectedDate);
                iterations = iterations.filter(x => x.idTodoTimePair == this.idTimePair);
                // iterations = (!this.showComplete) ? iterations.filter(x => x.attemptedAt || x.completedAt) : iterations.filter(x => !x.attemptedAt && !x.completedAt)

                return iterations;
            }
            return undefined;
        },
        iteration() {
            return (this.iterations && this.iterations.length) ? this.iterations[0] : undefined;
        },
        isComplete() {
            if (this.iteration && this.iteration.attemptedAt) {
                return true;
            } else {
                return false
            }
        },
    },
    methods: {
        timeAt,
        markComplete,
        markIncomplete,
        onEdit,
        onDelete
    },
}

function timeAt(timePair, endpoint) {
    return (timePair[`${endpoint}At`]) ? timePair[`${endpoint}At`] : undefined
}

function markComplete() {
    let now = new Date().toJSON();
    if (this.iteration) {
        this.iterationStore.toggleCompletion(this.iteration.id, now, now);
    } else {
        this.iterationStore.completeTimePairIteration(this.todoID, this.idTimePair, null, null, now, this.selectedDate, this.selectedDate);
    }
}

function markIncomplete() {
    this.iterationStore.toggleCompletion(this.iteration.id, null, null);
}

function onEdit() {
    let iteration =  clone(this.iteration);
    delete iteration.__typename;
    
    this.$emit('onEdit', iteration);
}

function onDelete() {
    if (this.iteration) {
        this.iterationStore.deleteIteration(this.iteration.id);
    }
}

</script>

<style scoped>
.time-pair-list-item {
    margin-top: 4px;
    user-select: none;
    padding: 4px 0px;
    font-size: 14px;
}

.time-pair.recommended {
    opacity: .5;
}

span {
    font-size: 12px;
    text-align: start;
}

.days span {
    border-radius: 4px;
}

.complete span {
    text-decoration: line-through;
}

.caret {
    min-width: 8px;
}

.checkbox {
    margin: auto 0;
}

.checkbox:hover {
    background-color: rgba(248, 248, 248, 1);
    border-radius: 24px;
}

.icon-button {
    border-radius: 8px;
    width: 16px;
}

.icon-button:hover {
    background-color: rgba(60, 64, 67, .10);
}

.button-group {
    width: 16px;
    margin: 0px 8px;
    visibility: hidden;
    z-index: 5;
}

.time-pair-list-item:hover .button-group {
    visibility: visible;
    margin-right: 10px;
}

.time-pair-list-item:hover {
    background-color: #F5F5F5;
    /* border-top: 1px solid #DCDCDC; */
    /* box-shadow: 0px -3px 5px 4px rgba(0,0,0,.5); */
    /* box-shadow: 0px -3px 5px 2px rgba(0,0,0,.5); */
}

/* I removed this because it was taking long to implement
   (shadow on bottom when clicked) */
.time-pair-list-item:active:hover {
    /* box-shadow: 0px -3px 5px 2px rgba(0,0,0,.5); */
    background-color: #D8D8D8;
}

.time-pair-list-item .points {
    font-size: 10px;
    color: #747474;
}

.time-pair-list-item .text {
    /* height: 14px;
    line-height: 15px; */
    line-height: 22px;
}

.children {
    /* padding-left: 12px; */
    z-index: 2;
}
</style>