<template>
    <div class="d-flex flex-column">
        <ItemTableToolbar :itemType="itemType"
                          @setColumns="selectedColumns = $event" 
                          @setSortBy="sortBy = $event"
                          @setSearchTerm="searchTerm = $event"/>
        <ItemTable :itemType="itemType"
                   :sortBy="sortBy"
                   :searchTerm="searchTerm"
                   :selectedColumns="selectedColumns"
                   @setDraggedItem="draggedItem = $event"/>
    </div>
</template>

<script>
import ItemTableToolbar from './ItemTableToolbar.vue';
import ItemTable from './ItemTable.vue';

export default {
    components: { ItemTableToolbar, ItemTable },
    props: {
      itemType: String
    },
    provide() {
        return {
            draggedItem: this.draggedItem,
        }
    },
    data: function() {
        return {
            sortBy: null,
            searchTerm: "",
            selectedColumns: null,
            store: null,
            draggedItem: null
        }
    }
}
</script>