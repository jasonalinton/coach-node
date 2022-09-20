<template>
  <div class="d-flex flex-column">
    <GoalTableToolbar @setColumns="selectedColumns = $event" 
                      @setSortBy="sortBy = $event"></GoalTableToolbar>
    <GoalTableCore :sortBy="sortBy" :selectedColumns="selectedColumns"></GoalTableCore>
  </div>
</template>

<script>
import GoalTableCore from './GoalTableCore.vue'
import GoalTableToolbar from './GoalTableToolbar.vue'

export default {
    components: { GoalTableToolbar, GoalTableCore },
    data: function() {
        return {
            sortBy: null,
            selectedColumns: null
        }
    }
}
</script>

<style>

</style>