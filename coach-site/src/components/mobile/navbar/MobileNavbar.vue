<template>
    <nav v-if="!itemPanelHeaders.includes(selectedPanel) || activeNavbar == 'main'" id="navbar" class="navbar navbar-expand-sm navbar-light">
        <div class="d-flex flex-row justify-content-between w-100">
            <div class="d-flex flex-row">
                <NavbarMenuButton />
                <a class="navbar-brand float-left" href="#">Coach</a>
            </div>
            <div class="d-flex flex-row">
                <button class="btn btn-sm" type="button" @click="selectPage('planner')">Planner</button>
                <button class="btn btn-sm" type="button" @click="selectPage('items')">Items</button>
                <button class="btn btn-sm" type="button" @click="selectPage('metrics')">Metrics</button>
            </div>
            <NavbarCalendarButton />
        </div>
    </nav>
    <nav v-else>
        <ItemPanelNavbar v-if="itemPanelHeaders.includes(selectedPanel)" />
    </nav>
</template>

<script>
import ItemPanelNavbar from './ItemPanelNavbar.vue';
import { useAppStore } from '@/store/appStore'
import NavbarMenuButton from './component/NavbarMenuButton.vue';
import NavbarCalendarButton from './component/NavbarCalendarButton.vue';

export default {
    name: 'MobileNavbar',
    components: { NavbarMenuButton, NavbarCalendarButton, ItemPanelNavbar },
    props: {
        
    },
    data: function () {
        return {
            appStore: undefined,
            itemPanelHeaders: [ "todo", "goal", "inventory" ]
        }
    },
    created: function() {
        this.appStore = useAppStore();
    },
    computed: {
        activeNavbar() {
            return (this.appStore) ? this.appStore.navbar.active : "main";
        },
        selectedPanel() {
            return (this.appStore) ? this.appStore.itemPanel.selected : "todo";
        },
    },
    methods: {
        selectPage,
    },
}

function selectPage() {

}

</script>

<style scoped>
.navbar {
    border-bottom: 1px solid rgba(220, 220, 220, .5);
    padding: 8px 0;
    padding-bottom: 7px;
    line-height: 38px;
    width: 100%;
}

.navbar-brand {
    margin: 0px;
}

.menu-button {
    margin-left: 8px;
    margin-right: 12px;
}
</style>