<template>
    <div class="event position-relative d-flex w-100"
         :class="[size, flexDirection, successStatus]"
         :style="{ 'top': `${top}px`, 'height': `${height}px`, 'z-index': 1}"
            @click="$emit('selectEvent', _event)">
         <div class="title">
            {{ _event.text }}
            <span v-if="size == 'sm' || size == 'md'">,</span>
         </div>
         <div class="time">
             {{ toTimeString(_event.startAt)}}
         </div>
    </div>
</template>

<script>
import { getDurationInMinutes, toTimeString } from '../../../../../utility/timeUtility';
import { sortDesc } from '../../../../../utility';

export default {
    name: "Event",
    props: {
        _event: Object,
        minuteHeight: Number,
        zIndex: Number
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
            if (this.minutes <= 15)
                return "sm";
            else if (this.minutes > 15 && this.minutes <= 30)
                return "md";
            else
                return "lg";
        },
        flexDirection() {
            if (this.size == 'sm' || this.size == 'md')
                return 'flex-row'
            else
                return 'flex-column'
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
        }
    },
    methods: {
        getDurationInMinutes,
        toTimeString,
    }
}
</script>

<style scoped>
.event {
    border: 1px white solid;
    border-radius: 3px;
    background-color: #039BE5;
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
    font-size: 12px;
    padding-top: 4px;
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