<template>
    <div id="app" class="grid-container">
        <div class="nav-bar">
            <PlannerNavbar
                :dayCount="navbar.week.dayCount" 
                :selectedView="navbar.selectedView" 
                :selectedPage="navbar.selectedPage"
                @dayCountChange="dayCountChange"
                @viewChange="viewChange"
                @showPage="showPage">
            </PlannerNavbar>
        </div>
        <div class="grid-body" ref="gridBody">
            <Planner 
                v-if="navbar.selectedPage == 'planner'" 
                :selectedPage="navbar.selectedPage"
                :dayCount="navbar.week.dayCount"
                :selectedView="navbar.selectedView"
                :selectedDate="selectedDate"
                @dateChange="dateChange">
            </Planner>
            <ItemTabs v-if="navbar.selectedPage == 'items'"></ItemTabs>
        </div>
        <div class="grid-right-panel">
            <ItemPanel :selectedDate="selectedDate"></ItemPanel>
        </div>
    </div>
</template>

<script>
import PlannerNavbar from "./components/nav/PlannerNavbar.vue";
import ItemPanel from './components/planner/item-panel/ItemPanel.vue';
import Planner from "./components/planner/Planner.vue";
import ItemTabs from "./components/items/ItemTabs.vue";
import { today } from "../utility"

export default {
    name: "App",
    components: {
        PlannerNavbar,
        ItemPanel,
        Planner,
        ItemTabs,
    },
    data: function () {
        return {
            navbar: {
                selectedView: 'weekView',
                week: {
                    dayCount: 5,
                },
                selectedPage: 'planner',
            },
            itemsPage: {
                selectedTab: "metric",
            },
            selectedDate: today()
        };
    },
    created: function () {
        let selectedPage_Store = localStorage.getItem(`selected-page`);
        if (selectedPage_Store) {
            this.navbar.selectedPage = selectedPage_Store;
        } else {
            localStorage.setItem(`selected-page`, this.navbar.selectedPage);
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
        dayCountChange,
        viewChange,
        showPage,
        dateChange,
    },
    watch: {
        'navbar.selectedPage'(value) { localStorage.setItem(`selected-page`, value); },
        'navbar.selectedView'(value) { localStorage.setItem(`selected-planner-view`, value); },
        'navbar.week.dayCount'(value) { localStorage.setItem(`week-view-day-count`, value); },
    },
};

function dayCountChange(count) {
    this.navbar.week.dayCount = count;
}

function viewChange(view) {
    this.navbar.selectedView = view;
}

function showPage(page) {
    this.navbar.selectedPage = page;
}

function dateChange(date) {
    this.selectedDate = date;
}
</script>


<style>
body { 
    overflow-x: hidden;
}

.grid-container {
    height: 100vh;
    /* width: 100vw; */
    display: grid;
    /* gap: 20px; */
    grid-template-rows: 64px auto;
    grid-template-columns: 272px auto 352px;
}

.nav-bar {
    /* background-color: darkcyan; */
    grid-row: 1;
    grid-column: 1 / span 2;
}

.grid-body {
    height: 100%;
    width: 100%;
    overflow: hidden;
    /* background-color: darkgoldenrod; */
    grid-row: 2;
    grid-column: 1 / span 2;
}

.grid-right-panel {
    /* background-color:mediumseagreen; */
    grid-row: 1 / span 2;
    grid-column: 3;
    overflow-y: hidden;
    height: 100%
}

/* @font-face {
  font-family: "San Francisco";
  font-weight: 400;
  src: url("https://applesocial.s3.amazonaws.com/assets/styles/fonts/sanfrancisco/sanfranciscodisplay-regular-webfont.woff");
} */

@import url('https://fonts.googleapis.com/css2?family=Varela+Round&display=swap');

/* @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@500;700&family=Varela+Round&display=swap'); */
</style>
