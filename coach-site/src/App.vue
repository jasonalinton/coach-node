<template>
    <div id="app" >
        <AppMobile v-if="isExtraSmall"/>
        <div v-else :class="['grid-container', leftPanelVisibility, itemPanelVisibility]">
            <div class="nav-bar overflow-scroll">
                <PlannerNavbar/>
            </div>
            <div class="grid-left-panel">
                <LeftPanel />
            </div>
            <div class="grid-body overflow-scroll">
                <!-- <RouterView/> -->
                <Planner v-show="selectedPage == 'planner'" />
                <ItemTabs v-show="selectedPage == 'items'" />
                <PhysicalView v-if="selectedPage == 'physical'" />
            </div>
            <div class="grid-right-panel">
                <ItemPanel />
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
import { useUniversalStore } from '@/store/universalStore'
// import { RouterView } from 'vue-router'

export default {
    name: "App",
    components: {
        AppMobile,
        PlannerNavbar,
        LeftPanel,
        ItemPanel,
        Planner,
        ItemTabs,
        PhysicalView,
        // RouterView
    },
    data: function () {
        return {
            itemsPage: {
                selectPanel: undefined,
            },
            appStore: undefined,
            plannerStore: undefined,
        };
    },
    created: async function () {
        await this.initStores();
    },
    beforeUnmount () {
        if (typeof window !== 'undefined') {
            window.removeEventListener('resize', this.onResize, { passive: true })
        }
    },

    mounted () {
        this.onResize()
        window.addEventListener('resize', this.onResize, { passive: true })
    },
    computed: {
        leftPanelVisibility() {
            return (this.showLeftPanel) ? `show-left-panel` : 'hide-left-panel'
        },
        isExtraSmall() {
            return (this.appStore) ?this.appStore.isExtraSmall : true;
        },
        itemPanelVisibility() {
            return (this.appStore.itemPanel.selected) ? 'show-item-panel' : 'hide-item-panel'
        },
        selectedItemPanel() {
            return (this.appStore) ? this.appStore.itemPanel.selected : "todo";
        },
        selectedPage() {
            return (this.appStore) ? this.appStore.navbar.selectedPage : "planner";
        },
        showLeftPanel() {
            return (this.appStore) ? this.appStore.showLeftPanel : true;
        },
    },
    methods: {
        initStores,
        onResize
    },
    watch: {
        selectedPage(page) {
            if (page == 'planner') {
                this.appStore.setLeftPanelVisibility(true);
            } else if (page == 'items') {
                this.appStore.setLeftPanelVisibility(false);
            } else if (page == 'physical') {
                this.appStore.setLeftPanelVisibility(false);
            }
        }
    },
};

async function initStores() {
    this.appStore = useAppStore();
    this.plannerStore = usePlannerStore();
    
    let universalStore = useUniversalStore();
    let eventStore = useEventStore();
    let iterationStore = useIterationStore();
    let physicalStore = usePhysicalStore();
    let metricStore = useMetricStore();
    let goalStore = useGoalStore();
    let todoStore = useTodoStore();
    let routineStore = useRoutineStore();

    universalStore.initialize();
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

function onResize() {
    this.appStore.setWindowSize(window.innerWidth, window.innerHeight);
    this.appStore.setWindowOuterSize(window.outerWidth, window.outerHeight);
}
</script>


<style>
@import url('https://fonts.googleapis.com/css2?family=Varela+Round&display=swap');

:root {
    --background-color: #ffffff;
    --pill-default: #EFF6FC;
    --pill-border-hover: #3B99FC;
    --pill-background-selected: #BAD8F1;
    --task-color: #F4511E;
    --goal-color: #4285F4;
    --workout-red: #E25555;
    --form-header-hover: #005A9E;
    --hover-gray: #F5F5F5;
    --active-gray: rgb(60, 64, 67, .1);
    --dark-gray: darkgray;
    --dark-gray-text: #3F3F3F;
    --gray-text: #747474;
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


/* @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@500;700&family=Varela+Round&display=swap'); */

.cursor-default {
    cursor: default;
}

.control-label {
    font-size: 12px;
    padding: 2px 8px;
    color: rgba(0, 0, 0, .55);
}

.textbox {
    height: 28px;
}

.textbox, .textarea, .select, .date-picker {
    width: 100%;
    font-size: 14px;
    line-height: 16px;
    padding: 2px 8px;
    /* padding-top: 4px; */
    /* color: #343434; */
    color: #212529;
    border-radius: 4px;
}

@media only screen and (max-width: 576px) {
    .textbox, .textarea, .select, .date-picker {
        font-size: 16px;
        line-height: 22px;
    }
}

.textarea {
    padding: 8px;
}

.textbox:not(.accissible), .textarea:not(.accissible), 
.select:not(.accissible), .date-picker:not(.accissible) {
    outline-style: none;
    -webkit-appearance: none;
    border: 1px solid rgba(0, 0, 0, .00);
    resize: none;
}

.textbox:not(.accissible):focus, .textarea:not(.accissible):focus, 
.select:not(.accissible):focus, .date-picker:not(.accissible):focus {
    border: 1px solid #039BE5;
    transition-property: border-color;
    transition-duration: 0.15s;
    transition-timing-function: ease-in-out;
    transition-delay: 0s;
    resize: vertical;
}

.textbox:not(.accissible):hover:not(:focus), .textarea:not(.accissible):hover:not(:focus), 
.select:not(.accissible):hover:not(:focus) .date-picker:not(.accissible):hover:not(:focus) {
    /* border: 1px solid rgba(0, 0, 0, .08); */
    border: 1px solid rgba(0, 0, 0, .2);
    resize: vertical;
}

.date-picker:not(:focus) {
    border: 1px solid rgba(0, 0, 0, .08) !important;
}

.form-select-sm {
    font-size: 14px;
    line-height: 14px;
}

.add-btn {
    width: 55px;
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

/* pills */
.app-pill {
    cursor: pointer;
    padding: 4px 4px;
    line-height: 14px;
    font-size: 14px;
    background-color: var(--pill-default);
    border-radius: 4px;
    border: transparent solid 1px;
}
.app-pill:hover {
    border: var(--pill-border-hover) solid 1px;
}
.app-pill.selected {
    border: var(--pill-border-hover) solid 1px;
    background-color: var(--pill-background-selected);
}
.app-pill:active {
    background-color: var(--pill-background-selected);
}
</style>
