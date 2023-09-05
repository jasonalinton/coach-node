<template>
    <div class="form-group mt-2">
      <div class="d-flex justify-content-between align-items-center align-middle"
            :style="{'height': '30px'}">
        <h2>Repeats</h2>
        <button v-if="!activeRepeat" class="btn btn-sm btn-link" type="button" @click="constructRepeat">Add</button>
      </div>
      <div v-if="activeRepeat" class="d-column">
        <!-- Timeframe -->
        <div class="d-flex flew-rowalign-middle mb-2">
          <div v-for="repetition in repetitions.filter(rep => rep.isActive)" v-bind:key="repetition.id" class="form-check form-check-inline">
            <input class="form-check-input" type="radio" :id="repetition.text" :value="repetition.id" v-model="activeRepeat.timeframe.id">
            <label class="form-check-label" :for="repetition.text">{{ repetition.text }}</label>
          </div>
        </div>
        <!-- Interval -->
        <div class="d-flex flew-row mb-2">
          <!-- <label :style="{'width':'90px', 'padding-right':'10px'}">interval</label> -->
          <div class="d-flex flex-row">
            <span class="me-2">Every</span>
            <input class="form-control form-control-sm me-2" type="number" min="1" v-model="activeRepeat.interval"
                   :style="{'width': '55px'}" required/>
            <span>{{ timeframe }}</span>
          </div>
        </div>
        <!-- Frequency -->
        <div class="d-flex flew-row">
          <!-- <label class="me-2" :style="{'width':'90px', 'padding-right':'10px'}">frequency</label> -->
          <div class="d-flex flex-row">
            <input class="form-control form-control-sm me-2" type="number" min="1" v-model="activeRepeat.frequency"
                    :style="{'width': '55px'}" required />
            <span class="me-2">times a</span>
            <span>{{ timeframe }}</span>
          </div>
        </div>
        <!-- Days Of -->
         <div v-if="showDayPicker" class="d-flex mt-2">
          <label class="justify-content-center me-2">Days</label>
          <select class="form-control" v-model="activeRepeat.dayIndecies" multiple :style="{'width': '45px'}">
            <option v-for="day in days" v-bind:key="day" :value="day">{{ day }}</option>
          </select>
        </div>
        <!-- Repeat Times -->
        <div class="d-flex flex-column">
          <div class="d-flex flex-column mt-2">
            <TimeControl class="mt-2" label="Repeat Start" :time="activeRepeat.startRepeat" title="Repeat Start" endpoint="Start" type="repeat"></TimeControl>
          </div>
          <div class="d-flex flex-column mt-2">
            <TimeControl class="mt-2" label="Repeat End" :time="activeRepeat.endRepeat" title="Repeat End" endpoint="End" type="repeat" @addTime="addTime"></TimeControl>
          </div>
        </div>
        <!-- Iteration -->
        <div class="d-flex flex-column">
          <!-- Start -->
          <div class="d-flex flex-column mt-2">
            <TimeControl class="mt-2" label="Iteration Start" :time="activeRepeat.startIteration" title="Iteration Start" type="iteration" endpoint="Start" @addTime="addTime"></TimeControl>
          </div>
          <!-- End -->
          <div class="d-flex flex-column mt-2">
            <TimeControl class="mt-2" label="Iteration End" :time="activeRepeat.endIteration" title="Iteration End" type="iteration" endpoint="End" @addTime="addTime"></TimeControl>
          </div>
        </div>
        <!-- End - Iteration -->
        <!-- Is Event Visible -->
        <div class="form-check">
          <input class="form-check-input mt-1" type="checkbox" value="" id="isEventVisible" v-model="activeRepeat.isEventVisible">
          <label class="form-check-label float-start" for="isEventVisible">
            Is Event Visible
          </label>
        </div>
        <!-- Recommended -->
        <div class="form-check">
          <input class="form-check-input mt-1" type="checkbox" value="" id="flexCheckDefault" v-model="activeRepeat.isRecommended">
          <label class="form-check-label float-start" for="flexCheckDefault">
            Recommended
          </label>
        </div>
        <!-- Buttons -->
        <div class="d-flex justify-content-end">
          <button class="btn btn-sm btn-link" type="button" @click="saveRepeat">Save</button>
          <button class="btn btn-sm btn-link" type="button" @click="cancelRepeat">Cancel</button>
        </div>
      </div>
      <!-- Repeat List -->
      <div class="list-group" v-for="repeat in repeats" v-bind:key="repeat.id">
        <div class="list-group-item list-group-item-light list-group-item-action d-flex flew-row justify-content-between" @click="editRepeat(repeat)">
          <div>
            <div class="d-flex flex-row">
              <span class="me-2">Every</span>
              <span class="me-2">{{ repeat.interval }}</span>
              <span>{{ getTimeframe(repeat.timeframe.id) }}</span>
            </div>
            <div class="d-flex flex-row">
              <span class="me-2">{{ repeat.frequency }}</span>
              <span>times a {{ getTimeframe(repeat.timeframe.id) }}</span>
            </div>
          </div>
          <div class="d-flex align-center">
            <i class="remove fas fa-times btn-sm" @click.stop="removeRepeat(repeat)"></i>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import TimeControl from '../time/TimeControl1.vue'
import { today, clone } from '../../../../utility'

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

var repetitions = [
  { id: 63, text: "Daily", isActive: true },
  { id: 64, text: "Workdaily", isActive: false },
  { id: 65, text: "Weekdaily", isActive: false },
  { id: 66, text: "Weekendaily", isActive: false },
  { id: 67, text: "Weekendly", isActive: false },
  { id: 68, text: "Weekly", isActive: true },
  { id: 69, text: "Monthly", isActive: true },
];
var timeframes = [
  { id: 63, text: "day(s)", isActive: true },
  { id: 64, text: "work day(s)", isActive: false },
  { id: 65, text: "week day(s)", isActive: false },
  { id: 66, text: "weekend day(s)", isActive: false },
  { id: 67, text: "weekend(s)", isActive: false },
  { id: 68, text: "week(s)", isActive: true },
  { id: 69, text: "month(s)", isActive: true },
];

export default {
  name: 'RepeatControl2',
  components: {
    TimeControl
  },
  props: {
      repeats: {}
  },
  data() {
    return {
      showAdd: true,
      activeRepeat: null,
      newRepeatID: 0,
      newTimeID: 0,
      selectedRepetitions: [],
      selectedDays: [],
      repetitions,
      timeframes,
      timeTypes,
      flexibilityTypes,
      endpointTypes,
      momentTypes,
      console: console
    }
  },
  computed: {
    showDayPicker: function () {
      if (!this.activeRepeat) return [];

      return (this.activeRepeat.timeframe.id === this.getTimeframeID("Weekly") || 
              this.activeRepeat.timeframe.id === this.getTimeframeID("Monthly"));
    },
    days: function () {
      if (!this.activeRepeat)
        return [];

      var days = [];
      if (this.activeRepeat.timeframe.id == 68) {
        for (var i = 1; i <= 7; i++)
            days.push(i);
      } else if (this.activeRepeat.timeframe.id == 69) {
        for (i = 1; i <= 31; i++)
            days.push(i);
      }
      return days;
    },
    timeframe: function () {
      if (!this.activeRepeat.timeframe.id)
        return "____";
      
      var self = this;
      var timeframe = this.timeframes.find(timeframe => timeframe.id == self.activeRepeat.timeframe.id);
      return timeframe.text;
    },
  },
  watch: {
    repeats(value) {
      console.log(value)
    },
    'activeRepeat.dayIndecies'(value) {
      if (value && value.length > 0)
        this.activeRepeat.frequency = value.length;
    }
  },
  methods: {
    constructRepeat: function () {
      let dateTime = today();
      this.activeRepeat = { 
        id: --this.newRepeatID,
        startRepeat: { 
          id: --this.newTimeID,
          dateTime: dateTime.toJSON(),
          // dateTimeString: dateString(dateTime.toJSON()),
          type: { id: this.getTimeTypeID("Scheduled") },
          // endpoint: { id: 84 },
          endpoint: { id: this.getEndpointTypeID("Start") },
          moment: { id: 87, text: "Date" },
          flexibility: { id: this.getFlexibilityTypeID("Elastic") },
        },
        endRepeat: null,
        startIteration: null,
        endIteration: null,
        type: { id: this.getTimeTypeID("Scheduled") },
        timeframe: { id: this.getTimeframeID("Daily") },
        isRecommended: 0,
        frequency: 1,
        interval: 1,
        dayIndecies: []
      };
    },
    constructTime,
    addRepeatTime,
    addIterationTime,
    addTime,
    setRepeatTime,
    setIterationTime,
    getEndpointTypeID,
    getTimeTypeID,
    getFlexibilityTypeID,
    getMomentTypeID,
    addEndRepeat: function () {
      this.activeRepeat.endRepeat = this.constructTime(this.activeRepeat.startRepeat.dateTime.toJSON(), "end", "date");
    },
    removeEndRepeat: function () {
      this.activeRepeat.endRepeat = null;
    },
    addIterationStart: function () {
      this.activeRepeat.startIteration = this.constructTime("06:00:00", "start", "time");
    },
    removeIterationStart: function () {
      this.activeRepeat.startIteration = null;
    },
    addIterationEnd: function () {
      var time;
      if (this.activeRepeat.startIteration)
        time = this.activeRepeat.startIteration.dateTimeString
      else
        time = "06:00:00"
      this.activeRepeat.endIteration = this.constructTime(time, "end", "time");
    },
    removeIterationEnd: function () {
      this.activeRepeat.endIteration = null;
    },
    editRepeat: function (repeat) {
      repeat = this.repeats.find((object) => object.id == repeat.id);
      var tempRepeat = JSON.parse(JSON.stringify(repeat));

      // Init temp field, isRecommended
      if (tempRepeat.type.id == this.getTimeTypeID("Recommended"))
        tempRepeat.isRecommended = true;
      else
        tempRepeat.isRecommended = false;

      let indecies = [];
      tempRepeat.dayIndecies.forEach(dayIndex => indecies.push(dayIndex.index));
      tempRepeat.dayIndecies = indecies;

      tempRepeat.isUpdated = true;

      this.activeRepeat = tempRepeat;
    },
    saveRepeat: function () {
      var repeat = JSON.parse(JSON.stringify(this.activeRepeat));

      // Set time type
      if (repeat.isRecommended)
        repeat.type = { id: this.getTimeTypeID("Recommended") }
      else
        repeat.type = { id: this.getTimeTypeID("Scheduled") };
      delete repeat.isRecommended;

      let indecies = [];
      repeat.dayIndecies.forEach(index => {
        indecies.push({ index })
      })
      repeat.dayIndecies = indecies;

      // Set Type ID's
      if (repeat.endRepeat)
        repeat.endRepeat.type.id = repeat.type.id;
      if (repeat.startIteration)
        repeat.startIteration.type.id = repeat.type.id;
      if (repeat.endIteration)
        repeat.endIteration.type.id = repeat.type.id;

      repeat.interval = parseInt(repeat.interval);
      repeat.frequency = parseInt(repeat.frequency);


      if (this.activeRepeat.isUpdated) {
        this.$emit('updateRepeat', repeat);
      } else
        this.$emit('addRepeat', repeat);

      this.activeRepeat = null;
    },
    cancelRepeat: function () {
      this.activeRepeat = null;
    },
    removeRepeat: function (repeat) {
      var index = this.repeats.findIndex((object) => object.id == repeat.id);
      if (index > -1)
        this.repeats.splice(index, 1);
    },
    getTimeframe: function (idTimeframe) {
      if (idTimeframe == undefined || idTimeframe <= 0)
        return "____";
      var timeframe = this.timeframes.find(function (timeframe) {
        return timeframe.id == idTimeframe;
      });
      return timeframe.text;
    },
    getTimeframeID(repetition) {
        return this.repetitions.find(_repetition => _repetition.text == repetition).id
    },
  }
}

function constructTime(moment, endpoint, datetime = today()) {
    return {
        id: --this.newTimeID,
        type: { id: this.getTimeTypeID("Scheduled") },
        endpoint: { id: this.getEndpointTypeID(endpoint) },
        moment: clone(moment),
        flexibility: { id: this.getFlexibilityTypeID("Elastic") },
        dateTime: datetime.toJSON(),
    }
}

function addTime(moment, endpoint, type) {
    if (type == "repeat") {
      if (endpoint.toLowerCase() == "start") {
          this.activeRepeat['startRepeat'] = this.constructTime(moment, "Start")
      }else if (endpoint.toLowerCase() == "end") {
          this.activeRepeat['endRepeat'] = this.constructTime(moment, "End")
      }
    } else if (type == "iteration") {
      if (endpoint.toLowerCase() == "start") {
          this.activeRepeat['startIteration'] = this.constructTime(moment, "Start")
      }else if (endpoint.toLowerCase() == "end") {
          this.activeRepeat['endIteration'] = this.constructTime(moment, "End")
      }
    }
}

function addRepeatTime(moment, endpoint) {
    if (endpoint.toLowerCase() == "start") {
        this.activeRepeat['startRepeat'] = this.constructTime(moment, "Start")
    }else if (endpoint.toLowerCase() == "end") {
        this.activeRepeat['endRepeat'] = this.constructTime(moment, "End")
    }
}

function addIterationTime(moment, endpoint) {
    if (endpoint.toLowerCase() == "start") {
        this.activeRepeat['startIteration'] = this.constructTime(moment, "Start")
    }else if (endpoint.toLowerCase() == "end") {
        this.activeRepeat['endIteration'] = this.constructTime(moment, "End")
    }
}

function setRepeatTime(dateTime, endpoint) {
    this.activeRepeat[`${endpoint.toLowerCase()}Repeat`]
}

function setIterationTime(dateTime, endpoint) {
    this.activeRepeat[`${endpoint.toLowerCase()}Iteration`]
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
</script>

<style scoped>
h2 {
  font-size: 16px;
  margin-bottom: 0px;
  padding-left: 8px;
  color: #343434
}


.btn-link {
  padding: 2px 8px;
}

/* .list-group-item {
  padding: 5px;
  font-size: 14px;
} */

.list-group-item {
    padding: 4px 8px;
    border-radius: initial;
    border: none;
    font-size: 14px;
    /* line-height: 14px; */
    color: #343434;
}

.list-group-item:hover {
    background-color:#F5F5F5;
}

.list-group-item:hover img {
    visibility: visible;
}

i.remove {
    visibility: hidden;
}

.list-group-item:hover i.remove {
    visibility: visible;
}
</style>
