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
            <div v-for="block in timeline" :key="block.key" class="time-block d-flex flex-row">
                <div class="time-rail d-flex flex-column align-items-center">
                    <span class="start-time">{{ toNumberTimeString(block.event.startAt) }}</span>
                    <span class="end-time">{{ toNumberTimeString(block.event.endAt) }}</span>
                </div>
                <DyBlockEvent class="flex-grow-1" :block="block" />
            </div>
        </div>
    </div>
</template>

<script>
import DyBlockEvent from './DyBlockEvent.vue';
import { toShortWeekdayString, startOfDay, endOfDay, isToday, 
    toNumberTimeString, timeToDate } from '../../../../../utility/timeUtility';
import { sortAsc } from '../../../../../utility';
import { EVENTTYPE, PRIORITY_GOAL, ITEMTYPES, TIMEFRAME, KANBAN_COLUMN } from '../../../../model/constants';
import iconRefreshCw from '@/assets/icons/icon-refresh-cw.svg';
import iconTrim from '@/assets/icons/icon-trim.svg';

const DEFAULT_TIME_ESTIMATE_MINUTES = 15;

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
            goalStore: undefined,
            iconRefreshCw,
            iconTrim,
            toNumberTimeString,
            end: "17:00"
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
        let goalStore = await import('@/store/goalStore');
        this.goalStore = goalStore.useGoalStore();
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
            let blockRepeats = (this.plannerStore) ? this.plannerStore.activeBlockRepeats : [];
            return blockRepeats;
        },
        /* A block is a routine block repeat on the selected day. Its event is the saved block event for that
         * repeat + day, or an unsaved (negative ID) one until it's started. Tasks don't need to be mapped to
         * the event: each routine todo's task is found from that day's iterations */
        blocks() {
            if (!this.selectedDate || !this.routineStore || !this.todoStore || !this.iterationStore) return [];

            let phantomID = -1;
            let blocks = this.blockRepeats.map(repeat => {
                let routine = this.routineStore.routines.find(routine => routine.id == repeat.idRoutine);
                let event = this.blockEvents.find(e => e.idRepeat == repeat.id)
                    || this.newBlockEvent(repeat, routine, phantomID--);
                return {
                    key: `repeat-${repeat.id}`,
                    repeat,
                    event,
                    tasks: this.getBlockTasks(event, repeat, routine),
                };
            });

            // Saved block events that aren't tied to an active repeat (e.g. created before events stored their repeat)
            this.blockEvents
                .filter(e => !blocks.some(b => b.event === e))
                .forEach(event => blocks.push({ key: `event-${event.id}`, repeat: undefined, event, tasks: this.getBlockTasks(event) }));

            return blocks.filter(b => b.tasks.length > 0);
        },
        blockEvents() {
            if (!this.eventStore || !this.selectedDate) return [];
            let start = +startOfDay(this.selectedDate);
            let end = +endOfDay(this.selectedDate);
            let events = this.eventStore.getEvents(start, end, false);
            return events.filter(e => e.id > 0 && e.type && e.type.id == EVENTTYPE.BLOCKROUTINE);
        },
        timeline() {
            return [...this.blocks].sort((a, b) => +new Date(a.event.startAt) - +new Date(b.event.startAt));
        },
        planButtonText() {
            return this.blockEvents.length === 0 ? 'Plan' : 'Replan';
        },
    },
    methods: {
        onPlanClick, onTrimClick, fetchBlockEvents, getTodosInOrder, newBlockEvent, getBlockTasks,
    },
    watch: {
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
    // The day's iterations, so tasks can find matching iterations (incl. ones scheduled to a time)
    if (this.iterationStore) this.iterationStore.getIterationsInRange(+start, +end);
}

/* Unsaved block event for a repeat on the selected day. It's created when it's started or a task is completed */
function newBlockEvent(repeat, routine, id) {
    const [sh, sm] = repeat.startTime.split(':').map(Number);
    let startAt = startOfDay(this.selectedDate);
    startAt.setHours(sh, sm, 0, 0);

    let endAt;
    if (repeat.endTime) {
        const [eh, em] = repeat.endTime.split(':').map(Number);
        endAt = startOfDay(this.selectedDate);
        endAt.setHours(eh, em, 0, 0);
    } else {
        endAt = new Date(startAt.getTime() + 60 * 60000);
    }

    return {
        id,
        repeat,
        idRepeat: repeat.id,
        text: routine ? routine.text : "",
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
}

/* One task per routine todo, plus any iterations mapped to the event. A todo's task is, in order: the iteration
 * mapped to the event, its iteration completed that day, any iteration that day, or a new unsaved task */
function getBlockTasks(event, repeat, routine) {
    let mapped = (event.iterations || []).map(i => this.iterationStore.getLoadedIterationsWithIDs([i.id])[0] || i);
    let todoIDOf = iteration => iteration.idTodo ?? iteration.todoID;
    let tasks = [];

    (routine ? routine.todoIDs : []).forEach(idTodo => {
        let todo = this.todoStore.getItem(idTodo);
        if (!todo) return;

        let repeat_Todo = todo.repeats.find(r => r.routineRepeatID == repeat.id);
        let iterations = sortAsc(this.iterationStore.getTodoIterationsOnDate(idTodo, this.selectedDate), 'attemptedAt');
        let task = mapped.find(i => todoIDOf(i) == idTodo)
            || iterations.find(i => i.completedAt)
            || iterations[0]
            || this.iterationStore.newTask(todo, repeat_Todo);

        // First check if the task/iteration has a time estimate, then check the repeat. Default to 15 minutes.
        task.timeEstimate = task.timeEstimate || repeat_Todo?.timeEstimate || todo.timeEstimate || DEFAULT_TIME_ESTIMATE_MINUTES;

        // If todo's repeat has points set it to the iteration (should this override the tasks points?)
        if (repeat_Todo?.points) {
            task.points = repeat_Todo.points;
        }

        tasks.push(task);
    });

    // Mapped iterations for todos that aren't in the routine
    mapped.filter(i => !tasks.includes(i) && !tasks.some(t => todoIDOf(t) == todoIDOf(i)))
        .forEach(i => tasks.push(i));

    return tasks;
}

async function onPlanClick() {
    // 1. Determine how much time do you have left?
    let timeLeft = +(timeToDate(this.end, this.selectedDate)) - +new Date();
    let minutesLeft = timeLeft / 1000 / 60;
    let hoursLeft = minutesLeft / 60;

    // 2. Get kanbans for priority goals, and build the ordered todo list
    //    (used later to trim tasks that won't be completed in time)
    let todoIDs = await this.getTodosInOrder();

    let timeEstimate = this.blocks
        .flatMap(block => block.tasks)
        .reduce((total, task) => total + (task.timeEstimate || 0), 0);

    // Get incomplete tasks in phantomEvents
    let incompleteTasks = this.blocks
        .flatMap(block => block.tasks)
        .filter(task => !task.completedAt);

    // Sort them based on the todo order using iteration.idTodo
    incompleteTasks.sort((a, b) => {
        let aIndex = todoIDs.indexOf(a.idTodo);
        let bIndex = todoIDs.indexOf(b.idTodo);
        if (aIndex == -1) aIndex = todoIDs.length;
        if (bIndex == -1) bIndex = todoIDs.length;
        return aIndex - bIndex;
    });

    // Create list of tasks that will fit
    let tasksThatFit = [];
    // Create list of tasks that wont fit
    let tasksThatWontFit = [];

    let minutesRemaining = minutesLeft;
    incompleteTasks.forEach(task => {
        let taskMinutes = (task.timeEstimate || 0);
        if (taskMinutes <= minutesRemaining) {
            tasksThatFit.push(task);
            minutesRemaining -= taskMinutes;
        } else {
            let iteration = this.iterationStore.getIteration(task.id);
            iteration.wontFit = true;
            task.wontFit = true;
            tasksThatWontFit.push(task);
        }
    });
}

// 2. Get kanbans for priority goals (primary, secondary, and tertiary)
//    a. Using the kanban, get the id and position of active todos in the day timeframe
//    b. Put the list of todo ids in order, primary then secondary, then tertiary
async function getTodosInOrder() {
    if (!this.goalStore) return [];

    let getActiveDayTodos = (rows) => {
        return (rows || [])
            .filter(row => row.idType == ITEMTYPES.TODO
                && row.idTimeframe == TIMEFRAME.DAY
                && row.idColumn == KANBAN_COLUMN.ACTIVE
                && !row.dateRemoved)
            .sort((a, b) => a.positionDescendant - b.positionDescendant)
            .map(row => ({ id: row.idItem, position: row.positionDescendant }));
    };

    let todosByPriority = {};
    for (let key of ['PRIMARY', 'SECONDARY', 'TERTIARY']) {
        let rows = (await this.goalStore.getGoalKanban(PRIORITY_GOAL[key])) || [];
        todosByPriority[key] = getActiveDayTodos(rows);
    }

    let todoIDs = [
        ...todosByPriority.PRIMARY,
        ...todosByPriority.SECONDARY,
        ...todosByPriority.TERTIARY,
    ].map(todo => todo.id);

    return todoIDs;
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
