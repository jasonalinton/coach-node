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
        <div class="columns-track-wrapper overflow-scroll" :style="{ maxWidth: (width) + 'px' }">
            <div class="columns-track d-flex flex-row">
                <div v-for="entry in blocksByDay" :key="+entry.day" class="day-column d-flex flex-column">
                    <div class="col-header d-flex flex-row justify-content-between">
                        <span class="day-label" :class="{ 'is-today': isToday(entry.day) }">{{ getDayOfWeekShort(entry.day) }} {{ getMonthDate(entry.day) }}</span>
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
        <div v-if="unplannedBlocks.length" class="unplanned-section d-flex flex-column">
            <div class="unplanned-header d-flex flex-row justify-content-between">
                <span>Unplanned</span>
            </div>
            <div class="unplanned-blocks d-flex flex-column">
                <div v-for="block in unplannedBlocks" :key="block.key"
                     class="task-block-unplanned d-flex flex-column" :data-id="block.id" :data-start="block.startAt">
                    <span class="block-title">{{ block.title }}</span>
                    <div class="block-meta d-flex flex-row justify-content-between">
                        <span class="block-type">{{ block.typeText }}</span>
                        <span class="block-points">{{ block.points }}p</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useAppStore } from '@/store/appStore'
import { usePlannerStore } from '@/store/plannerStore'
import { usePhysicalStore } from '@/store/physicalStore'
import { useTodoStore } from '@/store/todoStore'
import { useWorkoutStore } from '@/store/workoutStore'
import { TODO_ACTIVITY_TYPE, TIMEFRAME } from '../../../model/constants'
import { getActivityTypeColor } from '../../../model/types'
import { today, startOfDay, firstDayOfWeek, lastDayOfWeek, addDay, isSameDate, getDayOfWeekShort, getMonthDate } from '../../../../utility/timeUtility';

export default {
    name: 'PhysicalActivitySchedule',
    components: {  },
    props: {

    },
    data: function () {
        return {
            appStore: undefined,
            plannerStore: undefined,
            physicalStore: undefined,
            todoStore: undefined,
            workoutStore: undefined,
            physicalActivityIterations: [],
            physicalActivityTypeIDs: []
        }
    },
    created: async function() {
        this.appStore = useAppStore();
        this.plannerStore = usePlannerStore();
        this.physicalStore = usePhysicalStore();
        this.todoStore = useTodoStore();
        this.workoutStore = useWorkoutStore();
        this.ensureWeekWorkouts();
        let batteryData = await this.physicalStore.getPhysicalBatteryData(false);
        this.physicalActivityIterations = batteryData?.physicalActivityIterations || [];
        this.physicalActivityTypeIDs = batteryData?.physicalActivityTypeIDs || [];
    },
    watch: {
        selectedDate() {
            this.ensureWeekWorkouts();
        }
    },
    computed: {
        selectedDate() {
            if (this.plannerStore) {
                return this.plannerStore.selectedDate;
            }
            return today();
        },
        width() {
            return (this.appStore && this.appStore.bodyOuterWidth) ? this.appStore.bodyOuterWidth : 0
        },
        weekStart() {
            return firstDayOfWeek(this.selectedDate);
        },
        weekEnd() {
            return lastDayOfWeek(this.selectedDate);
        },
        weekDays() {
            let days = [];
            for (let i = 0; i < 7; i++) {
                days.push(addDay(this.weekStart, i));
            }
            return days;
        },
        weekWorkouts() {
            return this.workoutStore
                ? this.workoutStore.getWorkoutsInRange(this.weekStart, this.weekEnd)
                : [];
        },
        // A block is anything shown on the schedule — either a logged/scheduled Workout or a
        // standalone physical-activity todo iteration — normalized into one common shape.
        // Planned/unplanned is a property of the block, not a pre-filter, since unplanned
        // items still need to show up (in the unplanned list) rather than being dropped.
        blocks() {
            let workoutBlocks = this.weekWorkouts.map(workout => {
                let iteration = workout.iteration;
                let type = this.resolveType(iteration);
                return {
                    key: `workout-${workout.id}`,
                    title: workout.name,
                    points: workout.points || 0,
                    startAt: iteration?.startAt,
                    isCompleted: !!iteration?.completedAt,
                    isPlanned: this.isPlanned(iteration),
                    typeText: type.text,
                    typeColor: type.color
                };
            });

            let iterationBlocks = this.physicalActivityIterations.map(iteration => {
                let todo = iteration.idTodo ? this.todoStore.getItem(iteration.idTodo) : undefined;
                let type = this.resolveType(iteration);
                return {
                    key: `iteration-${iteration.id}`,
                    title: todo ? todo.text : 'Activity',
                    points: iteration.points || 0,
                    id: iteration.id,
                    startAt: iteration.startAt,
                    isCompleted: !!iteration.completedAt,
                    isPlanned: this.isPlanned(iteration),
                    typeText: type.text,
                    typeColor: type.color
                };
            });

            return [...workoutBlocks, ...iterationBlocks];
        },
        plannedBlocks() {
            return this.blocks.filter(block => block.isPlanned);
        },
        unplannedBlocks() {
            return this.blocks.filter(block => !block.isPlanned && this.isInSelectedWeek(block.startAt));
        },
        blocksByDay() {
            let entries = this.weekDays.map(day => ({ day, blocks: [] }));
            this.plannedBlocks.forEach(block => {
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
        getMonthDate,
        ensureWeekWorkouts() {
            if (this.workoutStore) {
                this.workoutStore.ensureWorkoutsInRange(this.weekStart, this.weekEnd);
            }
        },
        isToday(day) {
            return isSameDate(day, today());
        },
        dayTotal(entry) {
            return entry.blocks.reduce((sum, block) => sum + block.points, 0);
        },
        // Planned = time-boxed to a specific day with a concrete start/end; anything else
        // (different timeframe, or missing startAt/endAt) is unplanned.
        isPlanned(iteration) {
            return !!iteration && iteration.idTimeframe === TIMEFRAME.DAY && !!iteration.startAt && !!iteration.endAt;
        },
        isInSelectedWeek(startAt) {
            if (!startAt) {
                return false;
            }
            let day = startOfDay(new Date(startAt));
            return +day >= +this.weekDays[0] && +day <= +this.weekDays[this.weekDays.length - 1];
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
    min-width: 920px;
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

.unplanned-section {
    margin-top: 20px;
}

.unplanned-header {
    padding-bottom: 8px;
    border-bottom: 2px solid #cbd5e1;
    font-size: 13px;
    font-weight: 500;
    color: #475569;
}

.unplanned-blocks {
    margin-top: 8px;
    gap: 6px;
}

.task-block-unplanned {
    background-color: #f1f5f9;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 10px;
    gap: 4px;
}

.task-block-unplanned .block-title {
    color: #0f172a;
}

.task-block-unplanned .block-type {
    color: #64748b;
}

.task-block-unplanned .block-points {
    color: #64748b;
}
</style>
