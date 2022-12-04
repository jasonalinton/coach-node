<template>
    <div id="app" :class="['grid-container', (selectedItemPanel) ? 'show-item-panel' : 'hide-item-panel']">
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
                v-show="navbar.selectedPage == 'planner'" 
                    :selectedPage="navbar.selectedPage"
                    :dayCount="navbar.week.dayCount"
                    :selectedView="navbar.selectedView"
                    :selectedDate="selectedDate"
                    @dateChange="dateChange"
                    @selectEvent="selectEvent">
            </Planner>
            <ItemTabs v-show="navbar.selectedPage == 'items'"></ItemTabs>
        </div>
        <div class="grid-right-panel">
            <ItemPanel :selectedDate="selectedDate"
                       :selectPanel="itemsPage.selectPanel"
                       :selectedPanel="selectedItemPanel"
                       @setSelectedPanel="selectedItemPanel = $event"></ItemPanel>
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
                selectPanel: undefined,
            },
            selectedDate: today(),
            selectedItemPanel: "todo"
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
            this.navbar.selectedView = selectedView_Store;
        } else {
            localStorage.setItem(`selected-planner-view`, this.selectedView);
        }

        let dayCount_Store = localStorage.getItem(`week-view-day-count`);
        if (dayCount_Store) {
            this.navbar.week.dayCount = Number(dayCount_Store);
        } else {
            localStorage.setItem(`week-view-day-count`, this.dayCount);
        }
    },
    methods: {
        dayCountChange,
        viewChange,
        showPage,
        dateChange,
        selectEvent,
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

function selectEvent(_event) {
    this.itemsPage.selectPanel = {
        panel: 'event',
        props: { _event }
    }
}
</script>


<style>
body { 
    overflow-x: hidden;
}

.grid-container {
    height: 100vh;
    /* This is supposed to prevent the viewport height being too large on mobile */
    /* https://stackoverflow.com/questions/37112218/css3-100vh-not-constant-in-mobile-browser */
    min-height: -webkit-fill-available;
    /* width: 100vw; */
    display: grid;
    /* gap: 20px; */
    grid-template-rows: 64px auto;
}

.show-item-panel {
    grid-template-columns: 272px auto 352px;
}

.hide-item-panel {
    grid-template-columns: 272px auto 57px;
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
