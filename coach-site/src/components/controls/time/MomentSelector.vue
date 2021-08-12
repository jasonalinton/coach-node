<template>
    <div class="btn-group" role="group" :aria-label="`moment`">
        <input type="checkbox" class="btn-check" :name="`${(type) ? type : ''}-${endpoint}-date`" :id="`${(type) ? type : ''}-${endpoint}-date`" v-model="selectedDate" autocomplete="off" @click="selectDate">
        <label class="btn btn-outline-primary" :for="`${(type) ? type : ''}-${endpoint}-date`">Date</label>

        <input type="checkbox" class="btn-check" :name="`${(type) ? type : ''}-${endpoint}-time`" :id="`${(type) ? type : ''}-${endpoint}-time`" v-model="selectedTime" autocomplete="off" @click="selectTime">
        <label class="btn btn-outline-primary" :for="`${(type) ? type : ''}-${endpoint}-time`">Time</label>

        <input type="checkbox" class="btn-check" :name="`${(type) ? type : ''}-${endpoint}-dateTime`" :id="`${(type) ? type : ''}-${endpoint}-dateTime`" v-model="selectedDateTime" autocomplete="off" @click="selectDateTime">
        <label class="btn btn-outline-primary" :for="`${(type) ? type : ''}-${endpoint}-dateTime`">Date-Time</label>
    </div>
</template>

<script>
var momentTypes = [
    { id: 87, text: "Date" },
    { id: 88, text: "Time" },
    { id: 89, text: "DateTime" },
]

export default {
    name: 'MomentSelector',
    props: {
        moment: Object,
        endpoint: String,
        type: String
    },
    data: function() {
        return {
            momentTypes,
            selectedDate: false,
            selectedTime: false,
            selectedDateTime: false
        }
    },
    created: function() {
        if (this.moment) {
            this.selectedDate = (this.moment.id == this.getMomentID("Date")) ? true : false;
            this.selectedTime = (this.moment.id == this.getMomentID("Time")) ? true : false;
            this.selectedDateTime = (this.moment.id == this.getMomentID("DateTime")) ? true : false;
        }
    },
    methods: {
        getMomentID,
        selectDate: function() {
            if (!this.selectedDate) {
                if (!this.selectedTime && !this.selectedDateTime) {
                    let moment = { id: this.getMomentID("Date"), text: "Date" }
                    this.$emit('addTime', moment, this.type);
                } else {
                    this.moment.text = "Date";
                    this.moment.id = this.getMomentID("Date");
                }
                this.selectedTime = false;
                this.selectedDateTime = false;
            } else if (this.selectedDate && !this.selectedTime && !this.selectedDateTime) {
                    this.$emit('removeTime');
            }
        },
        selectTime: function() {
            if (!this.selectedTime) {
                if (!this.selectedDate && !this.selectedDateTime) {
                    let moment = { id: this.getMomentID("Time"), text: "Time" }
                    this.$emit('addTime', moment, this.type);
                } else {
                    this.moment.text = "Time";
                    this.moment.id = this.getMomentID("Time");
                }
                this.selectedDate = false;
                this.selectedDateTime = false;
            } else if (this.selectedTime && !this.selectedDate && !this.selectedDateTime) {
                    this.$emit('removeTime');
            }
        },
        selectDateTime: function() {
            if (!this.selectedDateTime) {
                if (!this.selectedDate && !this.selectedTime) {
                    let moment = { id: this.getMomentID("DateTime"), text: "DateTime" }
                    this.$emit('addTime', moment);
                } else {
                    this.moment.text = "DateTime";
                    this.moment.id = this.getMomentID("DateTime");
                }
                this.selectedDate = false;
                this.selectedTime = false;
            } else if (this.selectedDateTime && !this.selectedDate && !this.selectedTime) {
                this.$emit('removeTime');
            }
        },
    },
}

function getMomentID(momentType) {
    return this.momentTypes.find(_momentType => _momentType.text == momentType).id
}
</script>

<style scoped>
.btn-group {
    height: 24px;
}

.btn-group label {
    font-size: 14px;
    line-height: 24px;
    padding: 0px 4px;
    height: 22px;
    border: none;
    border-radius: initial;
    color: #565656;
}

.btn, .btn:focus {
    outline-style: none;
    box-shadow: none !important;
}

.btn-check:checked + .btn-outline-primary {
    color: #0D6EFD;
    background-color: #DEECF9;
}

.btn:hover {
    color: #343434;
    background-color: rgba(60, 64, 67, .08);
}
</style>