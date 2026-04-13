<template>
    <div class="todo-panel-timeframe d-flex flex-column">
        <div class="d-flex flex-row">
            <span class="timeframe">{{ timeframe }}</span>
        </div>
        <div v-if="showRepeat" class="d-flex flex-column">
            <span>Repeats</span>
            <RepeatListItem v-for="repeat in repeats" :key="repeat.id" :idRepeat="repeat.id" :idTimeframe="idTimeframe" />
            <!-- <span v-for="repeat in repeats" :key="repeat.id">{{ repeat.id }}</span> -->
        </div>
        <div class="d-flex flex-column">
            <span>Time-Pairs</span>
            <TimePairListItem v-for="timePair in timePairs" :key="timePair.id" :idTimePair="timePair.id" />
            <!-- <span v-for="timePair in timePairs" :key="timePair.id">{{ timePair.id }}</span> -->
        </div>
    </div>
</template>

<script>
import RepeatListItem from './RepeatListItem.vue';
import TimePairListItem from './TimePairListItem.vue';
import { timeframes } from '../../../../model/types';
import { TIMEFRAME } from '../../../../model/constants';
import { dow } from '../../../../../utility/timeUtility';
 
export default {
    name: 'TodoPanelTimeframe',
    components: { RepeatListItem, TimePairListItem },
    props: {
        idTimeframe: Number
    },
    data: function () {
        return {
            appStore: undefined,
            plannerStore: undefined,
            showDayIndices: false
        }
    },
    created: async function() {
        let appStore = await import(`@/store/appStore`);
        this.appStore = appStore.useAppStore();

        let plannerStore = await import(`@/store/plannerStore`);
        this.plannerStore = plannerStore.usePlannerStore();
    },
    computed: {
        selectedDate() {
            return (this.plannerStore) ? this.plannerStore.selectedDate : today();
        },
        timeframe() {
            let timeframe = timeframes.find(x => x.id == this.idTimeframe);
            return timeframe.text;
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
            if (this.plannerStore) {
                let timePairs = this.plannerStore.getActiveTimePairs(this.idTimeframe, this.selectedDate);
                return timePairs;
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

</style>