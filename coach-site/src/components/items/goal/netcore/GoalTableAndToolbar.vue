<template>
  <div class="d-flex flex-column">
    <GoalTableToolbar @setColumns="selectedColumns = $event" 
                      @setSortBy="sortBy = $event"></GoalTableToolbar>
    <GoalTableCore :sortBy="sortBy" 
                   :selectedColumns="selectedColumns"
                   :itemType="itemType"></GoalTableCore>
  </div>
</template>

<script>
import GoalTableCore from './GoalTableCore.vue'
import GoalTableToolbar from './GoalTableToolbar.vue'
import { useGoalStore } from '@/store/goalStore';

export default {
    components: { GoalTableToolbar, GoalTableCore },
    props: {
      itemType: String
    },
    data: function() {
        return {
            sortBy: null,
            selectedColumns: this.initSelectedColumns()
        }
    },
    created: async function() {
        let store = useGoalStore();
        await store.fill();
        console.log(useGoalStore());
    },
    methods: {
      initSelectedColumns
    },
}

function initSelectedColumns() {
  if (this.itemType == 'goal') {
    return import('../../../../config/items/goal-config').properties;
  }
}
</script>

<style>

</style>