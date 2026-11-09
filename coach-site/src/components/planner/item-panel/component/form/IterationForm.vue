<template>
    <form v-if="iteration_updated"
          :id="`iteration-form`" class="d-flex flex-column gap-3 pb-3" v-on:submit.prevent>
        <!-- Header -->
        <div class="header d-flex flex-row align-items-center gap-2 mt-2">
            <!-- Back Button -->
            <img class="icon-button"
                 src='/icon/previous.png' width="16" height="16"
                 @click.prevent="close"/>
            <!-- Title/Text -->
            <input class="title textbox flex-grow-1" type="text" ref="text" placeholder="Title"
                   v-model.lazy.trim="iteration_updated.text"
                   v-on:keyup.enter="save"
                   spellcheck="true"/>
            <!-- ID -->
            <span class="iteration-id">#{{ iteration.id }}</span>
        </div>
        <!-- Todo -->
        <div v-if="todoID" class="todo-link-row d-flex flex-row align-items-center gap-2">
            <span class="field-label">TODO</span>
            <span class="todo-link" @click="openTodoForm">
                {{ todo ? todo.text : 'Open todo' }}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4.5 2.5h5v5M9.5 2.5L3 9" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </span>
            <span class="todo-id">#{{ todoID }}</span>
        </div>
        <!-- Points -->
        <div class="points d-flex flex-column gap-1">
            <span class="field-label">POINTS</span>
            <div class="app-pills d-flex flex-row align-items-center gap-1">
                <input class="small-input" type="number" min="1" v-model.number="iteration_updated.points"/>
                <span v-for="point in [1,3,5,8]" :key="point" class="app-pill flex-grow-1"
                      @click="addPoints(point)">+{{ point }}</span>
                <span class="app-pill clear-pill flex-grow-1" @click="addPoints(0)">Clear</span>
            </div>
        </div>
        <!-- Timeframe -->
        <div class="timeframe d-flex flex-column gap-1">
            <span class="field-label">TIMEFRAME</span>
            <div class="app-pills d-flex flex-row gap-1">
                <span v-for="timeframe in timeframes" :key="timeframe.id" class="app-pill flex-grow-1"
                      :class="{ 'selected': iteration_updated.idTimeframe == timeframe.id }"
                      @click="iteration_updated.idTimeframe = timeframe.id">{{ timeframe.text }}</span>
            </div>
        </div>
        <!-- Time -->
        <div class="time d-flex flex-column gap-1">
            <span class="field-label">START</span>
            <DateTimeSelector class="date-selector"
                              :dateTime="iteration_updated.startAt" @onChange="setStart($event)"></DateTimeSelector>
            <div class="app-pills d-flex flex-row gap-1">
                <span v-for="time in startSuggestions" :key="time.string" class="app-pill flex-grow-1"
                      @click="setStart(time.object)">{{ time.string }}</span>
            </div>
            <div class="d-flex flex-row align-items-center gap-2 mt-1">
                <span class="field-label">END</span>
                <input class="small-input duration-input" type="number" min="0"
                       :value="duration" :disabled="!iteration_updated.startAt"
                       @change="setDuration($event.target.value)"/>
                <span class="duration-unit">min</span>
            </div>
            <DateTimeSelector class="date-selector"
                              :dateTime="iteration_updated.endAt" @onChange="setEnd($event)"></DateTimeSelector>
            <div class="app-pills d-flex flex-row gap-1">
                <span v-for="minutes in [5,10,15,30,60]" :key="minutes" class="app-pill flex-grow-1"
                      @click="addTime(minutes)">+{{ minutes }}</span>
            </div>
        </div>
        <!-- Quick Actions -->
        <div class="quick-actions d-flex flex-column gap-1">
            <span class="field-label">QUICK ACTIONS</span>
            <div class="app-pills d-flex flex-row gap-1">
                <span class="app-pill flex-grow-1" @click="isAllDay">All day</span>
                <span class="app-pill flex-grow-1" @click="toNextDay">Next day</span>
                <span class="app-pill flex-grow-1" @click="markAttempted">Attempt</span>
                <span v-if="!isComplete" class="app-pill flex-grow-1" @click="markComplete">Complete</span>
                <span v-if="isComplete" class="app-pill selected flex-grow-1" @click="markIncomplete">Incomplete</span>
            </div>
        </div>
        <!-- Blurbs -->
        <BlurbFormControl header="Blurbs" placeholder="Click to add blurb" :blurbs="blurbs" :showTitle="true"
            @addBlurb="addBlurb($event)" @saveBlurb="updateBlurb($event)" />
        <!-- Photos & Videos -->
        <MediaGallery v-if="iteration.id > 0" itemType="iteration" :itemId="iteration.id" header="Photos & Videos" />
        <!-- Footer -->
        <div class="footer d-flex flex-row align-items-center gap-2">
            <!-- Delete -->
            <span v-if="!confimDelete" class="link delete-link" @click="confimDelete = true">Delete</span>
            <!-- Delete Confirmation -->
            <div v-if="confimDelete" class="d-flex flex-row align-items-center gap-2">
                <span>Delete?</span>
                <span class="link delete-link fw-medium" @click="deleteTask">Yes, delete</span>
                <span class="link" @click="confimDelete = false">Keep</span>
            </div>
            <!-- Cancel Button -->
            <span class="link ms-auto" @click="close">Cancel</span>
            <!-- Save Button -->
            <button class="save-button" type="button" @click.prevent="save">Save</button>
        </div>
    </form>
</template>

<script>
import { addDay, addMinutes, startOfDay, getShortTimeString } from "../../../../../../utility/timeUtility";
import DateTimeSelector from "../../../../controls/select/DateTimeSelector.vue"
import BlurbFormControl from "../../../../items/form/component/BlurbFormControl.vue";
import MediaGallery from "../../../../items/form/component/media/MediaGallery.vue";
import { BLURBTYPE, TIMEFRAME, ITERATION_ACTION } from "../../../../../model/constants";

export default {
    name: "IterationForm",
    components: { DateTimeSelector, BlurbFormControl, MediaGallery },
    props: {
        iteration: Object
    },
    data: function() {
        return {
            iterationStore: undefined,
            universalStore: undefined,
            todoStore: undefined,
            appStore: undefined,
            iteration_updated: undefined,
            confimDelete: false,
            timeframes: [
                { id: TIMEFRAME.DAY, text: "Day" },
                { id: TIMEFRAME.WEEK, text: "Week" },
                { id: TIMEFRAME.MONTH, text: "Month" },
                { id: TIMEFRAME.YEAR, text: "Year" }
            ]
        }
    },
    created: async function() {
        let iterationStore = await import(`@/store/iterationStore`);
        this.iterationStore = iterationStore.useIterationStore();

        let universalStore = await import(`@/store/universalStore`);
        this.universalStore = universalStore.useUniversalStore();

        let todoStore = await import(`@/store/todoStore`);
        this.todoStore = todoStore.useTodoStore();

        let appStore = await import(`@/store/appStore`);
        this.appStore = appStore.useAppStore();

        this.initUpdatedIteration();
    },
    computed: {
        blurbs() {
            if (this.universalStore && this.iterationStore) {
                let liveIteration = this.iterationStore.getIteration(this.iteration.id);
                let blurbIds = liveIteration?.blurbIds || this.iteration.blurbIds || [];
                return this.universalStore.getBlurbsWithID(blurbIds);
            }
            return [];
        },
        todoID() {
            return this.iteration.todoID || this.iteration.idTodo;
        },
        todo() {
            if (this.todoStore && this.todoID) {
                return this.todoStore.getItem(this.todoID);
            }
            return undefined;
        },
        duration() {
            if (this.iteration_updated.startAt && this.iteration_updated.endAt) {
                return Math.round((+new Date(this.iteration_updated.endAt) - +new Date(this.iteration_updated.startAt)) / 60000);
            }
            return "";
        },
        isComplete() {
            if (this.iteration.attemptedAt) {
                return true;
            } else {
                return false
            }
        },
        startSuggestions() {
            let suggestions = [];
            if (this.iteration_updated.startAt) {
                let start = new Date();
                const currentMinutes = start.getMinutes();
                const minutesToAdd = 15 - (currentMinutes % 15);
                start.setMinutes(currentMinutes + minutesToAdd);
                start.setSeconds(0);
                start.setMilliseconds(0);

                let minutes = [45, 30, 15];
                minutes.forEach(minutes => {
                    let date = addMinutes(-minutes, start);
                    suggestions.push({
                        object: date,
                        string: getShortTimeString(date)
                    })
                });
                suggestions.push({
                    object: start,
                    string: getShortTimeString(start)
                })
            }
            return suggestions;
        }
    },
    methods: {
        initUpdatedIteration,
        addPoints,
        setStart,
        setEnd,
        setDuration,
        addTime,
        isAllDay,
        toNextDay,
        markAttempted,
        markComplete,
        markIncomplete,
        deleteTask,
        addBlurb,
        updateBlurb,
        save,
        updateIteration,
        openTodoForm,
        close,
    },
    watch: {
        iteration() {
            this.initUpdatedIteration();
        }
    }
}

function initUpdatedIteration() {
    this.iteration_updated = {
        id: this.iteration.id,
        text: this.iteration.text,
        points: this.iteration.points,
        startAt: this.iteration.startAt,
        endAt: this.iteration.endAt,
        idTimeframe: this.iteration.idTimeframe
    };
}

function addPoints(points) {
    if (points == 0) {
        this.iteration_updated.points = null;
        return;
    }
    if (this.iteration_updated.points == null) {
        this.iteration_updated.points = points;
    } else {
        this.iteration_updated.points += points;
    }
}

// End follows start, keeping the duration
function setStart(time) {
    let duration = this.duration || 0;
    this.iteration_updated.startAt = time;
    this.iteration_updated.endAt = (time) ? addMinutes(duration, time) : time;
}

// End can't be before start, so it snaps to start
function setEnd(time) {
    let startAt = this.iteration_updated.startAt;
    if (time && startAt && +new Date(time) < +new Date(startAt)) {
        time = startAt;
    }
    this.iteration_updated.endAt = time;
}

function setDuration(minutes) {
    minutes = Math.max(0, parseInt(minutes) || 0);
    this.iteration_updated.endAt = addMinutes(minutes, this.iteration_updated.startAt);
}

function addTime(minutes) {
    this.iteration_updated.endAt = addMinutes(minutes, this.iteration_updated.endAt);
}

function isAllDay() {
    this.iteration_updated.startAt = startOfDay(new Date(this.iteration_updated.startAt));
    this.iteration_updated.endAt = startOfDay(new Date(this.iteration_updated.startAt));

    this.save();
}

function toNextDay() {
    let nextDay = addDay(new Date(this.iteration_updated.startAt));
    this.iteration_updated.startAt = nextDay;
    this.iteration_updated.endAt = nextDay;
    this.updateIteration();

    this.close();
}

function markAttempted() {
    this.updateIteration(ITERATION_ACTION.ATTEMPT, new Date(this.iteration_updated.startAt));

    this.close();
}

function markComplete() {
    this.updateIteration(ITERATION_ACTION.COMPLETE, new Date());

    this.close();
}

function markIncomplete() {
    this.updateIteration(ITERATION_ACTION.INCOMPLETE);

    this.close();
}

function deleteTask() {
    this.iterationStore.deleteIteration(this.iteration_updated.id);

    this.close();
}

function addBlurb(blurb) {
    if (blurb.text.trim() != "") {
        blurb.idType = BLURBTYPE.BLURB;
        return this.iterationStore.addBlurb(this.iteration.id, blurb);
    }
}

function updateBlurb(blurb) {
    if (blurb.text.trim() != "") {
        blurb.idType = BLURBTYPE.BLURB;
        return this.iterationStore.updateBlurb(blurb);
    }
}

function save() {
    var title = this.iteration_updated.text.trim();
    if (title == "") return;

    this.updateIteration();

    this.close();
}

// Saves the form's edits and, optionally, a status change in one request
function updateIteration(action, actionAt) {
    let updated = this.iteration_updated;
    let text = updated.text.trim() || this.iteration.text;

    return this.iterationStore.updateIteration(updated.id, text, updated.points,
        updated.startAt, updated.endAt, updated.idTimeframe, action, actionAt);
}

function openTodoForm() {
    this.appStore.selectTodoForm(this.todoID);
}

function close() {
    this.$emit('closeForm');
}
</script>

<style scoped>
form {
    padding-left: 12px;
    padding-right: 12px;
    height: calc(100vh - 64px - 42px);
    overflow: scroll;
}

form > * {
    flex-shrink: 0;
}

input {
    background-color: white;
}

/* .title {
    padding-top: 10px;
} */

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}

.field-label {
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    color: #6C757D;
    text-align: start;
}

.title {
    font-size: 16px;
    font-weight: 500;
}

.iteration-id, .todo-id {
    font-size: 12px;
    color: #9A9A9A;
}

.todo-link-row {
    padding-left: 24px;
}

.todo-link {
    cursor: pointer;
    font-size: 14px;
    color: #3B99FC;
}

.todo-link:hover {
    text-decoration: underline;
}

.small-input {
    width: 44px;
    height: 24px;
    padding: 2px 6px;
    font-size: 14px;
    text-align: end;
    border: 1px solid rgba(0, 0, 0, .08);
    border-radius: 4px;
    outline-style: none;
}

.small-input:focus {
    border-color: #039BE5;
}

.duration-unit {
    font-size: 12px;
    color: #6C757D;
}

.clear-pill {
    background-color: #F5F5F5;
}

.footer {
    padding-top: 12px;
    border-top: 1px solid rgba(0, 0, 0, .08);
    font-size: 14px;
}

.link {
    cursor: pointer;
    color: #6C757D;
}

.delete-link {
    color: #DC3545;
}

.save-button {
    padding: 5px 16px;
    font-size: 14px;
    font-weight: 500;
    line-height: 18px;
    color: white;
    background-color: #3B99FC;
    border: none;
    border-radius: 4px;
}

.save-button:hover {
    background-color: #2A86E8;
}
</style>