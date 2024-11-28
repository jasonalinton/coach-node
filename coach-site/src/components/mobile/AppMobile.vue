<template>
    <div id="app" :class="['grid-container-mobile']">
        <div class="navbar">
            <MobileNavbar />
        </div>
        <div class="calendar">
            <CalendarMobile class="mt-2" />
        </div>
        <div class="item-panel-tabbar">
            <ItemPanelTabBar />
        </div>
        <ItemPanel v-show="false" class="item-panel" />
    </div>
</template>

<script>
import MobileNavbar from './navbar/MobileNavbar.vue';
import ItemPanelTabBar from '../planner/item-panel/ItemPanelTabBar.vue';
import ItemPanel from '../planner/item-panel/ItemPanel.vue';
import CalendarMobile from './calendar/CalendarMobile.vue';
import { today } from '../../../utility';

export default {
    name: "AppMobile",
    components: {
        MobileNavbar,
        CalendarMobile,
        ItemPanelTabBar,
        ItemPanel
    },
    data: function () {
        return {
            initialDate: new Date(),
            selectedDate: today().toLocaleString()
        };
    },
    created: async function () {
        
    },
    computed: {
        
    },
    methods: {
        
    },
    watch: {
        
    },
};


</script>


<style>
body { 
    overflow-x: hidden;
}

.grid-container-mobile {
    height: 100vh;
    /* This is supposed to prevent the viewport height being too large on mobile */
    /* https://stackoverflow.com/questions/37112218/css3-100vh-not-constant-in-mobile-browser */
    min-height: -webkit-fill-available;
    /* width: 100vw; */
    display: grid;
    /* gap: 20px; */
    grid-template-rows: 64px auto auto 0;
}

.show-tab-bar {
    grid-template-columns: 57px auto
}

.hide-tab-bar {
    grid-template-columns: 0px auto
}

.navbar {
    /* background-color: darkcyan; */
    grid-row: 1;
    grid-column: 1 / span 2;
}

.calendar {
    grid-row: 2;
    grid-column: 1 / span 2;
    height: 10px;
}

.item-panel-tabbar {
    grid-row: 3;
    grid-column: 1;
    height: 100%
}
</style>
