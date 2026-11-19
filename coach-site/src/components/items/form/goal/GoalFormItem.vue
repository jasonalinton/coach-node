<template>
    <div v-if="goal" class="wrapper d-flex flex-column">
        <div class="goal d-flex flex-row"
             @click="repeatsShown = !repeatsShown">
            <img src="/icon/goal-icon.png" width="18" height="18"/>
            <div class="d-flex flex-column">
                <div class="d-flex flex-row">
                    <span class="id">{{ goal.id }}</span>
                    <span class="text" @click.stop="openForm">{{ goal.text }}</span>
                </div>
                <!-- <div class="d-flex flex-row">
                    <span class="metrics">{{ metricString }}</span>
                    <span class="timeframes">{{  }}</span>
                </div> -->
            </div>
        </div>
        <div v-if="repeatsShown" >
            <RepeatControl v-for="repeat in repeats" :key="repeat.id"
                           :repeat="repeat" :itemID="id" itemType="goal"/>
        </div>
    </div>
</template>

<script>
import { useGoalStore } from "@/store/goalStore";
import { clone, listToString } from "../../../../../utility";
import RepeatControl from "../component/RepeatControl.vue";
import { Modal } from "bootstrap";

export default {
    name: "GoalFormItem",
    components: { RepeatControl },
    props: {
        id: Number,
        parentID: Number,
        parentType: String,
        displayedRepeatID: Number,
        routineRepeatIDs: Array
    },
    data: function() {
        return {
            store: null,
            appStore: null,
            repeatsShown: false 
        }
    },
    created: async function() {
        this.store = useGoalStore();
        let appStore = await import(`@/store/appStore`);
        this.appStore = appStore.useAppStore();
    },
    computed: {
        goal() {
            if (this.store) {
                let goal = this.store.getItem(this.id);
                return goal;
            } else {
                return null;
            }
        },
        metricString() {
            return listToString(this.goal.metrics, "text");
        },
        repeats() {
            let repeats = this.goal.repeats
                .filter(x => this.routineRepeatIDs.includes(x.routineRepeatID));
            if (repeats) {
                return repeats.filter(x => clone(x));
            } else {
                return [];
            }
        },
        repeat() {
            if (this.displayedRepeatID) {
                let repeat = this.goal.repeats.find(x => x.routineRepeatID == this.displayedRepeatID);
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
        openForm
    },
}

function openForm() {
    let modalEl = this.$el.closest('.modal');
    if (modalEl) {
        Modal.getInstance(modalEl)?.hide();
    }
    this.appStore.selectGoalForm(this.id);
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

.text:hover {
    cursor: pointer;
    text-decoration: underline;
}

.metric {
    color: #747474;
}
</style>