<template>
    <div class="goals-in-timeframe d-flex flex-column text-start">
        <div v-if="timeframeID == TIMEFRAME.DAY" class="d-flex flex-row">
            <span v-if="isToday" class="timeframe">Today</span>
            <span v-if="!isToday" class="timeframe">Day</span>
            <span class="dash">-</span>
            <span class="date">{{ date }}</span>
        </div>
        <span v-else class="timeframe">{{ timeframe }}</span>
        <GoalTimeframeItem v-for="id in goalIDs" :key="id"
                           class="mb-2"
                           :goalID="id" :timeframeID="timeframeID" />
        <GoalDailyTimeframeItem v-for="object in indirectIterations" :key="object.goalID" 
                                :goalID="object.goalID" :iterationIDs="object.iterationIDs"/>
    </div>
</template>

<script>
import GoalTimeframeItem from './GoalTimeframeItem.vue';
import GoalDailyTimeframeItem from './GoalDailyTimeframeItem.vue';
import { TIMEFRAME } from '../../../../../model/constants';
import { timeframes } from '../../../../../model/types';
import { clone, today } from '../../../../../../utility';
import { isToday, toShortWeekdayString, endOfDay } from '../../../../../../utility/timeUtility';

export default {
    name: 'GoalsInTimeframe',
    components: { GoalTimeframeItem, GoalDailyTimeframeItem },
    props: {
        timeframeID: Number,
    },
    data: function () {
        return {
            plannerStore: undefined,
            goalStore: undefined,
            todoStore: undefined,
            iterationStore: undefined,
            timeframes: clone(timeframes),
            TIMEFRAME: clone(TIMEFRAME)
        }
    },
    created: async function() {
        let plannerStore = await import(`@/store/plannerStore`);
        this.plannerStore = plannerStore.usePlannerStore();

        let goalStore = await import(`@/store/goalStore`);
        this.goalStore = goalStore.useGoalStore();

        let todoStore = await import(`@/store/todoStore`);
        this.todoStore = todoStore.useTodoStore();

        let iterationStore = await import(`@/store/iterationStore`);
        this.iterationStore = iterationStore.useIterationStore();
    },
    computed: {
        selectedDate() {
            if (this.plannerStore) {
                return this.plannerStore.selectedDate;
            }
            return today();
        },
        date() {
            return toShortWeekdayString(this.selectedDate, true);
        },
        isToday() {
            return isToday(this.selectedDate);
        },
        timeframe() {
            var timeframe = this.timeframes.find(x => x.id == this.timeframeID);
            return (timeframe) ? timeframe.text : "";
        },
        goalIDs() {
            if (this.goalStore) {
                let goals = this.goalStore.getGoalsInTimeframe(this.timeframeID, this.selectedDate);
                let goalIDs = goals.map(x => x.id);
                return goalIDs;
            }
            return [];
        },
        indirectIterations() {
            if (this.goalStore && this.timeframeID == TIMEFRAME.DAY) {
                let objectArray = [];
                // If timefrome is day
                if (this.timeframeID == TIMEFRAME.DAY) {
                    let goals = this.goalStore.getActiveGoals(this.selectedDate); // Get all active goals in all timeframes
                    let goalIDs_Active = goals.map(x => x.id);
                    
                    // Get goal id's that are parents to the iterations
                    let iterations = this.iterationStore.getIterationsInRange(this.selectedDate, endOfDay(this.selectedDate), false); // Get iterations that are scheduled for day
                    iterations.forEach(iteration => {
                        let todoIDs_Checked = []
                        let goalIDs = [];
                        if (iteration.todoID) {
                            this.getGoalIDs(iteration.todoID, goalIDs, todoIDs_Checked);
                            goalIDs = goalIDs.filter(id => goalIDs_Active.includes(id)); // Determin active goal ids that match the iterations
                            if (goalIDs.length > 0) {
                                objectArray.push({
                                    task: iteration,
                                    goalIDs
                                })
                            }
                        }
                    })
                }
                
                let goalObjectList = [];
                objectArray.forEach(x => {
                    let removedIDs = []; // We don't want all the goals in the heirarchy. Only the one at the bottom
                    x.goalIDs.forEach(id => {
                        let goal = this.goalStore.getItem(id);
                        goal.childIDs.forEach(childID => {
                            if (x.goalIDs.includes(childID)) {
                                removedIDs.push(childID);
                            }
                        })
                    })
                    x.goalIDs = x.goalIDs.filter(id => !removedIDs.includes(id));
                    x.goalIDs.forEach(id => {
                        let index = goalObjectList.findIndex(y => y.goalID == id);
                        if (index > -1) {
                            goalObjectList[index].iterationIDs.push(x.task.id)
                        } else {
                            goalObjectList.push({
                                goalID: id,
                                iterationIDs: [ x.task.id]
                            })
                        }
                    })
                });
                
                return goalObjectList;
            }
        }
    },  
    methods: {
        getGoalIDs
    },
}

function getGoalIDs(idTodo, goalIDs, todoIDs_Checked) {
    todoIDs_Checked.push(idTodo);

    let todo = this.todoStore.getItem(idTodo);
    todo.goalIDs.forEach(id => {
        if (!goalIDs.includes(id)) {
            goalIDs.push(id);
        }
    })
    // Get goal IDs of parents
    todo.parentIDs.forEach(parentID => {
        if (!todoIDs_Checked.includes(parentID)) { //Don't check todo multiple times. Prevent infinite loop
            this.getGoalIDs(parentID, goalIDs, todoIDs_Checked);
        }
    })
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