<template>
    <div class="item row g-0">
        <div :class="{ split: selectedItem }">
            <ItemTable 
                :id="`${config.itemType}-table`"
                    :config="config"
                    @itemSelected="itemSelected"
                    @closeForm="closeForm"/>
            <ItemForm 
                v-if="selectedItem"
                :id="`${config.itemType}-form`" class="h-100" 
                    :config="config"
                    :item="selectedItem" 
                    @closeForm="closeForm"></ItemForm>
        </div>
    </div>
</template>

<script>
import ItemForm from './ItemForm.vue'
import ItemTable from './ItemTable.vue'

import Split from 'split.js'

export default {
    components: { ItemTable, ItemForm },
    name: 'Item',
    props: {
        config: Object
    },
    data: function() {
        return {
            items: null,
            selectedItem: null,
            split: null,
            cache: null
        }
    },
    created() {
        // this.config.subscriptions.forEach(sub => {
        //     this.$apollo.addSmartSubscription(sub.name, sub.object);
        // });
    },
    methods: {
        itemSelected,
        closeForm
    }
}

function itemSelected(item) {
    if (this.selectedItem != item) {
        if (this.split) this.split.destroy();

        this.selectedItem = item;
        this.$nextTick(() => {
            let sizes = localStorage.getItem(`${this.config.itemType}-split-sizes`);
            if (sizes) {
                sizes = JSON.parse(sizes)
            } else {
                sizes = [75, 25]
            }

            this.split = Split([`#${this.config.itemType}-table`, `#${this.config.itemType}-form`], {
                sizes,
                minSize: [320, 200],
                onDragEnd: (sizes) => localStorage.setItem(`${this.config.itemType}-split-sizes`, JSON.stringify(sizes))
            });
        });
    } else {
        this.closeForm();
    }
}

function closeForm() {
    if (this.split) {
        this.split.destroy();
        this.split = null;
    }
    this.selectedItem = null;
}
</script>

<style>
    .split {
        display: flex;
        flex-direction: row;
    }   

    .item .gutter {
        background-color: #eee;
        background-repeat: no-repeat;
        background-position: 50%;
    }

    .item .gutter.gutter-horizontal {
        background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==');
        cursor: col-resize;
    }   
</style>