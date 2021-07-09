<template>
    <div class="form-group mt-2">
      <div class="d-flex justify-content-between align-items-center align-middle mb-1"
            :style="{'height': '30px'}">
        <h2>Repeats</h2>
        <button v-if="!activeRepeat" class="btn btn-sm btn-link" type="button" @click="constructRepeat">Add</button>
      </div>
      <div v-if="activeRepeat" class="d-column">
        <!-- Timeframe -->
        <div class="d-flex flew-rowalign-middle mb-2">
          <div v-for="repetition in repetitions.filter(rep => rep.isActive)" v-bind:key="repetition.id" class="form-check form-check-inline">
            <input class="form-check-input" type="radio" :id="repetition.text" :value="repetition.id" v-model="activeRepeat.idTimeframe">
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
                    :style="{'width': '55px'}" required/>
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
            <span class="align-self-start">Repeat Start</span>
            <TimeControl class="mt-2" label="Repeat Start" :time="activeRepeat.repeatStart"></TimeControl>
          </div>
          <div class="d-flex flex-column mt-1">
            <div class="d-flex flex-row justify-content-between">
              <span>Repeat End</span>
              <i v-if="!activeRepeat.repeatEnd" class="fas fa-plus btn btn-sm" @click="addEndRepeat()"></i>
              <i v-if="activeRepeat.repeatEnd" class="fas fa-minus btn btn-sm" @click="removeEndRepeat()"></i>
            </div>
            <TimeControl v-if="activeRepeat.repeatEnd" class="mt-2" label="Repeat End" :time="activeRepeat.repeatEnd"></TimeControl>
          </div>
        </div>
        <!-- Iteration -->
        <div class="d-flex flex-column">
          <!-- Start -->
          <div class="d-flex flex-column mt-2">
            <div class="d-flex flex-row justify-content-between">
              <span>Iteration Start</span>
              <i v-if="!activeRepeat.iterationStart" class="fas fa-plus btn btn-sm" @click="addIterationStart()"></i>
              <i v-if="activeRepeat.iterationStart" class="fas fa-minus btn btn-sm" @click="removeIterationStart()"></i>
            </div>
            <TimeControl v-if="activeRepeat.iterationStart" class="mt-2" label="Iteration End" :time="activeRepeat.iterationStart"></TimeControl>
          </div>
          <!-- End -->
          <div class="d-flex flex-column mt-2">
            <div class="d-flex flex-row justify-content-between">
              <span>Iteration End</span>
              <i v-if="!activeRepeat.iterationEnd" class="fas fa-plus btn btn-sm" @click="addIterationEnd()"></i>
              <i v-if="activeRepeat.iterationEnd" class="fas fa-minus btn btn-sm" @click="removeIterationEnd()"></i>
            </div>
            <TimeControl v-if="activeRepeat.iterationEnd" class="mt-2" label="Iteration End" :time="activeRepeat.iterationEnd"></TimeControl>
          </div>
        </div>
        <!-- End - Iteration -->
        <!-- Recommended -->
        <div class="form-check">
          <input class="form-check-input mt-1" type="checkbox" value="" id="flexCheckDefault" v-model="activeRepeat.isRecommended">
          <label class="form-check-label" for="flexCheckDefault">
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
        <div class="list-group-item list-group-item-light list-group-item-action d-flex flew-row justify-content-between">
          <div>
            <div class="d-flex flex-row">
              <span class="me-2">Every</span>
              <span class="me-2">{{ repeat.frequency }}</span>
              <span>{{ getTimeframe(repeat.idTimeframe) }}</span>
            </div>
            <div class="d-flex flex-row">
              <span class="me-2">{{ repeat.interval }}</span>
              <span>times a {{ getTimeframe(repeat.idTimeframe) }}</span>
            </div>
          </div>
          <div class="d-flex align-center">
            <i v-if="!activeRepeat" class="fas fa-pen btn-sm" @click="editRepeat(repeat)" :style="{'font-size': '11px', 'padding': '5px 2px'}"></i>
            <i class="fas fa-times btn-sm" @click="removeRepeat(repeat)"></i>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import TimeControl from '../time/TimeControl.vue'

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
var timeTypes = [
  { id: 80, text: "Scheduled", isActive: true },
  { id: 81, text: "Recommended", isActive: true }
];

export default {
  name: 'RepeatControl',
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
      timeTypes
    }
  },
  computed: {
    showDayPicker: function () {
      if (!this.activeRepeat) return [];

      return (this.activeRepeat.idTimeframe === this.getTimeframeID("Weekly") || 
              this.activeRepeat.idTimeframe === this.getTimeframeID("Monthly"));
    },
    days: function () {
      if (!this.activeRepeat)
        return [];

      var days = [];
      if (this.activeRepeat.idTimeframe == 68) {
        for (var i = 1; i <= 7; i++)
            days.push(i);
      } else if (this.activeRepeat.idTimeframe == 69) {
        for (i = 1; i <= 31; i++)
            days.push(i);
      }
      return days;
    },
    timeframe: function () {
      if (!this.activeRepeat.idTimeframe)
        return "____";
      
      var self = this;
      var timeframe = this.timeframes.find(timeframe => timeframe.id == self.activeRepeat.idTimeframe);
      return timeframe.text;
    }
  },
  methods: {
    constructRepeat: function () {
      this.activeRepeat = { 
        id: --this.newRepeatID,
        repeatStart: { 
          id: --this.newTimeID,
          dateTime: null,
          dateTimeString: new Date().toJSON(),
          idType: 80,
          idEndPoint: 84,
          iterationEnd: null,
          idMoment: 87,
          idFlexibility: 0,
          isActive: 1
        },
        repeatEnd: null,
        iterationStart: null,
        iterationEnd: null,
        idType: 80,
        idTimeframe: 0,
        isRecommended: 0,
        isActive: 1,
        frequency: 1,
        interval: 1,
        dayIndecies: []
      };
    },
    constructTime: function (dateTimeString, endpoint, moment) {
      var idMoment;
      if (moment == "date")
        idMoment = 87;
      else if (moment == "time")
        idMoment = 88;
      else
        idMoment = 89;

      return { 
        id: --this.newTimeID,
        dateTime: null,
        dateTimeString: dateTimeString,
        idType: this.activeRepeat.idType,
        idEndPoint: (endpoint == "start") ? 84 : 85,
        iterationEnd: null,
        idMoment: idMoment,
        idFlexibility: 25,
        isActive: 1
      };
    },
    addEndRepeat: function () {
      this.activeRepeat.repeatEnd = this.constructTime(this.activeRepeat.repeatStart.dateTimeString, "start", "date");
    },
    removeEndRepeat: function () {
      this.activeRepeat.repeatEnd = null;
    },
    addIterationStart: function () {
      this.activeRepeat.iterationStart = this.constructTime("06:00:00", "start", "time");
    },
    removeIterationStart: function () {
      this.activeRepeat.iterationStart = null;
    },
    addIterationEnd: function () {
      var time;
      if (this.activeRepeat.iterationStart)
        time = this.activeRepeat.iterationStart.dateTimeString
      else
        time = "06:00:00"
      this.activeRepeat.iterationEnd = this.constructTime(time, "end", "time");
    },
    removeIterationEnd: function () {
      this.activeRepeat.iterationEnd = null;
    },
    saveRepeat: function () {
      // if (!(this.activeRepeat && 
      //     (this.activeRepeat.idTimeframe != 63 || this.activeRepeat.idTimeframe != 68 || this.activeRepeat.idTimeframe != 69) &&
      //     this.activeRepeat.frequency > 0 &&
      //     this.activeRepeat.interval > 0)) {
      //     alert("Invalid form!");
      //     return;
      //     }
      var repeat = JSON.parse(JSON.stringify(this.activeRepeat));

      // Set Type ID's
      if (repeat.repeatEnd)
        repeat.repeatEnd.idType = repeat.idType;
      else if (repeat.iterationStart)
        repeat.iterationStart.idType = repeat.idType;
      else if (repeat.iterationEnd)
        repeat.iterationEnd.idType = repeat.idType;

      if (this.activeRepeat.isUpdated) {
        delete repeat.isUpdated;
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
    editRepeat: function (repeat) {
      repeat = this.repeats.find((object) => object.id == repeat.id);
      var tempRepeat = JSON.parse(JSON.stringify(repeat));
      tempRepeat.isUpdated = true;
      this.activeRepeat = tempRepeat;
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
    }
  }
}
</script>

<style scoped>
  h2 {
    font-size: 16px;
    margin-bottom: 0px;
  }

  
  .btn-link {
    padding: 2px 8px;
  }

  .list-group-item {
    padding: 5px;
    font-size: 14px;
  }

</style>
