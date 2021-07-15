<template>
    <div class="row g-0">
        <div class="col">
            <!-- Header -->
            <ItemPanelHeader :title="'todos'" :sort="sort" @onSortChange="onSortChange"></ItemPanelHeader>
            <TodoPanelByMetric v-if="sort.by=='Metric'"></TodoPanelByMetric>
            <TodoPanelByDate v-if="sort.by=='Date'"></TodoPanelByDate>
        </div>
    </div>
</template>

<script>
import ItemPanelHeader from '../component/ItemPanelHeader.vue';
import TodoPanelByDate from './TodoPanelByDate.vue';
import TodoPanelByMetric from './TodoPanelByMetric.vue';

var sortItems = [
    { id: 1, text: "Metric" },
    { id: 2, text: "Date" },
    { id: 3, text: "Repetition" },
    { id: 4, text: "Custom" },
];

export default {
    name: 'TodoPanel',
    components: { ItemPanelHeader, TodoPanelByMetric, TodoPanelByDate, },
    data: function () {
        return {
            sort: {
                by: 'Metric',
                items: sortItems
            },
        }
    },
    methods: {
        onSortChange
    },
}

function onSortChange(sortBy) {
    this.sort.by = sortBy;
}
</script>

<style scoped>

</style>