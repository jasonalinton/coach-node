<template>
    <div v-if="routine" class="wrapper d-flex flex-column">
        <div class="routine d-flex flex-row">
            <img src="/icon/routine-icon.png" width="18" height="18"/>
            <div class="d-flex flex-column">
                <div class="d-flex flex-row">
                    <span class="id">{{ routine.id }}</span>
                    <span class="text">{{ routine.text }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useRoutineStore } from "@/store/routineStore";

export default {
    name: "RoutineFormItem",
    props: {
        id: Number,
        parentID: Number,
        parentType: String
    },
    data: function() {
        return {
            store: null
        }
    },
    created: async function() {
        this.store = useRoutineStore();
    },
    computed: {
        routine() {
            if (this.store) {
                let routine = this.store.getItem(this.id);
                return routine;
            } else {
                return null;
            }
        }
    }
}
</script>

<style scoped>
.wrapper {
    padding: 4px 2px;
    line-height: 18px;
    text-align: start;
    font-size: 14px;
}

.wrapper:hover {
    background-color: #EFF6FC;
}

img {
    margin-right: 2px;
}

.id {
    color: #bcbcbc;
    margin-right: 3px;
}

.text {
    color: #3B99FC;
}
</style>
