<template>
    <div v-if="todo" class="todo-kanban-card d-flex flex-column">
        <!-- Head -->
        <div class="d-flex flex-row justify-content-between align-items-center">
            <span class="flag-pill d-flex flex-row align-items-center" :style="flagStyle">
                <span class="flag-dot"></span>
                {{ flag }}
            </span>
            <i class="fa-solid fa-ellipsis more-icon" @click.stop="togglePriority"></i>
        </div>
        <!-- Text -->
         <div class="d-flex gap-1">
             <div class="text">{{ todo.id }}</div>
             <div class="text">{{ todo.text }}</div>
         </div>
        <!-- Blurb -->
        <div v-if="blurb" class="blurb">{{ blurb.text }}</div>
        <!-- Footer -->
        <div class="d-flex flex-row justify-content-between align-items-center footer">
            <div class="d-flex flex-row align-items-center gap-3">
                <span class="d-flex flex-row align-items-center gap-1">
                    <i class="fa-solid fa-list-check"></i>
                    {{ taskCount }}
                </span>
                <span class="d-flex flex-row align-items-center gap-1">
                    <i class="fa-solid fa-star"></i>
                    {{ `${points} pts` }}
                </span>
            </div>
            <span v-if="isPriorityShown" class="priority-pill">{{ priority }}</span>
        </div>
    </div>
</template>

<script>
import { BLURBTYPE } from '../../../../model/constants';

const FLAG = {
    NEGLECTED: "Neglected",
    BEHIND: "Behind",
    NO_STARTED: "No started",
    ON_TRACK: "On track",
    AHEAD: "Ahead",
    OVERWORKED: "Overworked",
    COMPLETE: "Complete"
};

/* Placeholder colors until real flag business rules exist */
const FLAG_COLORS = {
    [FLAG.NEGLECTED]: { color: "#D93025", background: "#FCE8E6" },
    [FLAG.BEHIND]: { color: "#E8710A", background: "#FEF0DC" },
    [FLAG.NO_STARTED]: { color: "#5F6368", background: "#F1F3F4" },
    [FLAG.ON_TRACK]: { color: "#1967D2", background: "#E8F0FE" },
    [FLAG.AHEAD]: { color: "#12847A", background: "#E4F5F3" },
    [FLAG.OVERWORKED]: { color: "#8430CE", background: "#F3E8FD" },
    [FLAG.COMPLETE]: { color: "#188038", background: "#E6F4EA" },
};

const PRIORITY_SHOWN_DURATION = 2000;

export default {
    name: "TodoKanbanCard",
    props: {
        id: Number
    },
    data: function() {
        return {
            todoStore: null,
            isPriorityShown: true,
            /* Hardcoded until priority has a real data source */
            priority: "High"
        }
    },
    created: async function() {
        let todoStore = await import(`@/store/todoStore`);
        this.todoStore = todoStore.useTodoStore();
    },
    mounted: function() {
        setTimeout(() => this.isPriorityShown = false, PRIORITY_SHOWN_DURATION);
    },
    computed: {
        todo() {
            if (this.todoStore) {
                return this.todoStore.getItem(this.id);
            }
            return null;
        },
        blurb() {
            // let blurbs = this.todo.blurbs.filter(x => x.idType == BLURBTYPE.REASON || x.idType == BLURBTYPE.REMINDER);
            // if (blurbs.length > 0) {
            //     let index = Math.floor(Math.random() * blurbs.length);
            //     return blurbs[index];
            // }
            return null;
        },
        points() {
            // if (this.todoStore) {
            //     return this.todoStore.getPoints(this.id);
            // }
            return this.todo?.points || 0;
        },
        taskCount() {
            if (this.todoStore) {
                let count = this.todo.iterationIDs.length;
                return count;
            }
            return 0;
        },
        /* Determined by computed property (placeholder rule until real business logic exists) */
        flag() {
            if (this.todo.iterationIDs.length === 0) {
                return FLAG.COMPLETE;
            } else if (this.points === 0) {
                return FLAG.NO_STARTED;
            }
            return FLAG.ON_TRACK;
        },
        flagStyle() {
            let colors = FLAG_COLORS[this.flag];
            return {
                color: colors.color,
                backgroundColor: colors.background
            };
        }
    },
    methods: {
        togglePriority() {
            this.isPriorityShown = !this.isPriorityShown;
        }
    }
}
</script>

<style scoped>
.todo-kanban-card {
    padding: 16px;
    gap: 8px;
    background-color: var(--background-color);
    border: 1px solid #E0E0E0;
    border-radius: 8px;
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.08);
    font-size: 14px;
    color: var(--dark-gray-text);
}

.flag-pill {
    font-size: 12px;
    font-weight: 500;
    padding: 2px 10px;
    border-radius: 12px;
    gap: 6px;
}

.flag-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: currentColor;
}

.more-icon {
    color: var(--gray-text);
    cursor: pointer;
    padding: 4px;
}

.text {
    font-weight: 600;
    font-size: 16px;
}

.blurb {
    color: var(--gray-text);
    font-size: 13px;
    line-height: 18px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.footer {
    font-size: 13px;
    color: var(--gray-text);
}

.footer .fa-star {
    color: #F4B400;
}

.priority-pill {
    font-size: 12px;
    font-weight: 600;
    color: #D93025;
    background-color: #FCE8E6;
    padding: 2px 10px;
    border-radius: 12px;
    transition: opacity 0.2s ease;
}
</style>
