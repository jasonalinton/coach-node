<template>
    <div class="modal-dialog modal-xl modal-fullscreen-md-down modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" :id="`routine-${id}-ModalLabel`">{{ (routine) ? routine.id : "" }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <div class="container">
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
                    <div class="col-4">
                        <span class="form-head">Todos</span>
                    </div>
                    <div class="col-4 d-flex flex-column">
                        <span class="form-head">Repetition</span>
                        <div>
                            <RepeatRoutineControl v-for="repeat in repeats.value" :key="repeat.id"
                                                  :repeat="repeat" :itemID="id" itemType="routine"
                                                  @saveRepeat="saveRepeat"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" @click="save()">Save changes</button>
        </div>
        </div>
    </div>
</template>

<script>
import { saveRoutine } from '../../../../api/routineAPI';
import RepeatRoutineControl from '../component/RepeatRoutineControl.vue';
import { clone, replaceItem, addOrReplaceItem } from '../../../../../utility';

export default {
    name: "RoutineFormModal",
    components: { RepeatRoutineControl },
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
        saveRepeat(repeat) {
            let _repeat = clone(repeat);
            _repeat.startRepeat = _repeat.startRepeat.value;
            _repeat.endRepeat = _repeat.endRepeat.value;
            replaceItem(_repeat, this.repeats.value);
            
            let updatedRepeat = clone(repeat);
            addOrReplaceItem(updatedRepeat, this.repeats.updated);
        },
        save() {
            let model = {
                id: this.id,
                text: this.text,
            };
            saveRoutine(model);
            this.$emit("closeItemModal");
        }
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

.form-head {
    font-size: 20px;
    text-align: start;
    width: 100%;
}
</style>