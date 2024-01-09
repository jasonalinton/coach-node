<template>
    <div>
        <div v-if="!isEditing" class="wrapper d-flex flex-row justify-content-between"
             @click="onRepeatClicked">
            <div class="d-flex flex-row">
                <div class="d-flex flex-column">
                    <img src="/icon/calendar-day.png" width="14" height="14"/>
                    <span>{{ repeat.id }}</span>
                </div>
                <div class="timeframe d-flex flex-column">
                    <div>
                        <span>Every</span>
                        <span>{{ (repeat.interval == 1) ? " " : ` ${repeat.interval} ` }}</span>
                        <span class="blue">{{ (repeat.interval == 1) ? timeframe : `${timeframe}s` }}</span>
                    </div>
                    <div>
                        <span class="blue">{{ frequency }}</span>
                        <span> a </span>
                        <span>{{ timeframe }}</span>
                    </div>
                    <div v-if="repeat.idTimeframe == 68 && repeat.dayIndecies.length > 0">
                        <span>On </span>
                        <span class="blue">{{ daysOfWeek }}</span>
                    </div>
                    <div v-if="repeat.idTimeframe == 69 && repeat.dayIndecies.length > 0">
                        <span>On the </span>
                        <span class="blue">{{ daysOfMonth }}</span>
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
                <div class="d-flex flew-rowalign-middle mt-2">
                    <div v-for="repetition in timeframes.filter(rep => rep.isActive)" v-bind:key="repetition.id" 
                         class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" :id="repetition.text" :value="repetition.id" 
                        v-model="updatedRepeat.idTimeframe"
                               @click="onTimeFrameChanged">
                        <label class="form-check-label" :for="repetition.text">{{ repetition.text }}</label>
                    </div>
                </div>
                <!-- Interval -->
                <div class="interval d-flex flew-row mb-1">
                    <div class="d-flex flex-row">
                        <span class="me-1">Every</span>
                        <input class="form-control form-control-sm me-1" type="number" min="1" v-model="updatedRepeat.interval"
                               :style="{'width': numInputWidth}" required/>
                        <span class="me-1">{{ (updatedRepeat.interval == 1) ? timeframe : `${timeframe}s` }}</span>
                        <input class="form-control form-control-sm me-1" type="number" v-model="updatedRepeat.frequency"
                               :min="minFrequency" :max="maxFrequency"
                               :style="{'width': numInputWidth}" required />
                        <span class="me-1">times a</span>
                        <span>{{ timeframe }}</span>
                    </div>
                </div>
                <!-- Frequency -->
                <!-- <div class="frequency d-flex flew-row">
                    <div class="d-flex flex-row">
                    </div>
                </div> -->
                <!-- Day of Week -->
                <div v-if="updatedRepeat.idTimeframe == 68">
                    <span class="head">Days of Week</span>
                    <div>
                        <span v-for="day in dow" :key="day.index" class="day" 
                              :class="{ selected: day.isSelected }"
                              @click="onDayClicked(day)">{{ day.alt }}</span>
                    </div>
                </div>
                <!-- Day of Month -->
                <div v-if="updatedRepeat.idTimeframe == 69">
                    <span class="head">Days of Month</span>
                    <div class="day-of-month d-flex flex-row flex-wrap">
                        <span v-for="day in dom" :key="day.index" class="day" 
                              :class="{ selected: day.isSelected }"
                              @click="onDayClicked(day)">{{ day.index }}</span>
                    </div>
                </div>
                <!-- Repeat Times -->
                <div class="d-flex flex-column">
                    <div class="d-flex flex-column">
                        <TimeControl class="time-control" :class="{ 'invalid': !updatedRepeat.startRepeat.isValid}"
                                     label="Repeat Start" :time="updatedRepeat.startRepeat.value" 
                                     title="Repeat Start" endpoint="Start" type="repeat" :canRemove="false"
                                     @setTime="setTime"></TimeControl>
                    </div>
                    <div class="d-flex flex-column">
                        <TimeControl class="time-control" :class="{ 'invalid': !updatedRepeat.endRepeat.isValid}"
                                     label="Repeat End" :time="updatedRepeat.endRepeat.value" 
                                     title="Repeat End" endpoint="End" type="repeat" :isSet="!updatedRepeat.endRepeat.isRemoved"
                                     @addTime="addTime" @setTime="setTime" @removeTime="removeTime(updatedRepeat.endRepeat)"></TimeControl>
                    </div>
                </div>
                <!-- Iteration -->
                <div class="d-flex flex-column">
                    <!-- Start -->
                    <div class="d-flex flex-column">
                        <TimeControl class="time-control" :class="{ 'invalid': !updatedRepeat.startIteration.isValid}" 
                                    label="Iteration Start" :time="updatedRepeat.startIteration.value" :canRemove="false"
                                    title="Iteration Start" type="iteration" endpoint="Start" :isSet="!updatedRepeat.startIteration.isRemoved"
                                    @addTime="addTime" @setTime="setTime"></TimeControl>
                    </div>
                    <!-- End -->
                    <div class="d-flex flex-column">
                        <TimeControl class="time-control" :class="{ 'invalid': !updatedRepeat.endIteration.isValid}" 
                                    label="Iteration End" :time="updatedRepeat.endIteration.value"  :canRemove="false"
                                    title="Iteration End" type="iteration" endpoint="End" :isSet="!updatedRepeat.endIteration.isRemoved"
                                    @addTime="addTime" @setTime="setTime"></TimeControl>
                    </div>
                </div>
                <!-- End - Iteration -->
                <!-- Inheritance Type -->
                <div class="d-flex flex-column">
                    <select class="form-select panel-select" aria-label="select" v-model="updatedRepeat.idInheritance">
                        <option v-for="inheritanceType in inheritanceTypes" v-bind:key="inheritanceType.id" :value="inheritanceType.id">{{inheritanceType.text}}</option> 
                    </select> 
                </div>
                <!-- Is Event Visible -->
                <div class="form-check">
                    <input class="form-check-input mt-1" type="checkbox" value="" id="isEventVisible" 
                           v-model="updatedRepeat.isEventVisible">
                    <label class="form-check-label float-start" for="isEventVisible">
                        Is Event Visible
                    </label>
                </div>
                <!-- Recommended -->
                <div class="form-check">
                    <input class="form-check-input mt-1" type="checkbox" value="" id="flexCheckDefault" 
                           v-model="updatedRepeat.isRecommended">
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
import { clone, capitalize, toDateString } from '../../../../../utility'
import { saveRoutineRepeat } from '../../../../api/routineAPI'
import { saveTodoRepeat } from '../../../../api/todoAPI'

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
]

let dow = [
    {
        index: 1,
        text: "Sunday",
        alt: "S",
        isSelected: false
    },
    {
        index: 2,
        text: "Monday",
        alt: "M",
        isSelected: false
    },
    {
        index: 3,
        text: "Tuesday",
        alt: "T",
        isSelected: false
    },
    {
        index: 4,
        text: "Wednesday",
        alt: "W",
        isSelected: false
    },
    {
        index: 5,
        text: "Thursday",
        alt: "T",
        isSelected: false
    },
    {
        index: 6,
        text: "Friday",
        alt: "F",
        isSelected: false
    },
    {
        index: 7,
        text: "Saturday",
        alt: "S",
        isSelected: false
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
    name: "RepeatControl",
    components: { TimeControl },
    props: {
        repeat: Object,
        itemID: Number,
        itemType: String,
        canEdit: Boolean
    },
    data: function() {
        return {
            todoStore: null,
            timeframes: clone(timeframes),
            inheritanceTypes: clone(inheritanceTypes),
            updatedRepeat: undefined,
            todoRepeats: [],
            isEditing: false,
            isValid: true
        }
    },
    created: async function() {
        let todoStore = await import(`@/store/todoStore`);
        this.todoStore = todoStore.useTodoStore();

        if (this.repeat.id < 0) {
            this.isEditing = true;
        }
    },
    computed: {
        timeframe() {
            let repeat = (this.isEditing) ? this.updatedRepeat : this.repeat;
            let timeframe = timeframes.find(x => x.id == repeat.idTimeframe).text;
            return timeframe.toLowerCase();
        },
        frequency() {
            let repeat = (this.isEditing) ? this.updatedRepeat : this.repeat;
            if (repeat.frequency == 1) {
                return "Once";
            } else {
                return `${repeat.frequency} times`;
            }
        },
        daysOfWeek() {
            let daysOfWeek = "";
            if (this.repeat.idTimeframe == 68)  {
                this.repeat.dayIndecies.forEach(x => {
                    let dayOfWeek = this.dow.find(y => y.index == x).text;
                    daysOfWeek += (`${dayOfWeek} `);
                });
            }
            return daysOfWeek;
        },
        daysOfMonth() {
            let daysOfMonth = "";
            this.repeat.dayIndecies.forEach(dom => {
                if (dom == 1) {
                    daysOfMonth += "1st ";
                } else if (dom == 2) {
                    daysOfMonth += "2nd ";
                } else if (dom == 3) {
                    daysOfMonth += "3rd ";
                } else if (dom > 3) {
                    daysOfMonth += `${dom}th `;
                }
            });
            return daysOfMonth;
        },
        dow() {
            let days = [];
            dow.forEach(dayOfWeek => {
                let day = clone(dayOfWeek);
                days.push(day);
                if (this.updatedRepeat && this.updatedRepeat.idTimeframe == 68)  {
                    day.isSelected = this.updatedRepeat.dayIndecies.includes(day.index);
                }
            })
            return days;
        },
        dom() {
            var days = [];
            for (let i = 1; i <= 31; i++) {
                let day = { index: i }
                days.push(day);
                if (this.updatedRepeat.idTimeframe == 69)  {
                    day.isSelected = this.updatedRepeat.dayIndecies.includes(day.index);
                }
            }
            return days;
        },
        numInputWidth() {
            if (this.updatedRepeat.interval < 10) {
                return "25px";
            } else if (this.updatedRepeat.interval < 100){
                return "34px";
            } else {
                return "41px";
            }
        },
        minFrequency() {
            return (this.updatedRepeat.dayIndecies.length > 0) ? this.updatedRepeat.dayIndecies.length : 1;
        },
        maxFrequency() {
            if (this.updatedRepeat.idTimeframe == 68) {
                return 7;
            } else if (this.updatedRepeat.idTimeframe == 69){
                return 31;
            } else {
                return "none";
            }
        },
        // todoRepeats() {
        //     if (this.updatedRepeat) {
        //         // var todoIDs = this.updatedRepeat.todo_Repeats.map(x => x.idTod);
        //         // todoIDs.forEach(idTodo => {

        //         // })

        //         let todoRepeats = [];
        //         this.updatedRepeat.todoRepeats.forEach(tr => {
        //             let todo = this.todoStore.getItem(tr.idTodo);
        //             todoRepeats.push({
        //                 idTodo: todo.id,
        //                 todoText: todo.text,
        //                 repeat: tr,
        //                 isShown: false
        //             });
        //         });
        //         return todoRepeats
        //     } else {
        //         return [];
        //     }
        // }
    },
    methods: {
        initUpdatedRepeat,
        onRepeatClicked,
        onDayClicked,
        onTimeFrameChanged,
        addTime,
        setTime,
        removeTime,
        validateTimes,
        correctTimes,
        toggleTodoRepeat(todoRepeat) {
            todoRepeat.isShown = !todoRepeat.isShown;
        },
        cancel() {
            this.isEditing = false;
            this.$emit("cancelRepeatEditing", this.repeat.id);
        },
        save,
        deleteOrArchive
    },
    watch: {
        isEditing(value) {
            if (value == true) {
                this.initUpdatedRepeat();
            }
        }
    }
}

function initUpdatedRepeat() {
    this.updatedRepeat = clone(this.repeat);
    if (this.updatedRepeat.idTimeframe == 68)  {// Week
        this.updatedRepeat.dayIndecies.forEach(index => {
            let day = this.dow.find(_day => _day.index == index);
            day.isSelected = true;
        })
    }
    let timeProps = ["startRepeat", "endRepeat", "startIteration", "endIteration"];
    timeProps.forEach(prop => {
        this.updatedRepeat[prop] = {
            isEdited: false,
            isRemoved: false,
            isValid: true,
            value: this.updatedRepeat[prop] ? clone(this.updatedRepeat[prop]) : null,
            oldValue: this.updatedRepeat[prop] ? clone(this.updatedRepeat[prop]) : null
        };
    });
    this.validateTimes();
}

function onRepeatClicked() {
    if (this.canEdit) {
        this.isEditing = true;
        this.$emit("setSelectedRepeat", this.repeat.id);
    }
}

function onDayClicked(day) {
    day.isSelected = !day.isSelected;
    if (day.isSelected) {
        this.updatedRepeat.dayIndecies.push(day.index);
        /* Make sure frequency isn't less than number of day indecies */
        if (this.updatedRepeat.frequency < this.updatedRepeat.dayIndecies.length) {
            this.updatedRepeat.frequency = this.updatedRepeat.dayIndecies.length;
        }
    } else {
        let index = this.updatedRepeat.dayIndecies.findIndex(x => x == day.index);
        this.updatedRepeat.dayIndecies.splice(index, 1);
        // Lower frequency every time day is deselected. Min 1
        if (this.updatedRepeat.frequency != 1) {
            this.updatedRepeat.frequency -= 1; 
        }
    }
    this.updatedRepeat.dayIndecies = this.updatedRepeat.dayIndecies.sort(function (a, b) {  return a - b;  });
}

function onTimeFrameChanged() {
    this.updatedRepeat.interval = 1;
    this.updatedRepeat.frequency = 1;
    this.updatedRepeat.dayIndecies = [];
}

function addTime(endpoint, type) {
    var idEndpoint;
    if (endpoint.toLowerCase() == "start") {
        idEndpoint = 84
    } else if (endpoint.toLowerCase() == "end") {
        idEndpoint = 85
    }
    var idMoment;
    if (type.toLowerCase() == "repeat") {
        idMoment = 87
    } else if (type.toLowerCase() == "iteration") {
        idMoment = 88
    }

    var dateTime = toDateString(new Date().toJSON());
    this.updatedRepeat[`${endpoint.toLowerCase()}${capitalize(type)}`] = {
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

function setTime(time, endpoint, type) {
    let timeModel = this.updatedRepeat[`${endpoint.toLowerCase()}${capitalize(type)}`]
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
    this.correctTimes();
    // If end repeat exists and end repeat is less than start repeat, invalidate
    if (this.updatedRepeat.endRepeat.value && 
        (+new Date(this.updatedRepeat.startRepeat.value.dateTime) 
        > +new Date(this.updatedRepeat.endRepeat.value.dateTime))) {
            this.isValid = false;
            this.updatedRepeat.startRepeat.isValid = false;
            this.updatedRepeat.endRepeat.isValid = false;
    } else {
        this.isValid = true;
        this.updatedRepeat.startRepeat.isValid = true;
        this.updatedRepeat.endRepeat.isValid = true;
    }
    // If start end iterations exists and end iteration is less than or equal to start iteration, invalidate
    if (this.updatedRepeat.startIteration.value && this.updatedRepeat.endIteration.value &&
        (+new Date(this.updatedRepeat.startIteration.value.dateTime) 
        >= +new Date(this.updatedRepeat.endIteration.value.dateTime))) {
            this.isValid = false;
            this.updatedRepeat.startIteration.isValid = false;
            this.updatedRepeat.endIteration.isValid = false;
    } else {
        this.isValid = true;
        this.updatedRepeat.startIteration.isValid = true;
        this.updatedRepeat.endIteration.isValid = true;
    }
}

/* Set date portion of start & end iterations to date of start repeat */
function correctTimes() {
    let startRepeatDate = new Date(this.updatedRepeat.startRepeat.value.dateTime);

    let startIteration = this.updatedRepeat.startIteration;
    if (startIteration && startIteration.value) {
        let startIterationDate = new Date(startIteration.value.dateTime);
        startIterationDate
            .setUTCFullYear(startRepeatDate.getUTCFullYear(), startRepeatDate.getUTCMonth(), startRepeatDate.getUTCDate())
        startIteration.value.dateTime = startIterationDate.toISOString();
        if (startIteration.oldValue.id &&
            new Date(startIteration.value.dateTime).getTime() 
            != new Date(startIteration.oldValue.dateTime).getTime()) {
            startIteration.isEdited = true;
        } else {
            startIteration.isEdited = false;
        }
    }

    let endIteration = this.updatedRepeat.endIteration;
    if (endIteration && endIteration.value) {
        let endIterationDate = new Date(endIteration.value.dateTime);
        endIterationDate
            .setUTCFullYear(startRepeatDate.getUTCFullYear(), startRepeatDate.getUTCMonth(), startRepeatDate.getUTCDate())
        endIteration.value.dateTime = endIterationDate.toISOString();
        if (endIteration.oldValue.id &&
            new Date(endIteration.value.dateTime).getTime() 
            != new Date(endIteration.oldValue.dateTime).getTime()) {
            endIteration.isEdited = true;
        } else {
            endIteration.isEdited = false;
        }
    }
}

function save() {
    this.correctTimes();

    let repeat = {
        id: this.updatedRepeat.id,
        idInheritance: this.updatedRepeat.idInheritance,
        isOwner: true,
        itemID: this.itemID,
        itemType: this.itemType.toLowerCase(),
        idTimeframe: this.updatedRepeat.idTimeframe,
        idType: this.updatedRepeat.idType,
        interval: this.updatedRepeat.interval,
        frequency: this.updatedRepeat.frequency,
        dayIndecies: this.updatedRepeat.dayIndecies,
        startRepeat: this.updatedRepeat.startRepeat,
        endRepeat: (this.updatedRepeat.endRepeat.value) ? this.updatedRepeat.endRepeat : null,
        startIteration: (this.updatedRepeat.startIteration.value) ? this.updatedRepeat.startIteration : null,
        endIteration: (this.updatedRepeat.endIteration.value) ? this.updatedRepeat.endIteration : null,
        isEventVisible: this.updatedRepeat.isEventVisible,
        isRecommended: this.updatedRepeat.isRecommended,
    };
    
    if (this.itemType.toLowerCase() == "routine") {
        saveRoutineRepeat(repeat);
    } else if (this.itemType.toLowerCase() == "todo") {
        saveTodoRepeat(repeat);
    }

    this.$emit("saveRepeat", repeat);
    this.isEditing = false;
}

function deleteOrArchive() {
    this.todoStore.deleteOrArchiveRepeat(this.repeat.id);
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
}

.timeframe {
    margin-left: 3px;
}

.blue {
    color: #3B99FC
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

.todo-repeat:hover {
    background-color: #EFF6FC;
}
.todo-text {
    line-height: 18px;
    text-align: start;
    font-size: 14px;
}
</style>