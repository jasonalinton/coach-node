<template>
    <div class="todo-panel-timeframe d-flex flex-column mt-2">
        <div class="d-flex flex-row">
            <span class="timeframe">{{ timeframe }}</span>
            <div v-if="idTimeframe == TIMEFRAME.DAY" class="d-flex flex-row">
                <span class="dash">-</span>
                <span class="date">{{ date }}</span>
            </div>
        </div>
        <div class="d-flex flex-column">
            <TimePairListItem v-for="timePair in timePairs" :key="timePair.id" 
                              :idTimePair="timePair.id" :showComplete="showComplete" 
                              @edit="$emit('editIteration', $event)" />
        </div>
        <div v-if="showRepeat" class="d-flex flex-column">
            <RepeatListItem v-for="repeat in repeats" :key="repeat.id" 
                            :idRepeat="repeat.id" :idTimeframe="idTimeframe" :showComplete="showComplete"
                            @edit="$emit('editIteration', $event)" />
        </div>
    </div>
</template>

<script>
import RepeatListItem from './RepeatListItem.vue';
import TimePairListItem from './TimePairListItem.vue';
import { timeframes } from '../../../../model/types';
import { TIMEFRAME } from '../../../../model/constants';
import { dow, isToday, toShortWeekdayString, today } from '../../../../../utility/timeUtility';
 
export default {
    name: 'TodoPanelTimeframe',
    components: { RepeatListItem, TimePairListItem },
    props: {
        idTimeframe: Number,
        showComplete: {
            type: Boolean,
            default: () => false
        }
    },
    data: function () {
        return {
            appStore: undefined,
            plannerStore: undefined,
            iterationStore: undefined,
            TIMEFRAME,
            showDayIndices: false
        }
    },
    created: async function() {
        let appStore = await import(`@/store/appStore`);
        this.appStore = appStore.useAppStore();

        let plannerStore = await import(`@/store/plannerStore`);
        this.plannerStore = plannerStore.usePlannerStore();

        let iterationStore = await import(`@/store/iterationStore`);
        this.iterationStore = iterationStore.useIterationStore();
    },
    computed: {
        selectedDate() {
            return (this.plannerStore) ? this.plannerStore.selectedDate : today();
        },
        date() {
            return toShortWeekdayString(this.selectedDate, true);
        },
        timeframe() {
            if (this.idTimeframe == TIMEFRAME.DAY) {
                return (this.isToday) ? "Today" : "Day"
            } else {
                let timeframe = timeframes.find(x => x.id == this.idTimeframe);
                return timeframe.text;
            }
        },
        isToday() {
            return isToday(this.selectedDate);
        },
        repeats() {
            if (this.plannerStore && this.appStore) {
                let repeats = this.plannerStore.getActiveRepeats(this.idTimeframe, this.selectedDate);

                /* If day timeframe, add repeats with day indecies on current date */
                if (this.idTimeframe == TIMEFRAME.DAY) {
                    /* Add weekly repeats with day index on current day */
                    let weeklyRepeats = this.plannerStore.getActiveRepeats(TIMEFRAME.WEEK, this.selectedDate);
                    weeklyRepeats = weeklyRepeats.filter(repeat => {
                        let dow = this.selectedDate.getDay() + 1;
                        let isOnDay = repeat.dayIndecies.some(x => x == dow);
                        return isOnDay;
                    })
                    repeats = [...repeats, ...weeklyRepeats];
                    
                    /* Add monthly repeats with day index on current date */
                    let monthlyRepeats = this.plannerStore.getActiveRepeats(TIMEFRAME.MONTH, this.selectedDate);
                    monthlyRepeats = monthlyRepeats.filter(repeat => {
                        let date = this.selectedDate.getDate();
                        let isOnDay = repeat.dayIndecies.some(x => x == date);
                        return isOnDay;
                    })
                    repeats = [...repeats, ...monthlyRepeats];
                } 
                else if (!this.showDayIndices && [TIMEFRAME.WEEK, TIMEFRAME.MONTH].includes(this.idTimeframe)) {
                    let repeatsWithnplannedDays = repeats.filter(repeat => {
                        let unplannedCount = repeat.frequency - repeat.dayIndecies.length;
                        return unplannedCount > 0;
                    });
                    repeats = [...repeatsWithnplannedDays];
                }
                repeats = repeats.filter(r => r.isTodoRepeat && !r.isRoutineTodoRepeat); // Not part of routine
                repeats = repeats.filter(r => r.todo_Repeats.some(x => !x.isEventVisible)); // Not in event

                if (this.showHierarchy) {
                    let rootRepeats = repeats.filter(repeat => {
                        if (repeat.parentID) {
                            let parentRepeat = repeats.find(x => x.id == repeat.parentID);
                            if (parentRepeat) {
                                return false;
                            }
                        }
                        return true;
                    });
                    console.log(rootRepeats);
                    return rootRepeats;
                }

                return repeats;
            }
        },
        timePairs() {
            if (this.plannerStore && this.iterationStore) {
                let timePairs = this.plannerStore.getActiveTimePairs(this.idTimeframe, this.selectedDate);
                let timePairIDs = timePairs.map(x => x.id);

                let iterations = this.iterationStore.getIterationsInTimeframe(this.idTimeframe, this.selectedDate)
                    .filter(x => x.idTodoTimePair && !timePairIDs.includes(x.id));
                timePairIDs = iterations.map(x => x.idTodoTimePair);
                let timePairs2 = this.plannerStore.timePairs.filter(x => timePairIDs.includes(x.id));

                return [...timePairs, ...timePairs2];
            }
        },
        showRepeat() {
            return (this.appStore) ? this.appStore.itemPanel.todo.showRepeat : undefined;
        },
        showTimeline() {
            return (this.appStore) ? this.appStore.itemPanel.todo.showTimeline : undefined;
        },
        showRecommended() {
            return (this.appStore) ? this.appStore.itemPanel.todo.showRecommended : undefined;
        },
        showHierarchy() {
            return (this.appStore) ? this.appStore.itemPanel.todo.showHierarchy : undefined;
        },
    },
    methods: {
        
    },
}

</script>

<style scoped>
span.timeframe {
    padding-left: 20px;
    color: #3B99FC;
    font-size: 14px;
    font-weight: 500;
}
span.date {
    font-size: 14px;
    font-weight: 500;
}
span.dash {
    margin: 0 4px;
    line-height: 21px;
}

</style>