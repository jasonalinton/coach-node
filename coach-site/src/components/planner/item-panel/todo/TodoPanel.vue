<template>
    <div class="row g-0 h-100">
        <div class="col h-100">
            <!-- Header -->
            <ItemPanelHeader :title="'todos'" :sort="sort" :selectedDate="selectedDate" @onSortChange="onSortChange"></ItemPanelHeader>
            <TodoPanelByMetric v-if="sort.by=='Metric'" :selectedDate="selectedDate"></TodoPanelByMetric>
            <TodoPanelByDate v-if="sort.by=='Date'" :selectedDate="selectedDate"></TodoPanelByDate>
            <TodoPanelByCustom v-if="sort.by=='Custom'" :selectedDate="selectedDate"></TodoPanelByCustom>
        </div>
    </div>
</template>

<script>
import ItemPanelHeader from '../component/ItemPanelHeader.vue';
import TodoPanelByDate from './TodoPanelByDate.vue';
import TodoPanelByMetric from './TodoPanelByMetric.vue';
import TodoPanelByCustom from './TodoPanelByCustom.vue';

var sortItems = [
    { id: 1, text: "Metric" },
    { id: 2, text: "Date" },
    { id: 3, text: "Repetition" },
    { id: 4, text: "Custom" },
];

export default {
    name: 'TodoPanel',
    components: { ItemPanelHeader, TodoPanelByMetric, TodoPanelByDate, TodoPanelByCustom, },
    props: {
        selectedDate: Date
    },
    data: function () {
        return {
            sort: {
                by: 'Metric',
                items: sortItems
            },
        }
    },
    created: function() {
        let todoPanelSortBy_Store = localStorage.getItem(`todo-panel-sort-by`);
        if (todoPanelSortBy_Store) {
            this.sort.by = todoPanelSortBy_Store;
        } else {
            localStorage.setItem(`todo-panel-sort-by`, this.sort.by);
        }
    },
    methods: {
        onSortChange
    },
}

function onSortChange(sortBy) {
    this.sort.by = sortBy;
    localStorage.setItem(`todo-panel-sort-by`, sortBy);
}
</script>

<style scoped>

</style>