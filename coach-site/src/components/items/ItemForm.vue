<template>
    <form :id="`${config.itemType}-form`" 
    v-on:submit.prevent
    >
        <!-- ID & Close Button -->
        <div class="d-flex flex-row justify-content-between mt-2">
            <span>{{ item.id }}</span>
            <i class="btn btn-sm fas fa-times" @click="close"></i>
        </div>
        <!-- Title/Text -->
        <div class="form-group mt-2">
            <div class="form-floating">
                <input class="form-control form-control-md" type="text" ref="text" 
                v-model.lazy.trim="item.text" 
                v-on:keyup.enter="save(item)"
                spellcheck/>
                <label>Title</label>
            </div>
        </div>
        <!-- Description -->
        <div class="form-group mt-2">
            <div class="form-floating">
                <textarea class="form-control form-control-sm" type="text" 
                v-model="item.description"
                v-on:keyup.enter="save(item)" />
                <label>Description</label>
            </div>
        </div>
        <!-- Mapped Items -->
        <ApolloQuery 
            v-for="prop in itemProps" :key="prop.id"
            :query="prop.optionsQuery">
            <template slot-scope="{ result: { error, data }, isLoading }">
                <div class="form-group mt-2">
                    <div class="d-flex justify-content-between align-items-center align-middle mb-1">
                        <h2>{{ prop.name }}</h2>
                        <a class="btn btn-sm btn-link" type="button" data-bs-toggle="collapse" :data-bs-target="`.${prop.prop}.collapse`" aria-controls="offcanvas-items">Edit</a>
                    </div>
                    <!-- Quick Add Item -->
                    <div class="d-flex justify-content-between">
                        <input class="form-control form-control-sm" type="text" 
                            v-model="newItem[prop.prop].text"
                            v-on:keyup.enter="addItem(newItem[prop.prop], item[prop.prop])"
                            :style="{'width': 'calc(100% - 50px)'}"/>
                        <button class="btn btn-secondary btn-sm" type="button" @click="addItem(newGoal, todo.Goals)">Add</button>
                    </div>
                    <div :class="`${prop.prop} collapse mt-1`">
                        <div v-if="isLoading">Loading...</div>
                        <div v-else-if="error">An error occurred</div>
                        <SelectItem v-else-if="data" :items="data[prop.queryField]" :selectedItems="item[prop.prop]"></SelectItem>
                        <div v-else class="no-result apollo">No result :(</div>
                    </div>
                    <div :class="`list-group ${prop.prop} collapse show mt-1`">
                        <a href="#" class="list-group-item list-group-item-light list-group-item-action d-flex justify-content-between" v-for="_item in item[prop.prop]" v-bind:key="_item.id">
                            {{ _item.text }}
                            <i class="fas fa-times btn-sm" @click="removeItem(_item, item[prop.prop])"></i>
                        </a>
                    </div>
                </div>
            </template>
        </ApolloQuery>
        <RepeatControl :repeats="item.repeats" @addRepeat="addRepeat" @updateRepeat="updateRepeat"></RepeatControl>
        <div class="d-flex flew-row justify-content-between">
            <!-- Toggle Panel - Checkbox -->
            <div class="form-check">
                <input :id="`toggle-${config.itemType}-panel`" class="form-check-input" type="checkbox" v-model="togglePanel" >
                <label class="form-check-label" :for="`toggle-${config.itemType}-panel`">
                    Toggle
                </label>
            </div>
            <!-- Buttons -->
            <div class="form-group d-flex justify-content-end mt-2">
                <button class="btn btn-primary me-2" type="button" @click.prevent="save(item)">Save</button>
                <button class="btn btn-warning" type="button" @click.prevent="close">Cancel</button>
            </div>
        </div>
    </form>
</template>

<script>
import SelectItem from "../controls/SelectItem.vue"
import { replaceItem, removeItem, clone } from '../../../utility'
import RepeatControl from '../controls/time/RepeatControl.vue'

export default {
    components: { SelectItem, RepeatControl },
    name: "ItemForm",
    props: {
        config: Object,
        item: Object
    },
    data: function() {
        return {
            originalItem: null,
            togglePanel: false,
            newItem: {},
            itemProps: this.config.props.filter(prop => prop.isItem)
        }
    },
    created: function() {
        this.originalItem = clone(this.item);
        this.initToggle();
        this.initNewItems();
    },
    mounted: function() {
        this.$refs.text.focus();
    },
    methods: {
        initToggle,
        initNewItems,
        addItem,
        save,
        close,
        refreshForm,
        removeItem,
        getUnmappedIDs,
        addRepeat,
        updateRepeat,
    },
    watch: {
        togglePanel(value) {
            localStorage.setItem(`${this.config.itemType}-toggle-panel`, value);
        }
    }
}

function initToggle() {
    let togglePanel_Store = (localStorage.getItem(`${this.config.itemType}-toggle-panel`) === 'true');
    if (togglePanel_Store) {
        this.togglePanel = Boolean(togglePanel_Store);
    } else {
        localStorage.setItem(`${this.config.itemType}-toggle-panel`, this.togglePanel);
        this.togglePanel = false;
    }
}

function initNewItems() {
    let _this = this;
    this.itemProps.forEach(prop => {
        _this.newItem[prop.prop] = { 
            id: -1,
            text: null 
        };
    });
}

function addItem(item, itemsList) {
    var text = item.text.trim();
    if (text != "") {
        var newItem = {
          id: item.id--,
          text
        }
        itemsList.push(newItem);
        item.text = "";
    }
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

function addRepeat(repeat) {
    this.item.repeats.push(clone(repeat));
}

function updateRepeat(repeat) {
    var success = replaceItem(clone(repeat), this.item.repeats);
    if (!success)
        alert("Repeat no longer exists");
}

function save(item) {
    var title = item.text.trim();
    if (title == "") return;

    // TEMP
    delete item.repeats;

    item.unmappedItemIDs = this.getUnmappedIDs();

    if (!item.id) {
        this.config.addItem(item, this.$apollo);
    } else {
        this.config.updateItem(item, this.$apollo);
    }

    if (this.togglePanel) {
        this.close();
    } else {
        this.refreshForm();
    }
}

function refreshForm() {
    this.$emit('refreshForm');
}

function close() {
    this.$emit('closeForm', this.togglePanel);
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