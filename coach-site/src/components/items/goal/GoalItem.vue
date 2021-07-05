<template>
    <div class="goal-item row g-0">
        <div class="col">
            <div :class="{ split: selectedGoal}">
                <GoalTable id="goal-table" :newGoals="newGoal" :style="{ 'height': `${bodyHeight}px`, 'overflow': 'auto' }" @goalSelected="goalSelected" @closeForm="closeForm"></GoalTable>
                <GoalForm id="goal-form" class="h-100" 
                v-if="selectedGoal" :goal="selectedGoal" 
                @save="save" 
                @closeForm="closeForm"></GoalForm>
            </div>
        </div>
    </div>
</template>

<script>
import GoalTable from './GoalTable.vue';
import GoalForm from './GoalForm.vue';

import $ from "jquery";
import Split from 'split.js'

export default {
    components: { GoalTable, GoalForm },
    name: 'GoalItem',
    data: function() {
        return {
            newGoal: {},
            goals: [],
            selectedGoal: null,
            split: null,
            bodyHeight: undefined
        }
    },
    mounted: function() {
        this.onResize();
    },
    created: function () {
        window.addEventListener('resize', this.onResize);
    },
    methods: {
        goalSelected,
        closeForm,
        onResize() {
            console.log($('#app-body').height())
            console.log($('#nav-tab').height())
            this.bodyHeight = $('#app-body').height() - $('#nav-tab').height();
        },
        save(goal) {
            this.newGoal = [goal];
        }
    }
}

function goalSelected(goal) {
    if (this.selectedGoal != goal) {
        if (this.split) this.split.destroy();

        this.selectedGoal = goal;
        this.$nextTick(() => {
            let sizes = localStorage.getItem('split-sizes');
            if (sizes) {
                sizes = JSON.parse(sizes)
            } else {
                sizes = [75, 25]
            }

            this.split = Split(['#goal-table', '#goal-form'], {
                sizes,
                minSize: [320, 200],
                onDragEnd: (sizes) => localStorage.setItem('split-sizes', JSON.stringify(sizes))
            });
        });
    } else {
        this.closeForm();
    }
}

function closeForm() {
    this.split.destroy();
    this.split = null;
    this.selectedGoal = null;
}
</script>

<style scoped>
.split {
    display: flex;
    flex-direction: row;
}
</style>

<style>
.goal-item .gutter {
    background-color: #eee;
    background-repeat: no-repeat;
    background-position: 50%;
}

.goal-item .gutter.gutter-horizontal {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==');
    cursor: col-resize;
}
</style>