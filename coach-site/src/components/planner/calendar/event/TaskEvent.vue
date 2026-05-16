<template>
    <div v-if="taskModel" class="task d-flex flex-column" :class="{ complete: isComplete, incomplete: !isComplete }"
         :style="{ 'top': `${top}px`, 'z-index': 1, 'height': `${height}px` }"
         @click.stop="selectTask">
        <div class="top-anchor" :style="{ 'height': `${paddingTopBottom}px` }"
             @click.stop></div>
        <div class="task-body d-flex flex-column overflow-hidden flex-grow-1"
             draggable="true" @dragstart="onDragStart($event)" @dragend="onDragEnd($event)">
            <!-- <div class="actions d-flex align-items-center">
                <img class="check button" width="14" height="14"
                     :src="`/icon/task-icon-${(isComplete)?'black':'white'}.png`"
                        @click.stop="(isComplete) ? markIncomplete() : markComplete()"/>
                <img class="attempted button vanishing" width="14" height="14"
                     :src="`/icon/thumbs-up-${(isComplete)?'dark':'lite'}-2.png`"
                        @click.stop="markAttempted()"/>
                <img class="delete button vanishing" width="14" height="14"
                     :src="`/icon/delete-${(isComplete)?'dark':'lite'}.png`"
                        @click.stop="deleteTask()"/>
                <img class="next button vanishing" width="14" height="14"
                     :src="`/icon/next-${(isComplete)?'dark':'lite'}.png`" 
                        @click.stop="toNextDay()"/>
             </div> -->
             <div class="text">{{ task.text }}</div>
        </div>
        <div class="bottom-anchor" :style="{ 'height': `${paddingTopBottom}px` }"
             @mousedown.stop="onDragStart_Bottom"
             @click.stop></div>
    </div>
</template>

<script>
import { addDay, clone } from '../../../../../utility';
import { getDurationInMinutes } from '../../../../../utility/timeUtility';

export default {
    name: 'TaskEvent',
    props: {
        idTask: Number,
        minuteHeight: Number,
        zIndex: Number
    },
    data: function() {
        return {
            appStore: undefined,
            plannerStore: undefined,
            eventStore: undefined,
            iterationStore: undefined,
            task: undefined,
            paddingTopBottom: 4,
            resizing: undefined,
            currentY: undefined,
            initialStart: undefined,
            initialEnd: undefined
        }
    },
    created: async function() {
        let appStore = await import(`@/store/appStore`);
        this.appStore = appStore.useAppStore();

        let plannerStore = await import(`@/store/plannerStore`);
        this.plannerStore = plannerStore.usePlannerStore();

        let eventStore = await import(`@/store/eventStore`);
        this.eventStore = eventStore.useEventStore();

        let iterationStore = await import(`@/store/iterationStore`);
        this.iterationStore = iterationStore.useIterationStore();
    },
    computed: {
        taskModel() {
            if (this.iterationStore) {
                let task =  this.iterationStore.getIteration(this.idTask);
                return task;
            } else {
                return undefined;
            }
        },
        top() {
            let datetime = this.task.startAt.toDate();
            let min = datetime.getMinutes();
            let marginTop = this.minuteHeight * min;
            return marginTop;
        },
        height() {
            return this.minuteHeight * this.minutes;
        },
        mouseY() { return (this.eventStore) ? this.eventStore.mouseY : undefined; },
        startY: {
            get() {
                return this.eventStore ? this.eventStore.startY : undefined;
            },
            set(value) {
                if (this.eventStore) {
                    this.eventStore.startY = value;
                }
            }
        },
        minutes() { return getDurationInMinutes(new Date(this.task.startAt), new Date(this.task.endAt)); },
        isComplete() {
            if (this.task.attemptedAt) {
                return true;
            } else {
                return false
            }
        }
    },
    methods: {
        onDragStart_Bottom,
        onDrag_Bottom,
        toNextDay,
        markAttempted,
        markComplete,
        markIncomplete,
        deleteTask,
        onDragStart,
        onDragEnd,
        onResizeEnd,
        updateBottom,
        selectTask
    },
    watch: {
        taskModel() {
            this.task = clone(this.taskModel);
        },
        mouseY() {
            this.onDrag_Bottom();
        },
        startY() {
            if (this.startY == undefined) {
                if (this.resizing == "top") {
                    this.updateTop();
                } else if (this.resizing == "bottom") {
                    this.updateBottom();
                }
            }
        }
    }
}

function onDragStart_Bottom(ev) {
    this.resizing = "bottom";
    this.startY = ev.clientY;
    this.initialEnd = this.task.endAt;
    console.log("Drag started at: " + this.startY);
}

function onDrag_Bottom(ev) {
    
    if (this.resizing == "bottom") {
        console.log("Dragging at: " + this.eventStore.mouseY);
        this.currentY = this.mouseY;
        let deltaY = this.currentY - this.startY;
        console.log(deltaY);
        let x = 0;
        if (this.minutes > 15) {
            x = -this.minutes + 15;
        }
        if (deltaY > x) {
            let minutes = Math.round(deltaY / this.minuteHeight);
            console.log("Minutes: " + minutes);
            let minutes15 = Math.floor(minutes / 15) * 15;
            let newEndAt = new Date(new Date(this.initialEnd).getTime() + minutes15 * 60000);
            this.task.endAt = newEndAt.toJSON();
        }
    }
}

function updateBottom() {
    let newEndAt = new Date(this.task.endAt);
    let mins = this.task.endAt.toDate().getMinutes();
    let mins15 = Math.round(mins / 15) * 15;
    newEndAt.setMinutes(mins15);
    this.task.endAt = newEndAt.toJSON();
    
    this.iterationStore.updateIteration(this.task.id, this.task.text, this.task.blurb, 
        this.task.points, this.task.startAt, this.task.endAt);

    this.onResizeEnd();
}

function onResizeEnd(ev) {
    this.resizing = undefined;
    this.startY = undefined;
    this.currentY = undefined;
    this.initialStart = undefined;
    this.initialEnd = undefined;
    console.log("Drag ended");
}

function toNextDay() {
    let nextDay = addDay(new Date(this.task.startAt));
    this.iterationStore.rescheduleIteration(this.task.id, nextDay, nextDay);
}

function markAttempted() {
    this.iterationStore.attemptIteration(this.task.id, new Date(this.task.startAt));
}

function markComplete() {
    let now = new Date().toJSON();
    this.task.attemptedAt = now;
    this.task.completedAt = now;

    this.iterationStore.toggleCompletion(this.task.id, this.task.attemptedAt, this.task.completedAt);
}

function markIncomplete() {
    this.task.attemptedAt = null;
    this.task.completedAt = null;

    this.iterationStore.toggleCompletion(this.task.id, this.task.attemptedAt, this.task.completedAt);
}

function deleteTask() {
    this.iterationStore.deleteIteration(this.task.id);
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

function selectTask() {
    this.appStore.setSelectedTask(this.task);
    // this.plannerStore.selectDate(new Date(this.task.startAt));
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
    border: solid 1px white;
    border-radius: 3px;
    line-height: 14px;
    font-size: 11px;
    user-select: none;
    min-height: 20px;
    width: calc(100% - 8px);
    font-family: SF Pro Display, 'Roboto', sans-serif;
    position: relative;
}

.task-body {
    padding: 0px 8px 0px 8px;
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
    /* white-space: nowrap; */
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

.top-anchor:hover, .bottom-anchor:hover {
    cursor: s-resize;
}
</style>