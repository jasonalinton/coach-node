<template>
    <div class="blurb-form-control d-flex flex-column">
        <div class="header d-flex flex-column"
             @click="isShown = !isShown"
             @mouseover="hovered = true">
            <div class="d-flex flex-row justify-content-between">
                <span class="form-head text-start">{{ title }}</span>
                <img v-if="!isShown" class="caret mt-auto mb-auto me-2" 
                        src='/icon/caret-right.png' width="5" height="8"/>
                <img v-if="isShown" class="caret mt-auto mb-auto me-2" 
                        src='/icon/caret-down.png' width="8" height="5"/>
            </div>
            <hr/>
        </div>
        <div v-if="isShown" class="d-flex flex-column">
            <textarea class="textarea" 
                      v-model.trim="text"
                      v-on:keyup.enter.ctrl="addBlurb"
                      :placeholder="placeholder"
                      spellcheck>
            </textarea>
            <div class="d-flex flex-column">
                <div v-for="blurb in blurbs" :key="blurb.id"
                     class="blurb d-flex flex-column mt-2">
                    <!-- <span class="text-start">{{ getDateString(blurb.datetime) }}</span> -->
                    <span class="text-start">{{ blurb.text }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getShortDateString } from '../../../../../utility/timeUtility'; 

export default {
    name: 'BlurbFormControl',
    components: {  },
    props: {
        title: {
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
        }
    },
    data: function () {
        return {
            text: undefined,
            isShown: true
        }
    },
    created: function() {
       
    },
    methods: {
        addBlurb,
        getDateString(datetime) {
            if (datetime) {
                let date = new Date(datetime);
                return getShortDateString(date);
            }
            return "";
        },
    },
}

function addBlurb() {
    this.$emit("addBlurb", this.text);
    this.text = undefined;
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

hr {
    margin-top: 3px;
    margin-bottom: 3px;
    color: #565656
}

.blurb {
    padding: 8px;
    font-size: 14px;
    background-color: #F5F5F5;
    border-radius: 4px;
}
</style>