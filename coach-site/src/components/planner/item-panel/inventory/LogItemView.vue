<template>
    <div v-if="logItem" class="log-item d-flex flex-column">
        <div class="d-flex flex-row justify-content-between">
            <div class="d-flex flex-row">
                <div class="name"
                     @click="$emit('selectLogItem', logItem.id)">{{ logItem.name }}</div>
                <img v-if="!showAdditionalValues" 
                     class="icon-button" :class="{ show:(value)?true:false}"
                     src='/icon/next.png' width="16" height="16"
                     @click.prevent="showAdditionalValues = (value) ? true : showAdditionalValues"/>
                <img v-if="showAdditionalValues" class="icon-button" 
                     :class="{ show:(value)?true:false}"
                     src='/icon/icon-expanded.png' width="16" height="16"
                     @click.prevent="showAdditionalValues = (value) ? false : showAdditionalValues"/>
            </div>
            <div class="last-value">{{ value }}</div>
        </div>
        <div class="fields d-flex flex-column">
            <template v-for="field in fields">
                <input v-if="CONTROL.SLIDER == field.controlTypeID" :key="field.id"
                       class="slider" :class="{ 'has-value': field.value }"
                       type="range" min="1" max="10" step="0.1" v-model="field.value"
                       @mousedown="sliderStart($event, field)"
                       @mouseup="sliderEnd($event, field)"
                       @touchstart="sliderStart($event, field)"
                       @touchend="sliderEnd($event, field)">
            </template>
        </div>
        <div v-if="value && showAdditionalValues" 
             class="additional-values d-flex flex-column">
            <DateTimeSelector class="date-selector mt-2"
                              :dateTime="updatedDateTime" 
                              @onChange="updateEntryDateTime"/>
            <textarea id="blurb" class="textarea mt-2" 
                      type="text"
                      placeholder="Blurb"
                      v-model.lazy="blurb"
                      spellcheck="true">
            </textarea>
        </div>
    </div>
</template>

<script>
import DateTimeSelector from '../../../controls/select/DateTimeSelector.vue'
import { useMetricStore } from '../../../../store/metricStore';
import { CONTROL } from '../../../../model/constants'
import { subtractMinutes, getDurationInMinutes } from '../../../../../utility/timeUtility';

export default {
    name: 'LogItemView',
    components: { DateTimeSelector },
    props: {
        logItemID: Number,
        clearValues: Number,
        clearMinutes: {
            type: Number,
            default: 60
        }
    },
    data: function () {
        return {
            metricStore: undefined,
            CONTROL,
            fields: [],
            entryDateTime: undefined,
            updatedDateTime: undefined,
            blurb: null,
            hasValue: false,
            timeout: undefined,
            showAdditionalValues: false,
        }
    },
    created: function() {
       this.metricStore = useMetricStore();
    },
    computed: {
        logItem() {
            if (this.metricStore) {
                let logItem = this.metricStore.getLogItem(this.logItemID);
                return logItem;
            }
            return undefined;
        },
        value() {
            let value = "";
            this.fields.forEach(field => {
                if (field.value != undefined) {
                    value += field.value;
                }
            })
            return value;
        },
        lastEntry() {
            return (this.logItem && this.logItem.entries) ? this.logItem.entries[this.logItem.entries.length-1] : undefined;
        },
        isLevel() {
            if (this.logItem) {
                if (this.logItem.fields.length == 1 && this.logItem.fields[0].name.toLowerCase() == "level") {
                    return true;
                }
            }
            return false;
        },
        isDrug() {
            if (this.logItem && this.logItem.name.toLowerCase() == "drugs") {
                return true;
            } else {
                return false;
            }
        }
    },
    methods: {
        setProps,
        setTimeout(minutes) {
            if (this.timeout) {
                clearTimeout(this.timeout);
            }
            this.timeout = setTimeout(() => {
                this.clear();
            }, minutes * 60 * 1000)
        },
        sliderStart(e, field) {
            if (field.value == undefined) {
                field.value = e.currentTarget.value;
            }
        },
        sliderEnd() {
            if (this.entryDateTime == undefined) {
                this.entryDateTime = new Date();
                this.save(true);
            } else {
                this.save();
            }
            this.setTimeout(this.clearMinutes);
        },
        updateEntryDateTime,
        clear() {
            this.setProps(true);
        },
        save(isNew) {
            let model = {
                logItemID: this.logItem.id,
                dateTime: this.entryDateTime,
                fields: [],
                isNew: isNew || false,
                isUpdated: (isNew) ? false : true,
            }
            this.fields.forEach(field => {
                model.fields.push({
                    id: field.id,
                    value: field.value
                });
            })
            this.metricStore.logLogItem(model);
        }
    },
    watch: {
        logItem() {
            this.setProps();
        },
        clearValues() {
            this.clear();
        },
        showAdditionalValues(value) {
            if (value) {
                this.updatedDateTime = this.entryDateTime.toJSON();
            }
        },
        blurb(value) {
            if (value == null || this.lastEntry.reason == value)
                return;
            let model = {
                logItemID: this.logItem.id,
                dateTime: this.entryDateTime,
                reason: {
                    value,
                    isUpdated: true
                },
                isUpdated: true,
            }
            this.metricStore.logLogItem(model);
        }
    }
}

function setProps(clear) {
    let lastEntry = (!clear && this.logItem.entries) ? this.logItem.entries[this.logItem.entries.length-1] : undefined;
    let fields = [];
    this.logItem.fields.forEach(f => {
        let field = {
            id: f.id,
            value: undefined,
            controlTypeID: f.controlTypeID,
            dataTypeID: f.dataTypeID
        };
        fields.push(field);
        /* Set field value 
           If clear is false and the last logged value was within the clear time */
        if (!clear && lastEntry) {
            let lastValue = lastEntry.fieldValues.find(v => v.logItemFieldID == f.id);
            if (lastValue) {
                let lastEntryDateTime = new Date(lastEntry.dateTime);
                let clearCutoff = subtractMinutes(this.clearMinutes);
                if (+lastEntryDateTime > +clearCutoff) {
                    field.value = lastValue.value;
                    this.blurb = lastEntry.reason;
                    this.entryDateTime = lastEntryDateTime;
                    let minutesSince = getDurationInMinutes(lastEntryDateTime, new Date());
                    let minutesLeft = this.clearMinutes - minutesSince;
                    this.setTimeout(minutesLeft);
                } else {
                    this.entryDateTime = undefined;
                    this.updatedDateTime = undefined;
                    this.blurb = null;
                    this.showAdditionalValues = false;
                }
            }
        }
    });
    if (clear) {
        this.entryDateTime = undefined;
        this.updatedDateTime = undefined;
        this.blurb = null;
        this.showAdditionalValues = false;
    }
    this.fields = fields;
}

function updateEntryDateTime(value) {
    let model = {
        logItemID: this.logItem.id,
        dateTime: this.entryDateTime,
        updatedDateTime: value,
        fields: [],
        isUpdated: true,
    }
    this.updatedDateTime = value;
    this.entryDateTime = new Date(value);
    this.metricStore.logLogItem(model);
}

</script>

<style scoped>
.name:hover {
    text-decoration: underline;
}

.icon-button {
    margin: auto 0 auto 2px;
    visibility: hidden;
}

.log-item:hover .icon-button.show {
    visibility: visible;
}

/* The slider itself */
.slider {
  -webkit-appearance: none;  /* Override default CSS styles */
  appearance: none;
  width: 100%; /* Full-width */
  height: 25px; /* Specified height */
  background: #d3d3d3; /* Grey background */
  outline: none; /* Remove outline */
  opacity: 0.7; /* Set transparency (for mouse-over effects on hover) */
  -webkit-transition: .2s; /* 0.2 seconds transition on hover */
  transition: opacity .2s;
}

/* Mouse-over effects */
.slider:hover {
  opacity: 1; /* Fully shown on mouse-over */
}

/* The slider handle (use -webkit- (Chrome, Opera, Safari, Edge) and -moz- (Firefox) to override default look) */
.slider::-webkit-slider-thumb {
  -webkit-appearance: none; /* Override default look */
  appearance: none;
  width: 25px; /* Set a specific slider handle width */
  height: 25px; /* Slider handle height */
  background: #d3d3d3; /* Green background */
  cursor: pointer; /* Cursor on hover */
}

.slider::-moz-range-thumb {
  width: 25px; /* Set a specific slider handle width */
  height: 25px; /* Slider handle height */
  background: #d3d3d3; /* Green background */
  cursor: pointer; /* Cursor on hover */
}

.slider.has-value::-webkit-slider-thumb {
  background: #3B99FC;
} 

.slider.has-value::-moz-range-thumb {
  background: #3B99FC;
} 
</style>