<template>
    <div class="dp-task-item d-flex flex-row justify-content-between align-items-center">
        <div class="d-flex flex-row align-items-center flex-grow-1">
            <div class="status-icon" :class="status" @click="onStatusClick">
                <img v-if="status === 'incomplete'" :src="iconStatusIncomplete" class="status-img" />
                <img v-else-if="status === 'complete'" :src="iconStatusCheck" class="check-img" />
                <div v-else-if="status === 'partial'" class="minus-line"></div>
            </div>
            <div class="d-flex" :class="{ 'flex-column': iteration && iteration.points }">
                <span v-if="iteration && iteration.points" class="points">{{ iteration.points }} pts</span>
                <span class="text" @click="onTextClick" @dblclick="onTextDblClick">{{ iteration ? iteration.text : '' }}</span>
            </div>
        </div>
        <div class="button-group">
            <div class="delete-button" @click="onDelete">
                <img :src="iconDeleteX" width="13" height="13" />
            </div>
        </div>
    </div>
</template>

<script>
import iconStatusIncomplete from '@/assets/icons/icon-status-incomplete.svg';
import iconStatusCheck from '@/assets/icons/icon-status-check.svg';
import iconDeleteX from '@/assets/icons/icon-delete-x.svg';

export default {
    name: 'DPTaskItem',
    components: {  },
    props: {
        iterationId: { type: Number, required: true },
    },
    data: function () {
        return {
            iterationStore: undefined,
            appStore: undefined,
            iteration: undefined,
            clickTimer: null,
            iconStatusIncomplete,
            iconStatusCheck,
            iconDeleteX,
        }
    },
    created: async function() {
        let iterationStore = await import('@/store/iterationStore');
        this.iterationStore = iterationStore.useIterationStore();
        let appStore = await import('@/store/appStore');
        this.appStore = appStore.useAppStore();
        this.iteration = this.iterationStore.getIteration(this.iterationId);
    },
    computed: {
        status() {
            if (!this.iteration) return 'incomplete';
            if (this.iteration.completedAt) return 'complete';
            if (this.iteration.attemptedAt) return 'partial';
            return 'incomplete';
        },
    },
    methods: {
        markComplete, markIncomplete, onStatusClick,
        openTaskForm, openTodoForm, onTextClick, onTextDblClick,
        onDelete,
    },
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

function onStatusClick() {
    if (this.status === 'incomplete') this.markComplete();
    else if (this.status === 'complete') this.markIncomplete();
}

function openTaskForm() {
    this.appStore.setSelectedTask(this.iteration);
}

function openTodoForm() {
    this.appStore.selectTodoForm(this.iteration.todoID);
}

function onTextClick() {
    if (this.clickTimer) return;
    this.clickTimer = setTimeout(() => {
        this.openTaskForm();
        this.clickTimer = null;
    }, 250);
}

function onTextDblClick() {
    clearTimeout(this.clickTimer);
    this.clickTimer = null;
    this.openTodoForm();
}

function onDelete() {
    this.iterationStore.deleteIteration(this.iteration.id);
}
</script>

<style scoped>
.dp-task-item {
    background-color: white;
    user-select: none;
    padding: 4px 0px;
    gap: 12px;
}

.dp-task-item:hover {
    background-color: #F5F5F5;
}

.status-icon {
    width: 18px;
    height: 18px;
    border-radius: 9px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.status-icon.incomplete,
.status-icon.complete {
    cursor: pointer;
}

.status-icon.complete {
    background-color: #10B981;
}

.status-icon.partial {
    background-color: #F59E0B;
}

.status-img {
    width: 18px;
    height: 18px;
}

.check-img {
    width: 10px;
    height: 10px;
}

.minus-line {
    width: 8px;
    height: 2px;
    border-radius: 1px;
    background-color: white;
}

.points {
    font-size: 11px;
    font-style: italic;
    color: #4B5563;
}

.text {
    font-size: 13px;
    color: #4B5563;
}

.text:hover {
    text-decoration: underline;
    cursor: pointer;
}

.button-group {
    visibility: hidden;
    margin: 0px 8px;
}

.dp-task-item:hover .button-group {
    visibility: visible;
}

.delete-button {
    width: 24px;
    height: 24px;
    border-radius: 8px;
    background-color: white;
    border: 1px solid #DDE3DF;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}
</style>
