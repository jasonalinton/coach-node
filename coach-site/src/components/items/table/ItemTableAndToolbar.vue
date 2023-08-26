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
        <div v-if="form.id" class="item modal fade" :id="`${form.itemType}-${form.id}-Modal`" tabindex="-1" 
             :aria-labelledby="`${form.itemType}-${form.id}-ModalLabel`" aria-hidden="true" :ref="`${form.itemType}-${form.id}-Modal`">
            <GoalFormModal v-if="form.itemType == 'goal'" :id="form.id"
                           @closeItemModal="closeItemModal" />
            <RoutineFormModal v-if="form.itemType == 'routine'" :id="form.id"
                              @closeItemModal="closeItemModal" />
        </div>
    </div>
</template>

<script>
import ItemTableToolbar from './ItemTableToolbar.vue';
import ItemTable from './ItemTable.vue';
import GoalFormModal from '../form/goal/GoalFormModal.vue'
import RoutineFormModal from '../form/routine/RoutineFormModal.vue'
import { Modal } from 'bootstrap';

export default {
    name: 'ItemTableAndToolbar',
    components: { ItemTableToolbar, ItemTable, GoalFormModal, RoutineFormModal },
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
            form: {
                id: undefined,
                itemType: undefined
            },
            modal: undefined
        }
    },
    methods: {
        async openItemForm(data) {
            this.form.id = undefined;
            this.form.itemType = undefined
            await this.$nextTick();
            this.form.id = data.id;
            this.form.itemType = data.itemType;
            await this.$nextTick();
            this.modal = new Modal(this.$refs[`${data.itemType}-${data.id}-Modal`]);
            if (data.itemType == "goal" || data.itemType == "routine") {
                this.modal.show();
            } 

            // myModal.handleUpdate()
        },
        async closeItemModal() {
            this.modal.hide();
            this.modal = undefined;
            this.form.id = undefined;
            this.form.itemType = undefined;
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
    /* max-width: none; */
}
</style>