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
                   @setDraggedItem="draggedItem = $event"
                   @openItemForm="openItemForm"/>
        <div v-if="formItemID" class="item modal fade" :id="`${itemType}-${formItemID}-Modal`" tabindex="-1" 
             :aria-labelledby="`${itemType}-${formItemID}-ModalLabel`" aria-hidden="true" :ref="`${itemType}-${formItemID}-Modal`">
            <GoalFormModal :id="formItemID"
                           @closeItemModal="closeItemModal" />
        </div>
    </div>
</template>

<script>
import ItemTableToolbar from './ItemTableToolbar.vue';
import ItemTable from './ItemTable.vue';
import GoalFormModal from '../form/goal/GoalFormModal.vue'
import { Modal } from 'bootstrap';

export default {
    name: 'ItemTableAndToolbar',
    components: { ItemTableToolbar, ItemTable, GoalFormModal },
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
            draggedItem: null,
            formItemID: undefined,
            modal: undefined
        }
    },
    methods: {
        async openItemForm(id) {
            this.formItemID = null;
            await this.$nextTick();
            this.formItemID = id;
            await this.$nextTick();
            this.modal = new Modal(this.$refs[`${this.itemType}-${id}-Modal`]);
            this.modal.toggle();

            // myModal.handleUpdate()
        },
        async closeItemModal() {
            this.modal.toggle();
        }
    }
}
</script>

<style>
.item .modal-lg {
    max-width: 950px;
}

.item .modal-xl {
    /* max-width: 1180px; */
    max-width: none;
    margin-left: 50px;
    margin-right: 50px;
}

.item .modal-body .container {
    max-width: none;
}
</style>