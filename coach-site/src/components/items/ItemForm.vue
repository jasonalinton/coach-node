<template>
    <form :id="`${config.itemType}-form`">
        <!-- ID & Close Button -->
        <div class="d-flex flex-row justify-content-between mt-2">
            <span>{{ item.id }}</span>
            <i class="btn btn-sm fas fa-times" @click="close"></i>
        </div>
        <!-- Title/Text -->
        <div class="form-group mt-2">
            <div class="form-floating">
                <input class="form-control form-control-lg" type="text" v-model.lazy.trim="item.text" />
                <label>Title</label>
            </div>
        </div>
        <!-- Description -->
        <div class="form-group mt-2">
            <div class="form-floating">
                <textarea class="form-control form-control-sm" type="text" v-model="item.description" />
                <label>Description</label>
            </div>
        </div>
        <!-- Mapped Items -->
        <ApolloQuery 
            v-for="prop in this.config.props.filter(prop => prop.isItem)" :key="prop.id"
            :query="prop.optionsQuery">
            <template slot-scope="{ result: { error, data }, isLoading }">
                <div class="form-group mt-2">
                    <div class="d-flex justify-content-between align-items-center align-middle mb-1">
                        <h2>{{ prop.name }}</h2>
                        <a class="btn btn-sm btn-link" type="button" data-bs-toggle="collapse" :data-bs-target="`.${prop.prop}.collapse`" aria-controls="offcanvas-items">Edit</a>
                    </div>
                    <div :class="`${prop.prop} collapse`">
                        <div v-if="isLoading">Loading...</div>
                        <div v-else-if="error">An error occurred</div>
                        <SelectItem v-else-if="data" :items="data[prop.prop]" :selectedItems="item[prop.prop]"></SelectItem>
                        <div v-else class="no-result apollo">No result :(</div>
                    </div>
                    <div :class="`list-group ${prop.prop} collapse show`">
                        <a href="#" class="list-group-item list-group-item-light list-group-item-action d-flex justify-content-between" v-for="_item in item[prop.prop]" v-bind:key="_item.id">
                            {{ _item.text }}
                            <i class="fas fa-times btn-sm" @click="removeItem(_item, item[prop.prop])"></i>
                        </a>
                    </div>
                </div>
            </template>
        </ApolloQuery>
        <!-- Buttons -->
        <div class="form-group d-flex justify-content-end mt-2">
            <button class="btn btn-primary me-2" type="button" @click.prevent="save(item)">Save</button>
            <button class="btn btn-warning" type="button" @click.prevent="close">Cancel</button>
        </div>
    </form>
</template>

<script>
import SelectItem from "../controls/SelectItem.vue"
import { removeItem, clone } from '../../../utility'

export default {
    components: { SelectItem },
    name: "ItemForm",
    props: {
        config: Object,
        item: Object
    },
    data: function() {
        return {
            originalItem: null
        }
    },
    created: function() {
        this.originalItem = clone(this.item);
    },
    methods: {
        save,
        close,
        // unmapItem,
        removeItem,
        getUnmappedIDs
    }
}

function save(item) {
    var title = item.text.trim();
    if (title == "") return;

    item.unmappedItemIDs = this.getUnmappedIDs();

    if (!item.id) {
        this.config.addItem(item, this.$apollo);
    } else {
        this.config.updateItem(item, this.$apollo);
    }
    
    this.close();
}

function getUnmappedIDs() {
    let unmappedItemIDs = {};
    let properties = this.config.props.filter(prop => prop.type == 'objects');
    let _this = this;

    properties.forEach(prop => {
        let updatedIDs = _this.item[prop.prop].map(item => { return item.id });
        let originalIDs = _this.originalItem[prop.prop].map(item => { return item.id });
        let unmappedIDs = []

        originalIDs.forEach(id => {
            if (!updatedIDs.includes(id)) {
                unmappedIDs.push(id);
            }
        })

        if (unmappedIDs.length > 0) {
            unmappedItemIDs[prop.prop] = unmappedIDs;
        }
    })

    return unmappedItemIDs;
}

function close() {
    this.$emit('closeForm');
}
</script>

<style scoped>
    form {
        padding: 0px 10px
    }

    h2 {
        font-size: 16px;
        margin-bottom: 0px;
    }
</style>