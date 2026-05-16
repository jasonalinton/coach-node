<template>
    <div class="hour-block position-relative d-flex flex-wrap align-items-baseline"
         :style="{ 'height': `${blockHeight}px` }">
        <span v-if="isCurrentHour" class="time circle" :style="{ 'top': `${timeTop - 4}px`}"></span>
        <span v-if="isCurrentHour" class="time line" :style="{ 'top': `${timeTop}px`}"></span>
        <div>

            <template v-for="(item, index) in items">
                <Event v-if="item.type == 'event'" :key="index"
                       class="position-absolute float-start"
                       :style="{'width': `calc(100% - ${(item.level * 20) + 4}px) !important`, 'margin-left': `${item.level * 20}px`}"
                       :_event="item.data" :data-overlaps="item.overlaps" :data-level="item.level"
                       :minuteHeight="minuteHeight"
                       :zIndex="zIndex">
                </Event>
                <Task v-if="item.type == 'iteration'" 
                      class="position-absolute float-start"
                      :style="{'width': `calc(100% - ${(item.level * 20) + 4}px) !important`, 'margin-left': `${item.level * 20}px`}"
                      :idTask="item.data.id" :data-overlaps="item.overlaps" :data-level="item.level"
                      :minuteHeight="minuteHeight"
                      :zIndex="zIndex">
                </Task>
            </template>
        </div>
        <div class="d-flex flex-column h-100 w-100 position-absolute">
            <span v-for="n in 4" :key="n" class="block-15 flex-grow-1" :class="{ 'dragged-over': draggedOver[n-1] }"
                  :data-min="(n-1) * 15"
                  @dragenter.prevent="draggedOver[n-1] = true" @dragover.prevent="draggedOver[n-1] = true" 
                  @dragleave.prevent="draggedOver[n-1] = false" @drop.prevent="onDrop"></span>
        </div>
    </div>
</template>

<script>
import Event from './Event.vue'
import Task from './TaskEvent.vue'
import { startOfDay } from '../../../../../utility/timeUtility';
import { TIMEFRAME } from '../../../../model/constants';
import { sortDateAsc } from '../../../../../utility';

export default {
    components: { Event, Task },
    name: "HourBlock",
    props: {
        date: Date,
        hour: Object,
        blockHeight: Number,
        zIndex: Number
    },
    data: function () {
        return {
            plannerStore: undefined,
            eventStore: undefined,
            iterationStore: undefined,
            draggedOverCount: 4,
            draggedOver: [],
        };
    },
    created: async function() {
        let plannerStore = await import(`@/store/plannerStore`);
        this.plannerStore = plannerStore.usePlannerStore();

        let eventStore = await import(`@/store/eventStore`);
        this.eventStore = eventStore.useEventStore();

        let iterationStore = await import(`@/store/iterationStore`);
        this.iterationStore = iterationStore.useIterationStore();

        for (let i = 0; i < this.draggedOverCount; i++) {
            this.draggedOver.push(false);
        }
    },
    computed: {
        timeTop() {
            return this.minuteHeight * this.minute
        },
        minuteHeight() {
            return this.blockHeight / 60;
        },
        currentTime() {
            if (this.plannerStore) {
                return this.plannerStore.currentTime;
            } else {
                return new Date();
            }
        },
        minute() {
            return this.currentTime.getMinutes();
        },
        isCurrentHour() {
            if (this.currentTime.toDateString() == this.date.toDateString() &&
                this.currentTime.getHours() == this.hour.military) {
                    return true;
            } else {
                return false;
            }
        },
        items() {
            let items = [];
            if (this.events) {
                items = items.concat(this.events.map(event => {
                    return { 
                        type: "event", 
                        data: event, 
                        startAt: event.startAt, 
                        overlaps: 0,
                        level: 0
                    }
                }));
            }
            if (this.iterations) {
                items = items.concat(this.iterations.map(iteration => {
                    return { 
                        type: "iteration", 
                        data: iteration, startAt: 
                        iteration.startAt, 
                        overlaps: 0,
                        level: 0
                    }
                }));
            }
            items = sortDateAsc(items, 'startAt');

            // let i = 0;
            items.forEach((item, index) => {
                let overlaps = 0;
                for (let i = 0; i < index; i++) {
                    let compareItem = items[i];
                    let itemStart = new Date(item.startAt).getTime();
                    let itemEnd = new Date(item.data.endAt).getTime();
                    let compareItemStart = new Date(compareItem.startAt).getTime();
                    let compareItemEnd = new Date(compareItem.data.endAt).getTime();

                    if ((itemStart >= compareItemStart && itemStart < compareItemEnd) ||
                        (itemEnd > compareItemStart && itemEnd <= compareItemEnd) ||
                        (itemStart <= compareItemStart && itemEnd >= compareItemEnd)) {
                            compareItem.overlaps++;
                            item.level = ++overlaps;
                        }

                }
                // i++;
                // let overlaps = 0;
                // for (let i = 0; i < items.length; i++) {
                //     if (i != index) {
                //         let itemStart = new Date(item.startAt).getTime();
                //         let itemEnd = new Date(item.data.endAt).getTime();
                //         let compareItemStart = new Date(items[i].startAt).getTime();
                //         let compareItemEnd = new Date(items[i].data.endAt).getTime();

                //         if ((itemStart >= compareItemStart && itemStart < compareItemEnd) ||
                //             (itemEnd > compareItemStart && itemEnd <= compareItemEnd) ||
                //             (itemStart <= compareItemStart && itemEnd >= compareItemEnd)) {
                //                 overlaps++;
                //             }
                //     }
                // }
                // item.overlaps = overlaps;
            });

            return items;
        },
        events() {
            if (this.eventStore) {
                let start = startOfDay(this.date);
                start.setHours(this.hour.military);
                let end = startOfDay(this.date);
                end.setHours(this.hour.military, 59, 59, 59);

                let events = this.eventStore.getEvents(start, end, false);
                events = events.filter(event => {
                    return (new Date(event.startAt)).getTime() >= start && (new Date(event.startAt)).getTime() <= end;
                });
                
                return events;
            } else {
                return [];
            }
        },
        iterations() {
            if (this.iterationStore) {
                let start = startOfDay(this.date);
                start.setHours(this.hour.military);
                let end = startOfDay(this.date);
                end.setHours(this.hour.military, 59, 59, 59);

                let iterations = this.iterationStore.getIterationsInTimeframe(TIMEFRAME.DAY, this.date);
                iterations = iterations.filter(x => +x.startAt.toDate().getTime() >= start && +x.startAt.toDate().getTime() <= end)
                iterations = iterations.filter(iteration => !iteration.eventID);

                return iterations;
            }
            return undefined;
        },
    },
    methods: {
        onDrop
    }
}

function onDrop(ev) {
    ev.preventDefault();    
    let data = ev.dataTransfer.getData("text");
    data = JSON.parse(data);

    if (data.type && data.type == "event") {
        console.log("Event dropped on hour block");
        let event = this.eventStore.getEvent(data.id, false);
        let duration = (new Date(event.endAt)).getTime() - (new Date(event.startAt)).getTime();
        let minutes = parseInt(ev.currentTarget.dataset.min);
        let newStart = new Date(this.date);
        newStart.setHours(this.hour.military, minutes, 0, 0);
        event.startAt = newStart.toJSON();
        let newEnd = new Date(newStart.getTime() + duration);
        event.endAt = newEnd.toJSON();

        this.eventStore.updateEvent(event.id, event.title, event.startAt, event.endAt);
    } else if (data.type && data.type == "task") {
        console.log("Task dropped on hour block");
        let task = this.iterationStore.getIteration(data.id);
        let duration = (new Date(task.endAt)).getTime() - (new Date(task.startAt)).getTime();
        let minutes = parseInt(ev.currentTarget.dataset.min);
        let newStart = new Date(this.date);
        newStart.setHours(this.hour.military, minutes, 0, 0);
        task.startAt = newStart.toJSON();
        let newEnd = new Date(newStart.getTime() + duration);
        task.endAt = newEnd.toJSON();
        
        this.iterationStore.updateIteration(task.id, task.text, task.blurb, 
            task.points, task.startAt, task.endAt);
    }
}
</script>

<style scoped>
.hour-block {
    border-bottom: solid 1px #DCDCDC;
    padding-right: 4px;
}

.block-15.dragged-over {
    background-color: var(--pill-default);
}

.block-15 {
    width: 100%;
    border: solid 1px white;
}

.time {
    display: block;
    position: absolute;
    left: -6px;
    background-color: red;
    z-index: 1000000;
}

.time.circle {
    height: 12px;
    width: 12px;
    border-radius: 6px;
}

.time.line {
    height: 2px;
    width: 100%;
}
</style>