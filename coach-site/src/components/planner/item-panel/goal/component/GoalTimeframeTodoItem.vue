<template>
    <div v-if="todo" class="goal-timeframe-todo d-flex flex-column justify-content-between"
            :class="[{ complete: checked }]"
            :style="{ 'font-size': fontSize }"
            @click.stop="showToolbar = !showToolbar">
        <div class="d-flex justify-content-between align-items-center">
            <!-- <ItemCheckbox class="checkbox align-self-start" 
                            :checked="checked" 
                            @onChecked="markComplete" 
                            @onUnchecked="markIncomplete">
            </ItemCheckbox> -->
            <img class="icon me-2" :class="{ selected: showTodos }"
                            src="/icon/todo-icon.png"
                            width="30" height="30" />
            <div class="d-flex flex-column">
                <div class="d-flex flex-fill" :class="{ 'flex-column': points}">
                    <!-- <span v-if="iteration.points" class="points">{{ iteration.points }} pts</span>         -->
                    <span class="text">{{ todo.text }}</span>
                </div>
                <div v-if="showToolbar" class="toolbar d-flex flex-row align-items-center gap-1">
                        <span class="points" :class="{ selected: showTasks }"
                            @click.stop="pointsClicked">{{`${points} pts`}}</span>
                        <img class="icon" :class="{ selected: showChildren }"
                            src="/icon/child-icon.png"
                            width="18" height="18"
                            @click.stop="childrenClicked" />
                        <!-- <div class="d-flex gap-1">
                            <img class="icon" :class="{ selected: showDay }"
                                src="/icon/calendar-day.png"
                                width="16" height="16"
                                @click.stop="showDay = !showDay" />
                            <img class="icon" :class="{ selected: showWeek }"
                                src="/icon/calendar-week.png"
                                width="16" height="16"
                                @click.stop="showWeek = !showWeek" />
                            <img class="icon" :class="{ selected: showMonth }"
                                src="/icon/calendar-month.png"
                                width="16" height="16"
                                @click.stop="showMonth = !showMonth" />
                        </div> -->
                    </div>            
            </div>
            <div class="d-flex">
                <div class="button-group d-flex flex-column justify-content-between">
                    <img class="attempted button" width="14" height="14"
                            :src="`/icon/thumbs-up-dark-2.png`"
                            @click="markAttempted()"/>
                    <img class="icon-button" 
                            src='/icon/delete-button.png' width="16" height="16"
                            @click="unmapTodo"/>
                </div>            
            </div>
        </div>
        <div v-if="showToolbar" class="progress-bar d-flex flex-row justify-content-start">
            <span class="bar"></span>
        </div>
        <div v-if="showTasks" class="d-flex flex-column">
            <span>Tasks</span>
        </div>
        <div v-if="showChildren" class="d-flex flex-column">
            <GoalTimeframeTodoItem v-for="childID in childIDs" :key="childID"
                                   :todoID="childID" 
                                   @click.stop/>
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
            todoStore: undefined,
            isExpanded: false,
            showToolbar: false,
            showTasks: false,
            showTodos: false,
            showChildren: false,
            showDay: false,
            showWeek: false,
            showMonth: false,
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
        },
        showExpander() {
            return (this.childIDs.length > 0);
        },
        points() {
            return 4;
        },
        childIDs() {
            return (this.todo) ? this.todo.childIDs : [];
        }
    },
    methods: {
        markComplete() {
            this.todoStore.toggleGoalTimePairTodoCompletion(this.goalTimePairTodoID, this.selectedDate)
        },
        markIncomplete() {
            this.todoStore.toggleGoalTimePairTodoCompletion(this.goalTimePairTodoID, null)
        },
        markAttempted() {
            this.todoStore.createTask(this.todoID, this.selectedDate);
        },
        unmapTodo() {
            this.goalStore.unmapTodoFromGoalTimePair(this.goalTimePairTodoID);
        },
        expanderClicked,
        pointsClicked,
        childrenClicked,
    },
}

function expanderClicked() {
    if (this.isExpanded) {
        this.isExpanded = false;
        this.showTasks = false;
        this.showChildren = false;
    } else {
        this.showTasks = false;
        this.showChildren = true;
        this.showToolbar = true;
        this.isExpanded = true;
    }
}

function pointsClicked() {
    this.showChildren = false;
    this.isExpanded = false;

    this.showTasks = !this.showTasks;
}

function childrenClicked() {
    this.showTasks = false;

    this.showChildren = !this.showChildren;
    this.isExpanded = this.showChildren;
}

</script>

<style scoped>
.goal-timeframe-todo {
    background-color: white;
    /* max-height: 40px; */
    user-select: none;
    padding: 4px 0px;
    padding-left: 20px;
}

.goal-timeframe-todo:hover {
    background-color: #F5F5F5;
}

.complete span {
    text-decoration: line-through;
}

.todo-icon {
    width: 20px;
    height: 20px;
}

.checkbox {
    margin: auto 0;
}

.checkbox:hover {
    background-color: rgba(248, 248, 248, 1);
    border-radius: 24px;
}

.goal-timeframe-todo .points {
    font-size: 10px;
    color: #747474;
    line-height: 18px;
    padding: 0px 4px;
}

.goal-timeframe-todo .text {
    /* height: 14px;
    line-height: 15px; */
    line-height: 22px;
    color: #969696;
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

.goal-timeframe-todo:hover .button-group {
    visibility: visible;
    margin-right: 10px;
}

.progress-bar {
    background-color: rgba(13,110,253,.25);
    height: 3px;
}

.progress-bar span {
    height: 3px;
}

.bar {
    width: 50%;
    background-color: #3B99FC;
}
</style>