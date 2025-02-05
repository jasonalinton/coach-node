<template>
    <div class="day pill d-flex flex-column position-relative" 
         :class="[day.pointInTime, (isSelected) ? 'selected' : '', status(day.iterationCompletion)]"  
         @click="selectDate(day.date)"
         @drop="onDrop($event)" @dragover.prevent @dragenter.prevent>
        <span>{{ day.day }}</span>
        <span class="status position-absolute"></span>
    </div>  
</template>

<script>
import { today } from "../../../../utility";

export default {
    props: {
        day: Object,
    },
    created: async function() {
        let plannerStore = await import(`@/store/plannerStore`);
        this.plannerStore = plannerStore.usePlannerStore();
        let iterationStore = await import(`@/store/iterationStore`);
        this.iterationStore = iterationStore.useIterationStore();
    },
    data: function () {
        return {
            plannerStore: undefined,
            iterationStore: undefined,
        }
    },
    computed: {
        date() {
            return new Date(this.day.date);
        },
        selectedDate() {
            if (this.plannerStore) {
                return this.plannerStore.selectedDate;
            }
            return today();
        },
        isSelected() {
            return +this.date == +this.selectedDate;
        }
    },
    methods: {
        selectDate,
        status,
        onDrop,
    },
}

function selectDate(date) {
    this.plannerStore.selectDate(date);
}

function status(iterationCompletion) {
    if ((new Date(iterationCompletion.datetime).getTime() > today().getTime()))
        return 'pending'
    else if (iterationCompletion.percentComplete >= 90)
        return 'success';
    else if (iterationCompletion.percentComplete >= 50 && iterationCompletion.percentComplete < 90)
        return 'close';
    else if (iterationCompletion.percentComplete < 50)
        return 'fail';
    else
        return '';
}

function onDrop(ev) {
    ev.preventDefault();
    
    let data = ev.dataTransfer.getData("text");
    data = JSON.parse(data);

    if (data.type && data.type == "task") {
        /* If routine event, first unmap task from event and routine iteration */
        if (data.parentType && data.parentType == "routineEvent") {
            console.log("this.unmapTaskFromRoutineEvent(data.id, data.parentID, new Date(this.day.date), null, null, this.$apollo)");
        } else {
            this.iterationStore.rescheduleIteration(data.id, new Date(this.day.date), new Date(this.day.date));
        }


    }
}
</script>

<style scoped>
.pill {
    width: 24px;
    height: 24px;
    border-radius: 12px;
    font-weight: 500;
    font-size: 10px;
    line-height: 24px;
    text-align: center;
    margin: 2px 3px;
    user-select: none;
}

.day {
    color: rgba(0, 0, 0, .87);
}

.day:not(:hover) {
    color: rgba(0, 0, 0, .87);
    transition-property: background-color;
    transition-duration: .25s;
    transition-timing-function: ease-in-out;
    transition-delay: 0s;
}

.day:hover {
    background-color: #F1F3F4;
}

.day.present {
    background-color: #1A73E8;
    color: white;
    font-weight: 800;
}

.day.selected:not(.present) {
    background-color: #D2E3FC;
}

.day.selected:hover:not(.present) {
    background-color: #8AB4F8;
}

.day.selected:not(.hover) {
    transition-property: background-color;
    transition-duration: .25s;
    transition-timing-function: ease-in-out;
    transition-delay: 0s;
}

.day.selected.present:not(.previous-month) {
    background-color: #0366E9;
}

.day span.status {
    width: 4px;
    height: 4px;
    top: 18px;
    left: 10px;
    border-radius: 2px;
}

.day.success span.status {
    background-color: green;
}

.day.close span.status {
    background-color: orange;
}

.day.fail span.status {
    background-color: red;
}

.pill.previous-month, .pill.next-month {
    color: rgba(0, 0, 0, .6);
}
</style>