<template>
    <div class="form-group mt-2">
        <div class="header d-flex justify-content-between align-items-center align-middle">
            <h2>Times</h2>
        </div>
        <!-- Add Button -->
        <button v-if="!activeTimePair" class="add-btn mt-1" type="button" @click="constructTimePair">
            <img src="/icon/button/add.png" width="10" height="10"/>Add
        </button>
        <div v-if="activeTimePair" class="active-time-pair d-column mt-2">
            <div class="d-flex flex-column">
                <!-- Start -->
                <TimeControl class="mb-2" :time="activeTimePair.startTime" endpoint="Start" @addTime="addTime" @removeTime="removeTime" @setTime="setTime"></TimeControl>
                <!-- End -->
                <TimeControl :time="activeTimePair.endTime" endpoint="End" @addTime="addTime" @removeTime="removeTime" @setTime="setTime"></TimeControl>
            </div>
            <!-- Buttons -->
            <div class="edit-buttons d-flex justify-content-end">
                <button class="btn btn-sm btn-link" type="button" @click="saveTimePair">Save</button>
                <button class="btn btn-sm btn-link" type="button" @click="cancelTimePair">Cancel</button>
            </div>
        </div>
        <!-- Time List -->
        <div class="list-group mt-1" v-for="timePair in timePairs" v-bind:key="timePair.id">
            <div class="list-group-item list-group-item-light list-group-item-action d-flex flew-row justify-content-between"
                @click="editTimePair(timePair)">
                <div class="d-flex flex-column justify-content-between">
                <div class="type d-flex flex-row align-items-center">
                    <img src="/icon/time.png" width="14" height="14"/>
                    <div>Scheduled</div>
                </div>
                    <div v-if="timePair.startTime" class="start">
                        <span>Start:</span>
                        {{ ` ${dateTimeString(timePair.startTime)}` }}
                    </div>
                    <div v-if="timePair.endTime" class="end">
                        <span :style="{ 'margin-right': '4px'}">End:</span>
                        {{ `${dateTimeString(timePair.endTime)}` }}
                    </div>
                </div>
                <div class="d-flex align-center">
                    <i class="remove fas fa-times btn-sm" @click.stop="removeItem(timePair, timePairs)"></i>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { removeItem, toDateString, toTimeString, toDateTimeString, today } from '../../../../utility'
import TimeControl from './TimeControl.vue';
import moment from 'moment';

let timeTypes = [
  { id: 80, text: "Scheduled", isActive: true },
  { id: 81, text: "Recommended", isActive: true }
];
let endpointTypes = [
    { id: 84, text: "Start" },
    { id: 85, text: "End" },
];
let flexibilityTypes = [
  { id: 23, text: "Definitive", isActive: true },
  { id: 24, text: "Strict", isActive: true },
  { id: 25, text: "Elastic", isActive: true },
  { id: 26, text: "Flexible", isActive: true }
];
let momentTypes = [
    { id: 87, text: "Date", inputType: "date" },
    { id: 88, text: "Time", inputType: "time" },
    { id: 89, text: "DateTime", inputType: "datetime-local" },
]

export default {
    name: 'TimePairControl',
    components: { TimeControl },
    props: {
        timePairs: Array
    },
    data: function() {
        return {
            activeTimePair: null,
            newTimePairID: 0,
            newTimeID: 0,
        }
    },
    methods: {
        constructTimePair,
        constructTime,
        setTime,
        addTime,
        removeTime,
        editTimePair,
        saveTimePair,
        cancelTimePair,
        removeItem,
        getEndpointTypeID,
        getTimeTypeID,
        getFlexibilityTypeID,
        getMomentTypeID,
        dateTimeString,
        toDateString,
        toTimeString,
        toDateTimeString
    }
}

function constructTimePair() {
    this.activeTimePair = {
        id: --this.newTimePairID,
        timeType: { id: this.getTimeTypeID("Scheduled") },
        startTime: null,
        endTime: null,
    }
}

function constructTime(moment, endpoint, datetime = today()) {
    return {
        id: --this.newTimeID,
        type: { id: this.getTimeTypeID("Scheduled") },
        endpoint: { id: this.getEndpointTypeID(endpoint) },
        moment: moment,
        flexibility: { id: this.getFlexibilityTypeID("Elastic") },
        dateTime: datetime.toJSON(),
        isRecommended: false,
    }
}

function setTime(dateTime, endpoint) {
    if (endpoint.toLowerCase() == "start") {
        this.activeTimePair['startTime'].dateTime = dateTime;
    }else if (endpoint.toLowerCase() == "end") {
        this.activeTimePair['endTime'].dateTime = dateTime;
    }
}

function addTime(moment, endpoint) {
    if (endpoint.toLowerCase() == "start") {
        this.activeTimePair['startTime'] = this.constructTime(moment, "Start")
    }else if (endpoint.toLowerCase() == "end") {
        this.activeTimePair['endTime'] = this.constructTime(moment, "End")
    }
}

function removeTime(time) {
    if (this.activeTimePair.startTime && this.activeTimePair.startTime.id == time.id)
        this.activeTimePair.startTime = null;
    else if (this.activeTimePair.endTime && this.activeTimePair.endTime.id == time.id)
        this.activeTimePair.endTime = null;
}

function editTimePair(timePair) {
    if (this.activeTimePair) return;

    timePair = this.timePairs.find((object) => object.id == timePair.id);
    timePair = JSON.parse(JSON.stringify(timePair));

    // Initilize temp time field, isRecommended
    if (timePair.startTime && timePair.startTime.type.id == this.getTimeTypeID("Recommended"))
        timePair.startTime.isRecommended = true;
    else if (timePair.startTime)
        timePair.startTime.isRecommended = false;

    // Initilize temp field, isRecommended
    if (timePair.endTime && timePair.endTime.type.id == this.getTimeTypeID("Recommended"))
        timePair.endTime.isRecommended = true;
    else if (timePair.endTime)
        timePair.endTime.isRecommended = false;

    timePair.isUpdated = true;

    this.activeTimePair = timePair;
}

function saveTimePair(timePair) {
    timePair = JSON.parse(JSON.stringify(this.activeTimePair));

    // Set start time type
    if (timePair.startTime) {
        if (timePair.startTime.isRecommended) {
            timePair.startTime.type = { id: this.getTimeTypeID("Recommended") }
        } else {
            timePair.startTime.type = { id: this.getTimeTypeID("Scheduled") };
        }
        delete timePair.startTime.isRecommended;
    }

    // Set end time type
    if (timePair.endTime) {
        if (timePair.endTime.isRecommended) {
            timePair.endTime.type = { id: this.getTimeTypeID("Recommended") }
        } else {
            timePair.endTime.type = { id: this.getTimeTypeID("Scheduled") };
        }
        delete timePair.endTime.isRecommended;
    }

    // Set datetime
    if (timePair.startTime) {
        timePair.startTime.dateTime = new Date(timePair.startTime.dateTime);
    }
    if (timePair.endTime) {
        timePair.endTime.dateTime = new Date(timePair.endTime.dateTime);
    }

    if (this.activeTimePair.isUpdated) {
        this.$emit('updateTimePair', timePair);
    } else {
        this.$emit('addTimePair', timePair);
    }

    this.activeTimePair = null;
}

function cancelTimePair() {
    this.activeTimePair = null;
}

function getEndpointTypeID(endpointType) {
    return endpointTypes.find(_endpointType => _endpointType.text == endpointType).id
}

function getTimeTypeID(timeType) {
    return timeTypes.find(_timeType => _timeType.text == timeType).id
}

function getFlexibilityTypeID(flexibilityType) {
    return flexibilityTypes.find(_flexibilityType => _flexibilityType.text == flexibilityType).id
}

function getMomentTypeID(momentType) {
    return momentTypes.find(_momentType => _momentType.text == momentType).id
}

function dateTimeString(time) {
    if (time.moment.text == "Date") {
        return moment(time.dateTime).format("MMMM DD, YYYY");
    } else if (time.moment.text == "Time") {
        return moment(time.dateTime).format("LT");
    } else if (time.moment.text == "DateTime") {
        // let zoned = moment.parseZone(time.dateTime).utc(true);
        // let zoned2 = zoned.format();
        // console.log(zoned2);
        return `${moment(time.dateTime).format("MMMM DD, YYYY")} ${moment(time.dateTime).format("LT")}`;
    }
}
</script>

<style scoped>
.header {
    height: 30px;
    border-bottom: 1px solid rgba(220, 220, 220, .5);
}

.add-btn {
    width: 50px;
    height: 28px;
    line-height: 28px;
    padding-left: 5px;
    border: none;
    font-size: 12px;
    background-color: transparent;
}

.mapped-item:hover .header a, .mapped-item:focus .header a {
    color: #005A9E;
}

.header a {
    height: 28px;
    text-decoration: none;
    font-weight: 700;
}

h2 {
    font-size: 16px;
    margin-bottom: 0px;
    padding-left: 8px;
    color: #343434
}

.btn-link {
    padding: 2px 8px;
}

.list-group-item {
    padding: 4px 8px;
    border-radius: initial;
    border: none;
    font-size: 12px;
    /* line-height: 14px; */
    color: #343434;
    font-weight: 500;
}

.list-group-item:hover {
    background-color:#EFF6FC;
    color: #343434;
}

.list-group-item:hover img {
    visibility: visible;
}

i.edit {
    font-size: 11px;
    padding: 5px 2px;
}

i.remove {
    visibility: hidden;
}

.list-group-item:hover i.remove {
    visibility: visible;
}

.type {
    font-size: 12px !important;
    
}

.type img {
    margin-left: 2px;
    margin-right: 3px;
    
}

.type span {
    margin-left: 19px;
    font-size: 12px;
}

.start span {
    color: #1EBA31;
    margin-left: 19px;
    font-size: 12px;
}

.end span {
    color: #FC3B3B;
    margin-left: 19px;
    font-size: 12px;
}

.active-time-pair .edit-buttons {
    visibility: hidden;
}

.active-time-pair:hover .edit-buttons {
    visibility: visible;
}
</style>