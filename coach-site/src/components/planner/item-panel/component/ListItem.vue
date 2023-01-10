<template>
    <div> 
        <div class="iteration d-flex flex-row justify-content-between align-items-center" :class="[{ complete: checked, unplanned: isUnplanned }]"
             :style="{ 'font-size': fontSize }"
             draggable @dragstart="onDragStart($event)" @dragend="onDragEnd($event)">
            <ItemCheckbox class="checkbox align-self-start" 
                          :checked="checked" 
                            @onChecked="markComplete" 
                            @onUnchecked="markIncomplete"
                            @onDelete="onDelete">
            </ItemCheckbox>
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
</template>

<script>
import ItemCheckbox from './ItemCheckbox.vue';
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
    name: 'ListItem',
    components: { 
        ItemCheckbox
    },
    props: {
        iteration: Object,
        parent: Object,
        parentType: String,
        isUnplanned: Boolean,
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
        onEdit,
        onDelete,
        onDragStart,
        onDragEnd
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

function onEdit() {
    let iteration =  clone(this.iteration);
    delete iteration.__typename;
    
    this.$emit('onEdit', iteration);
}

function onDelete() {
    this.$emit('onDelete', this.iteration);
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