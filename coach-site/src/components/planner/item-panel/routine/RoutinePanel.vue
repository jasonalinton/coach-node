<template>
    <div class="row g-0 h-100">
        <div class="col h-100">
            <!-- Header -->
            <ItemPanelHeader v-show="showHead" 
                             :title="'routine'" 
                             :sort="sort" 
                             @onSortChange="onSortChange"></ItemPanelHeader>
            <RoutinePanelByCustom v-if="sort.by=='Ordered'"> </RoutinePanelByCustom>
        </div>
    </div>
</template>

<script>
import ItemPanelHeader from '../component/ItemPanelHeader.vue';
import RoutinePanelByCustom from './RoutinePanelByCustom.vue';

var sortItems = [
    { id: 1, text: "Metric" },
    { id: 2, text: "Date" },
    { id: 3, text: "Repetition" },
    { id: 4, text: "Ordered" },
];

export default {
    name: 'RoutinePanel',
    components: { ItemPanelHeader, RoutinePanelByCustom, },
    props: {
        showHead: {
            type: Boolean,
            default: true
        }
    },
    data: function () {
        return {
            sort: {
                by: 'Ordered',
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