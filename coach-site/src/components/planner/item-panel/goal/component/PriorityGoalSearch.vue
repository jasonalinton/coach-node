<template>
    <div class="priority-goal-search">
        <div class="search-box d-flex align-items-center" :class="{ focused: isOpen }">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="6" cy="6" r="4.5" stroke="#7a847f" stroke-width="1.5"/>
                <path d="M9.5 9.5L13 13" stroke="#7a847f" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <input v-model="text" class="search-input flex-grow-1" type="text" placeholder="Add a goal…"
                   @focus="isFocused = true" @blur="isFocused = false"
                   @keydown.down.prevent="moveHighlight(1)" @keydown.up.prevent="moveHighlight(-1)"
                   @keydown.enter.prevent="submit" @keydown.esc="text = ''" />
        </div>
        <div v-if="isOpen" class="results d-flex flex-column">
            <div v-for="(goal, index) in results" :key="goal.id"
                 class="result d-flex align-items-center" :class="{ active: index == highlight }"
                 @mouseenter="highlight = index">
                <div class="d-flex flex-column flex-grow-1">
                    <span class="result-title">{{ goal.text }}</span>
                    <span class="result-path">{{ placements[goal.id] ? `Already in ${placements[goal.id]}` : pathOf(goal) }}</span>
                </div>
                <div class="lane-picker d-flex">
                    <span v-for="lane in lanes" :key="lane.key" class="lane-dot"
                          :class="{ on: lane.key == laneKey && index == highlight }"
                          :style="laneDotStyle(lane, lane.key == laneKey && index == highlight)"
                          :title="`Add to ${lane.label}`"
                          @mousedown.prevent="add(goal, lane.key)">{{ lane.n }}</span>
                </div>
            </div>
            <div v-if="results.length > 0" class="separator"></div>
            <span class="create" :class="{ active: highlight == -1 }"
                  @mousedown.prevent="create">+ Create “{{ text.trim() }}” as a new goal in {{ laneLabel }}</span>
            <span class="hint">↵ adds to {{ laneLabel }} · ↑↓ to choose</span>
        </div>
    </div>
</template>

<script>
import { PRIORITY_GOAL } from '../../../../../model/constants';

export default {
    name: 'PriorityGoalSearch',
    emits: ['add', 'create'],
    props: {
        lanes: { type: Array, required: true },
        placements: { type: Object, default: () => ({}) }
    },
    data: function() {
        return {
            goalStore: null,
            text: '',
            isFocused: false,
            highlight: 0,
            laneKey: 'PRIMARY'
        }
    },
    created: async function() {
        let goalStore = await import(`@/store/goalStore`);
        this.goalStore = goalStore.useGoalStore();
    },
    computed: {
        isOpen() {
            return this.isFocused && this.text.trim().length > 0;
        },
        results() {
            let text = this.text.trim().toLowerCase();
            if (!text || !this.goalStore) return [];
            let priorityIDs = Object.values(PRIORITY_GOAL);
            return this.goalStore.goals
                .filter(goal => !priorityIDs.includes(goal.id) && goal.text && goal.text.toLowerCase().includes(text))
                .sort((a, b) => a.text.toLowerCase().indexOf(text) - b.text.toLowerCase().indexOf(text))
                .slice(0, 8);
        },
        laneLabel() {
            return this.lanes.find(lane => lane.key == this.laneKey)?.label;
        }
    },
    watch: {
        results(results) {
            this.highlight = (results.length > 0) ? 0 : -1;
        }
    },
    methods: {
        pathOf(goal) {
            let parents = (goal.parents || []).map(parent => parent.text).filter(x => x);
            return (parents.length > 0) ? `${parents.join(', ')} › ${goal.text}` : 'Not in any plan yet';
        },
        laneDotStyle(lane, isOn) {
            return {
                borderColor: lane.color,
                color: isOn ? '#ffffff' : lane.color,
                backgroundColor: isOn ? lane.color : '#ffffff'
            };
        },
        moveHighlight(delta) {
            this.highlight = Math.min(this.results.length - 1, Math.max(-1, this.highlight + delta));
        },
        submit() {
            if (this.highlight >= 0 && this.results[this.highlight]) {
                this.add(this.results[this.highlight], this.laneKey);
            } else if (this.text.trim()) {
                this.create();
            }
        },
        // The lane picked last becomes the default for Enter
        add(goal, laneKey) {
            this.laneKey = laneKey;
            this.$emit('add', goal.id, laneKey);
            this.text = '';
        },
        create() {
            this.$emit('create', this.text.trim(), this.laneKey);
            this.text = '';
        }
    }
}
</script>

<style scoped>
.priority-goal-search {
    position: relative;
}
.search-box {
    gap: 8px;
    padding: 9px 12px;
    border-radius: 10px;
    background-color: #ffffff;
    border: 1px solid #e8e2d8;
}
.search-box.focused {
    border: 1.5px solid #1f6f5c;
    padding: 8.5px 11.5px;
}
.search-input {
    border: none;
    outline: none;
    background: transparent;
    font-size: 13px;
    color: #1c2b27;
    min-width: 0;
}
.search-input::placeholder {
    color: #7a847f;
}
.results {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    right: 0;
    z-index: 10;
    padding: 6px 0;
    border-radius: 12px;
    background-color: #ffffff;
    border: 1px solid #e8e2d8;
    box-shadow: 0 12px 28px rgba(26, 38, 31, 0.12);
}
.result {
    gap: 10px;
    padding: 8px 12px;
}
.result.active {
    background-color: #e3efe9;
}
.result-title {
    font-size: 14px;
    font-weight: 500;
}
.result-path {
    font-size: 11px;
    color: #7a847f;
}
.lane-picker {
    gap: 4px;
}
.lane-dot {
    width: 22px;
    height: 22px;
    border-radius: 11px;
    border: 1.2px solid;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
}
.separator {
    height: 1px;
    background-color: #e8e2d8;
    margin: 4px 0;
}
.create {
    padding: 8px 12px;
    font-size: 13px;
    font-weight: 500;
    color: #1f6f5c;
    cursor: pointer;
}
.create.active, .create:hover {
    background-color: #e3efe9;
}
.hint {
    padding: 4px 12px 2px 12px;
    font-size: 11px;
    color: #7a847f;
}
</style>
