<template>
    <div id="app" >
        <AppMobile v-if="isExtraSmall"/>
        <div v-else :class="['grid-container', leftPanelVisibility, itemPanelVisibility]">
            <div class="nav-bar overflow-scroll">
                <PlannerNavbar
                    :dayCount="navbar.week.dayCount" 
                    :selectedView="navbar.selectedView" 
                    :selectedPage="navbar.selectedPage"
                    @dayCountChange="dayCountChange"
                    @viewChange="viewChange"
                    @showPage="showPage"
                    @toggleLeftPanel="toggleLeftPanel">
                </PlannerNavbar>
            </div>
            <div class="grid-left-panel">
                <LeftPanel :isShown="showLeft" 
                           @togglePanel="toggleLeftPanel"/>
            </div>
            <div class="grid-body overflow-scroll">
                <Planner 
                    v-show="navbar.selectedPage == 'planner'" 
                        :selectedPage="navbar.selectedPage"
                        :dayCount="navbar.week.dayCount"
                        :selectedView="navbar.selectedView"
                        @selectEvent="selectEvent">
                </Planner>
                <ItemTabs v-show="navbar.selectedPage == 'items'"></ItemTabs>
                <ItemTabsOG v-if="navbar.selectedPage == 'itemsOG'"></ItemTabsOG>
                <PhysicalView v-if="navbar.selectedPage == 'physical'"></PhysicalView>
            </div>
            <div class="grid-right-panel">
                <ItemPanel :selectPanel="itemsPage.selectPanel"
                           :selectedPanel="selectedItemPanel"></ItemPanel>
            </div>
        </div>
    </div>
</template>

<script>
import AppMobile from "./components/mobile/AppMobile.vue";
import PlannerNavbar from "./components/nav/PlannerNavbar.vue";
import LeftPanel from "./components/planner/left-panel/LeftPanel.vue";
import ItemPanel from './components/planner/item-panel/ItemPanel.vue';
import Planner from "./components/planner/Planner.vue";
import ItemTabs from "./components/items/ItemTabs.vue";
import ItemTabsOG from "./components/items/ItemTabsOG.vue";
import PhysicalView from "./components/metrics/physical/PhysicalView.vue";
import { useAppStore } from '@/store/appStore'
import { usePlannerStore } from '@/store/plannerStore'
import { useEventStore } from '@/store/eventStore'
import { useIterationStore } from '@/store/iterationStore'
import { usePhysicalStore } from '@/store/physicalStore'
import { useMetricStore } from '@/store/metricStore'
import { useGoalStore } from '@/store/goalStore'
import { useTodoStore } from '@/store/todoStore'
import { useRoutineStore } from '@/store/routineStore'

export default {
    name: "App",
    components: {
        AppMobile,
        PlannerNavbar,
        LeftPanel,
        ItemPanel,
        Planner,
        ItemTabs,
        ItemTabsOG,
        PhysicalView,
    },
    data: function () {
        return {
            navbar: {
                selectedView: 'weekView',
                week: {
                    dayCount: 7,
                },
                selectedPage: 'planner',
            },
            itemsPage: {
                selectPanel: undefined,
            },
            // selectedItemPanel: "todo",
            appStore: undefined,
            plannerStore: undefined,
            showLeft: true
        };
    },
    created: async function () {
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
            localStorage.setItem(`selected-planner-view`, this.navbar.selectedView);
        }

        let dayCount_Store = localStorage.getItem(`week-view-day-count`);
        if (dayCount_Store) {
            this.navbar.week.dayCount = Number(dayCount_Store);
        } else {
            localStorage.setItem(`week-view-day-count`, this.navbar.week.dayCount);
        }

        await this.initStores();
    },
    beforeDestroy () {
        if (typeof window !== 'undefined') {
            window.removeEventListener('resize', this.onResize, { passive: true })
        }
    },

    mounted () {
        this.onResize()
        window.addEventListener('resize', this.onResize, { passive: true })
    },
    computed: {
        isExtraSmall() {
            if (this.appStore) {
                return this.appStore.isExtraSmall;
            }
            return true;
        },
        leftPanelVisibility() {
            return (this.showLeft) ? `show-left-panel` : 'hide-left-panel'
        },
        itemPanelVisibility() {
            return (this.appStore.itemPanel.selected) ? 'show-item-panel' : 'hide-item-panel'
        },
        selectedItemPanel() {
            if (this.appStore) {
                return this.appStore.itemPanel.selected;
            }
            return "todo";
        }
    },
    methods: {
        initStores,
        toggleLeftPanel,
        dayCountChange,
        viewChange,
        showPage,
        selectEvent,
        onResize
    },
    watch: {
        'navbar.selectedPage'(value) { localStorage.setItem(`selected-page`, value); },
        'navbar.selectedView'(value) { localStorage.setItem(`selected-planner-view`, value); },
        'navbar.week.dayCount'(value) { localStorage.setItem(`week-view-day-count`, value); },
    },
};

async function initStores() {
    this.appStore = useAppStore();
    this.plannerStore = usePlannerStore();

    let eventStore = useEventStore();
    let iterationStore = useIterationStore();
    let physicalStore = usePhysicalStore();
    let metricStore = useMetricStore();
    let goalStore = useGoalStore();
    let todoStore = useTodoStore();
    let routineStore = useRoutineStore();

    eventStore.initialize();
    iterationStore.initialize();
    physicalStore.initialize();
    let metricPromise = metricStore.initialize();
    let goalPromise = goalStore.initialize();
    let todoPromise = todoStore.initialize();
    let routinePromise = routineStore.initialize();

    await Promise.all([metricPromise, goalPromise, todoPromise, routinePromise]).then(() => {
        metricStore.initializeItems();
        goalStore.initializeItems();
        todoStore.initializeItems();
        routineStore.initializeItems();
    });
}

function toggleLeftPanel() {
    this.showLeft = !this.showLeft;
}

function dayCountChange(count) {
    this.navbar.week.dayCount = count;
}

function viewChange(view) {
    this.navbar.selectedView = view;
}

function showPage(page) {
    if (page == 'planner') {
        this.showLeft = true;
    } else if (page == 'items') {
        this.showLeft = false;
    } else if (page == 'physical') {
        this.showLeft = false;
    }
    this.navbar.selectedPage = page;
}

function selectEvent(_event) {
    this.itemsPage.selectPanel = {
        panel: 'event',
        props: { _event }
    }
}

function onResize() {
    this.appStore.setWindowSize(window.innerWidth, window.innerHeight);
    this.appStore.setWindowOuterSize(window.outerWidth, window.outerHeight);
}
</script>


<style>
:root {
    --background-color: #ffffff
}

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

.show-left-panel.show-item-panel {
    grid-template-columns: 242px auto 352px;
}

.show-left-panel.hide-item-panel {
    grid-template-columns: 242px auto 57px;
}

.hide-left-panel.show-item-panel {
    grid-template-columns: 0px auto 352px;
}

.hide-left-panel.hide-item-panel {
    grid-template-columns: 0px auto 57px;
}

.nav-bar {
    /* background-color: darkcyan; */
    grid-row: 1;
    grid-column: 1 / span 2;
}

.grid-left-panel {
    grid-row: 2;
    grid-column: 1;
    overflow-y: hidden;
    height: 100%
}

.grid-body {
    height: 100%;
    width: 100%;
    overflow: hidden;
    /* background-color: darkgoldenrod; */
    grid-row: 2;
    grid-column: 2;
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


.control-label {
    font-size: 12px;
    padding: 2px 8px;
    color: rgba(0, 0, 0, .55);
}

.textbox {
    height: 28px;
}

.textbox, .textarea {
    width: 100%;
    font-size: 14px;
    line-height: 14px;
    padding: 2px 8px;
    /* padding-top: 4px; */
    /* color: #343434; */
    color: #212529;
}

.textarea {
    padding: 8px;
}

.textbox:not(.accissible), .textarea:not(.accissible) {
    outline-style: none;
    -webkit-appearance: none;
    border: 1px solid rgba(0, 0, 0, .00);
    resize: none;
}

.textbox:not(.accissible):focus, .textarea:not(.accissible):focus {
    border: 1px solid #039BE5;
    transition-property: border-color;
    transition-duration: 0.15s;
    transition-timing-function: ease-in-out;
    transition-delay: 0s;
    resize: vertical;
}

.textbox:not(.accissible):hover:not(:focus), .textarea:not(.accissible):hover:not(:focus) {
    /* border: 1px solid rgba(0, 0, 0, .08); */
    border: 1px solid rgba(0, 0, 0, .2);
    resize: vertical;
}

.add-btn {
    width: 50px;
    height: 28px;
    line-height: 28px;
    padding-left: 5px;
    border: none;
    font-size: 12px;
    background-color: transparent;
}

.add-btn:hover {
    background-color: #DEECF9;
}

.add-btn img {
    margin-right: 5px;
    vertical-align: initial;
}

.add.textbox {
    border: none;
}

.background {
    background-color: white;
}
</style>
