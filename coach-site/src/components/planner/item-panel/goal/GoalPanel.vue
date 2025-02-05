<template>
    <div class="row g-0">
        <div class="col">
            <!-- Header -->
            <ItemPanelNavbar v-if="showHead" />
            <GoalPanelByCustom v-if="sortBy=='Custom'" />
            <GoalPanelByTimeframe v-if="sortBy=='Timeframe'"/>
            <GoalPanelByDashboard v-if="sortBy=='Dashboard'" />
        </div>
    </div>
</template>

<script>
import GoalPanelByCustom from './GoalPanelByCustom.vue';
import GoalPanelByTimeframe from './GoalPanelByTimeframe.vue';
import GoalPanelByDashboard from './GoalPanelByDashboard.vue';
import ItemPanelNavbar from '../../../mobile/navbar/ItemPanelNavbar.vue';

var sortItems = [
    { id: 3, text: "Timeframe" },
    { id: 4, text: "Repetition" },
    { id: 5, text: "Custom" },
    { id: 6, text: "Dashboard" },
];

export default {
    name: 'GoalPanel',
    components: { ItemPanelNavbar, GoalPanelByTimeframe, GoalPanelByCustom, GoalPanelByDashboard },
    props: {
        showHead: {
            type: Boolean,
            default: true
        }
    },
    data: function () {
        return {
            appStore: undefined,
            title: 'Goals',
            sort: {
                by: 'Timeframe',
                items: sortItems
            },
        }
    },
    created: async function() {
        let appStore = await import(`@/store/appStore`);
        this.appStore = appStore.useAppStore();

        let goalPanelSortBy_Store = localStorage.getItem(`goal-panel-sort-by`);
        if (goalPanelSortBy_Store) {
            // this.sortBy = goalPanelSortBy_Store;
        } else {
            localStorage.setItem(`goal-panel-sort-by`, this.sortBy);
        }
    },
    computed: {
        sortBy() {
            if (this.appStore) {
                return this.appStore.itemPanel.goal.sort.by;
            }
            return undefined;
        }
    },
    methods: {
        onSortChange
    },
}

function onSortChange(sortBy) {
    // this.sort.by = sortBy;
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