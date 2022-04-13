<template>
    <div class="task d-flex" :class="{ complete: isComplete, incomplete: !isComplete }"
         draggable @dragstart="onDragStart($event)" @dragend="onDragEnd($event)">
        <div class="actions d-flex align-items-center">
            <img class="check button" width="14" height="14"
                 :src="`/icon/task-icon-${(isComplete)?'black':'white'}.png`"
                    @click="(isComplete) ? markIncomplete() : markComplete()"/>
            <img class="attempted button vanishing" width="14" height="14"
                 :src="`/icon/thumbs-up-${(isComplete)?'dark':'lite'}-2.png`"
                    @click="markAttempted()"/>
            <img class="delete button vanishing" width="14" height="14"
                 :src="`/icon/delete-${(isComplete)?'dark':'lite'}.png`"
                    @click="deleteTask()"/>
            <img class="next button vanishing" width="14" height="14"
                 :src="`/icon/next-${(isComplete)?'dark':'lite'}.png`" 
                    @click="toNextDay()"/>
         </div>
         <div class="text">{{ task.text }}</div>
    </div>
</template>

<script>
import { addDay } from "../../../../utility";
import { rescheduleIteration, attemptIteration, toggleCompletion, deleteIteration } from "../../../resolvers/todo-resolvers";

export default {
    name: 'Task',
    props: {
        task: Object
    },
    computed: {
        isComplete() {
            if (this.task.attemptedAt) {
                return true;
            } else {
                return false
            }
        }
    },
    methods: {
        rescheduleIteration,
        attemptIteration,
        toggleCompletion,
        toNextDay,
        markAttempted,
        markComplete,
        markIncomplete,
        deleteIteration,
        deleteTask,
        onDragStart,
        onDragEnd
    },
}

function toNextDay() {
    let nextDay = addDay(new Date(this.task.startAt));
    this.rescheduleIteration(this.task.id, nextDay, nextDay, this.$apollo);
}

function markAttempted() {
    this.attemptIteration(this.task.id, new Date(this.task.startAt), this.$apollo);
}

function markComplete() {
    let now = new Date();
    this.task.attemptedAt = now;
    this.task.completedAt = now;

    this.toggleCompletion(this.task, this.$apollo);
}

function markIncomplete() {
    this.task.attemptedAt = null;
    this.task.completedAt = null;

    this.toggleCompletion(this.task, this.$apollo);
}

function deleteTask() {
    this.deleteIteration(this.task.id, this.$apollo);
}

function onDragStart(ev) {
    let data = {
        type: "task",
        id: this.task.id
    };
    data = JSON.stringify(data);

    console.log("Drag Started");
    ev.target.classList.add("drag");
    ev.dataTransfer.dropEffect = 'move';
    ev.dataTransfer.effectAllowed = 'move';
    ev.dataTransfer.setData("text", data);
}

function onDragEnd(ev) {
    ev.target.classList.remove("drag");
}
</script>

<style scoped>
.task { 
    background-color: #F4501F;
    color: white;
    transition-property: color;
    transition-duration: 0.15s;
    transition-timing-function: ease-in-out;
    transition-delay: 0s;
    font-weight: 600;
    max-height: 20px;
    border-radius: 3px;
    margin-bottom: 2px;
    padding: 2px 8px 4px 8px;
    line-height: 14px;
    font-size: 12px;
    user-select: none;
    width: calc(100% - 8px);
    font-family: SF Pro Display, 'Roboto', sans-serif;
    position: relative;
}

.task.complete { 
    background-color: rgb(252, 203, 188);
    text-decoration: line-through;
    color: rgba(32,33,36,0.38);
    font-weight: 500;
}

.task .check {
    color: white;
    padding: 4px 4px 2px 0px;
    /* pointer-events: none; */
}

.task .text { 
    overflow: hidden;
    white-space: nowrap;
    /* margin-top: 1px; */
}

.button {
    border-radius: 7px;
    margin-top: 1px
}

.actions {
    width: 14px;
    transition-property: width;
    transition-duration: 0.15s;
    transition-timing-function: ease-in;
    overflow: clip;
}

.actions:hover {
    margin-right: 2px;
    width: 56px;
    transition-property: width;
    transition-duration: 0.15s;
    transition-timing-function: ease-in;
}

.task.incomplete .actions:hover > .button.vanishing {
    display: inline-block;
}

.task.incomplete:hover .button:hover {
    background-color: rgba(0, 0, 0, .5);
}

</style>