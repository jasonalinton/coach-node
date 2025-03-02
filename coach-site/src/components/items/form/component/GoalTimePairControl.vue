<template>
    <div class="goal-time-pair-control d-flex flex-column">
        <!-- Card View -->
        <div v-if="!isEditing" class="wrapper d-flex flex-row justify-content-between"
             @click="onTimePairClicked">
            <div class="d-flex flex-row">
                <div class="d-flex flex-column">
                    <img src="/icon/calendar-day.png" width="14" height="14"/>
                    <!-- <span>{{ timePair.id }}</span> -->
                </div>
                <div class="start d-flex flex-column">
                    <div>
                        <span class="blue">{{ timeframe }}</span>
                    </div>
                    <div v-if="timePair.startTime">
                        <span class="start-label">Start</span>
                        <span>{{ timeModelToString(timePair.startTime) }}</span>
                    </div>
                    <div v-if="timePair.endTime">
                        <span class="end-label">End</span>
                        <span>{{ timeModelToString(timePair.endTime) }}</span>
                    </div>
                </div>
            </div>
            <button class="btn-close" type="button" aria-label="close"
                    @click.stop="deleteTimePair"></button>
        </div>
        <!-- Edit View -->
        <div v-if="isEditing" class="wrapper-edit d-flex flex-column" :class="{ 'isValid': isValid}">
            <!-- Points -->
            <!-- <div class="points d-flex flex-column">
                <span class="label text-start">Points</span>
                <input class="textbox" type="number" min="1"
                               v-model.lazy="updatedTimePair.points" 
                               spellcheck="true"/>
                <div class="pills d-flex flex-row justify-content-between mt-1 gap-1">
                    <span v-for="point in points" :key="point" 
                          class="pill flex-grow-1"
                          @click="addPoints(point)">{{point}}</span>
                </div>
            </div> -->
            <!-- Inheritance -->
            <div class="inheritance d-flex flex-column mt-2">
                <span class="label text-start">Inheritance</span>
                <div class="pills d-flex flex-row justify-content-between gap-1">
                    <span v-for="inheritanceType in inheritanceTypes" v-bind:key="inheritanceType.id" 
                          class="pill flex-grow-1" :class="{ 'selected': isInheritanceSelected(inheritanceType.id)}"
                          @click="toggleInheritance(inheritanceType.id)">
                        {{ inheritanceType.text }}
                    </span>
                </div>
            </div>
            <!-- Timeframe -->
            <div class="timeframe d-flex flex-column mt-2">
                <span class="label text-start">Timeframe</span>
                <div class="pills d-flex flex-row justify-content-between mt-1 gap-1">
                    <span v-for="timeframe in timeframes.slice(0,3)" v-bind:key="timeframe.id" 
                          class="pill flex-grow-1" :class="{ 'selected': isTimeframeSelected(timeframe.id)}"
                          @click="toggleTimeframe(timeframe.id)">
                        {{ timeframe.text }}
                    </span>
                </div>
                <div class="pills d-flex flex-row justify-content-between mt-1 gap-1">
                    <span v-for="timeframe in timeframes.slice(3,5)" v-bind:key="timeframe.id"
                          class="pill flex-grow-1" :class="{ 'selected': isTimeframeSelected(timeframe.id)}"
                          @click="toggleTimeframe(timeframe.id)">
                        {{ timeframe.text }}
                    </span>
                </div>
                <div class="pills d-flex flex-row justify-content-between mt-1 gap-1">
                    <span v-for="timeframe in timeframes.slice(-3)" v-bind:key="timeframe.id"
                          class="pill flex-grow-1" :class="{ 'selected': isTimeframeSelected(timeframe.id)}"
                          @click="toggleTimeframe(timeframe.id)">
                        {{ timeframe.text }}
                    </span>
                </div>
            </div>
            <!-- Times -->
            <div class="start d-flex flex-column mt-2">
                <div class="d-flex flex-row justify-content-space-between">
                    <TimeControl class="time-control" :class="{ 'invalid': !updatedTimePair.startTime.isValid}"
                                 label="Start" :time="updatedTimePair.startTime.value" 
                                 title="Start" endpoint="Start" type="date" :canRemove="false" :isSet="!updatedTimePair.startTime.isRemoved"
                                 @addTime="addTime" @setTime="setTime" @removeTime="removeTime(updatedTimePair.startTime)"/>
                </div>            
                <div class="end d-flex flex-column">
                    <div class="d-flex flex-row justify-content-space-between">
                        <TimeControl class="time-control" :class="{ 'invalid': !updatedTimePair.endTime.isValid}"
                                     label="End" :time="updatedTimePair.endTime.value" 
                                     title="End" endpoint="End" type="date" :isSet="!updatedTimePair.endTime.isRemoved"
                                     @addTime="addTime" @setTime="setTime" @removeTime="removeTime(updatedTimePair.endTime)"/>
                    </div>            
                </div>
            </div>
            <!-- Todos -->
            <div class="d-flex flex-column mt-2">
                <span class="label text-start">Todos</span>
                <input class="textbox" type="number" min="1"
                               v-model="todoID" 
                               v-on:keyup.enter="addTodo"
                               spellcheck="true"/>
                <div class="d-flex flex-column">
                    <TodoFormItem v-for="id in updatedTimePair.todoIDs" :key="id"
                                :id="id" :parentID="itemID" parentType="goal" 
                                :routineRepeatIDs="[]"
                                :parentRepeatIDs="[]"
                                @removeItem="removeTodo(id)"/>
                    <!-- <div v-for="todo in todos" :key="todo.id" 
                         class="todo d-flex flex-row">
                        <span>{{ todo.id }}</span>
                        <span>{{ todo.text }}</span>
                    </div> -->
                </div>
            </div>
            <!-- Checkboxes -->
            <!-- <div class="d-flex flex-row gap-1 mt-2">
                <span class="pill flex-grow-1" :class="{ 'selected': updatedTimePair.isEventVisible}"
                      @click="updatedTimePair.isEventVisible = !updatedTimePair.isEventVisible">
                      Event
                </span>
                <span class="pill flex-grow-1" :class="{ 'selected': updatedTimePair.isRecommended}"
                      @click="updatedTimePair.isRecommended = !updatedTimePair.isRecommended">
                      Recommended
                </span>
            </div> -->
            <!-- Buttons -->
            <div class="d-flex justify-content-end">
                <button class="btn btn-sm btn-link" type="button" @click="save">Save</button>
                <button class="btn btn-sm btn-link" type="button" @click="cancel">Cancel</button>
            </div>
        </div>
    </div>
</template>

<script>
import TimeControl from '../../../controls/time/TimeControl.vue';
import TodoFormItem from '../todo/TodoFormItem.vue';
import { clone } from '../../../../../utility'
import { timeModelToString, toDateString, firstDayOfWeek, lastDayOfWeek, firstDayOfMonth, 
    lastDayOfMonth, endOfDay, firstDayOfYear, lastDayOfYear } from '../../../../../utility/timeUtility'
import { TIMEFRAME, MOMENT, TIMETYPE } from '../../../../model/constants'
import { timeframes, inheritanceTypes } from '../../../../model/types'

export default {
    name: 'GoalTimePairControl',
    components: { TimeControl, TodoFormItem },
    props: {
        timePair: Object,
        itemID: Number,
        canEdit: Boolean
    },
    data: function () {
        return {
            goalStore: null,
            updatedTimePair: undefined,
            inheritanceTypes: clone(inheritanceTypes),
            timeframes: clone(timeframes),
            TIMEFRAME: clone(TIMEFRAME),
            MOMENT: clone(MOMENT),
            TIMETYPE: clone(TIMETYPE),
            isEditing: false,
            isValid: true,
            todoID: undefined
            // points: [1,3,5,8,15,50]
        }
    },
    created: async function() {
        let goalStore = await import(`@/store/goalStore`);
        this.goalStore = goalStore.useGoalStore();

        if (this.timePair.id < 0) {
            this.isEditing = true;
        }
        let _this = this;
        this.inheritanceTypes.forEach(x => {
            x.isSelected = (_this.timePair.idInheritance == x.id);
        })
    },
    computed: {
        timeframe() {
            let timePair = (this.isEditing) ? this.updatedTimePair : this.timePair;
            let timeframe = timeframes.find(x => x.id == timePair.idTimeframe);
            return (timeframe) ? timeframe.text : "";
        },
    },
    methods: {
        initUpdatedTimePair,
        timeModelToString,
        onTimePairClicked,
        deleteTimePair,
        // addPoints,
        toggleInheritance,
        isInheritanceSelected,
        toggleTimeframe,
        isTimeframeSelected,
        correctTimes,
        addTime,
        setTime,
        removeTime,
        validateTimes,
        addTodo,
        removeTodo,
        save,
        cancel,
    },
    watch: {
        isEditing(value) {
            if (value == true) {
                this.initUpdatedTimePair();
            }
        },
    }
}

function initUpdatedTimePair() {
    this.updatedTimePair = clone(this.timePair);
    let timeProps = ["startTime", "endTime"];
    timeProps.forEach(prop => {
        this.updatedTimePair[prop] = {
            isEdited: false,
            isRemoved: false,
            isValid: true,
            value: this.updatedTimePair[prop] ? clone(this.updatedTimePair[prop]) : null,
            oldValue: this.updatedTimePair[prop] ? clone(this.updatedTimePair[prop]) : null
        };
    });
    this.validateTimes();
}

function onTimePairClicked() {
    if (this.canEdit) {
        this.isEditing = true;
        this.$emit("setSelectedTimePair", this.timePair.id);
    }
}

// function addPoints(points) {
//     if (!this.updatedTimePair.points) {
//         this.updatedTimePair.points = points;
//     } else {
//         this.updatedTimePair.points = parseInt(this.updatedTimePair.points);
//         this.updatedTimePair.points += points
//     }
// }

function toggleInheritance(id) {
    this.updatedTimePair.idInheritance = id;

    this.inheritanceTypes.forEach(x => {
        x.isSelected = (x.id == id)
    });
}

function toggleTimeframe(id) {
    let _this = this;
    this.timeframes.forEach(x => {
        if (x.id != id) {
            x.isSelected = false;
        } else if (!_this.updatedTimePair.idTimeframe) { 
            _this.updatedTimePair.idTimeframe = id;
            x.isSelected = true;
        } else { 
            if (_this.updatedTimePair.idTimeframe != id) {
                _this.updatedTimePair.idTimeframe = id;
                x.isSelected = true;
            } else {
                _this.updatedTimePair.idTimeframe = undefined;
                x.isSelected = false;
            }
        }
    });

    this.correctTimes();
}

function correctTimes() {
    let value = this.updatedTimePair.idTimeframe;
    let start = this.updatedTimePair.startTime.value;
    let end = this.updatedTimePair.endTime.value;
    if (value == this.TIMEFRAME.DAY) {
        if (start) {
            end.dateTime = new Date(start.dateTime).toISOString();
        } else if (end) {
            start.dateTime = new Date(end.dateTime).toISOString();
        }
    } else if (value == this.TIMEFRAME.WEEK) {
        if (start) {
            start.dateTime = firstDayOfWeek(start.dateTime).toISOString();
            end.dateTime = endOfDay(lastDayOfWeek(start.dateTime)).toISOString();
        } else if (end) {
            start.dateTime = firstDayOfWeek(end.dateTime).toISOString();
            end.dateTime = endOfDay(lastDayOfWeek(end.dateTime)).toISOString();
        }
    } else if (value == this.TIMEFRAME.MONTH) {
        if (start) {
            start.dateTime = firstDayOfMonth(start.dateTime).toISOString();
            end.dateTime = endOfDay(lastDayOfMonth(start.dateTime)).toISOString();
        } else if (end) {
            start.dateTime = firstDayOfMonth(end.dateTime).toISOString();
            end.dateTime = endOfDay(lastDayOfMonth(end.dateTime)).toISOString();
        }
    } else if (value == this.TIMEFRAME.YEAR) {
        if (start) {
            start.dateTime = firstDayOfYear(start.dateTime).toISOString();
            end.dateTime = endOfDay(lastDayOfYear(start.dateTime)).toISOString();
        } else if (end) {
            start.dateTime = lastDayOfYear(end.dateTime).toISOString();
            end.dateTime = endOfDay(lastDayOfYear(end.dateTime)).toISOString();
        }
    }


    if (new Date(start.dateTime) != new Date(this.timePair.startTime.dateTime)) {
        this.updatedTimePair.startTime.isEdited = true;
    } else {
        this.updatedTimePair.startTime.isEdited = false;
    }

    if (new Date(end.dateTime) != new Date(this.timePair.endTime.dateTime)) {
        this.updatedTimePair.endTime.isEdited = true;
    } else {
        this.updatedTimePair.endTime.isEdited = false;
    }

    this.validateTimes();
}

function isInheritanceSelected(id) {
    return this.updatedTimePair.idInheritance == id;
}

function isTimeframeSelected(id) {
    return this.updatedTimePair.idTimeframe == id;
}

function addTime(endpoint) {
    var idEndpoint;
    if (endpoint.toLowerCase() == "start") {
        idEndpoint = 84
    } else if (endpoint.toLowerCase() == "end") {
        idEndpoint = 85
    }
    var idMoment = this.MOMENT.DATETIME;

    var dateTime = toDateString(new Date().toJSON());
    this.updatedTimePair[`${endpoint.toLowerCase()}Time`] = {
            isEdited: false,
            isRemoved: false,
            isValid: true,
            value: {
                idEndpoint,
                idMoment,
                idType: 80,
                dateTime
            },
            oldValue: {
                idEndpoint,
                idMoment,
                idType: 80,
                dateTime
            }
    };
    this.correctTimes();
}

function setTime(time, endpoint) {
    endpoint = endpoint.toLowerCase();
    let timeModel = this.updatedTimePair[`${endpoint}Time`]
    timeModel.value.dateTime = time;
    if (timeModel.oldValue.dateTime != time && timeModel.oldValue.id) {
        timeModel.isEdited = true;
    } else {
        timeModel.isEdited = false;
    }

    let start = this.updatedTimePair.startTime.value;
    let end = this.updatedTimePair.endTime.value;
    if (this.updatedTimePair.idTimeframe) {
        if (this.updatedTimePair.idTimeframe == this.TIMEFRAME.DAY) {
            if (endpoint == "start") {
                end.dateTime = time;
            } else if (endpoint == "end") {
                start.dateTime = time;
            }
        } else if (this.updatedTimePair.idTimeframe == this.TIMEFRAME.WEEK) {
            if (endpoint == "start") {
                start.dateTime = firstDayOfWeek(new Date(time)).toISOString();
                end.dateTime = endOfDay(lastDayOfWeek(new Date(time))).toISOString();
            } else if (endpoint == "end") {
                start.dateTime = firstDayOfWeek(new Date(time)).toISOString();
                end.dateTime = endOfDay(lastDayOfWeek(new Date(time))).toISOString();
            }
        } else if (this.updatedTimePair.idTimeframe == this.TIMEFRAME.MONTH) {
            if (endpoint == "start") {
                start.dateTime = firstDayOfMonth(new Date(time)).toISOString();
                end.dateTime = endOfDay(lastDayOfMonth(new Date(time))).toISOString();
            } else if (endpoint == "end") {
                start.dateTime = firstDayOfMonth(new Date(time)).toISOString();
                end.dateTime = endOfDay(lastDayOfMonth(new Date(time))).toISOString();
            }
        } else if (this.updatedTimePair.idTimeframe == this.TIMEFRAME.YEAR) {
            if (endpoint == "start") {
                start.dateTime = firstDayOfYear(new Date(time)).toISOString();
                end.dateTime = endOfDay(lastDayOfYear(new Date(time))).toISOString();
            } else if (endpoint == "end") {
                start.dateTime = lastDayOfYear(new Date(time)).toISOString();
                end.dateTime = endOfDay(lastDayOfYear(new Date(time))).toISOString();
            }
        }
    } else {
        if (endpoint == "start" && end.dateTime) {
            if (+new Date(end.dateTime) < +new Date(time)) {
                end.dateTime = time;
            }
        } else if (endpoint == "end" && start.dateTime) {
            if (+new Date(start.dateTime) > +new Date(time)) {
                start.dateTime = time;
            }
        } 
    }

    this.validateTimes();
}

function removeTime(time) {
    time.isRemoved = true;
}

function validateTimes() {
    if (this.updatedTimePair.startTime.value && this.updatedTimePair.endTime.value) {
        if (+new Date(this.updatedTimePair.startTime.value.dateTime)
             > +new Date(this.updatedTimePair.endTime.value.dateTime)) {
                this.isValid = false;
                this.updatedTimePair.startTime.isValid = false;
                this.updatedTimePair.endTime.isValid = false;
        } else {
            this.isValid = true;
            this.updatedTimePair.startTime.isValid = true;
            this.updatedTimePair.endTime.isValid = true;
        }
    }
}

function addTodo() {
    var index = this.updatedTimePair.todoIDs.findIndex(x => x == this.todoID);
    if (index == -1) {
        this.updatedTimePair.todoIDs.push(this.todoID);
    }
    this.todoID = undefined;
}

function removeTodo(id) {
    let index = this.updatedTimePair.todoIDs.findIndex(x => x == id);
    this.updatedTimePair.todoIDs.splice(index, 1);
}

function save() {
    let timePair = {
        id: this.updatedTimePair.id,
        idParent: this.updatedTimePair.idParent,
        idTimeType: this.TIMETYPE.SCHEDULED,
        idInheritance: this.updatedTimePair.idInheritance,
        idTimeframe: this.updatedTimePair.idTimeframe,
        points: this.updatedTimePair.points || null,
        startTime: (this.updatedTimePair.startTime.value) ? this.updatedTimePair.startTime : null,
        endTime: (this.updatedTimePair.endTime.value) ? this.updatedTimePair.endTime : null,
        isOwner: true,
        isEventVisible: this.updatedTimePair.isEventVisible,
        isRecommended: this.updatedTimePair.isRecommended,
        itemID: this.itemID,
        itemType: "goal",
        addedTodoIDs: [],
        removedTodoIDs: []
    };

    let _this = this;
    this.updatedTimePair.todoIDs.forEach(id => {
        if (!_this.timePair.todoIDs.includes(id)) {
            timePair.addedTodoIDs.push(id);
        }
    });
    this.timePair.todoIDs.forEach(id => {
        if (!_this.updatedTimePair.todoIDs.includes(id)) {
            timePair.removedTodoIDs.push(id);
        }
    });
    
    this.goalStore.saveTimePair(timePair);

    this.$emit("saveTimePair", timePair);
    this.isEditing = false;
}

function deleteTimePair() {
    this.goalStore.deleteTimePair(this.timePair.id);
}

function cancel() {
    this.isEditing = false;
    this.$emit("cancelTimePairEditing", this.timePair.id);
}

</script>

<style scoped>
.wrapper {
    cursor: pointer;
    padding: 4px 2px;
    line-height: 18px;
    text-align: start;
    font-size: 12px;
}

.wrapper:hover {
    background-color: #EFF6FC;
}

.wrapper-edit {
    border: solid 1px transparent;
}

.wrapper-edit.invalid {
    border: solid 1px red;
}

button.btn-close {
    visibility: hidden;
}

.wrapper:hover button.btn-close {
    visibility: visible;
}

.time-control {
    border: solid 1px transparent;
    width: 100%;
}
.time-control.invalid {
    border: solid 1px red;
}

.label {
    font-size: 14px;
}

img {
    margin-top: 1px;
    margin-right: 2px;
}

.start {
    margin-left: 3px;
}

.blue {
    color: #3B99FC
}

span.start-label {
    color: #1EBA31;
    margin-right: 5px;
    font-weight: 500;
}

span.end-label {
    color: #FC3B3B;
    margin-right: 9px;
    font-weight: 500;
}

.pill {
    cursor: pointer;
    padding: 4px 0px;
    line-height: 14px;
    font-size: 14px;
    background-color: var(--pill-default);
    border-radius: 4px;
    border: transparent solid 1px;
}
.pill:hover {
    border: var(--pill-border-hover) solid 1px;
}
.pill.selected {
    border: var(--pill-border-hover) solid 1px;
    background-color: var(--pill-background-selected);
}
.pill:active {
    background-color: var(--pill-background-selected);
}
</style>