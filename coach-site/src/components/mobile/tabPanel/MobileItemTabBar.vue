<template>
    <div class="item-panel-tab-bar" :class="{ 'hidden': !isTabBarShown }">
        <div class="button d-flex flex-row mb-1">
            <img class="metric" :class="[{ active: selectedTab == 'metric' }]" src='/icon/inventory-icon.png' width="40" height="40"  :style="{'margin-top': '8px'}"
                    @click="setSelectedPanel('metric')"/>
            <div v-if="selectedTab == 'metric'">
            <div :style="{ 'width': '12px', 'height': '40px', 'background-color': '#3B99FC', 'margin-left': '3px', 'border-radius': '4px'}"></div></div>
        </div>
        <div class="button d-flex flex-row mb-1">
            <img class="todo" :class="[{ active: selectedTab == 'todo' }]" src='/icon/todo-icon.png' width="40" height="40"
                    @click="setSelectedPanel('todo')"/>
            <div v-if="selectedTab == 'todo'">
            <div :style="{ 'width': '12px', 'height': '40px', 'background-color': '#4285F4', 'margin-left': '3px', 'border-radius': '4px'}"></div></div>
        </div>
        <div class="button d-flex flex-row mb-1">
            <img class="goal" :class="[{ active: selectedTab == 'goal' }]" src='/icon/goal-icon.png' width="40" height="40"
                    @click="setSelectedPanel('goal')"/>
            <div v-if="selectedTab == 'goal'">
            <div :style="{ 'width': '12px', 'height': '40px', 'background-color': '#9013FE', 'margin-left': '3px', 'border-radius': '4px'}"></div></div>
        </div>
        <div class="button d-flex flex-row mb-1">
            <img class="routine" :class="[{ active: selectedTab == 'routine' }]" src='/icon/routine-icon.png' width="40" height="40"
                    @click="setSelectedPanel('routine')"/>
            <div v-if="selectedTab == 'routine'">
            <div :style="{ 'width': '12px', 'height': '40px', 'background-color': '#4C6EF5', 'margin-left': '3px', 'border-radius': '4px'}"></div></div>
        </div>
    </div>
</template>

<script>
import { useAppStore } from '@/store/appStore'
import { SELECTED_ITEM_TAB } from '@/model/appDefaults'

export default {
    name: 'MobileItemTabBar',
    components: {  },
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
        selectedTab() {
            return this.appStore?.itemTabs?.selectedTab || SELECTED_ITEM_TAB;
        },
        isTabBarShown() {
            if (this.appStore) {
                return this.appStore.isTabBarShown;
            }
            return true;
        },
    },
    methods: {
        setSelectedPanel(tab) {
            this.appStore.selectItemTab(tab);
        }
    },
}

</script>

<style scoped>
.item-panel-tab-bar {
    background-color: var(--background-color);
    border-right: 1px solid rgba(220, 220, 220, .5);
    overflow: hidden;
    height: 100%;
    width: 56px;
    transition: width .3s;
}

.item-panel-tab-bar.hidden {
    width: 0px;
}

.button {
    margin-left: 8px;
}

img.todo:hover, img.todo.active {
    background-color: rgba(76, 110, 245, .08);
    border-radius: 20px;
}

img.goal:hover, img.goal.active {
    background-color: rgba(66, 133, 244, .08);
    border-radius: 20px;
}

img.routine:hover, img.routine.active {
    background-color: rgba(144, 19, 254, .08);
    border-radius: 20px;
}

img.task-routine:hover, img.task-routine.active {
    background-color: rgba(244, 81, 30, .08);
    border-radius: 20px;
}

img.metric:hover, img.metric.active {
    background-color: rgba(59, 153, 252, .08);
    border-radius: 20px;
}
</style>
