<template>
    <button class="add-item">
        <div class="d-flex align-items-center">
            <i class="fas fa-check"></i>
            <span :style="{ 'line-height': '24px', 'font-size': '14px', 'color': '#F4511E' }" @click="onClick">Add a task</span>
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
    this.$emit('onClick');
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

span {
    line-height: 24px;
    font-size: 14px;
    color: #F4511E
}

button.add-item {
    background-color: transparent;
}


button.add-item:hover {
    background-color: rgba(60, 64, 67, .08);
}
</style>