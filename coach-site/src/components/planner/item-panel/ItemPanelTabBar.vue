<template>
    <div class="item-panel-tab-bar" :class="{ 'hidden': !isTabBarShown }">
        <div class="d-flex flex-row mb-1">
            <img class="dashboard" :class="[{ active: selectedPanel == 'dashboard' }]" src='/icon/dashboard-icon.png' width="40" height="40" :style="{'margin-top': '8px'}"
                    @click="setSelectedPanel('dashboard')"/>
            <div v-if="selectedPanel == 'dashboard'">
            <div :style="{ 'width': '12px', 'height': '40px', 'background-color': '#4285F4', 'margin-left': '3px', 'margin-top': '8px', 'border-radius': '4px'}"></div></div>
        </div>
        <div class="d-flex flex-row mb-1">
            <img class="todo" :class="[{ active: selectedPanel == 'todo' }]" src='/icon/todo-icon.png' width="40" height="40"
                    @click="setSelectedPanel('todo')"/>
            <div v-if="selectedPanel == 'todo'">
            <div :style="{ 'width': '12px', 'height': '40px', 'background-color': '#4285F4', 'margin-left': '3px', 'border-radius': '4px'}"></div></div>
        </div>
        <div class="d-flex flex-row mb-1">
            <img class="planner" :class="[{ active: selectedPanel == 'planner' }]" src='/icon/routine-icon.png' width="40" height="40"
                    @click="setSelectedPanel('planner')"/>
            <div v-if="selectedPanel == 'planner'">
            <div :style="{ 'width': '12px', 'height': '40px', 'background-color': '#4C6EF5', 'margin-left': '3px', 'border-radius': '4px'}"></div></div>
        </div>
        <div class="d-flex flex-row mb-1">
            <img class="goal" :class="[{ active: selectedPanel == 'goal' }]" src='/icon/goal-icon.png' width="40" height="40"
                    @click="setSelectedPanel('goal')"/>
            <div v-if="selectedPanel == 'goal'">
            <div :style="{ 'width': '12px', 'height': '40px', 'background-color': '#9013FE', 'margin-left': '3px', 'border-radius': '4px'}"></div></div>
        </div>
        <!-- <div class="d-flex flex-row mb-1">
            <img class="task-routine" :class="[{ active: selectedPanel == 'task-routine' }]" src='/icon/task-routine-icon.png' width="40" height="40" 
                    @click="setSelectedPanel('task-routine')"/>
            <div v-if="selectedPanel == 'task-routine'">
            <div :style="{ 'width': '12px', 'height': '40px', 'background-color': '#F4511E', 'margin-left': '3px', 'border-radius': '4px'}"></div></div>
        </div> -->
        <div class="d-flex flex-row mb-1">
            <img class="event" :class="[{ active: selectedPanel == 'event' }]" src='/icon/task-routine-icon.png' width="40" height="40" 
                    @click="setSelectedPanel('event')"/>
            <div v-if="selectedPanel == 'event'">
            <div :style="{ 'width': '12px', 'height': '40px', 'background-color': '#F4511E', 'margin-left': '3px', 'border-radius': '4px'}"></div></div>
        </div>
        <div class="d-flex flex-row mb-1">
            <img class="inventory" :class="[{ active: selectedPanel == 'inventory' }]" src='/icon/inventory-icon.png' width="40" height="40" 
                    @click="setSelectedPanel('inventory')"/>
            <div v-if="selectedPanel == 'inventory'">
            <div :style="{ 'width': '12px', 'height': '40px', 'background-color': '#3B99FC', 'margin-left': '3px', 'border-radius': '4px'}"></div></div>
        </div>
        <div class="d-flex flex-row mb-1">
            <img class="nutrition" :class="[{ active: selectedPanel == 'nutrition' }]" src='/icon/nutrition-icon.png' width="40" height="40" 
                    @click="setSelectedPanel('nutrition')"/>
            <div v-if="selectedPanel == 'nutrition'">
            <div :style="{ 'width': '12px', 'height': '40px', 'background-color': '#F4511E', 'margin-left': '3px', 'border-radius': '4px'}"></div></div>
        </div>
        <div class="d-flex flex-row mb-1">
            <img class="workout" :class="[{ active: selectedPanel == 'workout' }]" src='/icon/workout-icon.png' width="40" height="40" 
                    @click="setSelectedPanel('workout')"/>
            <div v-if="selectedPanel == 'workout'">
            <div :style="{ 'width': '12px', 'height': '40px', 'background-color': '#F4511E', 'margin-left': '3px', 'border-radius': '4px'}"></div></div>
        </div>
    </div>
</template>

<script>
import { useAppStore } from '@/store/appStore'

export default {
    name: 'ItemPanelTabBar',
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
        selectedPanel() {
            return (this.appStore) ? this.appStore.itemPanel.selected : "dashboard";
        },
        isTabBarShown() {
            if (this.appStore) {
                return this.appStore.isTabBarShown;
            }
            return true;
        },
    },
    methods: {
        setSelectedPanel
    },
}

function setSelectedPanel(panel) {
    this.appStore.setSelectedItemPanel(panel);
}

</script>

<style scoped>
.item-panel-tab-bar {
    transition: width .5s;
    width: 48px;
    overflow: hidden;
    border-right: 1px solid rgba(220, 220, 220, .5);
    height: 100%;
}

.item-panel-tab-bar.hidden {
    width: 0px;
    border-right: none;
}

img.dashboard:hover, img.dashboard.active {
    background-color: rgba(76, 110, 245, .08);
    border-radius: 20px;
}

img.todo:hover, img.todo.active {
    background-color: rgba(76, 110, 245, .08);
    border-radius: 20px;
}

img.goal:hover, img.goal.active {
    background-color: rgba(66, 133, 244, .08);
    border-radius: 20px;
}

img.planner:hover, img.planner.active {
    background-color: rgba(144, 19, 254, .08);
    border-radius: 20px;
}

img.task-routine:hover, img.task-routine.active {
    background-color: rgba(244, 81, 30, .08);
    border-radius: 20px;
}

img.event:hover, img.event.active {
    background-color: rgba(244, 81, 30, .08);
    border-radius: 20px;
}

img.inventory:hover, img.inventory.active {
    background-color: rgba(59, 153, 252, .08);
    border-radius: 20px;
}

img.nutrition:hover, img.nutrition.active {
    background-color: rgba(252, 59, 59, .08);
    border-radius: 20px;
}

img.workout:hover, img.workout.active {
    background-color: rgba(244, 81, 30, .08);
    border-radius: 20px;
}
</style>