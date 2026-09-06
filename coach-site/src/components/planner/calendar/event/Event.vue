<template>
    <div class="event cursor-default d-flex flex-column w-100"
         :class="[size, successStatus]"
         :style="{ 'top': `${top}px`, 'z-index': 1, 'background-color': color}"
         @click="selectEvent"
         @drop="onDrop($event)" @dragstart="onDragStart" @dragover.prevent @dragenter.prevent :draggable="resizing == undefined">
        <div class="top-anchor" :style="{ 'height': `${paddingTopBottom}px` }"
             @mousedown.stop="onDragStart_Top"
             @click.stop></div>
        <div class="event-body d-flex flex-column">
            <div :class="['d-flex', 'overflow-scroll', flexDirection]"
                :style="{ 'height': `${height-(paddingTopBottom*2)}px`}">
                <div class="title">
                    {{ _event.text }}
                    <span v-if="size == 'sm'">,</span>
                </div>
                <div class="time">
                    {{ getTimeString(new Date(_event.startAt))}}
                </div>
            </div>
        </div>
        <div class="bottom-anchor" :style="{ 'height': `${paddingTopBottom}px` }"
             @mousedown.stop="onDragStart_Bottom"
             @click.stop></div>
    </div>
</template>

<script>
import { useAppStore } from '@/store/appStore'
import { usePlannerStore } from '@/store/plannerStore'
import { getDurationInMinutes, getTimeString } from '../../../../../utility/timeUtility';
import { sortDesc } from '../../../../../utility';
import { EVENTTYPE } from '../../../../model/constants';

export default {
    name: "Event",
    props: {
        _event: Object,
        minuteHeight: Number,
        zIndex: Number
    },
    data: function () {
        return {
            appStore: undefined,
            plannerStore: undefined,
            eventStore: undefined,
            resizing: undefined,
            currentY: undefined,
            initialStart: undefined,
            initialEnd: undefined
        }
    },
    created: async function() {
        this.appStore = useAppStore();
        this.plannerStore = usePlannerStore();

        let eventStore = await import(`@/store/eventStore`);
        this.eventStore = eventStore.useEventStore();
    },
    // mounted () {
    //     document.addEventListener('keydown', this.escapeListener);
    // },
    // beforeUnmount () {
    //     if (typeof document !== 'undefined') {
    //         document.removeEventListener('keydown', this.escapeListener, { passive: true })
    //     }
    // },
    computed: {
        minutes() { return getDurationInMinutes(new Date(this._event.startAt), new Date(this._event.endAt)); },
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
        height() {
            return this.minuteHeight * this.minutes;
        },
        top() {
            let datetime = new Date(this._event.startAt)
            let min = datetime.getMinutes();
            let marginTop = this.minuteHeight * min;
            return marginTop;
        },
        size() {
            if (this.minutes <= 30)
                return "sm";
            else if (this.minutes > 30 && this.minutes <= 60)
                return "md";
            else
                return "lg";
        },
        flexDirection() {
            if (this.size == 'sm')
                return 'flex-row'
            else
                return 'flex-column'
        },
        paddingTopBottom() {
            if (this.size == 'sm')
                return 4;
            else
                return 6;
        },
        todoIterations() {
            return this._event.iterations.filter(iteration => iteration.routineIteration == null)
        },
        routineTodoIterations() {
            let routineIterations = this._event.iterations.filter(iteration => iteration.routineIteration != null).flat();
            routineIterations = routineIterations.map(iteration => iteration.routineIteration);
            return routineIterations.map(iteration => iteration.todoIterations).flat();
        },
        iterations() {
            let iterations = [];
            iterations = iterations.concat(this.routineTodoIterations).concat(this.todoIterations);
            if (this._event.type.id == EVENTTYPE.ROUTINE) {
                iterations = iterations.filter(x => x.text != this._event.text);
            }
            return sortDesc(iterations, 'id');
        },
        complete() {
            return this.iterations.filter(iteration => iteration.attemptedAt);
        },
        pending() {
            return this.iterations.filter(iteration => !iteration.attemptedAt);
        },
        percentComplete() {
            if (this.iterations.length == 0)
                return 100
            else
                return this.complete.length / this.iterations.length * 100
        },
        successStatus() {
            if (this.percentComplete >= 90)
                return 'success';
            else if (this.percentComplete >= 50 && this.percentComplete < 90)
                return 'close';
            else if (this.percentComplete < 50)
                return 'fail';
            else
                return '';
        },
        color() {
            if (this._event.type.id == EVENTTYPE.ROUTINE) {
                return "#4C6EF5";
            } else if (this._event.type.id == EVENTTYPE.WORKOUT) {
                return "#F54C70";
            } else {
                return "#039BE5";
            }
        }
    },
    methods: {
        getDurationInMinutes,
        getTimeString,
        onDragStart_Bottom,
        onDrag_Bottom,
        updateBottom,
        onDragStart_Top,
        onDrag_Top,
        updateTop,
        onDragEnd,
        onDragStart,
        onDrop,
        escapeListener,
        selectEvent
    },
    watch: {
        mouseY() {
            this.onDrag_Top();
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
    this.initialEnd = this._event.endAt;
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
            this._event.endAt = newEndAt.toJSON();
        }
    }
}

function updateBottom() {
    let newEndAt = new Date(this._event.endAt);
    let mins = this._event.endAt.toDate().getMinutes();
    let mins15 = Math.round(mins / 15) * 15;
    newEndAt.setMinutes(mins15);

    this._event.endAt = newEndAt.toJSON();
    this.eventStore.updateEvent(this._event.id, this._event.title, this._event.startAt, this._event.endAt)
    this.onDragEnd();
}

function onDragStart_Top(ev) {
    this.resizing = "top";
    this.startY = ev.clientY;
    this.initialStart = this._event.startAt;
    console.log("Drag started at: " + this.startY);
}

function onDrag_Top(ev) {
    if (this.resizing == "top") {
        console.log("Dragging top at: " + this.mouseY);
        this.currentY = this.mouseY;
        let deltaY = this.currentY - this.startY;
        console.log(deltaY);
        let x = 0;
        if (this.minutes > 15) {
            x = this.minutes - 15;
        }
        if (deltaY < x) {
            let minutes = Math.round(deltaY / this.minuteHeight);
            console.log("Minutes: " + minutes);
            let minutes15 = Math.floor(minutes / 15) * 15;
            let newStartAt = new Date(new Date(this.initialStart).getTime() + minutes15 * 60000);
            this._event.startAt = newStartAt.toJSON();
        }
    }
}

function updateTop() {
    let newStartAt = new Date(this._event.startAt);
    let mins = this._event.startAt.toDate().getMinutes();
    let mins15 = Math.round(mins / 15) * 15;
    newStartAt.setMinutes(mins15);

    this._event.startAt = newStartAt.toJSON();
    this.onDragEnd();
}

function onDragEnd(ev) {
    this.resizing = undefined;
    this.startY = undefined;
    this.currentY = undefined;
    this.initialStart = undefined;
    this.initialEnd = undefined;
    console.log("Drag ended");
}

function escapeListener(event) {
    if (event.key === 'Escape') {
        this.onDragEnd();
    }
}

function onDragStart(ev) {
    let data = {
        type: "event",
        id: this._event.id
    };
    data = JSON.stringify(data);

    // ev.dataTransfer.setDragImage(blank, 0, 0);

    console.log("Drag Started");
    ev.target.classList.add("drag");
    ev.dataTransfer.dropEffect = 'move';
    ev.dataTransfer.effectAllowed = 'move';
    ev.dataTransfer.setData("text", data);
}

function onDrop(ev) {
    if (this.startY) {
        return;
    }
    ev.preventDefault();    
    let data = ev.dataTransfer.getData("text");
    data = JSON.parse(data);

    if (data.type && data.type == "task") {
        /* If routine event, first unmap task from event and routine iteration */
        if (data.parentType && data.parentType == "routineEvent") {
            console.log("this.unmapTaskFromRoutineEvent(data.id, data.parentID, this._event.startAt, this._event.endAt, this._event.id, this.$apollo)");
        } else {
            console.log("this.mapIterationToEvent(data.id, this._event.id, this.$apollo)");
        }
    } else if (data.type && data.type == "todo") {
        if (data.parentType && data.parentType == "goal") {
            console.log("this.mapTodoToEvent(data.id, this._event.id, this.$apollo)");
        } 
    }
}

function selectEvent() {
    this.appStore.setSelectedEvent(this._event);
    // this.plannerStore.selectDate(new Date(this._event.startAt));
}
</script>

<style scoped>
.event {
    border: 1px white solid;
    border-radius: 3px;
    /* background-color: #039BE5; */
    color: white;
    min-height: 16px;
    line-height: 14px;
    vertical-align: middle;
}

.event.sm {
    font-size: 10px;
    white-space: nowrap;
}

.event.md, .event.lg {
    font-size: 11px;
    padding-right: 4px;
}

.event.success {
    border-left: 5px solid green
}

.event.close {
    border-left: 5px solid orange
}

.event.fail {
    border-left: 5px solid red
}

.event-body {
    padding-left: 8px;
}

.title {
    font-weight: bold;
    margin-right: 4px;
}

.top-anchor:hover, .bottom-anchor:hover {
    cursor: s-resize;
}
</style>