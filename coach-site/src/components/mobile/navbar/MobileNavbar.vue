<template>
    <nav v-if="selectedPanel != 'todo' || activeNavbar == 'main'" id="navbar" class="navbar navbar-expand-sm navbar-light">
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
        <TodoPanelHeader v-if="selectedPanel == 'todo'" />
    </nav>
</template>

<script>
import TodoPanelHeader from '../../planner/item-panel/todo/TodoPanelHeader.vue';
import { useAppStore } from '@/store/appStore'
import NavbarMenuButton from './NavbarMenuButton.vue';
import NavbarCalendarButton from './NavbarCalendarButton.vue';

export default {
    name: 'MobileNavbar',
    components: { NavbarMenuButton, NavbarCalendarButton, TodoPanelHeader },
    props: {
        
    },
    data: function () {
        return {
            appStore: undefined,
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