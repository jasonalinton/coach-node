<template>
    <div class="mobile-tab-panel d-flex flex-grow-1">
        <DashboardPanel v-show="selectedPanel == 'dashboard'" class="item-panel" :showHead="false" />
        <MetricPanel v-show="selectedPanel == 'metric'" class="item-panel" :showHead="false" />
        <GoalPanel v-show="selectedPanel == 'goal'" class="item-panel" :showHead="false" />
        <TodoPanel v-show="selectedPanel == 'todo'" class="item-panel" :showHead="false" />
        <RoutinePanel v-show="selectedPanel == 'routine'" class="item-panel" :showHead="false"/>
        <TaskRoutinePanel v-show="selectedPanel == 'task-routine'" class="item-panel" :showHead="false"/>
        <EventPanel v-show="selectedPanel == 'event'" :props="eventPanelProps" class="item-panel" :showHead="false"/>
        <InventoryPanel v-show="selectedPanel == 'inventory'" class="item-panel" :showHead="false"/>
        <NutritionPanel v-show="selectedPanel == 'nutrition'" class="item-panel" :showHead="false"/>
        <WorkoutPanel v-show="selectedPanel == 'workout'" class="item-panel" :showHead="false"
                        :selectedWorkoutID="workoutPanelProps.selectedWorkoutID"
                        @selectWorkout="selectWorkout"/>
    </div>
</template>

<script>
import { useAppStore } from '@/store/appStore'
import DashboardPanel from '../../planner/item-panel/dashboard/DashboardPanel.vue'
import MetricPanel from '../../planner/item-panel/MetricPanel.vue'
import GoalPanel from '../../planner/item-panel/goal/GoalPanel.vue'
import TodoPanel from '../../planner/item-panel/todo/TodoPanel.vue'
import RoutinePanel from '../../planner/item-panel/routine/RoutinePanel.vue'
import TaskRoutinePanel from '../../planner/item-panel/TaskRoutinePanel.vue'
import EventPanel from '../../planner/item-panel/event/EventPanel.vue'
import InventoryPanel from '../../planner/item-panel/inventory/InventoryPanel.vue'
import NutritionPanel from '../../planner/item-panel/nutrition/NutritionPanel.vue'
import WorkoutPanel from '../../planner/item-panel/workout/WorkoutPanel.vue'

export default {
    name: 'MobileItemTabPanel',
    components: { DashboardPanel, MetricPanel, GoalPanel, TodoPanel, RoutinePanel, TaskRoutinePanel, 
        EventPanel, InventoryPanel, NutritionPanel, WorkoutPanel },
    props: {
        
    },
    data: function () {
        return {
            appStore: undefined,
            eventPanelProps: { },
            workoutPanelProps: { 
                selectedWorkoutID: undefined
            }
        }
    },
    created: function() {
        this.appStore = useAppStore();
    },
    computed: {
        selectedPanel() {
            if (this.appStore) {
                return this.appStore.selectedItemPanel;
            }
            return "";
        }
    },
    methods: {
        selectWorkout() {}
    },
}

</script>

<style scoped>
.mobile-tab-panel {
    overflow: scroll;
}

.item-panel { 
    width: 100%;
    height: 100%;
    overflow-y: scroll;
}
</style>