<template>
    <div class="item-panel-wrapper row g-0">
        <div class="col h-100" :style="{'border-left': '1px solid rgba(220, 220, 220, .5)'}">
            <div :style="{'width': '100%', 'height': '64px', 'border-bottom': '1px solid rgba(220, 220, 220, .5)'}"></div>
            <!-- <div :style="{'width': '56px', 'height': '258px', 'padding-left': '8px', 'overflow': 'hidden'}"> -->
            <div :style="{'width': '56px', 'padding-left': '8px', 'overflow': 'hidden'}">
                <div class="d-flex flex-row mb-1">
                    <img class="dashboard" :class="[{ active: selectedPanel == 'dashboard' }]" src='/icon/dashboard-icon.png' width="40" height="40" :style="{'margin-top': '8px'}"
                         @click="setSelectedPanel('dashboard')"/>
                    <div v-if="selectedPanel == 'dashboard'">
                    <div :style="{ 'width': '12px', 'height': '40px', 'background-color': '#4285F4', 'margin-left': '3px', 'margin-top': '8px', 'border-radius': '4px'}"></div></div>
                </div>
                <div class="d-flex flex-row mb-1">
                    <img class="briefing" :class="[{ active: selectedPanel == 'briefing' }]" src='/icon/briefing2.png' width="40" height="40"
                         @click="setSelectedPanel('briefing')"/>
                    <div v-if="selectedPanel == 'briefing'">
                    <div :style="{ 'width': '12px', 'height': '40px', 'background-color': '#4285F4', 'margin-left': '3px', 'border-radius': '4px'}"></div></div>
                </div>
                <div class="d-flex flex-row mb-1">
                    <img class="todo" :class="[{ active: selectedPanel == 'todo' }]" src='/icon/todo-icon.png' width="40" height="40"
                         @click="setSelectedPanel('todo')"/>
                    <div v-if="selectedPanel == 'todo'">
                    <div :style="{ 'width': '12px', 'height': '40px', 'background-color': '#4285F4', 'margin-left': '3px', 'border-radius': '4px'}"></div></div>
                </div>
                <div class="d-flex flex-row mb-1">
                    <img class="goal" :class="[{ active: selectedPanel == 'goal' }]" src='/icon/goal-icon.png' width="40" height="40"
                         @click="setSelectedPanel('goal')"/>
                    <div v-if="selectedPanel == 'goal'">
                    <div :style="{ 'width': '12px', 'height': '40px', 'background-color': '#9013FE', 'margin-left': '3px', 'border-radius': '4px'}"></div></div>
                </div>
                <div class="d-flex flex-row mb-1">
                    <img class="routine" :class="[{ active: selectedPanel == 'routine' }]" src='/icon/routine-icon.png' width="40" height="40"
                         @click="setSelectedPanel('routine')"/>
                    <div v-if="selectedPanel == 'routine'">
                    <div :style="{ 'width': '12px', 'height': '40px', 'background-color': '#4C6EF5', 'margin-left': '3px', 'border-radius': '4px'}"></div></div>
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
        </div>
        <div class="col-auto h-100">
            <DashboardPanel v-show="selectedPanel == 'dashboard'" class="item-panel"/>
            <BriefingPanel v-show="selectedPanel == 'briefing'" class="item-panel"/>
            <MetricPanel v-show="selectedPanel == 'metric'" class="item-panel"/>
            <GoalPanel v-show="selectedPanel == 'goal'" class="item-panel"></GoalPanel>
            <TodoPanel v-show="selectedPanel == 'todo'" class="item-panel"/>
            <RoutinePanel v-show="selectedPanel == 'routine'" class="item-panel"/>
            <TaskRoutinePanel v-show="selectedPanel == 'task-routine'" class="item-panel"/>
            <EventPanel v-show="selectedPanel == 'event'" class="item-panel"/>
            <InventoryPanel v-show="selectedPanel == 'inventory'" class="item-panel"/>
            <NutritionPanel v-show="selectedPanel == 'nutrition'" class="item-panel"/>
            <WorkoutPanel v-show="selectedPanel == 'workout'" class="item-panel"/>
        </div>
    </div>
</template>

<script>
import { useAppStore } from '@/store/appStore'
import DashboardPanel from './dashboard/DashboardPanel.vue'
import BriefingPanel from './briefing/BriefingPanel.vue'
import MetricPanel from './MetricPanel.vue'
import GoalPanel from './goal/GoalPanel.vue'
import TodoPanel from './todo/TodoPanel.vue'
import RoutinePanel from './routine/RoutinePanel.vue'
import TaskRoutinePanel from './TaskRoutinePanel.vue'
import EventPanel from './event/EventPanel.vue'
import InventoryPanel from './inventory/InventoryPanel.vue'
import NutritionPanel from './nutrition/NutritionPanel.vue'
import WorkoutPanel from './workout/WorkoutPanel.vue'
import { EVENTTYPE } from '../../../model/constants'

export default {
    name: 'ItemPanel',
    components: { DashboardPanel, BriefingPanel, MetricPanel, GoalPanel, TodoPanel, RoutinePanel, TaskRoutinePanel, 
        EventPanel, InventoryPanel, NutritionPanel, WorkoutPanel },
    data: function() {
        return {
            appStore: undefined,
        }
    },
    created: function() {
        this.appStore = useAppStore();
        let selectedPanel_Store = localStorage.getItem(`selected-item-panel`);
        if (selectedPanel_Store) {
            selectedPanel_Store = (selectedPanel_Store == "undefined") ? undefined : selectedPanel_Store;
            this.$emit('setSelectedPanel', selectedPanel_Store);
        } else {
            localStorage.setItem(`selected-item-panel`, this.selectedPanel);
        }
    },
    computed: {
        selectedPanel() {
            return (this.appStore) ? this.appStore.itemPanel.selected : "todo";
        }
    },
    methods: {
        setSelectedPanel,
    },
    watch: {
        selectedPanel(value) {
            localStorage.setItem(`selected-item-panel`, value);
        },
    }
}

function setSelectedPanel(panel) {
    if (this.selectedPanel != panel) {
        this.appStore.setSelectedItemPanel(panel);
    } else {
        this.appStore.setSelectedItemPanel(undefined);
    }
}
</script>

<style scoped>
.item-panel-wrapper { 
    height: 100%;
}
.item-panel { 
    width: 295px;
    box-shadow: 7px 0px 9px 5px rgba(0,0,0,.5);
    height: 100%;
    overflow-y: scroll;
}

img.dashboard:hover, img.dashboard.active {
    background-color: rgba(76, 110, 245, .08);
    border-radius: 20px;
}

img.briefing:hover, img.briefing.active {
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

img.routine:hover, img.routine.active {
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