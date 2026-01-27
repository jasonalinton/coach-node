<template>
    <div class="blurb-form-control d-flex flex-column">
        <div class="header d-flex flex-column"
             @click="isShown = !isShown"
             @mouseover="hovered = true">
            <div class="d-flex flex-row justify-content-between">
                <div class="d-flex flex-row">
                    <span class="form-head text-start">{{ header }}</span>
                    <img class="icon-button ms-1 mt-auto mb-auto" src="/icon/add-button.png" :width="14" :height="14" 
                         @click.stop="onAddBlurb" />
                </div>
                <img v-if="!isShown" class="caret mt-auto mb-auto me-2" 
                        src='/icon/caret-right.png' width="5" height="8"/>
                <img v-if="isShown" class="caret mt-auto mb-auto me-2" 
                        src='/icon/caret-down.png' width="8" height="5"/>
            </div>
            <hr/>
        </div>
        <div v-if="isShown" class="d-flex flex-column">
            <div v-if="showTextarea" class="d-flex flex-column gap-2">
                <input v-if="showTitle" class="textbox text" type="text" placeholder="Title"
                       v-model.lazy.trim="title" 
                       spellcheck="true"/>
                <textarea class="textarea" ref="textbox"
                          v-model.trim="text"
                          v-on:keyup.enter.ctrl="saveBlurb"
                          v-on:keyup.esc.stop="cancelBlurb"
                          :placeholder="placeholder"
                          spellcheck="true"
                          @focus="showButtons = true"
                          @blur="onTextareaBlur">
                </textarea>
                <!-- Goal-TimePair -->
                <div class="d-flex flex-column mt-2">
                    <span class="label text-start">Goal-TimePair IDs</span>
                    <input class="textbox" type="number" min="1"
                                v-on:keyup.enter="addGoalTimePair"
                                spellcheck="true"/>
                    <div class="d-flex flex-column">
                        <div v-for="goalTimePairID in goalTimePairIDs" :key="goalTimePairID" class="d-flex flex-column">
                            <div class="goal-time-pair d-flex justify-content-between">
                                <span>{{ goalTimePairID }}</span>
                                <button class="btn-close mt-auto mb-auto" type="button" aria-label="close"
                                        @click.stop="removeGoalTimePair(goalTimePairID)"></button>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Goal-TimePair-Todo -->
                <div class="d-flex flex-column mt-2">
                    <span class="label text-start">Goal-TimePair-Todo IDs</span>
                    <input class="textbox" type="number" min="1"
                                v-on:keyup.enter="addGoalTimePairTodo"
                                spellcheck="true"/>
                    <div class="d-flex flex-column">
                        <div v-for="goalTimePairTodoID in goalTimePairTodoIDs" :key="goalTimePairTodoID" class="d-flex flex-column">
                            <div class="goal-time-pair d-flex justify-content-between">
                                <span>{{ goalTimePairTodoID }}</span>
                                <button class="btn-close mt-auto mb-auto" type="button" aria-label="close"
                                        @click.stop="removeGoalTimePairTodo(goalTimePairTodoID)"></button>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Save Button -->
                <div v-if="showButtons" class="d-flex flex-row mt-1 justify-content-end">
                    <button type="button" @click="saveBlurb">Save</button>
                    <button class="ms-1" type="button" @click="cancelBlurb">Cancel</button>
                </div>
            </div>
            <!-- Blurb Card -->
            <div class="d-flex flex-column">
                <div v-for="blurb in blurbs_Sorted" :key="blurb.id"
                     class="blurb cursor-default d-flex flex-column mt-2"
                     :class="{ selected: blurb.id == selectedID}"
                     @click="editBlurb(blurb.id)">
                    <!-- <span class="text-start">{{ getDateString(blurb.datetime) }}</span> -->
                    <span class="text-start">{{ blurb.text }}</span>
                    <!-- Goal-TimePair IDs -->
                    <div v-if="blurb.goalTimePairs.length > 0" class="goal-timepair d-flex flex-row gap-2">
                        <span v-for="id in blurb.goalTimePairs.map(x => x.id)" :key="id">{{ id }}</span>
                    </div>
                    <!-- Goal-TimePair-Todo IDs -->
                    <div v-if="blurb.goalTimePairTodos.length > 0" class="goal-timepair-todos d-flex flex-row gap-2">
                        <span v-for="id in blurb.goalTimePairTodos.map(x => x.id)" :key="id">{{ id }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getShortDateString } from '../../../../../utility/timeUtility';
import { sortAsc } from '../../../../../utility';

export default {
    name: 'BlurbFormControl',
    components: {  },
    props: {
        header: {
            type: String,
            default: () => "Blurb"
        },
        blurbs: {
            type: Array,
            default: () => []
        },
        placeholder: {
            type: String,
            default: () => ""
        },
        showTitle: {
            type: Boolean,
            default: () => false
        }
    },
    data: function () {
        return {
            universalStore: undefined,
            title: undefined,
            text: undefined,
            selectedID: undefined,
            isShown: true,
            showButtons: false,
            showTextarea: false,
            goalTimePairIDs: [],
            goalTimePairTodoIDs: []
        }
    },
    created: async function() {
        let universalStore = await import(`@/store/universalStore`);
        this.universalStore = universalStore.useUniversalStore();
    },
    computed: {
        blurbs_Sorted() {
            let blurbs = [];
            if (this.universalStore) {
                this.blurbs.forEach(_blurb => {
                    let blurb = this.universalStore.getBlurb(_blurb.id);
                    if (blurb) {
                        blurbs.push(blurb);
                    }
                })
            }
            return sortAsc([...blurbs], "position");
        }
    },
    methods: {
        reset,
        onAddBlurb,
        addGoalTimePair,
        removeGoalTimePair,
        addGoalTimePairTodo,
        removeGoalTimePairTodo,
        editBlurb,
        cancelBlurb,
        saveBlurb,
        onTextareaBlur,
        getDateString(datetime) {
            if (datetime) {
                let date = new Date(datetime);
                return getShortDateString(date);
            }
            return "";
        },
    },
}

function reset() {
    this.selectedID = undefined;
    this.title = undefined;
    this.text = undefined;
    this.goalTimePairIDs = [];
    this.goalTimePairTodoIDs = [];
}

function addGoalTimePair(e) {
    var index = this.goalTimePairIDs.findIndex(x => x == e.target.value);
    if (index == -1) {
        this.goalTimePairIDs.push(e.target.value);
    }
    e.target.value = undefined;
}

function removeGoalTimePair(id) {
    let index = this.goalTimePairIDs.findIndex(x => x == id);
    this.goalTimePairIDs.splice(index, 1);
}

function addGoalTimePairTodo(e) {
    var index = this.goalTimePairTodoIDs.findIndex(x => x == e.target.value);
    if (index == -1) {
        this.goalTimePairTodoIDs.push(e.target.value);
    }
    e.target.value = undefined;
}

function removeGoalTimePairTodo(id) {
    let index = this.goalTimePairTodoIDs.findIndex(x => x == id);
    this.goalTimePairTodoIDs.splice(index, 1);
}

function onAddBlurb() {
    this.reset();
    this.showTextarea = true;
}

function editBlurb(id) {
    this.selectedID = id;

    let index = this.blurbs_Sorted.findIndex(x => x.id == id);
    if (index > -1) {
        let blurb = this.blurbs_Sorted[index];
        this.text = blurb.text;
        this.title = blurb.title;
        this.goalTimePairIDs = [ ...blurb.goalTimePairs.map(x => x.id) ];
        this.goalTimePairTodoIDs = [ ...blurb.goalTimePairTodos.map(x => x.id) ];
        this.showTextarea = true;
        this.$refs["textbox"].focus();
    }
}

function cancelBlurb() {
    this.reset();
    this.$refs["textbox"].blur();
    this.showButtons = false;
    this.showTextarea = false;
}

function saveBlurb() {
    let blurb = {
        id: undefined,
        title: this.title,
        text: this.text,
        datetime: (!this.selectedID) ? new Date() : undefined,
        goalTimePairIDs: this.goalTimePairIDs,
        goalTimePairTodoIDs: this.goalTimePairTodoIDs,
    };

    if (!this.selectedID) {
        this.$emit("addBlurb", blurb);
    } else {
        blurb.id = this.selectedID;
        this.$emit("saveBlurb", blurb);
    }
    this.cancelBlurb();
}

function onTextareaBlur() {
    if (!this.text) {
        this.showButtons = false;
        this.showTextarea = false;
        this.selectedID = undefined;
    }
}

</script>

<style scoped>

.form-head {
    font-size: 20px;
    text-align: start;
    width: 100%;
    display: inline-block;
    font-weight: 500;
}

.header {
    cursor: default;
}

.header:hover .form-head {
    color: var(--form-header-hover);
}

.caret {
    visibility: hidden;
}

.header:hover .caret {
    visibility: visible;
}

.icon-button {
    border-radius: 8px;
    width: 16px;
}

.icon-button:hover {
    background-color: rgba(60, 64, 67, .10);
}

hr {
    margin-top: 3px;
    margin-bottom: 3px;
    color: #8A8A8A;
}

.blurb {
    padding: 8px;
    font-size: 14px;
    background-color: #F5F5F5;
    border-radius: 4px;
    border: transparent solid 1px;
    white-space: pre-wrap;
}

.blurb.selected {
    border: #979797 solid 1px;
}

button:not(.btn-close) {
    height: 25px;
    background-color: #BAD8F1;
    border: #3B99FC solid 1px;
    border-radius: 4px;
    font-size: 14px;
    line-height: 16px;
}

button.btn-close {
    font-size: 8px;
    visibility: hidden;
}

.goal-time-pair {
    color: #3B99FC;
    font-size: 14px;
}

.goal-time-pair:hover {
    background-color: #EFF6FC;
}

.goal-time-pair:hover button.btn-close {
    visibility: visible;
}
</style>