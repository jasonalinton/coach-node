<template>
    <div class="row g-1">
        <div v-for="timeframe in timeframes" :key="timeframe.id" class="col-3">
            <TimeframeItem :id="timeframe.id"
                           :text="timeframe.text"
                           :isSelected="timeframe.isSelected"
                           @toggleTimeframe="$emit('toggleTimeframe', $event)"></TimeframeItem>
        </div>
    </div>
</template>

<script>
import TimeframeItem from './TimeframeItem.vue';

let timeframes = [
    {
        id: 43,
        text: "Day",
        isSelected: false
    },
    {
        id: 48,
        text: "Week",
        isSelected: false
    },
    {
        id: 49,
        text: "Month",
        isSelected: false
    },
    {
        id: 56,
        text: "Milestone",
        isSelected: false
    },
    {
        id: 52,
        text: "Tri",
        isSelected: false
    },
    {
        id: 54,
        text: "Semi",
        isSelected: false
    },
    {
        id: 55,
        text: "Year",
        isSelected: false
    },
    {
        id: 57,
        text: "Life",
        isSelected: false
    }
]

export default {
    name: "TimeframeControl",
    components: { TimeframeItem },
    props: {
        selectedTimeframes: Array
    },
    data: function () {
        return {
            timeframes: []
        };
    },
    created: function() {
        this.timeframes = timeframes;
        this.timeframes.forEach(timeframe => {
            var selected = this.selectedTimeframes.find(x => x.id == timeframe.id);
            timeframe.isSelected = (selected) ? true : false;
        });
    },
    watch: {
        selectedTimeframes(value) {
            this.timeframes.forEach(timeframe => {
                var selected = value.find(x => x.id == timeframe.id);
                timeframe.isSelected = (selected) ? true : false;
            });
            
        }
    }
}
</script>