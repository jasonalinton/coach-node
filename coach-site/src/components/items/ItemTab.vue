<template>
    <div class="item row g-0" tabindex="0" v-on:keyup.esc="closeForm">
        <div :class="{ split: selectedItem }">
            <component :is="`${config.name}Table`"
                       :id="`${config.itemType}-table`"
                       :config="config"
                       :selectedItem="selectedItem"
                       @itemSelected="itemSelected"
                       @closeForm="closeForm"></component>
            <component :is="`${config.name}Form`" v-if="selectedItem"
                       :id="`${config.itemType}-form`"
                       :config="config"
                       :item="selectedItem"
                       @refreshForm="refreshForm"
                       @closeForm="closeForm"></component>
        </div>
    </div>
</template>

<script>
import Split from 'split.js'
import MetricTable from './metric/MetricTable.vue';
import MetricForm from './metric/MetricForm.vue';
import GoalTable from './goal/GoalTable.vue';
import GoalForm from './goal/GoalForm.vue';
import TodoTable from './todo/TodoTable.vue';
import TodoForm from './todo/TodoForm.vue';
import RoutineTable from './routine/RoutineTable.vue';
import RoutineForm from './routine/RoutineForm.vue';

export default {
    components: { TodoTable, TodoForm, GoalTable, GoalForm, RoutineTable, RoutineForm, MetricTable, MetricForm },
    name: 'ItemTab',
    props: {
        config: Object,
    },
    data: function() {
        return {
            selectedItem: null,
            split: null,
        }
    },
    methods: {
        itemSelected,
        refreshForm,
        closeForm,
    }
}

function itemSelected(item) {
    if (this.selectedItem != item) {
        if (this.split) this.split.destroy();

        this.selectedItem = null;
        this.selectedItem = item;
        this.$nextTick(() => {
            let sizes = localStorage.getItem(`${this.config.itemType}-split-sizes`);
            if (sizes) {
                sizes = JSON.parse(sizes)
            } else {
                sizes = [75, 25]
            }

            this.split = Split([`#${this.config.itemType}-table`, `#${this.config.itemType}-form`], {
                sizes,
                minSize: [320, 275],
                gutterSize: 10,
                snapOffset: 10,
                onDragEnd: (sizes) => localStorage.setItem(`${this.config.itemType}-split-sizes`, JSON.stringify(sizes))
            });
        });
    } else {
        this.closeForm();
    }
}

function closeForm() {
    if (this.split) {
        this.split.destroy();
        this.split = null;
    }
    this.selectedItem = null;
}

function refreshForm() {
    this.selectedItem = this.config.newItem();
}
</script>

<style>
    .split {
        display: flex;
        flex-direction: row;
    }   

    .item .gutter {
        border-left: 1px solid rgba(220, 220, 220, .5);
        background-color: #F5F5F5;
        background-repeat: no-repeat;
        background-position: 50%;
    }

    .item .gutter.gutter-horizontal {
        /* background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg=='); */
        cursor: col-resize;
    }   
</style>