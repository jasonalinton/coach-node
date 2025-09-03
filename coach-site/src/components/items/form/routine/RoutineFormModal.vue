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
                                v-model.lazy.trim="text" 
                                v-on:keyup.enter="save()"
                                spellcheck="true"/>
                        </div>
                    </div>
                    <div class="row g-2">
                        <div class="col-4">
                            <div class="form-check">
                                <input class="form-check-input mt-1" type="checkbox" value="" id="is-task-routine" 
                                       v-model="isTaskRoutine">
                                <label class="form-check-label float-start" for="is-task-routine">
                                    Task-Routine
                                </label>
                            </div>
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
                                <!-- Quick Add Item -->
                                <div class="d-flex justify-content-between mt-1 mb-1">
                                    <button class="add-btn my-auto" type="button" @click="addRepeatClicked">
                                        <img src="/icon/button/add.png" width="10" height="10"/>Add
                                    </button>
                                </div>
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
import RepeatControl from '../component/RepeatControl2.vue';
import FormItemList from '../component/FormItemList.vue';
import ItemMapper from '../component/ItemMapper.vue'
import { clone, replaceItem, addOrReplaceItem, sortItems, sortAsc } from '../../../../../utility';
import { ROUTINETYPES } from '../../../../model/constants'

export default {
    name: "RoutineFormModal",
    components: { RepeatControl, ItemMapper, FormItemList },
    props: {
      id: Number
    },
    data: function() {
        return {
            store: null,
            initialized: false,
            ROUTINETYPES: clone(ROUTINETYPES),
            text: undefined,
            isTaskRoutine: undefined,
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

        let plannerStore = await import(`@/store/plannerStore`);
        this.plannerStore = plannerStore.usePlannerStore();

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
            this.initialized = false;

            this.text = (routine) ? routine.text : "";

            let index = (routine) ? routine.types.findIndex(x => x.id == this.ROUTINETYPES.TASKROUTINE) : -1;
            this.isTaskRoutine = (index > -1) ? true : false;

            this.repeats.value = (routine) ? clone(routine.repeats) : [],
            this.repeats.added = [];
            this.repeats.updated = [];
            this.repeats.deletedIDs = [];

            this.initialized = true;
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
        addRepeatClicked() {
            let repeats = sortAsc(this.repeats.value, 'id');
            let newRepeat = this.plannerStore.createRepeat();
            newRepeat.id = (repeats.length > 0 && repeats[0].id < 0) ? repeats[0].id - 1 : -1;
            this.repeats.value.unshift(newRepeat);
        },
        saveRepeat(repeat) {
            let _repeat = clone(repeat);
            replaceItem(_repeat, this.repeats.value);
            
            let updatedRepeat = clone(repeat);
            addOrReplaceItem(updatedRepeat, this.repeats.updated);

            this.selectedRepeatID = undefined;
        },
        save() {
            if (this.text.trim()) {
                let model = {
                    id: this.id,
                    text: this.text,
                    isTaskRoutine: this.isTaskRoutine
                };
                saveRoutine(model);
                this.$emit("closeItemModal");
            }
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
        isTaskRoutine() {
            if (this.initialized && this.id > -1) {
                this.store.toggleIsTaskRoutine(this.id, this.isTaskRoutine);
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