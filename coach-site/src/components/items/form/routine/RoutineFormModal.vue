<template>
    <div :id="`routine-form-modal-${id}`" class="modal-dialog modal-xl modal-fullscreen-md-down modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" :id="`routine-${id}-ModalLabel`">{{ (routine) ? routine.id : "" }}</h5>
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
                        <div class="col-4">
                            
                        </div>
                        <div class="col-4 form-column">
                            <FormItemList itemType="todo" :itemIDs="todoIDs"
                                          parentType="routine" :parentID="id" :repeatIDs="repeatIDs"
                                          @addItemClicked="addTodoClicked" @addItem="addItem"/>
                        </div>
                        <div class="col-4 d-flex flex-column">
                            <span class="form-head">Repetition</span>
                            <div>
                                <RepeatControl v-for="repeat in repeats.value" :key="repeat.id"
                                               :repeat="repeat" :itemID="id" itemType="routine" :canEdit="selectedRepeatID == undefined"
                                               @refreshRepetition="refreshRepetitionForRepeat"
                                               @saveRepeat="saveRepeat" @setSelectedRepeat="setSelectedRepeat" @cancelRepeatEditing="cancelRepeatEditing"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="mapper.isShown && mapper.type == 'todo'" class="container">
                    <div class="row g-2">
                        <div class="col-12">
                            <ItemMapper itemType="todo" :selectedIDs="todoIDs" 
                                        @close="mapper.isShown = false" @cancel="cancelMapping" @select="selectTodos"/>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="!mapper.isShown" class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" @click="save()">Save</button>
            </div>
        </div>
    </div>
</template>

<script>
import { saveRoutine, mapTodos, createAndMapItem } from '../../../../api/routineAPI';
import RepeatControl from '../component/RepeatControl.vue';
import FormItemList from '../component/FormItemList.vue';
import ItemMapper from '../component/ItemMapper.vue'
import { clone, replaceItem, addOrReplaceItem, sortItems } from '../../../../../utility';

export default {
    name: "RoutineFormModal",
    components: { RepeatControl, ItemMapper, FormItemList },
    props: {
      id: Number
    },
    data: function() {
        return {
            store: null,
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
            todos: {
                ids: [],
                value: [],
                newItems: [],
                addedIDs: [],
                removedIDs: []
            },
            selectedRepeatID: undefined,
            mapper: {
                isShown: false,
                type: undefined
            }
        }
    },
    created: async function() {
        let routineStore = await import(`@/store/routineStore`);
        this.store = routineStore.useRoutineStore();

        let routine = this.store.getItem(this.id);
        this.setProps(routine);
    },
    computed: {
        routine() {
            if (this.store) {
                let routine = this.store.getItem(this.id);
                this.setProps(routine);
                return routine;
            } else {
                return null;
            }
        },
        todoIDs() {
            if (this.routine) {

            var todos = sortItems(this.routine.todos, "routine", this.id);
            return todos.map(x => x.id);
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
        setProps(routine) {
            this.text.value = routine.text;
            this.text.oldValue = routine.text;
            this.text.isUpdated = false;

            this.repeats.value = clone(routine.repeats),
            this.repeats.added = [];
            this.repeats.updated = [];
            this.repeats.deletedIDs = [];

        },
        setSelectedRepeat(repeatID) {
            this.selectedRepeatID = repeatID;
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
            _repeat.endRepeat = _repeat.endRepeat.value;
            replaceItem(_repeat, this.repeats.value);
            
            let updatedRepeat = clone(repeat);
            addOrReplaceItem(updatedRepeat, this.repeats.updated);

            this.selectedRepeatID = undefined;
        },
        save() {
            let model = {
                id: this.id,
                text: this.text,
            };
            saveRoutine(model);
            this.$emit("closeItemModal");
        },
        addItem(itemType, itemText) {
            createAndMapItem(this.id, itemType, itemText);
        },
        addTodoClicked() {
            this.mapper.isShown = true;
            this.mapper.type = "todo";
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
        refreshRepetitionForRepeat(repeatID) {
            this.store.refreshRepetitionForRepeat(this.id, repeatID)
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