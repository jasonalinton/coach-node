<template>
    <nav id="navbar" class="navbar navbar-expand-sm navbar-light">
        <div class="d-flex flex-row justify-content-between w-100">
            <div class="d-flex flex-row">
                <IconButton class="icon menu-button float-left" src="/icon/menu-button.png" :width="40" :height="40"
                            @click="toggleTabBar" />
                <a class="navbar-brand float-left" href="#">Coach</a>
            </div>
            <div class="d-flex flex-row">
                <button class="btn btn-sm" type="button" @click="$emit('selectPage', 'planner')">Planner</button>
                <button class="btn btn-sm" type="button" @click="$emit('selectPage', 'items')">Items</button>
                <button class="btn btn-sm" type="button" @click="$emit('selectPage', 'metrics')">Metrics</button>
            </div>
            <img class="icon calendar-button float-left" src="/icon/planner-icon.png" :width="36" :height="36"
                    @click="toggleCalendar"/>
        </div>
    </nav>
</template>

<script>
import IconButton from '../../controls/button/IconButton.vue';
import { useAppStore } from '@/store/appStore'

export default {
    name: 'MobileNavbar',
    components: { IconButton },
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
    methods: {
        selectPage,
        toggleTabBar,
        toggleCalendar
    },
}

function selectPage() {

}

function toggleTabBar() {
    this.appStore.toggleTabBar();
}

function toggleCalendar() {
    this.appStore.toggleMobileCalendar();
}

</script>

<style scoped>
.navbar {
    border-bottom: 1px solid rgba(220, 220, 220, .5);
    padding: 0 0 7px 0;
    padding-bottom: 7px;
    line-height: 38px;
    width: 100%;
}

.navbar-brand {
    margin: 0px;
}

.icon {
    margin: auto 12px auto 0px;
}

.menu-button {
    margin-left: 8px;
    margin-right: 12px;
}
</style>