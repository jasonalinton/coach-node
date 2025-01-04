<template>
    <div class="routine-panel-by-task d-flex flex-column">
        <span v-for="routine in taskRoutines" :key="routine.id">{{  routine.text }}</span>
    </div>
</template>

<script>
import { today, getDayOfWeekLong } from '../../../../../utility/timeUtility';
import { REPETITION } from '../../../../model/constants';

export default {
    name: 'RoutinePanelByTask',
    components: {  },
    props: {
        
    },
    data: function () {
        return {
            plannerStore: undefined,
            routineStore: undefined
        }
    },
    created: async function() {
        let plannerStore = await import(`@/store/plannerStore`);
        this.plannerStore = plannerStore.usePlannerStore();

        let routineStore = await import(`@/store/routineStore`);
        this.routineStore = routineStore.useRoutineStore();
    },
    computed: {
        selectedDate() {
            if (this.plannerStore) {
                return this.plannerStore.selectedDate;
            }
            return today();
        },
        taskRoutines() {
            let _this = this;
            if (this.routineStore) {
                let routines = this.routineStore.getTaskRoutines();
                routines = routines.filter(routine => {
                    let inTimeframe = false;
                    routine.repeats.forEach(repeat => {
                        // If repeat doesn't start till the future
                        if (!repeat.startRepeat || (repeat.startRepeat && new Date(repeat.startRepeat.dateTime) > this.selectedDate)) {
                            return;
                        }

                        if (repeat.idTimeframe == REPETITION.DAILY) {
                            inTimeframe = true;
                        } else if (repeat.idTimeframe == REPETITION.WEEKLY) {
                            let dayOfWeek = getDayOfWeekLong(_this.selectedDate)
                            if (repeat.dayIndecies.findIndex(x => x == 1) > -1 && dayOfWeek == "Sunday") {
                                inTimeframe = true;
                            } else if (repeat.dayIndecies.findIndex(x => x == 2) > -1 && dayOfWeek == "Monday") {
                                inTimeframe = true;
                            } else if (repeat.dayIndecies.findIndex(x => x == 3) > -1 && dayOfWeek == "Tuesday") {
                                inTimeframe = true;
                            } else if (repeat.dayIndecies.findIndex(x => x == 4) > -1 && dayOfWeek == "Wednesday") {
                                inTimeframe = true;
                            } else if (repeat.dayIndecies.findIndex(x => x == 5) > -1 && dayOfWeek == "Thursday") {
                                inTimeframe = true;
                            } else if (repeat.dayIndecies.findIndex(x => x == 6) > -1 && dayOfWeek == "Friday") {
                                inTimeframe = true;
                            } else if (repeat.dayIndecies.findIndex(x => x == 7) > -1 && dayOfWeek == "Saturday") {
                                inTimeframe = true;
                            }
                        } else if (repeat.idTimeframe == REPETITION.MONTHLY) {
                            let date = this.selectedDate.getDate();
                            if (repeat.dayIndecies.findIndex(x => x == date) > -1) {
                                inTimeframe = true;
                            }
                        }
                        return
                    })
                    return inTimeframe;
                })
                return routines;
            }
            return [];
        }
    },
    methods: {
        
    },
}

</script>

<style scoped>

</style>