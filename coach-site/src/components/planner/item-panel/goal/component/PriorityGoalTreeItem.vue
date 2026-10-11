<template>
    <div class="priority-goal-tree-item">
        <div class="row-line d-flex align-items-center" :style="{ paddingLeft: depth * 24 + 'px' }">
            <span v-if="depth > 0" class="tree-connector"></span>
            <span class="status-dot" :class="statusClass"></span>
            <span class="label" :class="{ 'is-parent': hasChildren }">{{ node.item.text }}</span>
        </div>
        <PriorityGoalTreeItem v-for="child in node.children" :key="child.item.id"
                               :node="child" :depth="depth + 1" />
    </div>
</template>

<script>
export default {
    name: 'PriorityGoalTreeItem',
    props: {
        node: { type: Object, required: true },
        depth: { type: Number, default: 0 }
    },
    computed: {
        hasChildren() {
            return this.node.children && this.node.children.length > 0;
        },
        statusClass() {
            return `status-${this.node.status}`;
        }
    }
}
</script>

<style scoped>
.priority-goal-tree-item {
    width: 100%;
}
.row-line {
    gap: 12px;
    padding-top: 7px;
    padding-bottom: 7px;
}
.status-dot {
    width: 18px;
    height: 18px;
    border-radius: 9px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}
.status-complete {
    background-color: #10b981;
}
.status-complete::after {
    content: '';
    width: 8px;
    height: 5px;
    border-left: 2px solid #fff;
    border-bottom: 2px solid #fff;
    transform: rotate(-45deg) translate(1px, -1px);
}
.status-partial {
    background-color: #f59e0b;
}
.status-partial::after {
    content: '';
    width: 8px;
    height: 2px;
    border-radius: 1px;
    background-color: #fff;
}
.status-incomplete {
    background-color: transparent;
    border: 1.5px solid #d1d5db;
}
.label {
    font-size: 13px;
    font-weight: 400;
    color: #4b5563;
    word-break: break-word;
}
.label.is-parent {
    font-size: 14px;
    font-weight: 600;
    color: #111827;
}
.tree-connector {
    width: 10px;
    height: 20px;
    margin-top: -14px;
    margin-right: -4px;
    flex-shrink: 0;
    border-left: 1.5px solid #e5e7eb;
    border-bottom: 1.5px solid #e5e7eb;
    border-radius: 0 0 0 6px;
}
</style>
