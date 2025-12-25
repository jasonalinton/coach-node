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
                <div v-if="showButtons" class="d-flex flex-row mt-1 justify-content-end">
                    <button type="button" @click="saveBlurb">Save</button>
                    <button class="ms-1" type="button" @click="cancelBlurb">Cancel</button>
                </div>
            </div>
            <div class="d-flex flex-column">
                <div v-for="blurb in blurbs_Sorted" :key="blurb.id"
                     class="blurb cursor-default d-flex flex-column mt-2"
                     :class="{ selected: blurb.id == selectedID}"
                     @click="editBlurb(blurb.id)">
                    <!-- <span class="text-start">{{ getDateString(blurb.datetime) }}</span> -->
                    <span class="text-start">{{ blurb.text }}</span>
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
            title: undefined,
            text: undefined,
            selectedID: undefined,
            isShown: true,
            showButtons: false,
            showTextarea: false,
        }
    },
    created: function() {
       
    },
    computed: {
        blurbs_Sorted() {
            return sortAsc([...this.blurbs], "position");
        }
    },
    methods: {
        reset,
        onAddBlurb,
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
}

function onAddBlurb() {
    this.reset();
    this.showTextarea = true;
}

function editBlurb(id) {
    this.selectedID = id;

    let index = this.blurbs.findIndex(x => x.id == id);
    if (index > -1) {
        let blurb = this.blurbs[index];
        this.text = blurb.text;
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
        datetime: new Date()
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
}

.blurb.selected {
    border: #979797 solid 1px;
}

button {
    height: 25px;
    background-color: #BAD8F1;
    border: #3B99FC solid 1px;
    border-radius: 4px;
    font-size: 14px;
    line-height: 16px;
}
</style>