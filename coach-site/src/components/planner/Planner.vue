<template>
    <div class="planner row g-0">
        <div id="left-and-body" class="col">
            <div class="left-wrapper row g-0">
                <div class="col d-flex flex-row">
                    <div class="left" :class="{open: showLeft}">
                        <LeftPanel @dateChange="dateChange"></LeftPanel>
                    </div>
                    <div class="body">
                        <WeekView v-if="selectedView=='weekView'" :dayCount="dayCount"></WeekView>
                        <MonthView v-if="selectedView=='monthView'" :today="today" :selectedDate="selectedDate"></MonthView>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Split from 'split.js'
import WeekView from './calendar/week/WeekView.vue';
import LeftPanel from './left-panel/LeftPanel.vue';
import MonthView from './calendar/month/MonthView.vue';
import { today } from "../../../utility";

export default {
    name: "Planner",
    components: { WeekView, LeftPanel, MonthView },
    props: {
        dayCount: Number,
        selectedView: String,
        selectedDate: String,
    },
    data: function() {
        return {
            split: null,
            selectedPage: "items",
            showLeft: true,
            today: today(),
        }
    },
    mounted: function() {

    },
    created: function() {

    },
    methods: {
        initSplit,
        dateChange
    },
    watch: {
        dayCount(value) {
            localStorage.setItem(`week-view-day-count`, value);
        },
  }
};

function initSplit() {
    let sizes = localStorage.getItem(`planner-split-sizes`);
    if (sizes)
        sizes = JSON.parse(sizes);
    // else
    //     sizes = [75, 296];

    this.split = Split([`#left-and-body`, `#right`], {
        sizes,
        minSize: [296, 296],
        onDragEnd: (sizes) => localStorage.setItem(`planner-split-sizes`, JSON.stringify(sizes))
    });
}

function dateChange(date) {
    this.$emit('dateChange', date);
}
</script>

<style>
.panel-select:focus, .form-control:focus {
    box-shadow: none;
}

.planner .split {
    display: flex;
    flex-direction: row;
}
</style>

<style scoped>
.planner {
    height: 100%;
    width: 100%;
}

#left-and-body {
    /* height: 100vh; */
    overflow-y: hidden;
}

.left-wrapper {
    overflow: hidden;
}

.left { 
    visibility: collapse;
    width: 0px;
}

.left.open { 
    visibility: visible;
    width: auto;
}

.body {
    width: 100%;
    overflow: scroll;
}
</style>