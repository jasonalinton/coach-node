<template>
    <div class="row g-0">
        <div class="col">
            <!-- Header -->
            <ItemPanelHeader v-show="showHead" 
                             :title="title" 
                             :sort="sort" 
                             @onSortChange="onSortChange">
                <div class="d-flex flex-row justify-content-end pe-2 mt-auto">
                    <img class="header-button me-1" :class="{ active: showReverse }"
                        src='/icon/reverse-button.png' width="16" height="16"
                        @click.prevent="showReverse = !showReverse"/>
                    <img class="header-button me-1" :class="{ active: showTimeline }"
                        src='/icon/timeline.png' width="16" height="16"
                        @click.prevent="showTimeline = !showTimeline"/>
                    <img class="header-button me-1" :class="{ active: showHierarchy }"
                        src='/icon/hierarchy.png' width="16" height="16"
                        @click.prevent="showHierarchy = !showHierarchy"/>
                </div>
            </ItemPanelHeader>
            <GoalPanelByMetric v-if="sort.by=='Metric'" />
            <GoalPanelByDate v-if="sort.by=='Date'" />
            <GoalPanelByCustom v-if="sort.by=='Custom'" />
            <GoalPanelByTimeframe v-if="sort.by=='Timeframe'"
                                  :showReverse="showReverse" />
            <GoalPanelByDashboard v-if="sort.by=='Dashboard'" />
        </div>
    </div>
</template>

<script>
import ItemPanelHeader from '../component/ItemPanelHeader.vue';
import GoalPanelByCustom from './GoalPanelByCustom.vue';
import GoalPanelByDate from './GoalPanelByDate.vue';
import GoalPanelByTimeframe from './GoalPanelByTimeframe.vue';
import GoalPanelByMetric from './GoalPanelByMetric.vue';
import GoalPanelByDashboard from './GoalPanelByDashboard.vue';

var sortItems = [
    { id: 1, text: "Metric" },
    { id: 2, text: "Date" },
    { id: 3, text: "Timeframe" },
    { id: 4, text: "Repetition" },
    { id: 5, text: "Custom" },
    { id: 6, text: "Dashboard" },
];

export default {
    name: 'GoalPanel',
    components: { ItemPanelHeader, GoalPanelByMetric, GoalPanelByDate, GoalPanelByTimeframe, GoalPanelByCustom, GoalPanelByDashboard },
    props: {
        showHead: {
            type: Boolean,
            default: true
        }
    },
    data: function () {
        return {
            title: 'Goals',
            sort: {
                by: 'Custom',
                items: sortItems
            },
            showReverse: true,
            showTimeline: true,
            showHierarchy: false
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
/* Header Button */
.header-button {
    border-radius: 8px;
}
.header-button:hover {
    background-color: rgba(60, 64, 67, .08);
}
.header-button.active {
    background-color: rgba(60, 64, 67, .2);
}
</style>