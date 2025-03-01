<template>
    <div> 
        <div class="todo d-flex flex-row justify-content-between align-items-center" 
             :class="[{ complete: checked, unplanned: isUnplanned }]"
             :style="{ 'font-size': fontSize }"
             draggable="true" @dragstart="onDragStart($event)" @dragend="onDragEnd($event)">
            <ItemCheckbox class="checkbox align-self-start" 
                          :checked="checked" 
                            @onChecked="markComplete" 
                            @onUnchecked="markIncomplete"
                            @onDelete="onDelete">
            </ItemCheckbox>
            <div class="d-flex flex-fill" :class="{ 'flex-column': todo.points}">
                <span v-if="todo.points" class="points">{{ todo.points }} pts</span>        
                <span class="text">{{ todo.text }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import ItemCheckbox from './ItemCheckbox.vue';

export default {
    name: 'TodoItem',
    components: { 
        ItemCheckbox
    },
    props: {
        todo: Object,
        parent: Object,
        parentType: String,
        isUnplanned: Boolean,
        size: String,
    },
    data: function () {
        return {
            todoStore: undefined,
            isAttempted: false
        }
    },
    created: async function() {
        let todoStore = await import(`@/store/todoStore`);
        this.todoStore = todoStore.useTodoStore();
    },
    computed: {
        checked() {
            if (this.isAttempted) {
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
        onDelete,
        onDragStart,
        onDragEnd
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

.checkbox {
    margin: auto 0;
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

.iteration:active:hover {
    box-shadow: 0px -3px 5px 2px rgba(0,0,0,.5);
}

.iteration .points {
    font-size: 10px;
    color: #747474;
}

.iteration .text {
    /* height: 14px;
    line-height: 15px; */
    line-height: 22px;
}
</style>