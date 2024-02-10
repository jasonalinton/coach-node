<template>
    <div>
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
                    <div>
                        <span class="start-label">Start</span>
                        <span>{{ timeModelToString(timePair.startTime) }}</span>
                    </div>
                    <div>
                        <span class="end-label">End</span>
                        <span>{{ timeModelToString(timePair.endTime) }}</span>
                    </div>
                </div>
            </div>
            <button class="btn-close" type="button" aria-label="close"
                    @click.stop="deleteOrArchive"></button>
        </div>
        <div v-if="isEditing" 
             class="wrapper-edit d-flex flex-row" :class="{ 'isValid': isValid}">
            <div>
                <!-- Timeframe -->
                <div class="d-flex flex-column">
                    <select class="form-select panel-select" aria-label="select" v-model="updatedTimePair.idTimeframe">
                        <option v-for="timeframe in timeframes" v-bind:key="timeframe.id" :value="timeframe.id">{{timeframe.text}}</option> 
                    </select> 
                </div>
                <!-- Inheritance Type -->
                <div class="d-flex flex-column">
                    <select class="form-select panel-select" aria-label="select" v-model="updatedTimePair.idInheritance">
                        <option v-for="inheritanceType in inheritanceTypes" v-bind:key="inheritanceType.id" :value="inheritanceType.id">{{inheritanceType.text}}</option> 
                    </select> 
                </div>
                <!-- Times -->
                <div class="d-flex flex-column">
                    <div class="d-flex flex-column">
                        <TimeControl class="time-control" :class="{ 'invalid': !updatedTimePair.startTime.isValid}"
                                     label="Start" :time="updatedTimePair.startTime.value" 
                                     title="Start" endpoint="Start" type="time" :canRemove="false" :isSet="!updatedTimePair.startTime.isRemoved"
                                     @addTime="addTime" @setTime="setTime" @removeTime="removeTime(updatedTimePair.startTime)"></TimeControl>
                    </div>
                    <div class="d-flex flex-column">
                        <TimeControl class="time-control" :class="{ 'invalid': !updatedTimePair.endTime.isValid}"
                                     label="End" :time="updatedTimePair.endTime.value" 
                                     title="End" endpoint="End" type="time" :isSet="!updatedTimePair.endTime.isRemoved"
                                     @addTime="addTime" @setTime="setTime" @removeTime="removeTime(updatedTimePair.endTime)"></TimeControl>
                    </div>
                </div>
                <!-- Is Event Visible -->
                <div class="form-check">
                    <input class="form-check-input mt-1" type="checkbox" value="" id="isEventVisible" 
                           v-model="updatedTimePair.isEventVisible">
                    <label class="form-check-label float-start" for="isEventVisible">
                        Is Event Visible
                    </label>
                </div>
                <!-- Recommended -->
                <div class="form-check">
                    <input class="form-check-input mt-1" type="checkbox" value="" id="flexCheckDefault" 
                           v-model="updatedTimePair.isRecommended">
                    <label class="form-check-label float-start" for="flexCheckDefault">
                        Recommended
                    </label>
                </div>
                <!-- Buttons -->
                <div class="d-flex justify-content-end">
                    <button class="btn btn-sm btn-link" type="button" @click="save">Save</button>
                    <button class="btn btn-sm btn-link" type="button" @click="cancel">Cancel</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import TimeControl from '../../../controls/time/TimeControl.vue'
import { clone, toDateString } from '../../../../../utility'
import { MOMENT } from '../../../../model/constants'
import { saveGoalTimePair } from '../../../../api/goalAPI'
import { saveTodoTimePair } from '../../../../api/todoAPI'
import { timeModelToString } from '../../../../../utility/timeUtility'

let timeframes = [
    {
        id: 63,
        text: "Day",
        isActive: true
    },
    {
        id: 68,
        text: "Week",
        isActive: true
    },
    {
        id: 69,
        text: "Month",
        isActive: true
    },
    {
        id: 72,
        text: "Tri",
        isActive: false
    },
    {
        id: 74,
        text: "Semi",
        isActive: false
    },
    {
        id: 75,
        text: "Year",
        isActive: false
    },
    {
        id: 77,
        text: "Life",
        isActive: false
    },
]

let inheritanceTypes = [
    {
        id: 140,
        text: "Self"
    },
    {
        id: 141,
        text: "Children"
    },
    {
        id: 142,
        text: "Descendants"
    },
]

export default {
    name: "TimePairControl",
    components: { TimeControl },
    props: {
        timePair: Object,
        itemID: Number,
        itemType: String,
        canEdit: Boolean
    },
    data: function() {
        return {
            todoStore: null,
            timeframes: clone(timeframes),
            inheritanceTypes: clone(inheritanceTypes),
            updatedTimePair: undefined,
            todoTimePairs: [],
            isEditing: false,
            isValid: true
        }
    },
    created: async function() {
        let todoStore = await import(`@/store/todoStore`);
        this.todoStore = todoStore.useTodoStore();

        if (this.timePair.id < 0) {
            this.isEditing = true;
        }
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
        onTimePairClicked,
        timeModelToString,
        addTime,
        setTime,
        removeTime,
        validateTimes,
        cancel() {
            this.isEditing = false;
            this.$emit("cancelTimePairEditing", this.timePair.id);
        },
        save,
        deleteOrArchive
    },
    watch: {
        isEditing(value) {
            if (value == true) {
                this.initUpdatedTimePair();
            }
        }
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

function addTime(endpoint) {
    var idEndpoint;
    if (endpoint.toLowerCase() == "start") {
        idEndpoint = 84
    } else if (endpoint.toLowerCase() == "end") {
        idEndpoint = 85
    }
    var idMoment = MOMENT.DATE;

    var dateTime = toDateString(new Date().toJSON());
    this.timePair[`${endpoint.toLowerCase()}Time`] = {
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
    }

}

function setTime(time, endpoint) {
    let timeModel = this.updatedTimePair[`${endpoint.toLowerCase()}Time`]
    timeModel.value.dateTime = time;
    if (timeModel.oldValue.dateTime != time && timeModel.oldValue.id) {
        timeModel.isEdited = true;
    } else {
        timeModel.isEdited = false;
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

function save() {
    let timePair = {
        id: this.updatedTimePair.id,
        idParent: this.updatedTimePair.idParent,
        idTimeType: this.updatedTimePair.idTimeType,
        idInheritance: this.updatedTimePair.idInheritance,
        idTimeframe: this.updatedTimePair.idTimeframe,
        startTime: (this.updatedTimePair.startTime.value) ? this.updatedTimePair.startTime : null,
        endTime: (this.updatedTimePair.endTime.value) ? this.updatedTimePair.endTime : null,
        isOwner: true,
        isEventVisible: this.updatedTimePair.isEventVisible,
        isRecommended: this.updatedTimePair.isRecommended,
        itemID: this.itemID,
        itemType: this.itemType.toLowerCase(),
    };
    
    if (this.itemType.toLowerCase() == "goal") {
        saveGoalTimePair(timePair);
    } else if (this.itemType.toLowerCase() == "todo") {
        saveTodoTimePair(timePair);
    }

    this.$emit("saveTimePair", timePair);
    this.isEditing = false;
}

function deleteOrArchive() {
    this.todoStore.deleteOrArchiveTimePair(this.timePair.id);
}

</script>

<style scoped>
.wrapper {
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
/* .wrapper-edit:hover {
    background-color: #EAEAEA;
    border: solid 1px transparent;
} */
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
}
.time-control.invalid {
    border: solid 1px red;
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

.interval span, .frequency span {
    text-align: center;
    line-height: 30px;
}

.interval input, .frequency input {
    line-height: 20px;
    min-height: 30px;
    /* padding: 4px; */
}

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

.head {
    font-size: 20px;
    text-align: start;
    width: 100%;
}

.day-of-month {
    max-width: 210px;
    margin: auto;
}

.day {
    width: 22px;
    height: 22px;
    border-radius: 11px;
    display: inline-block;
    margin: 0px 4px;
    border: solid 1px transparent;
    font-size: 14px;
}
.day:hover {
    border: solid 1px #989898;
}
.day.selected {
    background-color: #DCDCDC;
}
.day:hover {
    border: solid 1px #989898;
}

.todo-time-pair:hover {
    background-color: #EFF6FC;
}
.todo-text {
    line-height: 18px;
    text-align: start;
    font-size: 14px;
}
</style>