<template>
    <div class="d-flex flex-column">
        <input class="search textbox mb-2" type="text" placeholder="Search" v-model="searchTerm" />
        <div v-for="item in itemList" :key="item.id"
            class="d-flex flex-row" :class="{ selected: item.isSelected }"
            @click="itemClicked(item)">
            <span class="id">{{ item.id }}</span>
            <span class="text">{{ item.text }}</span>
        </div>
        <div class="modal-footer footer">
            <button type="button" class="btn btn-secondary"
                    @click="$emit('cancel')">Cancel</button>
            <button type="button" class="btn btn-primary" @click="save()">Save</button>
        </div>
    </div>
</template>

<script>
// import { useTodoStore } from "@/store/itemStore";
import { capitalize } from '../../../../../utility';

export default {
    name: "ItemMapper",
    props: {
        itemType: String,
        selectedIDs: Array
    },
    data: function() {
        return {
            store: null,
            items: [],
            itemList: [],
            originalIDs: [],
            addedIDs: [],
            removedIDs: [],
            searchTerm: ""
        }
    },
    created: async function() {
        let storeObject = await import(`@/store/${this.itemType}Store`);
        let useStore = storeObject[`use${capitalize(this.itemType)}Store`];
        this.store = useStore();

        this.setItems();
        this.setItemList();
    },
    methods: {
        setItems() {
            let items = [];
            let storeItems = this.store.getItems();
            storeItems.forEach(item => {
                items.push({
                    id: item.id,
                    text: item.text,
                    isSelected: (this.selectedIDs.includes(item.id)) ? true : false
                });
            });
            this.items = items;
        },
        setItemList() {
            if (this.searchTerm != "") {
                this.itemList = this.items.filter(x => x.text.toLowerCase().includes(this.searchTerm.toLowerCase()))
            } else {
                this.itemList = this.items;
            }
        },
        itemClicked(item) {
            item.isSelected = !item.isSelected;

            if (item.isSelected) {
                let index = this.removedIDs.findIndex(x => x == item.id);
                if (index != -1) {
                    this.removedIDs.splice(index, 1);
                }
                if (!this.selectedIDs.includes(item.id)) {
                    this.addedIDs.push(item.id);
                }
            } else {
                let index = this.addedIDs.findIndex(x => x == item.id);
                if (index != -1) {
                    this.addedIDs.splice(index, 1);
                }
                if (this.selectedIDs.includes(item.id)) {
                    this.removedIDs.push(item.id);
                }
            }       
        },
        save() {
            this.$emit("select", this.addedIDs, this.removedIDs);
        }
    },
    watch: {
        searchTerm() {
            this.setItemList();
        }
    }
}
</script>

<style scoped>
.id {
    width: 32px;
    margin-right: 5px;
}

.text {
    text-align: start;
}

.selected {
    background-color: #EFF6FC;}

.footer {
    position: sticky;
    bottom: 0px;
    background-color: white;
}
</style>