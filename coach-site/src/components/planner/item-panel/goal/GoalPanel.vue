<template>
    <div class="row g-0">
        <div class="col">
            <!-- Header -->
            <ItemPanelHeader :title="title" :sort="sort" @onSortChange="onSortChange"></ItemPanelHeader>
            <GoalPanelByMetric v-show="sort.by=='Metric'"></GoalPanelByMetric>
            <GoalPanelByDate v-show="sort.by=='Date'"></GoalPanelByDate>
            <GoalPanelByCustom v-show="sort.by=='Custom'" :selectedDate="selectedDate"></GoalPanelByCustom>
        </div>
    </div>
</template>

<script>
import ItemPanelHeader from '../component/ItemPanelHeader.vue';
import GoalPanelByCustom from './GoalPanelByCustom.vue';
import GoalPanelByDate from './GoalPanelByDate.vue';
import GoalPanelByMetric from './GoalPanelByMetric.vue';

var sortItems = [
    { id: 1, text: "Metric" },
    { id: 2, text: "Date" },
    { id: 3, text: "Repetition" },
    { id: 4, text: "Custom" },
];

export default {
    name: 'GoalPanel',
    components: { ItemPanelHeader, GoalPanelByMetric, GoalPanelByDate, GoalPanelByCustom },
    props: {
        selectedDate: Date
    },
    data: function () {
        return {
            title: 'Goals',
            sort: {
                by: 'Metric',
                items: sortItems
            },
        }
    },
    created: function() {
        let goalPanelSortBy_Store = localStorage.getItem(`goal-panel-sort-by`);
        if (goalPanelSortBy_Store) {
            this.sort.by = goalPanelSortBy_Store;
        } else {
            localStorage.setItem(`goal-panel-sort-by`, this.sort.by);
        }
    },
    methods: {
        onSortChange
    },
}

function onSortChange(sortBy) {
    this.sort.by = sortBy;
    localStorage.setItem(`goal-panel-sort-by`, sortBy);
}
</script>

<style scoped>

</style>