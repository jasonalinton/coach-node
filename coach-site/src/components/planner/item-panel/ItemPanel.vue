<template>
    <div class="row g-0">
        <div class="col" :style="{'border-left': '1px solid rgba(220, 220, 220, .5)'}">
            <div :style="{'width': '100%', 'height': '64px', 'border-bottom': '1px solid rgba(220, 220, 220, .5)'}"></div>
            <div :style="{'width': '56px', 'height': '192px', 'padding-left': '8px', 'overflow': 'hidden'}">
                <div class="d-flex flex-row mb-1">
                    <img class="goal" :class="[{ active: selectedPanel == 'goal' }]" src='/icon/goal-icon.png' width="40" height="40" :style="{'margin-top': '8px'}" @click="selectedPanel = 'goal'"/>
                    <div v-if="selectedPanel == 'goal'">
                    <div :style="{ 'width': '12px', 'height': '40px', 'background-color': '#4285F4', 'margin-left': '3px', 'margin-top': '8px', 'border-radius': '4px'}"></div></div>
                </div>
                <div class="d-flex flex-row mb-1">
                    <img class="todo" :class="[{ active: selectedPanel == 'todo' }]" src='/icon/todo-icon.png' width="40" height="40" @click="selectedPanel = 'todo'"/>
                    <div v-if="selectedPanel == 'todo'">
                    <div :style="{ 'width': '12px', 'height': '40px', 'background-color': '#4C6EF5', 'margin-left': '3px', 'border-radius': '4px'}"></div></div>
                </div>
                <div class="d-flex flex-row mb-1">
                    <img class="routine" :class="[{ active: selectedPanel == 'routine' }]" src='/icon/routine-icon.png' width="40" height="40" @click="selectedPanel = 'routine'"/>
                    <div v-if="selectedPanel == 'routine'">
                    <div :style="{ 'width': '12px', 'height': '40px', 'background-color': '#9013FE', 'margin-left': '3px', 'border-radius': '4px'}"></div></div>
                </div>
                <div class="d-flex flex-row mb-1">
                    <img class="task-routine" :class="[{ active: selectedPanel == 'task-routine' }]" src='/icon/task-routine-icon.png' width="40" height="40" @click="selectedPanel = 'task-routine'"/>
                    <div v-if="selectedPanel == 'task-routine'">
                    <div :style="{ 'width': '12px', 'height': '40px', 'background-color': '#F4511E', 'margin-left': '3px', 'border-radius': '4px'}"></div></div>
                </div>
            </div>
        </div>
        <div class="col-auto">
            <MetricPanel v-show="selectedPanel == 'metric'" class="item-panel"/>
            <GoalPanel v-show="selectedPanel == 'goal'" class="item-panel"></GoalPanel>
            <TodoPanel v-show="selectedPanel == 'todo'" class="item-panel"/>
            <RoutinePanel v-show="selectedPanel == 'routine'" class="item-panel"/>
            <TaskRoutinePanel v-show="selectedPanel == 'task-routine'" class="item-panel"/>
        </div>
    </div>
</template>

<script>
import MetricPanel from './MetricPanel.vue'
import GoalPanel from './goal/GoalPanel.vue'
import TodoPanel from './todo/TodoPanel.vue'
import RoutinePanel from './RoutinePanel.vue'
import TaskRoutinePanel from './TaskRoutinePanel.vue'

export default {
    name: 'ItemPanel',
    components: { MetricPanel, GoalPanel, TodoPanel, RoutinePanel, TaskRoutinePanel },
    data: function() {
        return {
            selectedPanel: 'goal'
        }
    }
}
</script>
<style scoped>
.item-panel { 
    width: 296px;
    box-shadow: 7px 0px 9px 5px rgba(0,0,0,.5);
    height: 100vh;
    overflow-y: scroll;
}

img.goal:hover, img.goal.active {
    background-color: rgba(66, 133, 244, .08);
    border-radius: 20px;
}

img.todo:hover, img.todo.active {
    background-color: rgba(76, 110, 245, .08);
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
</style>