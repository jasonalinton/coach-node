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
        <!-- Mapped Items -->
        <ApolloQuery
            v-for="prop in itemProps"
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
                        >
                            {{ prop.name }}
                        </a>
                    </div>
                    <!-- Quick Add Item -->
                    <div class="d-flex justify-content-between mt-1">
                        <button
                            class="add-btn my-auto"
                            type="button"
                            @click="addItem(newItem[prop.prop], item[prop.prop])">
                            <img src="/icon/button/add.png"
                                width="10"
                                height="10"/>
                            Add
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
        <div class="d-flex flew-row justify-content-between mt-4">
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
                    :for="`toggle-${config.itemType}-panel`">
                    Toggle
                </label>
            </div>
            <button
                class="btn btn-primary me-2"
                type="button"
                @click.prevent="refreshRepetitive()"
            >
                Refresh Repetitive
            </button>
            <!-- Buttons -->
            <div class="form-group d-flex justify-content-end">
                <button class="btn btn-primary me-2" type="button"
                        @click.prevent="save(item)">
                    Save
                </button>
                <button
                    class="btn btn-warning"
                    type="button"
                    @click.prevent="close">
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
import { refreshRepetitiveEvents } from "../../../api/routineAPI"

import {
    getRoutineRepeatIDsAssociatedWithTodo,
    createTodoRepeatFromRoutineRepeat,
} from "../../../service/time/repeatService";

export default {
    components: { SelectItem, RepeatControl2, TimePairControl2 },
    name: "RoutineForm",
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
        configureRoutine,
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

    this.configureRoutine(item);

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

// function configureRoutine(item) {
//     item.todos.forEach((todo) => {
//         item.repeats.forEach((repeat) => {
//             let cloned = clone(repeat);
//             cloned.isConnected = true;
//             if (!todo.repeats) todo.repeats = [];
//             todo.repeats.push(cloned);
//         });
//     });
// }

function configureRoutine(item) {
    item.todos.forEach((todo) => {
        if (todo.repeats) {
            let routineRepeatIDs = getRoutineRepeatIDsAssociatedWithTodo(todo, item);
            let repeatsToMap = item.repeats.filter(_repeat => !routineRepeatIDs.includes(_repeat.id));

            for (let i = 0; i < repeatsToMap.length; i++) {
                let _repeat = repeatsToMap[i];
                let repeat_new = createTodoRepeatFromRoutineRepeat(_repeat);
                repeat_new.id = -i - 1;

                if (!todo.repeats) todo.repeats = [];
                todo.repeats.push(repeat_new);
            }
        }
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

// function mapTodoToRoutine(todo) {
//     let routineRepeatIDs = getRoutineRepeatIDsAssociatedWithTodo(todo, this.item);
//     let repeatsToMap = this.item.repeats.filter(_repeat => !routineRepeatIDs.includes(_repeat.id));

//     for (let i = 0; i < repeatsToMap.length; i++) {
//         let _repeat = repeatsToMap[i];
//         let repeat_new = createTodoRepeatFromRoutineRepeat(_repeat);
//         repeat_new.id = -i - 1;
//     }

//     this.item.todos.push(todo);
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
    line-height: 16px;
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
    width: 53px;
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