<template>
    <div class="timeframe-radio d-flex flex-column">
        <div v-if="isToggle" class="btn-group" role="group" :aria-label="`moment`">
            <!-- eslint-disable-next-line vue/no-template-key -->
            <template v-for="timeframe in timeframesFirstRow" :key="-timeframe.id">
                <!-- eslint-disable-next-line vue/require-v-for-key -->
                <input type="checkbox" class="btn-check" 
                       :id="`${timeframe.text}-${container}`" :checked="isSelected(timeframe.id)" 
                       @change="toggleTimeframe(timeframe.id)" />
                <!-- eslint-disable-next-line vue/require-v-for-key -->
                <label class="btn btn-outline-primary" :for="`${timeframe.text}-${container}`">{{ timeframe.text }}</label>
            </template>
            <!-- eslint-disable-next-line vue/no-template-key -->
            <template v-for="timeframe in timeframesSecondRow" :key="timeframe.id">
                <!-- eslint-disable-next-line vue/require-v-for-key -->
                <input type="checkbox" class="btn-check" 
                       :id="`${timeframe.text}-${container}`" :checked="isSelected(timeframe.id)" 
                       @change="toggleTimeframe(timeframe.id)" />
                <!-- eslint-disable-next-line vue/require-v-for-key -->
                <label class="btn btn-outline-primary" :for="`${timeframe.text}-${container}`">{{ timeframe.text }}</label>
            </template>
        </div>
        <div v-if="!isToggle" class="btn-group" role="group" :aria-label="`moment`">
            <input type="radio" class="btn-check" :id="`day-${container}`" v-model="picked" value="day" />
            <label class="btn btn-outline-primary" :for="`day-${container}`">Day</label>
    
            <input type="radio" class="btn-check" :id="`week-${container}`" v-model="picked" value="week" />
            <label class="btn btn-outline-primary" :for="`week-${container}`">Week</label>
    
            <input type="radio" class="btn-check" :id="`month-${container}`" v-model="picked" value="month" />
            <label class="btn btn-outline-primary" :for="`month-${container}`">Month</label>
    
            <input type="radio" class="btn-check" :id="`year-${container}`" v-model="picked" value="year" />
            <label class="btn btn-outline-primary" :for="`year-${container}`">Year</label>
        </div>
        
    </div>
</template>

<script>
import { TIMEFRAME } from '../../../../model/constants';
import { timeframes } from '../../../../model/types';
import { clone } from '../../../../../utility';

export default {
    name: 'TimeframeRadio',
    props: {
        container: String,
        timeframe: String,
        timeframeIDs: {
            type: Array,
            default: function() { return []}
        },
        isToggle: Boolean
    },
    data: function() {
        return {
            TIMEFRAME: clone(TIMEFRAME),
            timeframes: clone(timeframes),
         }
    },
    computed: {
        picked: {
            get() { return this.timeframe },
            set(value) { this.$emit('timeframeSelected', value) }
        },
        selectedTimeframeIDs: {
            get() { return this.timeframeIDs; },
            set(value) { this.$emit("timeframesSelected", value) }
        },
        timeframesFirstRow() {
            let _this = this;
            let timeframes = this.timeframes.filter(x => 
                [ _this.TIMEFRAME.DAY, _this.TIMEFRAME.WEEK, _this.TIMEFRAME.MONTH, _this.TIMEFRAME.YEAR ].includes(x.id) 
            )
            return timeframes;
        },
        timeframesSecondRow() {
            let _this = this;
            let timeframes = this.timeframes.filter(x =>
                [ _this.TIMEFRAME.MILESTONE, _this.TIMEFRAME.LIFE ].includes(x.id) )
            return timeframes;
        },
    },
    methods: {
        isSelected(timeframeID) {
            if (!this.isToggle) {
                let timeframe = this.timeframes.find(x => x.id = timeframeID).text;
                return timeframe.toLowerCase() == this.timeframe.toLowerCase();
            } else {
                let isSelected = this.selectedTimeframeIDs.includes(timeframeID);
                return isSelected
            }
        },
        toggleTimeframe(timeframeID) {
            this.$emit("toggleTimeframe", timeframeID);
        }
    },
}
</script>

<style scoped>
.timeframe-radio {
    background-color: var(--background-color);
}

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