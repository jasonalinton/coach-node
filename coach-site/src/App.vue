<template>
    <div id="app" class="grid-container">
        <div class="nav-bar">
            <!-- <Navbar v-if="selectedPage != 'navbar'"></Navbar> -->
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
                :selectedView="navbar.selectedView" ></Planner>
            <ItemTabs v-if="navbar.selectedPage == 'items'" :selectedPage="navbar.selectedPage"></ItemTabs>
        </div>
        <div class="grid-right-panel">
            <ItemPanel></ItemPanel>
        </div>
        <!-- <Navbar v-if="selectedPage != 'planner'"></Navbar>
        <div id="app-body" class="row g-0">
            <div class="col">
                <Planner v-if="selectedPage == 'planner'" :selectedPage="selectedPage"></Planner>
                <ItemTabs
                    v-if="selectedPage == 'items'"
                    :style="{ height: `${bodyHeight}px` }"
                ></ItemTabs>
            </div>
        </div> -->
    </div>
</template>

<script>
// import Navbar from "./components/nav/Navbar.vue";
import PlannerNavbar from "./components/nav/PlannerNavbar.vue";
import ItemPanel from './components/planner/item-panel/ItemPanel.vue';
import Planner from "./components/planner/Planner.vue";
import ItemTabs from "./components/items/ItemTabs.vue";

export default {
    name: "App",
    components: {
        // Navbar,
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
            }
        };
    },
    computed: {
        selectedPage() { return this.navbar.selectedPage}
    },
    created: function () {
        let selectedPage_Store = localStorage.getItem(`selected-page`);
        if (selectedPage_Store) {
            this.navbar.selectedPage = selectedPage_Store;
        } else {
            localStorage.setItem(`selected-page`, this.navbar.selectedPage);
        }
    },
    methods: {
        dayCountChange,
        viewChange,
        showPage,
    },
    watch: {
        'navbar.selectedPage'(value) { localStorage.setItem(`selected-page`, value); },
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
    background-color: darkcyan;
    grid-row: 1;
    grid-column: 1 / span 2;
}

.grid-body {
    height: 100%;
    width: 100%;
    overflow: hidden;
    background-color: darkgoldenrod;
    grid-row: 2;
    grid-column: 1 / span 2;
}

.grid-right-panel {
    background-color:mediumseagreen;
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
