<template>
    <div class="create-task-button d-flex flex-row" ref="trigger">
        <button type="button" class="form-btn outline main" @click="$emit('create', selectedDate)">
            Create Task {{ dateString }}
        </button>
        <button type="button" class="form-btn outline toggle" :class="{ open: isOpen }"
                aria-label="Create task on a different day" :aria-expanded="isOpen"
                @click="open">▾</button>
        <DayPickerPopover v-if="isOpen" :anchor="anchor" :selectedDate="selectedDate"
                          title="Create task on…" hint="Pick a day for the task"
                          @pick="onPick" @close="isOpen = false"/>
    </div>
</template>

<script>
import DayPickerPopover from './DayPickerPopover.vue'

/** Creates a task on the planner's selected date, or on a day picked from the ▾ */
export default {
    name: 'CreateTaskButton',
    components: { DayPickerPopover },
    props: {
        selectedDate: Date,
        dateString: String
    },
    emits: ['create'],
    data: function() {
        return {
            isOpen: false,
            anchor: undefined
        }
    },
    methods: {
        open() {
            this.anchor = this.$refs.trigger.getBoundingClientRect();
            this.isOpen = true;
        },
        onPick(date) {
            this.isOpen = false;
            this.$emit('create', date);
        }
    }
}
</script>

<style scoped>
.main {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}

.toggle {
    margin-left: -1px;
    padding: 0 9px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    font-size: 12px;
}

.toggle.open {
    background-color: #E9ECEF;
}
</style>
