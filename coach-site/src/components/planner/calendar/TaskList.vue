<template>
    <div class="task-list d-flex flex-column flex-fill" 
         :style="{ 'min-height': height }"
         @drop="onDrop($event)" @dragover.prevent @dragenter.prevent>
        <Task v-for="(task, taskIndex) in taskList" :key="taskIndex" :task="task"></Task>
    </div>
  
</template>

<script>
import Task from "./Task.vue";
import { rescheduleIteration } from "../../../resolvers/todo-resolvers";
import { unmapTaskFromRoutineEvent, scheduleTodo } from "../../../resolvers/planner-resolvers";
// import { removeItem, replaceItem, sortAsc } from '../../../../utility';

export default {
    name: "TaskList",
    components: { Task },
    props: {
        date: Date,
        taskList: Array,
        minHeight: Number
    },
    data: function () {
        return {
            showRoutineTasks: false
        }
    },
    computed: {
        height() { return (this.minHeight) ? this.minHeight + "px" : "22px"}
    },
    methods: {
        onDrop,
        rescheduleIteration,
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
            this.rescheduleIteration(data.id, this.date, this.date, this.$apollo);
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