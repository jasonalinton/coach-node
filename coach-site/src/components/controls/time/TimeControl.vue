<template>
    <input class="form-control form-control-sm" :id="time.id" :type="type" @change="change" v-model="time.dateTimeString"/>
</template>

<script>

function findItem(id, itemList) {
  var findObject = (object) => object.id == id;
  var index = itemList.findIndex(findObject);
  if (index == -1) 
    null;
  else
      return itemList[index];
}

function inputDateToDate(dateString) {
    var dateArray = dateString.split("-");
    return new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
}

function inputTimeToDate(dateString) {
    var timeArray = dateString.split(":");
    return new Date(1, 0, 1, timeArray[0], timeArray[1], 0);
}

function inputDateTimeToDate(dateString) {
    var array = dateString.split("T");
    var dateArray = array[0].split("-");
    var timeArray = array[1].split(":");
    return new Date(dateArray[0], dateArray[1] - 1, dateArray[2], timeArray[0], timeArray[1], 0);
}

// var time = {
//   types: [
//     { id: 80, text: "Scheduled" },
//     { id: 81, text: "Recommended" },
//     { id: 82, text: "Due" }
//   ],
//   endpoint: [
//     { id: 84, text: "Start" },
//     { id: 85, text: "End" },
//   ],
  
// }
var moments = [
    { id: 87, text: "Date", inputType: "date" },
    { id: 88, text: "Time", inputType: "time" },
    { id: 89, text: "Date Time", inputType: "datetime-local" },
  ]

export default {
  name: 'TimeControl',
  props: {
      time: Object,
      label: String
  },
  computed: {
      type: function () {
          var moment = findItem(this.time.idMoment, moments);
          return moment.inputType;
      }
  },
  data: function () {
      return {
        selectedTypes: [],
      }
  },
  methods: {
    change: function () {
        if (this.type == "date") {
            this.time.dateTime = inputDateToDate(this.time.dateTimeString);
        } else if (this.type == "time") {
            this.time.dateTime = inputTimeToDate(this.time.dateTimeString);
        } else if (this.type == "datetime-local") {
            this.time.dateTime = inputDateTimeToDate(this.time.dateTimeString);
        }
    }
  }
}
</script>
