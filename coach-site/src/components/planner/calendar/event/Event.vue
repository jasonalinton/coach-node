<template>
    <div class="event cursor-default position-relative d-flex w-100"
         :class="[size, successStatus]"
         :style="{ 'top': `${top}px`, 'padding-top': `${paddingTopBottom}px`, 
                   'padding-bottom': `${paddingTopBottom}px`, 'z-index': 1, 'background-color': color}"
            @click="selectEvent"
            @drop="onDrop($event)" @dragover.prevent @dragenter.prevent>
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
        }
    },
    created: function() {
        this.appStore = useAppStore();
        this.plannerStore = usePlannerStore();
    },
    computed: {
        minutes() { return getDurationInMinutes(new Date(this._event.startAt), new Date(this._event.endAt)); },
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
        onDrop,
        selectEvent
    }
}

function onDrop(ev) {
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
    this.plannerStore.selectDate(new Date(this._event.startAt));
}
</script>

<style scoped>
.event {
    border: 1px white solid;
    border-radius: 3px;
    /* background-color: #039BE5; */
    padding-left: 8px;
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

.title {
    font-weight: bold;
    margin-right: 4px;
}
</style>