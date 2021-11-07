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

export default {
    name: "TaskList",
    components: { Task },
    props: {
        date: Date,
        taskList: Array,
        minHeight: Number
    },
    computed: {
        height() { return (this.minHeight) ? this.minHeight + "px" : "initial"}
    },
    methods: {
        onDrop,
        rescheduleIteration
    }
}

function onDrop(ev) {
    ev.preventDefault();
    let id = parseInt(ev.dataTransfer.getData("text"));
    this.rescheduleIteration(id, this.date, this.$apollo);
}
</script>

<style scoped>
.task-list {
    overflow: scroll;
}

/* .task-list:-moz-drag-over {
    
} */

</style>