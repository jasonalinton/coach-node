<template>
    <div class="physical-activity-schedule d-flex flex-column">
        <div class="header d-flex flex-row justify-content-between">
            <div class="header-text d-flex flex-column">
                <span class="title">Weekly Schedule Controller</span>
                <span class="subtitle">Sun-Sat timeline distribution &amp; completed blocks</span>
            </div>
            <div class="weekly-total d-flex flex-column align-items-end">
                <span class="weekly-total-label">Weekly Expenditure</span>
                <span class="weekly-total-value">{{ weeklyTotals.completed }} / {{ weeklyTotals.all }} pts</span>
            </div>
        </div>
        <div class="columns-track d-flex flex-row">
            <div v-for="entry in blocksByDay" :key="+entry.day" class="day-column d-flex flex-column">
                <div class="col-header d-flex flex-row justify-content-between">
                    <span class="day-label" :class="{ 'is-today': isToday(entry.day) }">{{ getDayOfWeekShort(entry.day) }}</span>
                    <span class="day-total">{{ dayTotal(entry) }}p</span>
                </div>
                <div class="col-blocks d-flex flex-column">
                    <div v-if="!entry.blocks.length" class="empty-day d-flex align-items-center justify-content-center">
                        <span>Rest / Recharge</span>
                    </div>
                    <div v-for="block in entry.blocks" :key="block.key"
                         class="task-block d-flex flex-column"
                         :class="{ 'is-completed': block.isCompleted }"
                         :style="{ borderColor: block.typeColor, backgroundColor: `color-mix(in srgb, ${block.typeColor} 20%, transparent)` }">
                        <span class="block-title">{{ block.title }}</span>
                        <div class="block-meta d-flex flex-row justify-content-between">
                            <span class="block-type" :style="{ color: block.typeColor }">{{ block.typeText }}</span>
                            <span class="block-points">{{ block.points }}p</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { usePlannerStore } from '@/store/plannerStore'
import { usePhysicalStore } from '@/store/physicalStore'
import { useTodoStore } from '@/store/todoStore'
import { TODO_ACTIVITY_TYPE } from '../../../model/constants'
import { getActivityTypeColor } from '../../../model/types'
import { today, startOfDay, firstDayOfWeek, addDay, isSameDate, getDayOfWeekShort } from '../../../../utility/timeUtility';

export default {
    name: 'PhysicalActivitySchedule',
    components: {  },
    props: {

    },
    data: function () {
        return {
            plannerStore: undefined,
            physicalStore: undefined,
            todoStore: undefined,
            workouts: [],
            physicalActivityIterations: [],
            physicalActivityTypeIDs: []
        }
    },
    created: async function() {
        this.plannerStore = usePlannerStore();
        this.physicalStore = usePhysicalStore();
        this.todoStore = useTodoStore();
        let batteryData = await this.physicalStore.getPhysicalBatteryData(false);
        this.workouts = batteryData?.workouts || [];
        this.physicalActivityIterations = batteryData?.physicalActivityIterations || [];
        this.physicalActivityTypeIDs = batteryData?.physicalActivityTypeIDs || [];
    },
    computed: {
        selectedDate() {
            if (this.plannerStore) {
                return this.plannerStore.selectedDate;
            }
            return today();
        },
        weekDays() {
            let days = [];
            let start = firstDayOfWeek(this.selectedDate);
            for (let i = 0; i < 7; i++) {
                days.push(addDay(start, i));
            }
            return days;
        },
        // A block is anything shown on the schedule — either a logged/scheduled Workout or a
        // standalone physical-activity todo iteration — normalized into one common shape.
        blocks() {
            let workoutBlocks = this.workouts
                .filter(workout => workout.iteration?.startAt)
                .map(workout => {
                    let type = this.resolveType(workout.iteration);
                    return {
                        key: `workout-${workout.id}`,
                        title: workout.name,
                        points: workout.points || 0,
                        startAt: workout.iteration.startAt,
                        isCompleted: !!workout.iteration.completedAt,
                        typeText: type.text,
                        typeColor: type.color
                    };
                });

            let iterationBlocks = this.physicalActivityIterations
                .filter(iteration => iteration.startAt)
                .map(iteration => {
                    let todo = iteration.idTodo ? this.todoStore.getItem(iteration.idTodo) : undefined;
                    let type = this.resolveType(iteration);
                    return {
                        key: `iteration-${iteration.id}`,
                        title: todo ? todo.text : 'Activity',
                        points: iteration.points || 0,
                        startAt: iteration.startAt,
                        isCompleted: !!iteration.completedAt,
                        typeText: type.text,
                        typeColor: type.color
                    };
                });

            return [...workoutBlocks, ...iterationBlocks];
        },
        blocksByDay() {
            let entries = this.weekDays.map(day => ({ day, blocks: [] }));
            this.blocks.forEach(block => {
                let blockDay = startOfDay(new Date(block.startAt));
                let entry = entries.find(e => +e.day === +blockDay);
                if (entry) {
                    entry.blocks.push(block);
                }
            });
            entries.forEach(entry => entry.blocks.sort((a, b) => new Date(a.startAt) - new Date(b.startAt)));
            return entries;
        },
        weeklyTotals() {
            let all = 0;
            let completed = 0;
            this.blocksByDay.forEach(entry => {
                entry.blocks.forEach(block => {
                    all += block.points;
                    if (block.isCompleted) {
                        completed += block.points;
                    }
                });
            });
            return { completed, all };
        }
    },
    methods: {
        getDayOfWeekShort,
        isToday(day) {
            return isSameDate(day, today());
        },
        dayTotal(entry) {
            return entry.blocks.reduce((sum, block) => sum + block.points, 0);
        },
        // Resolves an iteration's todo type against the dynamic physicalActivityTypeIDs list —
        // preferring a specific child type (e.g. "Rehab") over the generic Physical Activity
        // parent when a todo is tagged with both.
        resolveType(iteration) {
            let todo = iteration?.idTodo ? this.todoStore.getItem(iteration.idTodo) : undefined;
            let types = todo?.types || [];
            let match = types.find(t => this.physicalActivityTypeIDs.includes(t.id) && t.id !== TODO_ACTIVITY_TYPE.PHYSICAL_ACTIVITY)
                || types.find(t => this.physicalActivityTypeIDs.includes(t.id));
            return {
                text: match ? match.text : 'Activity',
                color: getActivityTypeColor(match?.id, this.physicalActivityTypeIDs)
            };
        }
    },
}

</script>

<style scoped>
.physical-activity-schedule {
    background-color: #fff;
    border-radius: 16px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    padding: 24px;
    width: 100%;
    text-align: start;
}

.header-text .title {
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1a;
}

.header-text .subtitle {
    font-size: 13px;
    color: #767676;
    margin-top: 2px;
}

.weekly-total-label {
    font-size: 11px;
    font-weight: 600;
    color: #767676;
    text-transform: uppercase;
}

.weekly-total-value {
    font-size: 18px;
    font-weight: 700;
    color: #14b8a6;
    margin-top: 2px;
}

.columns-track {
    margin-top: 20px;
    gap: 12px;
}

.day-column {
    flex: 1 1 0;
    min-width: 0;
}

.col-header {
    padding-bottom: 8px;
    border-bottom: 1px solid #e5e5e5;
}

.day-label {
    font-size: 13px;
    font-weight: 600;
    color: #1a1a1a;
}

.day-label.is-today {
    color: #14b8a6;
    text-decoration: underline;
}

.day-total {
    font-size: 12px;
    color: #767676;
}

.col-blocks {
    margin-top: 8px;
    gap: 8px;
}

.empty-day {
    height: 46px;
    border: 1px dashed #e5e5e5;
    border-radius: 8px;
    color: #767676;
    font-size: 12px;
}

.task-block {
    border: 1px solid;
    border-radius: 8px;
    padding: 8px 10px;
}

.task-block.is-completed {
    opacity: 0.6;
    border-color: #e5e5e5 !important;
}

.block-title {
    font-size: 12px;
    font-weight: 600;
    color: #1a1a1a;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
}

.block-meta {
    margin-top: 4px;
}

.block-type {
    font-size: 11px;
}

.block-points {
    font-size: 11px;
    font-weight: 600;
    color: #1a1a1a;
}
</style>
