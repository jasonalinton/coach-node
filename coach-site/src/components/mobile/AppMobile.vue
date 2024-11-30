<template>
    <div class="app-mobile grid-container-mobile" :class="[{'show-tab-bar': showTabBar}]" >
        <div class="navbar">
            <MobileNavbar />
        </div>
        <div class="calendar" :class="[{'collapse': !showCalendar}]">
            <CalendarMobile  />
        </div>
        <div class="item-panel-tabbar" :class="[{'collapse': !showTabBar}]">
            <ItemPanelTabBar />
        </div>
        <div class="tab-panel d-flex">
            <MobileItemTabPanel />
        </div>
        <ItemPanel v-show="false" class="item-panel" />
    </div>
</template>

<script>
import { useAppStore } from '@/store/appStore'
import MobileNavbar from './navbar/MobileNavbar.vue';
import ItemPanelTabBar from '../planner/item-panel/ItemPanelTabBar.vue';
import MobileItemTabPanel from './tabPanel/MobileItemTabPanel.vue';
import ItemPanel from '../planner/item-panel/ItemPanel.vue';
import CalendarMobile from './calendar/CalendarMobile.vue';
import { today } from '../../../utility';

export default {
    name: "AppMobile",
    components: {
        MobileNavbar,
        CalendarMobile,
        ItemPanelTabBar,
        MobileItemTabPanel,
        ItemPanel
    },
    data: function () {
        return {
            appStore: undefined,
            initialDate: new Date(),
            selectedDate: today().toLocaleString()
        };
    },
    created: async function () {
        this.appStore = useAppStore();
    },
    computed: {
        showTabBar() {
            if (this.appStore) {
                return this.appStore.isTabBarShown;
            }
            return true;
        },
        showCalendar() {
            if (this.appStore) {
                return this.appStore.calendarMobile.isShown;
            }
            return false;
        }
    },
    methods: {
        
    },
    watch: {
        
    },
};


</script>


<style scoped>
.grid-container-mobile {
    overflow: hidden;
    border-bottom: 1px solid rgba(220, 220, 220, .5);
    height: 100dvh;
    /* max-height: 100vh; */
    /* This is supposed to prevent the viewport height being too large on mobile */
    /* https://stackoverflow.com/questions/37112218/css3-100vh-not-constant-in-mobile-browser */
    min-height: -webkit-fill-available;
    width: 100vw;
    display: grid;
    /* gap: 20px; */
    grid-template-rows: 64px auto 1fr 0;
    grid-template-columns: 0px auto
}

.show-tab-bar {
    grid-template-columns: 57px auto
}

.navbar {
    /* background-color: darkcyan; */
    grid-row: 1;
    grid-column: 1 / span 2;
}

.calendar {
    grid-row: 2;
    grid-column: 1 / span 2;
    border-bottom: 1px solid rgba(220, 220, 220, .5);
}

.item-panel-tabbar {
    grid-row: 3;
    grid-column: 1;
    height: 100%
}

.tab-panel {
    grid-row: 3;
    grid-column: 2;
    height: 100%;
    overflow: scroll;
}
</style>
