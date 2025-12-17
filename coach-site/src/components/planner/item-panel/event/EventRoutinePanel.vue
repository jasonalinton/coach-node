<template>
    <div class="event-routine-panel d-flex flex-column flex-grow-1">
        <!-- Header -->
        <div class="head d-flex flex-column px-2 pt-2">
            <div v-if="!showForm" class="d-flex flex-column">
                <span class="label text-start mt-1 mb-1">{{ _event.text }}</span>
                <div class="d-flex flex-row justify-content-between">
                    <div class="d-flex flex-column">
                        <div class="d-flex flex-row mt-1">
                            <span v-if="isToday" class="timeframe">Today</span>
                            <span v-if="!isToday" class="timeframe">Day</span>
                            <span class="dash">-</span>
                            <span class="date">{{ date }}</span>
                        </div>
                        <div class="time d-flex flex-row">
                            <span class="date">{{ startDate }}</span>
                            <span class="dash">-</span>
                            <span class="date">{{ endDate }}</span>
                        </div>
                    </div>
                    <img class="edit icon-button ms-2 mt-auto mb-auto" 
                         src='/icon/edit-button.png' width="20" height="20"
                         @click="openForm"/>
                </div>
            </div>
            <!-- Form -->
            <div v-if="showForm" class="form d-flex flex-column">
                <!-- Title/Text -->
                <div class="form-group mt-1">
                    <input id="event-routine-panel-text" class="title textbox" type="text" ref="text" placeholder="Title"
                            v-model.lazy.trim="_event.text"
                            v-on:keyup.enter="save"
                            spellcheck="true"/>
                </div>
                <!-- Time -->
                <div class="form-group mt-1">
                    <DateTimeSelector class="date-selector mt-2" :class="{ 'invalid': !isValid }"
                                :dateTime="_event.startAt" @onChange="setTime('start', $event)"></DateTimeSelector>
                    <DateTimeSelector class="date-selector mt-2" :class="{ 'invalid': !isValid }"
                                :dateTime="_event.endAt" @onChange="setTime('end', $event)"></DateTimeSelector>
                </div>
                <!-- Buttons -->
                <div v-if="isProcessing" class="d-flex flex-row mt-auto mb-2 justify-content-center position-sticky bottom-0">
                    <div class="loader"></div>
                </div>
                <div v-if="!isProcessing" class="form-group d-flex justify-content-end mt-2">
                    <button class="btn-sm btn-primary me-2" :class="{ 'btn-primary': isValid, 'btn-danger': !isValid }" type="button"
                            :disabled="!isValid"
                            @click.prevent="save">Save</button>
                    <button class="btn-sm btn-warning" type="button" @click.prevent="closeForm">Cancel</button>
                </div>
            </div>
            <span class="points text-start mt-1">{{ points.text }}</span>
        </div>
        <!-- Body -->
        <div v-if="_event" class="d-flex flex-column flex-grow-1 justify-content-between mt-2">
            <!-- Pending -->
            <ul v-if="incompleteIterations" class="item-list pending">
                <li v-for="(iteration, index) in incompleteIterations" v-bind:key="iteration.id" :style="{ 'z-index': -index }">
                    <ListItem :iteration="iteration" :parent="_event" :parentType="'routineEvent'"></ListItem>
                </li>
            </ul>
            <!-- Complete  -->
            <div class="complete d-flex flex-column">
                <div class="header">Completed ({{ completeIterations.length }})</div>
                <ul v-if="completeIterations" class="item-list">
                    <li v-for="(iteration, index) in completeIterations" v-bind:key="index" :style="{ 'z-index': -index }">
                            <ListItem class="complete" :iteration="iteration"></ListItem>
                    </li>
                </ul>
            </div>
        </div>

    </div>
</template>

<script>
import ListItem from '../component/ListItem.vue';
import { toShortWeekdayString, startOfDay, isToday, toShortTimeString } from '../../../../../utility/timeUtility';
import { replaceItem, removeItem, today, sortAsc } from '../../../../../utility';
import DateTimeSelector from '../../../controls/select/DateTimeSelector.vue';


export default {
    name: 'EventRoutinePanel',
    components: { ListItem, DateTimeSelector },
    props: {
        _event: Object
    },
    data: function () {
        return {
            eventStore: undefined,
            iterations: { 
                new: null
            },
            original: {
                id: undefined,
                text: undefined,
                startAt: undefined,
                endAt: undefined
            },
            showForm: false,
            isValid: true,
            isProcessing: false
        }
    },
    created: async function() {
        let eventStore = await import(`@/store/eventStore`);
        this.eventStore = eventStore.useEventStore();
        
        this.original.id = this._event.id;
        this.original.text = this._event.text;
        this.original.startAt = this._event.startAt;
        this.original.endAt = this._event.endAt;
        this.showForm = false;
    },
    computed: {
        eventt() { 
            if (this.eventStore) {
                let eventt = this.eventStore.events.find(_event => _event.id == this._event.id);
                return eventt;
            } else {
                return undefined;
            }
        },
        startAt() {
            return (this.eventt) ? this.eventt.startAt.toDate() : undefined;
        },
        endAt() {
            return (this.eventt) ? this.eventt.endAt.toDate() : undefined;
        },
        completeIterations() { 
            if (this.eventt) {
                var complete = this.eventt.iterations.filter(task => task.attemptedAt && task.routineIterationID)
                return sortAsc(complete, 'id');
            } else {
                return [];
            }
        },
        incompleteIterations() { 
            if (this.eventt) {
                var incomplete = this.eventt.iterations.filter(task => !task.attemptedAt && task.routineIterationID) 
                return sortAsc(incomplete, 'id');
            } else {
                return [];
            }
        },
        date() {
            if (this.eventt) {
                return toShortWeekdayString(this.eventt.startAt, true);
            }
            return "";
        },
        startDate() {
            return (this.startAt) ? toShortTimeString(this.startAt) : "";
        },
        endDate() {
            return (this.endAt) ? toShortTimeString(this.endAt) : "";
        },
        isToday() {
            if (this.eventt) {
                return isToday(this.eventt.startAt);
            }
            return undefined
        },
        points() {
            let complete = 0;
            let incomplete = 0;
            this.incompleteIterations.forEach(x => {
                if (x.points) {
                    incomplete += x.points
                }
            });
            this.completeIterations.forEach(x => {
                if (x.points) {
                    complete += x.points
                }
            });
            let total = complete + incomplete;
            return { complete, incomplete, total, text: `${complete}/${total}` };
        },
    },
    methods: {
        initIteration,
        setTime,
        openForm,
        closeForm,
        validateTimes,
        addNewTask,
        cancelAddTask,
        replaceItem,
        removeItem,
        today,
        toShortWeekdayString,
        sortAsc,
        save
    },
    watch: {
        _event(value) {
            if (this.original.id == undefined || this.original.id && this.original.id != value.id) {
                this.original.id = value.id;
                this.original.text = value.text;
                this.original.startAt = value.startAt;
                this.original.endAt = value.endAt;
            }
        }
    }
}

function initIteration() {
    return {
        id: this.newItemID--,
        text: '',
        startAt: startOfDay(this._event.startAt),
        endAt: null,
        attemptedAt: null,
        completedAt: null,
        isRecommended: false,
    }
}

function openForm() {
    this.showForm = true;
}

function closeForm() {
    this._event.text = this.original.text;
    this._event.startAt = this.original.startAt;
    this._event.endAt = this.original.endAt;
    this.showForm = false;
    this.validateTimes();
}

function setTime(endpoint, datetime) {
    if (endpoint == "start") {
        this._event.startAt = datetime;
    } else 
    if (endpoint == "end") {
        this._event.endAt = datetime;
    }
    this.validateTimes();
}

function validateTimes() {
    if (+new Date(this._event.startAt) > +new Date(this._event.endAt)) {
        this.isValid = false;
    } else if (+new Date(this._event.startAt) <= +new Date(this._event.endAt)) {
        this.isValid = true;
    }
}

function addNewTask() {
    this.iterations.new = this.initIteration();
    this.$nextTick(() => this.$refs.newTask.focus());
}

function cancelAddTask() {
    this.iterations.new = null;
}

function save() {
    this.isProcessing = true;
    var title = this._event.text.trim();
    if (title == "") return;

    this.eventStore.updateEvent(this._event.id, title, this._event.startAt, this._event.endAt)
    .then(result => {
        this.isProcessing = false;
        this.showForm = false;
    });
}

</script>

<style scoped>
.event-routine-panel {
    height: calc(100vh - 64px);
    overflow: scroll;
}

.edit {
    visibility: hidden;
}

.head:hover .edit {
    visibility: visible;
}

.toolbar {
    padding: 8px;
    z-index: 3;
    background-color: white;
}

span.timeframe {
    /* padding-left: 20px; */
    color: #3B99FC;
    font-size: 14px;
    font-weight: 500;
}
span.date {
    font-size: 14px;
    font-weight: 500;
}
span.dash {
    margin: 0 4px;
    line-height: 21px;
}
span.label {
    line-height: 22px;
    font-size: 18px;
    font-weight: 500;
    color: var(--dark-gray-text);
}

.time {
    margin-left: 40px;
    color: var(--bs-secondary);
}

span.points {
    font-size: 14px;
}

.item-list {
    margin-bottom: 8px;
    z-index: 2;
}

ul {
    font-size: 14px;
    color: #3C4043;
    list-style: none;
    padding: 0px;
    margin: 0px;
    text-align: start;
}

.item-list li {
    position: relative;
}

.new-task {
    background-color: white;
    position: relative;
    z-index: 1;
    padding-right: 12px;
}

/* .pending {
    overflow: scroll;
} */

.complete {
    /* position: absolute; */
    bottom: 0;
}

.complete .header {
    background-color: white;
    z-index: 3;
    padding: 0 8px;
}

/* Loader */
.loader {
    margin-top: 2px;
    margin-right: 4px;
    width: 30px;
    aspect-ratio: 1;
    border-radius: 50%;
    border: 4px solid var(--workout-red);
    animation:
    l20-1 0.8s infinite linear alternate,
    l20-2 1.6s infinite linear;
}
@keyframes l20-1{
   0%    {clip-path: polygon(50% 50%,0       0,  50%   0%,  50%    0%, 50%    0%, 50%    0%, 50%    0% )}
   12.5% {clip-path: polygon(50% 50%,0       0,  50%   0%,  100%   0%, 100%   0%, 100%   0%, 100%   0% )}
   25%   {clip-path: polygon(50% 50%,0       0,  50%   0%,  100%   0%, 100% 100%, 100% 100%, 100% 100% )}
   50%   {clip-path: polygon(50% 50%,0       0,  50%   0%,  100%   0%, 100% 100%, 50%  100%, 0%   100% )}
   62.5% {clip-path: polygon(50% 50%,100%    0, 100%   0%,  100%   0%, 100% 100%, 50%  100%, 0%   100% )}
   75%   {clip-path: polygon(50% 50%,100% 100%, 100% 100%,  100% 100%, 100% 100%, 50%  100%, 0%   100% )}
   100%  {clip-path: polygon(50% 50%,50%  100%,  50% 100%,   50% 100%,  50% 100%, 50%  100%, 0%   100% )}
}
@keyframes l20-2{ 
  0%    {transform:scaleY(1)  rotate(0deg)}
  49.99%{transform:scaleY(1)  rotate(135deg)}
  50%   {transform:scaleY(-1) rotate(0deg)}
  100%  {transform:scaleY(-1) rotate(-135deg)}
}
</style>