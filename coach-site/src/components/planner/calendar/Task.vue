<template>
    <div class="task d-flex" :class="{ complete: task.attemptedAt, incomplete: !task.attemptedAt }"
         draggable @dragstart="onDragStart($event)" @dragend="onDragEnd($event)">
        <img class="check" :src="`/icon/task-icon-${(task.attemptedAt)?'black':'white'}.png`" width="14" height="14"/>
        <div>{{ task.text }}</div>
        <img class="next button" :src="`/icon/next-${(task.attemptedAt)?'dark':'lite'}.png`" 
                width="14" height="14"
                @click="toNextDay(task)"/>
        <img class="attempted button" :src="`/icon/thumbs-up-${(task.attemptedAt)?'dark':'lite'}-2.png`"
                width="14" height="14"
                @click="markAttempted(task)"/>
    </div>
</template>

<script>
import { rescheduleIteration, attemptIteration } from "../../../resolvers/todo-resolvers";
import { addDay } from "../../../../utility";

export default {
    name: 'Task',
    props: {
        task: Object
    },
    methods: {
        rescheduleIteration,
        toNextDay,
        attemptIteration,
        markAttempted,
        onDragStart,
        onDragEnd
    },
}

function toNextDay(iteration) {
    let nextDay = addDay(new Date(iteration.startAt));
    this.rescheduleIteration(iteration.id, nextDay, this.$apollo);
}

function markAttempted(iteration) {
    this.attemptIteration(iteration.id, new Date(iteration.startAt), this.$apollo);
}

function onDragStart(ev) {
    console.log("Drag Started")
    ev.target.classList.add("drag");
    ev.dataTransfer.dropEffect = 'move'
    ev.dataTransfer.effectAllowed = 'move'
    ev.dataTransfer.setData("text", `${this.task.id}`)
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

.task.incomplete:hover {
    color: rgba(255, 255, 255, .38);
    transition-property: color;
    transition-duration: 0.15s;
    transition-timing-function: ease-in-out;
    transition-delay: 0s;
}

.task.complete { 
    background-color: rgb(252, 203, 188);
    /* opacity: .5; */
    text-decoration: line-through;
    color: rgba(32,33,36,0.38);
    font-weight: 500;
}

.task .check {
    color: white;
    padding: 4px 4px 2px 0px;
    pointer-events: none;
}

.task div { 
    overflow: hidden;
    white-space: nowrap;
}

.button {
    position: absolute;
    border-radius: 7px;
    visibility: hidden;
    margin-top: 1px
}

.task.incomplete:hover .button {
    visibility: visible;
}

.task.incomplete:hover .button:hover {
    background-color: rgba(0, 0, 0, .5);
}

.attempted {
    right: 18px;
}

.next {
    right: 2px;
}

</style>