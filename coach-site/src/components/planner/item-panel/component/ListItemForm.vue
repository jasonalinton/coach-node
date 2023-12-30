<template>
    <div> 
        <div class="iteration d-flex flex-row justify-content-between align-items-center" :class="[{ complete: checked}]"
             :style="{ 'font-size': fontSize }">
            <ItemCheckbox class="checkbox align-self-start" 
                          :checked="checked" 
                            @onChecked="markComplete" 
                            @onUnchecked="markIncomplete"
                            @onDelete="onDelete">
            </ItemCheckbox>
             <form :id="`iteration-form`" class="pb-2" v-on:submit.prevent>
                <!-- Title/Text -->
                <div class="form-group mt-3">
                    <input class="title textbox" type="text" ref="text" placeholder="Title"
                            v-model.lazy.trim="iteration.text"
                            v-on:keyup.enter="save(iteration)"
                            spellcheck/>
                </div>
                <!-- Time -->
                <div class="form-group mt-1">
                    <DateSelector class="mt-3" :date="iteration.startAt" @onChange="iteration.startAt = $event"></DateSelector>
                    <span v-if="!iteration.startAt" class="error float-start mb-2">Iteration must have start</span>
                    <DateSelector class="mt-3" :date="iteration.endAt" @onChange="iteration.endAt = $event"></DateSelector>
                </div>
            </form>
            <div>
                <span class="flex-fill">{{ iteration.text }}</span>
                <div class="button-group d-flex flex-column justify-content-between">
                    <!-- <img class="icon-button" src='/icon/add-button.png' width="16" height="16"/> -->
                    <img class="icon-button" 
                        src='/icon/edit-button.png' width="16" height="16"
                            @click="onEdit"/>
                    <img class="icon-button" 
                        src='/icon/delete-button.png' width="16" height="16"
                            @click="onDelete"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ItemCheckbox from './ItemCheckbox.vue';
import { clone } from '../../../../../utility'
import DateSelector from '../../../controls/select/DateSelector.vue'

/* 
Parent Types
    defaultEvent
    routineEvent
    metric
    goal
    todo
    routine
*/

/* Sizes
    sm
    md
*/

export default {
    name: 'ListItemForm',
    components: { 
        ItemCheckbox, DateSelector
    },
    data: function() {
        return {
            iterationStore: undefined,
        }
    },
    created: async function() {
        let iterationStore = await import(`@/store/iterationStore`);
        this.iterationStore = iterationStore.useIterationStore();
    },
    props: {
        iteration: Object,
        parent: Object,
        parentType: String,
        size: String,
    },
    computed: {
        checked() {
            if (this.iteration.attemptedAt) {
                return true;
            } else {
                return false
            }
        },
        fontSize() {
            if (this.size && this.size == "sm") {
                return "14px";
            } else if (this.size && this.size == "md") {
                return "14px";
            } else {
                return "14px"
            }
        }
    },
    methods: {
        markComplete,
        markIncomplete,
        save,
        onEdit,
        onDelete,
    }
}

function markComplete() {
    let now = new Date();
    this.iteration.attemptedAt = now;
    this.iteration.completedAt = now;

    this.$emit('markComplete', this.iteration);
}

function markIncomplete() {
    this.iteration.attemptedAt = null;
    this.iteration.completedAt = null;

    this.$emit('markIncomplete', this.iteration);
}

function save(iteration) {
    var title = iteration.text.trim();
    if (title == "") return;
    if (!iteration.startAt) return;

    this.iterationStore.updateIteration(iteration.id, iteration.text, 
        iteration.startAt, iteration.endAt);

    this.close();
}

function onEdit() {
    let iteration =  clone(this.iteration);
    delete iteration.__typename;
    
    this.$emit('onEdit', iteration);
}

function onDelete() {
    this.$emit('onDelete', this.iteration);
}
</script>

<style scoped>
.iteration {
    background-color: white;
    /* max-height: 40px; */
    user-select: none;
}

.complete span {
    text-decoration: line-through;
}

 /* .box-shadow {
    box-shadow: 0px -3px 5px 4px rgba(0,0,0,.5);
    width: 100%;
    height: 40px;
    position: absolute;
    bottom: 0;
} */

.checkbox:hover {
    background-color: rgba(248, 248, 248, 1);
    border-radius: 24px;
}

.icon-button {
    border-radius: 8px;
    width: 16px;
}

.icon-button:hover {
    background-color: rgba(60, 64, 67, .10);
}

.button-group {
    width: 16px;
    margin: 0px 8px;
    visibility: hidden;
    /* margin-top: -4px; */
    z-index: 5;
    /* max-height: 40px; */
}

.iteration:hover .button-group {
    visibility: visible;
    margin-right: 10px;
}

.iteration:hover {
    background-color: #F5F5F5;
    /* border-top: 1px solid #DCDCDC; */
    /* box-shadow: 0px -3px 5px 4px rgba(0,0,0,.5); */
    /* box-shadow: 0px -3px 5px 2px rgba(0,0,0,.5); */
}

.iteration:active:hover {
    box-shadow: 0px -3px 5px 2px rgba(0,0,0,.5);
}

.iteration span {
    /* height: 14px;
    line-height: 15px; */
    line-height: 22px;
}
</style>