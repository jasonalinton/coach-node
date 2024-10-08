<template>
    <form :id="`${config.itemType}-form`" class="pb-2" v-on:submit.prevent>
        <!-- ID & Close Button -->
        <div class="d-flex flex-row justify-content-between ms-1 mt-2">
            <span>{{ item.id }}</span>
            <i class="btn btn-sm fas fa-times" @click="close"></i>
        </div>
        <!-- Title/Text -->
        <div class="form-group mt-1">
            <input
                id="title"
                class="textbox"
                type="text"
                ref="text"
                placeholder="Title"
                v-model.lazy.trim="item.text"
                v-on:keyup.enter="save(item)"
                spellcheck
            />
        </div>
        <!-- Description -->
        <div class="form-group mt-1">
            <textarea
                id="description"
                class="textarea"
                type="text"
                placeholder="Description"
                v-model="item.description"
                v-on:keyup.enter="save(item)"
            />
        </div>
        <!-- Metrics -->
        <ApolloQuery
            :query="require('../../../graphql/query/QueryMetrics.gql')"
        >
            <template slot-scope="{ result: { error, data }, isLoading }">
                <div class="mapped-item form-group mt-1">
                    <div
                        class="
                            header
                            d-flex
                            justify-content-between
                            align-items-center align-middle
                        "
                    >
                        <a
                            class="item-select btn btn-sm btn-link"
                            type="button"
                            data-bs-toggle="collapse"
                            :data-bs-target="`.metrics.collapse`"
                            aria-controls="offcanvas-items"
                            >Metrics</a
                        >
                    </div>
                    <!-- Quick Add Item -->
                    <div class="d-flex justify-content-between mt-1">
                        <button
                            class="add-btn my-auto"
                            type="button"
                            @click="addItem(newItem.metrics, item.metrics)"
                        >
                            <img
                                src="/icon/button/add.png"
                                width="10"
                                height="10"
                            />Add
                        </button>
                        <input
                            class="add textbox"
                            type="text"
                            v-model="newItem.metrics.text"
                            v-on:keyup.enter="
                                addItem(newItem.metrics, item.metrics)
                            "
                            :style="{ width: 'calc(100% - 55px)' }"
                        />
                    </div>
                    <div :class="`metrics collapse mt-1`">
                        <div v-if="isLoading">Loading...</div>
                        <div v-else-if="error">An error occurred</div>
                        <SelectItem
                            v-else-if="data"
                            :items="data.metrics"
                            :selectedItems="item.metrics"
                            @setSelected="metrics = $event"
                        ></SelectItem>
                        <div v-else class="no-result apollo">No result :(</div>
                    </div>
                    <div :class="`list-group metrics collapse show mt-1`">
                        <a
                            v-for="_item in metrics"
                            v-bind:key="_item.id"
                            href="#"
                            class="
                                list-group-item
                                list-group-item-light
                                list-group-item-action
                                d-flex
                                justify-content-between
                                align-items-center
                            "
                        >
                            {{ _item.text }}
                            <img
                                class="delete-button"
                                src="/icon/button/delete.png"
                                width="10"
                                height="10"
                                @click="removeItem(_item, item.metrics)"
                            />
                        </a>
                    </div>
                </div>
            </template>
        </ApolloQuery>
        <!-- Mapped Items -->
        <ApolloQuery
            v-for="prop in itemProps.filter(
                (itemProp) => itemProp.prop != 'metrics'
            )"
            :key="prop.id"
            :query="prop.optionsQuery"
        >
            <template slot-scope="{ result: { error, data }, isLoading }">
                <div class="mapped-item form-group mt-1">
                    <div
                        class="
                            header
                            d-flex
                            justify-content-between
                            align-items-center align-middle
                        "
                    >
                        <a
                            class="item-select btn btn-sm btn-link"
                            type="button"
                            data-bs-toggle="collapse"
                            :data-bs-target="`.${prop.prop}.collapse`"
                            aria-controls="offcanvas-items"
                            >{{ prop.name }}</a
                        >
                    </div>
                    <!-- Quick Add Item -->
                    <div class="d-flex justify-content-between mt-1">
                        <button
                            class="add-btn my-auto"
                            type="button"
                            @click="
                                addItem(newItem[prop.prop], item[prop.prop])
                            "
                        >
                            <img
                                src="/icon/button/add.png"
                                width="10"
                                height="10"
                            />Add
                        </button>
                        <input
                            class="add textbox"
                            type="text"
                            v-model="newItem[prop.prop].text"
                            v-on:keyup.enter="
                                addItem(newItem[prop.prop], item[prop.prop])
                            "
                            :style="{ width: 'calc(100% - 55px)' }"
                        />
                    </div>
                    <div :class="`${prop.prop} collapse mt-1`">
                        <div v-if="isLoading">Loading...</div>
                        <div v-else-if="error">An error occurred</div>
                        <SelectItem
                            v-else-if="data"
                            :items="data[prop.queryField]"
                            :selectedItems="item[prop.prop]"
                        ></SelectItem>
                        <div v-else class="no-result apollo">No result :(</div>
                    </div>
                    <div :class="`list-group ${prop.prop} collapse show mt-1`">
                        <a
                            href="#"
                            class="
                                list-group-item
                                list-group-item-light
                                list-group-item-action
                                d-flex
                                justify-content-between
                                align-items-center
                            "
                            v-for="_item in item[prop.prop]"
                            v-bind:key="_item.id"
                        >
                            {{ _item.text }}
                            <img
                                class="delete-button"
                                src="/icon/button/delete.png"
                                width="10"
                                height="10"
                                @click="removeItem(_item, item[prop.prop])"
                            />
                        </a>
                    </div>
                </div>
            </template>
        </ApolloQuery>
        <RepeatControl2
            class="mt-2"
            :repeats="item.repeats"
            @addRepeat="addRepeat"
            @updateRepeat="updateRepeat"
        ></RepeatControl2>
        <TimePairControl2
            class="mt-2"
            :timePairs="item.timePairs"
            @addTimePair="addTimePair"
            @updateTimePair="updateTimePair"
        ></TimePairControl2>
        <div class="d-flex flew-column justify-content-between mt-4">
            <!-- Is Group -->
            <div class="form-check">
                <input
                    :id="`todo-${item.id}-is-group`"
                    class="form-check-input"
                    type="checkbox"
                    v-model="item.isGroup"
                />
                <label
                    class="form-check-label"
                    :for="`todo-${item.id}-is-group`"
                >
                    Is Group
                </label>
            </div>
            <!-- Toggle Panel - Checkbox -->
            <div class="form-check">
                <input
                    :id="`toggle-${config.itemType}-panel`"
                    class="form-check-input"
                    type="checkbox"
                    v-model="togglePanel"
                />
                <label
                    class="form-check-label"
                    :for="`toggle-${config.itemType}-panel`"
                >
                    Toggle
                </label>
            </div>
        </div>
        <button
            class="btn btn-primary me-2"
            type="button"
            @click.prevent="refreshRepetitive()"
        >
            Refresh Repetitive
        </button>
        <div class="d-flex flew-row justify-content-between mt-4">
            <!-- Buttons -->
            <div class="form-group d-flex justify-content-end">
                <button
                    class="btn btn-primary me-2"
                    type="button"
                    @click.prevent="save(item)"
                >
                    Save
                </button>
                <button
                    class="btn btn-warning"
                    type="button"
                    @click.prevent="close"
                >
                    Cancel
                </button>
            </div>
        </div>
    </form>
</template>

<script>
import SelectItem from "../../controls/SelectItem.vue";
import { replaceItem, removeItem, clone } from "../../../../utility";
import RepeatControl2 from "../../controls/time/RepeatControl2.vue";
import TimePairControl2 from "../../controls/time/TimePairControl2.vue";
import { refreshRepetitiveEvents } from "../../../api/todoAPI";

export default {
    components: { SelectItem, RepeatControl2, TimePairControl2 },
    name: "TodoForm",
    props: {
        config: Object,
        item: Object,
    },
    data: function () {
        return {
            originalItem: null,
            togglePanel: false,
            newItem: {},
            itemProps: this.config.props.filter((prop) => prop.isItem),
        };
    },
    computed: {
        allTodos() {
            return this.$apollo.getClient().cache.readQuery({
                query: require("../../../graphql/query/QueryItems.gql"),
            }).items.todos;
        },
        allGoals() {
            return this.$apollo.getClient().cache.readQuery({
                query: require("../../../graphql/query/QueryItems.gql"),
            }).items.goals;
        },
        metrics: {
            /*
                Currently, this automatically maps metrics based on the goals and parent todos the item is mapped to
                PROBLEM: If you unmap the item the metric will still be mapped to it, whether it's supposed to or not
                SOLUTION: Initially, don't actually create mapping, just show the metrics of mapped items. 
                          Then use a button (or something) to create the actual mapping
            */
            get() {
                // let _metrics = [...this.item.metrics];

                ["parents", "children", "goals"].forEach((_prop) => {
                    this.item[_prop].forEach((_item) => {
                        let _relative;
                        if (_prop == "parents" || _prop == "children")
                            _relative = this.allTodos.find(
                                (_todo) => _todo.id == _item.id
                            );
                        if (_prop == "goals")
                            _relative = this.allGoals.find(
                                (_goal) => _goal.id == _item.id
                            );

                        _relative.metrics.forEach((_metric) => {
                            if (
                                !this.item.metrics
                                    .map((__) => __.id)
                                    .includes(_metric.id)
                            ) {
                                this.item.metrics.push({
                                    __typename: _metric.__typename,
                                    id: _metric.id,
                                    text: _metric.text,
                                    // isNewMap: true,
                                });
                            }
                        });
                    });
                });
                return this.item.metrics;
            },
            set(value) {
                this.item.metrics = value;
            },
        },
    },
    created: function () {
        this.originalItem = clone(this.item);
        this.initToggle();
        this.initNewItems();
    },
    mounted: function () {
        this.$refs.text.focus();
    },
    methods: {
        initToggle,
        initNewItems,
        addItem,
        save,
        configureTodo,
        close,
        refreshForm,
        removeItem,
        getUnmappedIDs,
        addRepeat,
        updateRepeat,
        addTimePair,
        updateTimePair,
        refreshRepetitive,
    },
    watch: {
        togglePanel(value) {
            localStorage.setItem(`${this.config.itemType}-toggle-panel`, value);
        },
        item(value) {
            this.originalItem = clone(value);
        },
    },
};

function initToggle() {
    let togglePanel_Store =
        localStorage.getItem(`${this.config.itemType}-toggle-panel`) === "true";
    if (togglePanel_Store) {
        this.togglePanel = Boolean(togglePanel_Store);
    } else {
        localStorage.setItem(
            `${this.config.itemType}-toggle-panel`,
            this.togglePanel
        );
        this.togglePanel = false;
    }
}

function initNewItems() {
    let _this = this;
    this.itemProps.forEach((prop) => {
        _this.newItem[prop.prop] = {
            id: -1,
            text: null,
        };
    });
}

function addItem(item, itemsList) {
    var text = item.text.trim();
    if (text != "") {
        var newItem = {
            id: item.id--,
            text,
        };
        itemsList.push(newItem);
        item.text = "";
    }
}

function getUnmappedIDs() {
    let unmappedIDs = {};
    let properties = this.config.props.filter((prop) => prop.type == "objects");
    let _this = this;

    properties.forEach((prop) => {
        let updatedIDs = _this.item[prop.prop].map((item) => {
            return item.id;
        });
        let originalIDs = _this.originalItem[prop.prop].map((item) => {
            return item.id;
        });
        let unmapped = [];

        originalIDs.forEach((id) => {
            if (!updatedIDs.includes(id)) {
                unmapped.push(id);
            }
        });

        if (unmapped.length > 0) {
            unmappedIDs[prop.prop] = unmapped;
        }
    });

    return unmappedIDs;
}

function addRepeat(repeat) {
    this.item.repeats.push(clone(repeat));
}

function updateRepeat(repeat) {
    var success = replaceItem(clone(repeat), this.item.repeats);
    if (!success) alert("Repeat no longer exists");
}

function addTimePair(timePair) {
    this.item.timePairs.push(clone(timePair));
}

function updateTimePair(timePair) {
    var success = replaceItem(clone(timePair), this.item.timePairs);
    if (!success) alert("TimePair no longer exists");
}

function save(item) {
    var title = item.text.trim();
    if (title == "") return;

    item.unmappedIDs = this.getUnmappedIDs();

    this.configureTodo(item);

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

/*
MAKE SURE THIS ISN'T CREATING AND MAPPING A NEW REPEAT EVERY TIME A TODO THAT IS
MAPPED TO A ROUTINE IS SAVED
*/
function configureTodo(item) {
    item.routines.forEach((routine) => {
        if (!routine.repeats) return;
        routine.repeats.forEach((repeat) => {
            if (item.repeats.length == 0) {
                let cloned = clone(repeat);

                // delete cloned.id;
                cloned.isConnected = true;

                // Remove ID so new objects are created
                if (cloned.startRepeat) delete cloned.startRepeat.id;
                if (cloned.endRepeat) delete cloned.endRepeat.id;
                if (cloned.startIteration) delete cloned.startIteration.id;
                if (cloned.endIteration) delete cloned.endIteration.id;

                cloned.isEventVisible = false;
                item.repeats.push(cloned);
            }
        });
    });
}

function refreshForm() {
    this.$emit("refreshForm");
}

function close() {
    this.$emit("closeForm", this.togglePanel);
}

// function mapRoutine(routine) {
//     routine = clone(routine);

//     routine.isNewMap = true;
//     this.item.routines.push(routine);

//     routine.repeats.forEach(repeat => {
//         let clonedRepeat = clone(repeat);
//         this.item.repeats.push(clonedRepeat);
//     })
// }

function refreshRepetitive() {
    refreshRepetitiveEvents(this.item.id);
}
</script>

<style scoped>
form {
    background-color: #f5f5f5;
    padding-left: 2px;
    padding-right: 12px;
    height: calc(100vh - 64px - 42px);
    overflow: scroll;
    /* box-shadow: 7px 0px 9px 5px rgba(0,0,0,.5); */
    /* box-shadow: 8px 20px 9px 4px rgba(0,0,0,.5); */
    /* border-left: 1px solid rgba(220, 220, 220, .5); */
}

#title {
    padding-top: 4px;
}

.mapped-item .header {
    border-bottom: 1px solid rgba(220, 220, 220, 0.5);
}

/* .mapped-item-header:hover {
    color: #005A9E;
    border-color: #005A9E;
} */

.mapped-item:hover .header a,
.mapped-item:focus .header a {
    color: #005a9e;
}

.mapped-item .header a {
    height: 28px;
    text-decoration: none;
    font-weight: 700;
}

.item-select {
    font-size: 16px;
    margin-bottom: 0px;
    padding-left: 8px;
    color: #343434;
}

.list-group-item {
    padding: 4px 8px;
    border-radius: initial;
    border: none;
    font-size: 14px;
    line-height: 14px;
    background-color: #f5f5f5;
    color: #343434;
    text-align: left;
}

.list-group-item:hover {
    background-color: #dcdcdc;
}

.list-group-item:hover img {
    visibility: visible;
}

.delete-button {
    margin: 4px 8px;
    visibility: hidden;
    opacity: 0.8;
}

.control-label {
    font-size: 12px;
    padding: 2px 8px;
    color: rgba(0, 0, 0, 0.55);
}

.textbox {
    height: 28px;
}

.textbox,
.textarea {
    width: 100%;
    font-size: 14px;
    line-height: 14px;
    padding: 2px 8px;
    /* padding-top: 4px; */
    /* color: #343434; */
    color: #212529;
}

.textarea {
    padding: 8px;
}

.textbox:not(.accissible),
.textarea:not(.accissible) {
    outline-style: none;
    -webkit-appearance: none;
    border: 1px solid rgba(0, 0, 0, 0.08);
    resize: none;
}

.textbox:not(.accissible):focus,
.textarea:not(.accissible):focus {
    border: 1px solid #039be5;
    transition-property: border-color;
    transition-duration: 0.15s;
    transition-timing-function: ease-in-out;
    transition-delay: 0s;
    resize: vertical;
}

.textbox:not(.accissible):hover:not(:focus),
.textarea:not(.accissible):hover:not(:focus) {
    /* border: 1px solid rgba(0, 0, 0, .08); */
    border: 1px solid rgba(0, 0, 0, 0.2);
    resize: vertical;
}

.add-btn {
    width: 50px;
    height: 28px;
    line-height: 28px;
    padding-left: 5px;
    border: none;
    font-size: 12px;
    background-color: transparent;
}

.add-btn:hover {
    background-color: #deecf9;
}

.add-btn img {
    margin-right: 5px;
    vertical-align: initial;
}

.add.textbox {
    border: none;
}
</style>