<template>
    <div class="task-list d-flex flex-column flex-fill" 
         :style="{ 'min-height': height }"
         @drop="onDrop($event)" @dragover.prevent @dragenter.prevent>
        <Task v-for="(task, taskIndex) in iterations" :key="taskIndex" :task="task"></Task>
    </div>
  
</template>

<script>
import Task from "./Task.vue";
import { unmapTaskFromRoutineEvent, scheduleTodo } from "../../../resolvers/planner-resolvers";
import { sortAsc } from '../../../../utility';
import { startOfDay } from '../../../../utility/timeUtility';

export default {
    name: "TaskList",
    components: { Task },
    props: {
        date: Date,
        taskList: Array,
        minHeight: Number
    },
    created: async function() {
        let iterationStore = await import(`@/store/iterationStore`);
        this.iterationStore = iterationStore.useIterationStore();
    },
    data: function () {
        return {
            iterationStore: undefined,
            showRoutineTasks: false
        }
    },
    computed: {
        height() { return (this.minHeight) ? this.minHeight + "px" : "22px"},
        iterations() { 
            if (this.iterationStore) {
                let start = startOfDay(this.date);
                let end = startOfDay(this.date);

                let iterations = this.iterationStore.iterations;
                iterations = iterations.filter(iteration => {
                    return +new Date(iteration.startAt) >= +start && 
                           +new Date(iteration.endAt) <= +end &&
                           !iteration.isRepeat;
                });
                iterations = iterations.filter(iteration => iteration.idRoutine == null && iteration.idRoutineIteration == null);
                iterations = sortAsc(iterations, 'startAt');
                return iterations;
            } else {
                return [];
            }
        },
    },
    methods: {
        onDrop,
        unmapTaskFromRoutineEvent,
        scheduleTodo
    }
}

function onDrop(ev) {
    ev.preventDefault();
    
    let data = ev.dataTransfer.getData("text");
    data = JSON.parse(data);

    if (data.type && data.type == "task") {
        /* If routine event, first unmap task from event and routine iteration */
        if (data.parentType && data.parentType == "routineEvent") {
            this.unmapTaskFromRoutineEvent(data.id, data.parentID, this.date, null, null, this.$apollo);
        } else {
            this.iterationStore.rescheduleIteration(data.id, this.date, this.date);
        }
    } else if (data.type && data.type == "todo") {
        if (data.parentType && data.parentType == "goal") {
            this.scheduleTodo(data.id, this.date, null, this.$apollo);
        } 
    }
}
</script>

<style scoped>
.task-list {
    overflow: scroll;
}

/* .task-list:-moz-drag-over {
    
} */

</style>