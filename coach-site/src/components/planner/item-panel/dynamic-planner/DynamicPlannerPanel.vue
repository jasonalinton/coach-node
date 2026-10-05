<template>
    <div class="dynamic-planner-panel d-flex flex-column">
        <div class="date-header d-flex flex-column">
            <div class="d-flex flex-row justify-content-between align-items-center">
                <div class="date-label">
                    <span class="relative">{{ isToday ? 'Today' : 'Day' }}</span>
                    <span class="dash">-</span>
                    <span class="date">{{ dateText }}</span>
                </div>
                <div class="cta d-flex flex-row">
                    <button class="btn-sm btn-primary plan-button" type="button" @click="onPlanClick">
                        <img :src="iconRefreshCw" width="16" height="16" />
                        <span>{{ planButtonText }}</span>
                    </button>
                    <button class="btn-sm btn-warning trim-button" type="button" @click="onTrimClick">
                        <img :src="iconTrim" width="16" height="16" />
                        <span>Trim</span>
                    </button>
                </div>
            </div>
            <div class="divider"></div>
        </div>
        <div class="timeline d-flex flex-column">
            <div v-for="item in timeline" :key="item.id" class="time-block d-flex flex-row">
                <div class="time-rail d-flex flex-column align-items-center">
                    <span class="start-time">{{ toNumberTimeString(item.startAt) }}</span>
                    <span class="end-time">{{ toNumberTimeString(item.endAt) }}</span>
                </div>
                <DyBlockEvent class="flex-grow-1" :event-id="item.id" />
            </div>
        </div>
    </div>
</template>

<script>
import DyBlockEvent from './DyBlockEvent.vue';
import { toShortWeekdayString, startOfDay, endOfDay, isToday, toNumberTimeString } from '../../../../../utility/timeUtility';
import { sortAsc } from '../../../../../utility';
import { EVENTTYPE } from '../../../../model/constants';
import iconRefreshCw from '@/assets/icons/icon-refresh-cw.svg';
import iconTrim from '@/assets/icons/icon-trim.svg';

export default {
    name: 'DynamicPlannerPanel',
    components: { DyBlockEvent },
    props: {

    },
    data: function () {
        return {
            plannerStore: undefined,
            eventStore: undefined,
            routineStore: undefined,
            todoStore: undefined,
            iterationStore: undefined,
            iconRefreshCw,
            iconTrim,
            toNumberTimeString,
        }
    },
    created: async function() {
        let plannerStore = await import('@/store/plannerStore');
        this.plannerStore = plannerStore.usePlannerStore();
        let eventStore = await import('@/store/eventStore');
        this.eventStore = eventStore.useEventStore();
        let routineStore = await import('@/store/routineStore');
        this.routineStore = routineStore.useRoutineStore();
        let todoStore = await import('@/store/todoStore');
        this.todoStore = todoStore.useTodoStore();
        let iterationStore = await import('@/store/iterationStore');
        this.iterationStore = iterationStore.useIterationStore();
        this.syncPhantomEvents();
        this.fetchBlockEvents();
    },
    computed: {
        selectedDate() {
            return this.plannerStore ? this.plannerStore.selectedDate : undefined;
        },
        isToday() {
            return this.selectedDate ? isToday(this.selectedDate) : true;
        },
        dateText() {
            return this.selectedDate ? toShortWeekdayString(this.selectedDate, true) : '';
        },
        blockRepeats() {
            if (this.plannerStore) {
                return this.plannerStore.repeats.filter(x => x.isBlock);
            }
            return [];
        },
        phantomEvents() {
            if (!this.selectedDate || !this.routineStore || !this.todoStore || !this.iterationStore) return [];

            let date = this.selectedDate;
            let blockRepeats = this.blockRepeats.filter(repeat => {
                if (!repeat.startDate) return false;
                if (+repeat.startDate.toDate() > +date) return false;
                if (repeat.endDate && +repeat.endDate.toDate() < +date) return false;
                return true;
            });
            blockRepeats = blockRepeats.filter(repeat => !!repeat.startTime);
            blockRepeats = blockRepeats.filter(repeat => repeat.isRoutineRepeat);

            // var newID = this.eventStore.newID();
            let newID = -1;

            let events = blockRepeats.map(repeat => {
                const [sh, sm] = repeat.startTime.split(':').map(Number);
                let startAt = startOfDay(date);
                startAt.setHours(sh, sm, 0, 0);

                let endAt;
                if (repeat.endTime) {
                    const [eh, em] = repeat.endTime.split(':').map(Number);
                    endAt = startOfDay(date);
                    endAt.setHours(eh, em, 0, 0);
                } else if (repeat.duration) {
                    endAt = new Date(startAt.getTime() + repeat.duration * 60000);
                } else {
                    endAt = new Date(startAt.getTime() + 60 * 60000);
                }

                let routine = this.routineStore.routines.find(routine => routine.id == repeat.idRoutine);
                let text = routine ? routine.text : "";

                let event = {
                    id: newID--,
                    repeat: repeat,
                    text: text,
                    startAt: startAt.toJSON(),
                    endAt: endAt.toJSON(),
                    isBlock: true,
                    isAllDay: false,
                    isRecommended: false,
                    isVisible: true,
                    itemType: "event",
                    iterations: [],
                    type: {
                        altText: "",
                        description: "Event",
                        id: EVENTTYPE.BLOCKROUTINE,
                        parentID: EVENTTYPE.EVENTTYPE,
                        position: null,
                        iterations: [],
                        text: "Block",
                    }
                };

                if (routine) {
                    routine.todoIDs.forEach(idTodo => {
                        let todo = this.todoStore.getItemModel(idTodo)?.data;
                        if (todo) {
                            let repeatChild = todo.repeats.find(r => r.routineRepeatID == repeat.id);
                            let iterations = this.iterationStore.getIterationsForTodo(idTodo);
                            iterations = sortAsc(iterations, 'attemptedAt');

                            let task = iterations.find(iteration => {
                                return iteration.startAt 
                                    && +iteration.startAt.toDate() == +this.selectedDate 
                                    && +iteration.endAt.toDate() == +this.selectedDate;
                            });
                            if (!task) {
                                task = this.iterationStore.newTask(todo, repeatChild);
                            } else {
                                console.log('Task found:', task);
                            }
                            event.iterations.push(task);
                        }
                    });
                }
                
                return event;
            });

            events = events.filter(e => e.iterations.length > 0);
            return events;
        },
        blockEvents() {
            // Temporary for testing: returns today's persisted block events.
            if (!this.eventStore || !this.selectedDate) return [];
            let start = +startOfDay(this.selectedDate);
            let end = +endOfDay(this.selectedDate);
            let events = this.eventStore.getEvents(start, end, false);
            // return events.filter(e => e.type && e.type.id == EVENTTYPE.BLOCKROUTINE);
            return events;
        },
        timeline() {
            // return sortAsc([...this.phantomEvents, ...this.blockEvents], 'startAt');
            return sortAsc([...this.blockEvents], 'startAt');
        },
        planButtonText() {
            return this.blockEvents.length === 0 ? 'Plan' : 'Replan';
        },
    },
    methods: {
        onPlanClick, onTrimClick, syncPhantomEvents, fetchBlockEvents,
    },
    watch: {
        phantomEvents() {
            this.syncPhantomEvents();
        },
        selectedDate() {
            this.fetchBlockEvents();
        }
    }
}

function fetchBlockEvents() {
    if (!this.eventStore || !this.selectedDate) return;
    let start = startOfDay(this.selectedDate);
    let end = endOfDay(this.selectedDate);
    this.eventStore.getEvents(start, end, true);
}

function syncPhantomEvents() {
    if (!this.eventStore) return;
    this.phantomEvents.forEach(p => {
        this.eventStore.replaceOrAddEvent(p);
    });
}

function onPlanClick() {
    // TODO: user will write Plan/Replan behavior manually.
}

function onTrimClick() {
    // TODO: no behavior specified for Trim yet.
}
</script>

<style scoped>
.dynamic-planner-panel {
    text-align: start;
    padding: 12px 20px;
}

.date-label {
    font-size: 16px;
}

.date-label .relative {
    font-weight: 600;
    color: #3B5BDB;
}

.date-label .dash {
    margin: 0 4px;
    color: #374151;
}

.date-label .date {
    font-weight: 600;
    color: #374151;
}

.cta button {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 6px;
    border-radius: 16px;
    border: none;
    padding: 6px 14px 6px 10px;
    font-size: 13px;
    font-weight: 600;
    color: white;
}

.cta button + button {
    margin-left: 8px;
}

.plan-button {
    background-color: #3B5BDB;
}

.trim-button {
    background-color: #F59E0B;
}

.divider {
    height: 1px;
    background-color: #E5E7EB;
    margin-top: 12px;
}

.timeline {
    margin-top: 16px;
    gap: 24px;
}

.time-block {
    gap: 12px;
}

.time-rail {
    width: 32px;
    flex-shrink: 0;
    font-size: 11px;
    color: #6B7280;
    text-align: center;
}

.start-time {
    font-weight: 600;
}

.end-time {
    opacity: 0.7;
}
</style>
