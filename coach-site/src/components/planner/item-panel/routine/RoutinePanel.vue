<template>
    <div class="row g-0 h-100">
        <div class="col h-100">
            <!-- Header -->
            <ItemPanelHeader v-show="showHead" 
                             :title="'routine'" 
                             :sort="sort" 
                             @onSortChange="onSortChange"></ItemPanelHeader>
            <RoutinePanelByTask v-if="sort.by=='Task Routine'"/>
        </div>
    </div>
</template>

<script>
import ItemPanelHeader from '../component/ItemPanelHeader.vue';
import RoutinePanelByTask from './RoutinePanelByTask.vue';

var sortItems = [
    { id: 1, text: "Task Routine" },
];

export default {
    name: 'RoutinePanel',
    components: { ItemPanelHeader, RoutinePanelByTask },
    props: {
        showHead: {
            type: Boolean,
            default: true
        }
    },
    data: function () {
        return {
            sort: {
                by: 'Task Routine',
                items: sortItems
            },
        }
    },
    created: function() {
        let routinePanelSortBy_Store = localStorage.getItem(`routine-panel-sort-by`);
        if (routinePanelSortBy_Store) {
            this.sort.by = routinePanelSortBy_Store;
        } else {
            localStorage.setItem(`routine-panel-sort-by`, this.sort.by);
        }
    },
    methods: {
        onSortChange
    },
}

function onSortChange(sortBy) {
    this.sort.by = sortBy;
    localStorage.setItem(`routine-panel-sort-by`, sortBy);
}
</script>

<style scoped>

</style>