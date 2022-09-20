<template>
  <div class="d-flex flex-column">
    <TodoTableToolbar @setColumns="selectedColumns = $event" 
                      @setSortBy="sortBy = $event"></TodoTableToolbar>
    <TodoTableCore :sortBy="sortBy" :selectedColumns="selectedColumns"></TodoTableCore>
  </div>
</template>

<script>
import TodoTableCore from './TodoTableCore.vue'
import TodoTableToolbar from './TodoTableToolbar.vue'

export default {
    components: { TodoTableToolbar, TodoTableCore },
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