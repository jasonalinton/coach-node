<template>
    <div> 
        <div class="iteration d-flex flex-row justify-content-between align-items-center" 
             :class="[{ complete: checked, unplanned: isUnplanned, recommended: iteration.isRecommended }]"
             :style="{ 'font-size': fontSize }"
             draggable @dragstart="onDragStart($event)" @dragend="onDragEnd($event)">
            <div class="d-flex flex-row align-items-center flex-grow-1 justify-content-between">
                <div class="d-flex flex-row">
                    <ItemCheckbox class="checkbox align-self-start" 
                                  :style="{ 'padding-left': `${(level-2)*padding}px` }"
                                  :checked="checked" 
                                  @onChecked="markComplete" 
                                  @onUnchecked="markIncomplete"
                                  @onDelete="onDelete">
                    </ItemCheckbox>
                    <div class="d-flex flex-row align-items-center"
                         @click="toggleChildren">
                        <div v-if="isParent" class="caret d-flex flex-row me-2">
                            <img v-if="!showChildren" class="caret-right" 
                                 src='/icon/caret-right.png' width="5" height="8"/>
                            <img v-if="showChildren" class="caret-down" 
                                 src='/icon/caret-down.png' width="8" height="5"/>
                        </div>
                        <span class="flex-fill">{{ iteration.text }}</span>
                    </div>           

                </div>
                <img v-if="viewModel.repeatID" 
                     class="icon-button" 
                     src='/icon/repeat.png' width="12" height="12"/>
            </div>
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
        <div v-if="showChildren" class="children d-flex flex-column">
            <HierarchicalListItem v-for="vm in viewModel.children" :key="vm.id"
                                  :viewModel="vm"
                                  :level="level+1"/> 
        </div>
    </div>
</template>

<script>
import ItemCheckbox from './ItemCheckbox.vue';
import HierarchicalListItem from '../component/HierarchicalListItem.vue'
import { clone } from '../../../../../utility'

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
    name: 'HierarchicalListItem',
    components: { 
        ItemCheckbox,
        HierarchicalListItem
    },
    props: {
        viewModel: Object,
        level: Number,
        parent: Object,
        parentType: String,
        isUnplanned: Boolean,
        size: String,
    },
    data: function () {
        return {
            iterationStore: undefined,
            iteration: undefined,
            showChildren: false,
            padding: 12
        }
    },
    created: async function() {
        this.iteration = this.viewModel.iterations[0];
        let iterationStore = await import(`@/store/iterationStore`);
        this.iterationStore = iterationStore.useIterationStore();
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
        },
        isParent() {
            return this.viewModel.children.length > 0;
        },
        // percentComplete() {
        //     if (this.isParent) {
        //         let iterations = [];
        //         let count = 1;
        //         this.vm.children.forEach(child => {

        //         });
        //     } else {
        //         return null
        //     }
        // }
    },
    methods: {
        markComplete,
        markIncomplete,
        onEdit,
        onDelete,
        onDragStart,
        onDragEnd,
        toggleChildren
    },
    watch: {
        viewModel() {
            this.iteration = this.viewModel.iterations[0];
        }
    }
}

function toggleChildren() {
    if (this.isParent) {
        this.showChildren = !this.showChildren;
    }
}

function markComplete() {
    let now = new Date().toJSON();
    this.iteration.attemptedAt = now;
    this.iteration.completedAt = now;

    this.iterationStore.toggleCompletion(this.iteration.id, this.iteration.attemptedAt, this.iteration.completedAt);
}

function markIncomplete() {
    this.iteration.attemptedAt = null;
    this.iteration.completedAt = null;

    this.iterationStore.toggleCompletion(this.iteration.id, this.iteration.attemptedAt, this.iteration.completedAt);
}

function onEdit() {
    let iteration =  clone(this.iteration);
    delete iteration.__typename;
    
    this.$emit('onEdit', iteration);
}

function onDelete() {
    this.iterationStore.deleteIteration(this.iteration.id);
}

function onDragStart(ev) {
    let data = {
        id: this.iteration.id,
        type: (this.parentType == "goal") ? "todo" : "task",
        parentType: this.parentType,
        parentID: this.parent.id
    };
    data = JSON.stringify(data);

    console.log("Drag Started");
    ev.target.classList.add("drag");
    ev.dataTransfer.dropEffect = 'move';
    ev.dataTransfer.effectAllowed = 'move';
    ev.dataTransfer.setData("text", data);
}

function onDragEnd(ev) {
    ev.target.classList.remove("drag");
}
</script>

<style scoped>
.iteration {
    background-color: white;
    /* max-height: 40px; */
    user-select: none;
    padding: 4px 0px;
}

.iteration.recommended {
    opacity: .5;
}

.iteration.unplanned {
    background-color: lightpink;
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

.caret {
    min-width: 8px;
}

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

/* I removed this because it was taking long to implement
   (shadow on bottom when clicked) */
.iteration:active:hover {
    /* box-shadow: 0px -3px 5px 2px rgba(0,0,0,.5); */
    background-color: #D8D8D8;
}

.iteration span {
    /* height: 14px;
    line-height: 15px; */
    line-height: 22px;
}

.children {
    /* padding-left: 12px; */
    z-index: 2;
}
</style>