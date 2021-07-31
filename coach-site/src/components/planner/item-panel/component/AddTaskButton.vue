<template>
    <button class="add-item" @click="onClick">
        <div class="d-flex align-items-center">
            <i class="fas fa-check"></i>
            <div class="text">Add a task</div>
        </div>
    </button>
</template>

<script>
export default {
    name: 'AddTaskButton',
    methods: {
        onClick
    }
}

function onClick() {
    this.$emit('click');
}
</script>

<style scoped>
.add-item {
    border: none;
    padding: 8px 12px;
    width: 232px;
    border-radius: 20px;
}

i {
    color: #F4511E;
    font-size: 24px;
    margin-right: 12px;
}

.text {
    height: 14px;
    line-height: 15px;
    font-size: 14px;
    font-weight: 500;
    color: #F4511E;
    /* color: #565656 */
}

button.add-item {
    background-color: transparent;
}


button.add-item:hover {
    background-color: rgba(60, 64, 67, .08);
}
</style>