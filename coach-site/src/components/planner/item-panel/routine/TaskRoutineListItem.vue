<template>
    <div v-if="todo" class="task-routine-list-item-parent d-flex flex-column">
        <div class="task-routine-list-item d-flex flex-row justify-content-between align-items-center flex-grow-1" 
             :class="[{ complete: checked }]">
            <div class="d-flex flex-row align-items-center flex-grow-1 justify-content-between">
                <div class="d-flex flex-row">
                    <ItemCheckbox class="checkbox align-self-start" 
                                  :style="{ 'padding-left': `${(level-1)*padding}px` }"
                                  :checked="checked" 
                                  @onChecked="markComplete" 
                                  @onUnchecked="markIncomplete"
                                  @onDelete="onDelete">
                    </ItemCheckbox>
                    <div class="d-flex" :class="{ 'flex-column': points}">
                        <span v-if="points" class="points">{{ points }} pts</span>
                        <div class="d-flex flex-row align-items-center"
                             @click="toggleChildren">
                            <div v-if="isParent" class="caret d-flex flex-row me-2">
                                <img v-if="!showChildren" class="caret-right" 
                                     src='/icon/caret-right.png' width="5" height="8"/>
                                <img v-if="showChildren" class="caret-down" 
                                     src='/icon/caret-down.png' width="8" height="5"/>
                            </div>
                            <span class="text flex-fill">{{ todo.text }}</span>
                        </div>           
                    </div>
                </div>
                <img v-if="idRepeat" 
                     class="icon-button" 
                     src='/icon/repeat.png' width="12" height="12"/>
            </div>
        </div>
        <div v-if="showChildren" class="children d-flex flex-column">
            <TaskRoutineListItem v-for="child in children" :key="child.id"
                                  :idTodo="child.id" :idParentRepeat="idRepeat" :idTodo_Root="idTodo_Root"
                                  :level="level+1"/> 
        </div>
    </div>
</template>

<script>
import ItemCheckbox from '../component/ItemCheckbox.vue';
import { TODO_MAPPING_TYPE } from '../../../../model/constants';

export default {
    name: 'TaskRoutineListItem',
    components: { ItemCheckbox },
    props: {
        idTodo: Number,
        idTodo_Root: Number,
        idRoutineRepeat: Number,
        idParentRepeat: Number,
        level: Number,
        parent: Object,
    },
    data: function () {
        return {
            todoStore: undefined,
            iterationStore: undefined,
            showChildren: false,
            padding: 12
        }
    },
    created: async function() {
        let todoStore = await import(`@/store/todoStore`);
        this.todoStore = todoStore.useTodoStore();

        let iterationStore = await import(`@/store/iterationStore`);
        this.iterationStore = iterationStore.useIterationStore();
    },
    computed: {
        todo() {
            if (this.todoStore) {
                let todo = this.todoStore.getItem(this.idTodo);
                return todo;
            }
            return undefined;
        },
        children() {
            if (this.todo) {
                let children = this.todoStore.todos.filter(x => this.todo.childIDs.includes(x.id));
                return children
            }
            return [];
        },
        repeat() {
            if (this.todo) {
                if (this.level == 1) {
                    let repeat = this.todo.repeats.find(x => x.id == idRoutineRepeat);
                    return repeat;
                } else {
                    let repeat = this.todo.repeats.find(x => x.idRoutineRepeat == idRoutineRepeat);
                    return repeat;
                }
            }
            return undefined;
        },
        iteration() {
            if (this.iterationStore) {
                
            }
        },
        rootIteration() {

        },
        idTodoMappingType() {
            return (this.repeat) ? this.repeat.idTodoMappingType : undefined;
        },
        isParent() {
            return this.children.length > 0;
        },
        checked() {
            return false
        },
        points() {
            return 2;
        },
        text() {
            return "";
        },
        idRepeat() {
            return undefined;
        }
    },
    methods: {
        markComplete,
        markIncomplete,
        onEdit,
        onDelete,
        toggleChildren
    },
}

function markComplete() {
    if (this.level == 1) {

    } else {
        if (this.idTodoMappingType == TODO_MAPPING_TYPE.GROUP) {
            /* Just log iteration */

        } else if (this.idTodoMappingType == TODO_MAPPING_TYPE.CLASS) {
            /* Log iteration, Log root iteration, Set root iteration points to 0 */
            
        }
    }
    // let now = new Date().toJSON();
    // this.iteration.attemptedAt = now;
    // this.iteration.completedAt = now;

    // this.iterationStore.toggleCompletion(this.iteration.id, this.iteration.attemptedAt, this.iteration.completedAt);
}

function markIncomplete() {
    // this.iteration.attemptedAt = null;
    // this.iteration.completedAt = null;

    // this.iterationStore.toggleCompletion(this.iteration.id, this.iteration.attemptedAt, this.iteration.completedAt);
}

function onEdit() {
    // let iteration =  clone(this.iteration);
    // delete iteration.__typename;
    
    // this.$emit('onEdit', iteration);
}

function onDelete() {
    // this.iterationStore.deleteIteration(this.iteration.id);
}

function toggleChildren() {
    if (this.isParent) {
        this.showChildren = !this.showChildren;
    }
}

</script>

<style scoped>
.task-routine-list-item {
    background-color: white;
    /* max-height: 40px; */
    user-select: none;
    padding: 4px 0px;
    font-size: 14px;
    text-align: start;
}

.task-routine-list-item.recommended {
    opacity: .5;
}

.task-routine-list-item.unplanned {
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

.task-routine-list-item:hover .button-group {
    visibility: visible;
    margin-right: 10px;
}

.task-routine-list-item:hover {
    background-color: #F5F5F5;
    /* border-top: 1px solid #DCDCDC; */
    /* box-shadow: 0px -3px 5px 4px rgba(0,0,0,.5); */
    /* box-shadow: 0px -3px 5px 2px rgba(0,0,0,.5); */
}

/* I removed this because it was taking long to implement
   (shadow on bottom when clicked) */
.task-routine-list-item:active:hover {
    /* box-shadow: 0px -3px 5px 2px rgba(0,0,0,.5); */
    background-color: #D8D8D8;
}

.task-routine-list-item .points {
    font-size: 10px;
    color: #747474;
}

.task-routine-list-item .text {
    /* height: 14px;
    line-height: 15px; */
    line-height: 22px;
}

.children {
    /* padding-left: 12px; */
    z-index: 2;
}

</style>