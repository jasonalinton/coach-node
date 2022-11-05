<template>
    <div class="d-flex flex-column">
        <ItemTableToolbar :itemType="itemType"
                          @setColumns="selectedColumns = $event" 
                          @setSortBy="sortBy = $event"/>
        <ItemTable :itemType="itemType"
                   :sortBy="sortBy"
                   :selectedColumns="selectedColumns"/>
    </div>
</template>

<script>
import ItemTableToolbar from './ItemTableToolbar.vue';
import ItemTable from './ItemTable.vue';
import { capitalizeFirstLetter } from '../../../../utility'

export default {
    components: { ItemTableToolbar, ItemTable },
    props: {
      itemType: String
    },
    data: function() {
        return {
            sortBy: null,
            selectedColumns: null,
            store: null
        }
    },
    created: async function() {
        let storeObject = await import(`@/store/${this.itemType}Store`);
        let useStore = storeObject[`use${capitalizeFirstLetter(this.itemType)}Store`];
        let store = useStore();
        await store.fill();
        console.log(store);
    },
}
</script>