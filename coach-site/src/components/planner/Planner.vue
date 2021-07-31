<template>
    <div class="planner row g-0">
        <div id="left-and-body" class="col">
            <PlannerNavbar class="nav" 
                :dayCount="dayCount" 
                :selectedView="selectedView" 
                :selectedPage="selectedPage" 
                @dayCountChange="dayCountChange"
                @viewChange="viewChange" 
                @showWeekView="selectedPage = 'planner'; showLeft = true" 
                @showItems="selectedPage = 'items'; showLeft = false"></PlannerNavbar>
            <div class="left-wrapper row g-0">
                <div class="col d-flex flex-row">
                    <div class="left" :class="{open: showLeft}">
                        <!-- <ThumbnailCalendar v-if="showThumbnail"></ThumbnailCalendar> -->
                        <LeftPanel @dateChange="dateChange"></LeftPanel>
                    </div>
                    <div class="body">
                        <Items v-if="selectedPage == 'items'"></Items>
                        <WeekView v-if="selectedPage == 'planner' && selectedView=='weekView'" :dayCount="dayCount"></WeekView>
                        <MonthView v-if="selectedPage == 'planner' && selectedView=='monthView'" :today="today" :selectedDate="selectedDate"></MonthView>
                    </div>
                </div>
            </div>
        </div>
        <div id="right" class="col-auto">
            <ItemPanel :selectedDate="selectedDate"></ItemPanel>
        </div>
    </div>
</template>

<script>
import PlannerNavbar from "../nav/PlannerNavbar.vue";
import ItemPanel from "./item-panel/ItemPanel.vue";
import Split from 'split.js'
import Items from '../items/Items.vue';
import WeekView from './calendar/week/WeekView.vue';
import LeftPanel from './left-panel/LeftPanel.vue';
import MonthView from './calendar/month/MonthView.vue';
import { today } from "../../../utility";
// import ThumbnailCalendar from './thumbnail/ThumbnailCalendar.vue';

export default {
    name: "Planner",
    components: { PlannerNavbar, ItemPanel, Items, WeekView, LeftPanel, MonthView },
    data: function() {
        return {
            split: null,
            selectedView: "monthView",
            selectedPage: "items",
            showLeft: true,
            dayCount: 5,
            today: today(),
            selectedDate: today(),
        }
    },
    mounted: function() {
        // this.initSplit();
    },
    created: function() {
        let selectedPage_Store = localStorage.getItem(`selected-page`);
        if (selectedPage_Store) {
            this.selectedPage = selectedPage_Store;
        } else {
            localStorage.setItem(`selected-page`, this.selectedPage);
        }

        let selectedView_Store = localStorage.getItem(`selected-planner-view`);
        if (selectedView_Store) {
            this.selectedView = selectedView_Store;
        } else {
            localStorage.setItem(`selected-planner-view`, this.selectedView);
        }

        let dayCount_Store = localStorage.getItem(`week-view-day-count`);
        if (dayCount_Store) {
            this.dayCount = Number(dayCount_Store);
        } else {
            localStorage.setItem(`week-view-day-count`, this.dayCount);
        }
    },
    methods: {
        initSplit,
        dayCountChange,
        viewChange,
        dateChange
    },
    watch: {
        selectedView(value) {
            localStorage.setItem(`selected-planner-view`, value);
        },
        dayCount(value) {
            localStorage.setItem(`week-view-day-count`, value);
        },
        selectedPage(value) {
            localStorage.setItem(`selected-page`, value);
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

function dayCountChange(count) {
    this.dayCount = count;
}

function viewChange(view) {
    this.selectedView = view;
}

function dateChange(date) {
    this.selectedDate = date;
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

/* .planner .gutter {
    background-color: #eee;
    background-repeat: no-repeat;
    background-position: 50%;
}

.planner .gutter.gutter-horizontal {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==');
    cursor: col-resize;
}   */
</style>

<style scoped>
.planner {
    height: 100vh;
    min-width: 100vw;
}

#left-and-body {
    height: 100vh;
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
    /* margin-left: 262px; */
    /* width: calc(100% - 262px); */
    width: 100%;
}
</style>