<template>
    <div v-if="todo" class="wrapper d-flex flex-column">
        <div class="todo-form-item d-flex flex-row"
             @click="repeatsShown = !repeatsShown">
            <img src="/icon/todo-icon.png" width="18" height="18"/>
            <div class="d-flex flex-column flex-grow-1">
                <div class="d-flex flex-row justify-content-between flex-grow-1">
                    <div class="d-flex flex-row">
                        <span class="id">{{ todo.id }}</span>
                        <span class="text">{{ todo.text }}</span>
                    </div>
                    <button class="btn-close mt-auto mb-auto" type="button" aria-label="close"
                            @click.stop="$emit('removeItem')"></button>
                </div>
                <!-- <div class="d-flex flex-row">
                    <span class="metrics">{{ metricString }}</span>
                    <span class="timeframes">{{  }}</span>
                </div> -->
            </div>
        </div>
        <div v-if="repeatsShown" >
            <RepeatControl v-for="repeat in repeats" :key="repeat.id"
                           :repeat="repeat" :itemID="id" itemType="todo"/>
        </div>
    </div>
</template>

<script>
import { useTodoStore } from "@/store/todoStore";
import { clone, listToString } from "../../../../../utility";
import RepeatControl from "../component/RepeatControl.vue";

export default {
    name: "TodoFormItem",
    components: { RepeatControl },
    props: {
        id: Number,
        parentID: Number,
        parentType: String,
        displayedRepeatID: Number,
        parentRepeatIDs: Array,
        routineRepeatIDs: Array
    },
    data: function() {
        return {
            store: null,
            repeatsShown: false 
        }
    },
    created: async function() {
        this.store = useTodoStore();
    },
    computed: {
        todo() {
            if (this.store) {
                let todo = this.store.getItem(this.id);
                return todo;
            } else {
                return null;
            }
        },
        metricString() {
            return listToString(this.todo.metrics, "text");
        },
        repeats() {
            let repeats = [];
            if (["goal", "todo"].includes(this.parentType)) {
                repeats = this.todo.repeats.filter(x => this.parentRepeatIDs.includes(x.id));
            } else if (this.parentType == "routine") {
                repeats = this.todo.repeats.filter(x => this.routineRepeatIDs.includes(x.routineRepeatID));
            }
            if (repeats) {
                return repeats.filter(x => clone(x));
            } else {
                return [];
            }
        },
        repeat() {
            if (this.displayedRepeatID) {
                let repeat = undefined;
                if (["goal", "todo"].includes(this.parentType)) {
                    repeat = this.todo.repeats.find(x => x.id == this.displayedRepeatID);
                } else if (this.parentType == "routine") {
                    repeat = this.todo.repeats.find(x => x.routineRepeatID == this.displayedRepeatID);
                }
                if (repeat) {
                    return clone(repeat);
                } else {
                    return null;
                }
            } else {
                return null;
            }
        }
    },
    methods: {
        
    },
}
</script>

<style scoped>
.wrapper {
    /* height: 40px; */
    padding: 4px 2px;
    line-height: 18px;
    text-align: start;
    font-size: 14px;
}

.wrapper:hover {
    background-color: #EFF6FC;
}

img {
    /* margin-top: 1px; */
    margin-right: 2px;
}

.id {
    color: #bcbcbc;
    margin-right: 3px;
}

.text {
    color: #3B99FC;
}

.metric {
    color: #747474;
}

button.btn-close {
    font-size: 8px;
    visibility: hidden;
}

.wrapper:hover button.btn-close {
    visibility: visible;
}
</style>