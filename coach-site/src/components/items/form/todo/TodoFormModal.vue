<template>
    <div :id="`todo-form-modal-${id}`" class="modal-dialog modal-xl modal-fullscreen-md-down modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" :id="`todo-${id}-ModalLabel`">{{ (todo) ? todo.id : "" }}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div v-if="!mapper.isShown" class="container-fluid">
                    <div class="row g-2">
                        <div class="col-12">
                            <input id="text" class="textbox" type="text" placeholder="Title"
                                v-model.lazy.trim="text.value" 
                                v-on:keyup.enter="save()"
                                spellcheck/>
                        </div>
                    </div>
                    <div class="row g-2">
                        <div class="col-12 col-sm-4">
                            
                        </div>
                        <div class="col-6 col-sm-4 form-column">
                            <FormItemList itemType="todo" :itemIDs="childIDs" :isChild="true"
                                          parentType="todo" :parentID="id" :repeatIDs="repeatIDs"
                                          @addItemClicked="addTodoClicked" @addItem="addItem"/>
                        </div>
                        <div class="col-6 col-sm-4 d-flex flex-column">
                            <!-- Repetition -->
                            <div>
                                <span class="form-head">Repetition</span>
                                <!-- Quick Add Item -->
                                <div class="d-flex justify-content-between mt-1 mb-1">
                                    <button class="add-btn my-auto" type="button" @click="addRepeatClicked">
                                        <img src="/icon/button/add.png" width="10" height="10"/>Add
                                    </button>
                                </div>
                                <div>
                                    <RepeatControl v-for="repeat in repeats.value" :key="repeat.id"
                                                   :repeat="repeat" :itemID="id" itemType="todo" :canEdit="selectedRepeatID == undefined"
                                                   @saveRepeat="saveRepeat" @setSelectedRepeat="setSelectedRepeat" @cancelRepeatEditing="cancelRepeatEditing"
                                                   @refreshRepetition="refreshRepetitionForRepeat"
                                                   @deleteFutureRepetitions="deleteFutureRepetitionsForRepeat"/>
                                </div>
                            </div>
                            <!-- Time -->
                            <div>
                                <span class="form-head">Time</span>
                                <!-- Quick Add Item -->
                                <div class="d-flex justify-content-between mt-1 mb-1">
                                    <button class="add-btn my-auto" type="button" @click="addTimeClicked">
                                        <img src="/icon/button/add.png" width="10" height="10"/>Add
                                    </button>
                                </div>
                                <div>
                                    <TimePairControl v-for="timePair in timePairs.value" :key="timePair.id"
                                                     :timePair="timePair" :itemID="id" itemType="todo" :canEdit="selectedTimePairID == undefined"
                                                     @saveTimePair="saveTimePair" @setSelectedTimePair="setSelectedTimePair" @cancelTimePairEditing="cancelTimePairEditing"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="mapper.isShown && mapper.type == 'todo'" class="container">
                    <div class="row g-2">
                        <div class="col-12">
                            <ItemMapper itemType="todo" :selectedIDs="childIDs" 
                                        @close="mapper.isShown=false" @cancel="cancelMapping" @select="selectTodos"/>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="!mapper.isShown" class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="createTask">Create Task</button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" @click="save">Save</button>
            </div>
        </div>
    </div>
</template>

<script>
import { saveTodo, mapTodos, createAndMapItem } from '../../../../api/todoAPI';
import RepeatControl from '../component/RepeatControl.vue';
import TimePairControl from '../component/TimePairControl.vue';
import FormItemList from '../component/FormItemList.vue';
import ItemMapper from '../component/ItemMapper.vue'
import { clone, replaceItem, addOrReplaceItem, sortItems, sortAsc } from '../../../../../utility';

export default {
    name: "TodoFormModal",
    components: { RepeatControl, TimePairControl, ItemMapper, FormItemList },
    props: {
      id: Number
    },
    data: function() {
        return {
            store: null,
            plannerStore: null,
            text: {
                value: undefined,
                oldValue: undefined,
                isUpdated: false
            },
            repeats: {
                value: [],
                added: [],
                deletedIDs: []
            },
            timePairs: {
                value: [],
                added: [],
                deletedIDs: []
            },
            todos: {
                ids: [],
                value: [],
                newItems: [],
                addedIDs: [],
                removedIDs: []
            },
            selectedRepeatID: undefined,
            selectedTimePairID: undefined,
            mapper: {
                isShown: false,
                type: undefined
            },
            test: "<u>Underline Test</u>"
        }
    },
    created: async function() {
        let todoStore = await import(`@/store/todoStore`);
        this.store = todoStore.useTodoStore();

        let plannerStore = await import(`@/store/plannerStore`);
        this.plannerStore = plannerStore.usePlannerStore();

        let todo = this.store.getItem(this.id);
        this.setProps(todo);
    },
    computed: {
        todo() {
            if (this.store) {
                let todo = this.store.getItem(this.id);
                this.setProps(todo);
                return todo;
            } else {
                return null;
            }
        },
        childIDs() {
            if (this.todo) {
                var children = sortItems(this.todo.children, "todo", this.id);
                return children.map(x => x.id);
            } else {
                return [];
            }
        },
        repeatIDs() {
            if (this.repeats?.value) {
                return this.repeats.value.map(x => x.id);
            } else {
                return [];
            }
        }
    },
    methods: {
        setProps(todo) {
            this.text.value = todo.text;
            this.text.oldValue = todo.text;
            this.text.isUpdated = false;

            this.repeats.value = clone(todo.repeats),
            this.repeats.added = [];
            this.repeats.updated = [];
            this.repeats.deletedIDs = [];

            this.timePairs.value = clone(todo.timePairs),
            this.timePairs.added = [];
            this.timePairs.updated = [];
            this.timePairs.deletedIDs = [];

        },
        setSelectedRepeat(repeatID) {
            this.selectedRepeatID = repeatID;
        },
        setSelectedTimePair(timePairID) {
            this.selectedTimePairID = timePairID;
        },
        selectTodos(addedIDs, removedIDs) {
            this.todos.addedIDs = [...addedIDs];
            this.todos.removedIDs = [...removedIDs];

            mapTodos(this.id, addedIDs, removedIDs);

            this.mapper.isShown = false;
            this.mapper.type = undefined;

        },
        saveRepeat(repeat) {
            let _repeat = clone(repeat);
            _repeat.startRepeat = _repeat.startRepeat.value;
            _repeat.endRepeat = (_repeat.endRepeat) ? _repeat.endRepeat.value : null;
            _repeat.startIteration = (_repeat.startIteration) ? _repeat.startIteration.value : null;
            _repeat.endIteration = (_repeat.endIteration) ? _repeat.endIteration.value : null;
            replaceItem(_repeat, this.repeats.value);
            
            let savedRepeat = clone(repeat);
            if (repeat.id > 0) {
                addOrReplaceItem(savedRepeat, this.repeats.updated);
            } else {
                addOrReplaceItem(savedRepeat, this.repeats.added);
            }

            this.selectedRepeatID = undefined;
        },
        saveTimePair(timePair) {
            let _timePair = clone(timePair);
            _timePair.startTime = (_timePair.startTime) ? _timePair.startTime.value : null;
            _timePair.endTime = (_timePair.endTime) ? _timePair.endTime.value : null;
            replaceItem(_timePair, this.timePairs.value);
            
            let savedTimePair = clone(timePair);
            if (timePair.id > 0) {
                addOrReplaceItem(savedTimePair, this.timePairs.updated);
            } else {
                addOrReplaceItem(savedTimePair, this.timePairs.added);
            }

            this.selectedTimePairID = undefined;
        },
        save() {
            let model = {
                id: this.id,
                text: this.text,
            };
            saveTodo(model);
            this.$emit("closeItemModal");
        },
        createTask() {
            this.store.createTask(this.id);
        },
        addItem(itemType, itemText) {
            createAndMapItem(this.id, itemType, itemText);
        },
        addTodoClicked() {
            this.mapper.isShown = true;
            this.mapper.type = "todo";
        },
        addTimeClicked() {
            let timePairs = sortAsc(this.timePairs.value, 'id');
            let newTimePair = this.plannerStore.createTimePair();
            newTimePair.id = (timePairs.length > 0 && timePairs[0].id < 0) ? timePairs[0].id - 1 : -1;
            this.timePairs.value.unshift(newTimePair);
        },
        addRepeatClicked() {
            let repeats = sortAsc(this.repeats.value, 'id');
            let newRepeat = this.plannerStore.createRepeat();
            newRepeat.id = (repeats.length > 0 && repeats[0].id < 0) ? repeats[0].id - 1 : -1;
            this.repeats.value.unshift(newRepeat);
        },
        cancelMapping() {
            this.mapper.isShown = false;
            this.mapper.type = undefined;
        },
        cancelRepeatEditing(id) {
            if (id < 0) {
                let index = this.repeats.value.findIndex(x => x.id == id);
                this.repeats.value.splice(index, 1)
            }
            this.selectedRepeatID = undefined;
        },
        cancelTimePairEditing(id) {
            if (id < 0) {
                let index = this.timePairs.value.findIndex(x => x.id == id);
                this.timePairs.value.splice(index, 1)
            }
            this.selectedTimePairID = undefined;
        },
        refreshRepetitionForRepeat(repeatID) {
            this.store.refreshRepetitionForRepeat(this.id, repeatID)
        },
        deleteFutureRepetitionsForRepeat(repeatID) {
            this.store.deleteFutureRepetitionsForRepeat(this.id, repeatID)
        },
    },
    watch: {
        'text.value'(value) {
            if (value != this.text.oldValue) {
                this.text.isUpdated = true;
            } else {
                this.isUpdated = false;
            }
        }
    }
}
</script>

<style scoped>
#text {
    height: 52px;
    font-size: 32px;
}

.form-column {
    overflow: auto;
}

.form-head {
    font-size: 20px;
    text-align: start;
    width: 100%;
    display: inline-block;
}
</style>