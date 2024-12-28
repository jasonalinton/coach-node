<template>
    <div v-if="todo" class="todo d-flex flex-row justify-content-between align-items-center" 
            :class="[{ complete: checked }]"
            :style="{ 'font-size': fontSize }">
        <ItemCheckbox class="checkbox align-self-start" 
                        :checked="checked" 
                        @onChecked="markComplete" 
                        @onUnchecked="markIncomplete">
        </ItemCheckbox>
        <div class="d-flex flex-fill" :class="{ 'flex-column': points}">
            <!-- <span v-if="iteration.points" class="points">{{ iteration.points }} pts</span>         -->
            <span class="text">{{ todo.text }}</span>
        </div>
        <div class="button-group d-flex flex-column justify-content-between">
            <img class="icon-button" 
                    src='/icon/delete-button.png' width="16" height="16"
                    @click="unmapTodo"/>
        </div>
    </div>
</template>

<script>
import ItemCheckbox from '../../component/ItemCheckbox.vue';
import { today } from '../../../../../../utility/timeUtility';

export default {
    name: 'GoalTimeframeTodoItem',
    components: { ItemCheckbox },
    props: {
        todoID: Number,
        goalTimePairTodoID: Number,
        completedAt: String,
        size: {
            type: String,
            default: "sm"
        }
    },
    data: function () {
        return {
            plannerStore: undefined,
            goalStore: undefined,
            todoStore: undefined
        }
    },
    created: async function() {
        let plannerStore = await import(`@/store/plannerStore`);
        this.plannerStore = plannerStore.usePlannerStore();

        let goalStore = await import(`@/store/goalStore`);
        this.goalStore = goalStore.useGoalStore();

        let todoStore = await import(`@/store/todoStore`);
        this.todoStore = todoStore.useTodoStore();
    },
    computed: {
        selectedDate() {
            if (this.plannerStore) {
                return this.plannerStore.selectedDate;
            }
            return today();
        },
        todo() {
            if (this.todoStore) {
                let todo = this.todoStore.getItem(this.todoID);
                return todo;
            }
            return undefined;
        },
        points() {
            return undefined;
        },
        checked() {
            return (this.completedAt) ? true : false;
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
        markComplete() {
            this.todoStore.toggleGoalTimePairTodoCompletion(this.goalTimePairTodoID, this.selectedDate)
        },
        markIncomplete() {
            this.todoStore.toggleGoalTimePairTodoCompletion(this.goalTimePairTodoID, null)
        },
        unmapTodo() {
            this.goalStore.unmapTodoFromGoalTimePair(this.goalTimePairTodoID);
        }
    },
}

</script>

<style scoped>
.todo {
    background-color: white;
    /* max-height: 40px; */
    user-select: none;
    padding: 4px 0px;
}

.complete span {
    text-decoration: line-through;
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

.todo {
    padding-left: 12px;
}

.todo:hover .button-group {
    visibility: visible;
    margin-right: 10px;
}

.todo:hover {
    background-color: #F5F5F5;
}

.todo .points {
    font-size: 10px;
    color: #747474;
}

.todo .text {
    /* height: 14px;
    line-height: 15px; */
    line-height: 22px;
}
</style>