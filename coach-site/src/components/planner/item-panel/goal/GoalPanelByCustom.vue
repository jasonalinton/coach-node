<template>
    <div class="row g-0">
        <TimeframeRadio :timeframe="timeframe" @timeframeSelected="timeframe=$event" :container="'goalPanelCustom'"></TimeframeRadio>
        <!-- Body -->
        <div v-if="goals" class="d-flex flex-column" style="margin-top: 8px">
            <!-- Header: Goals Mapped to Timeframe -->
            <!-- <div class="header d-flex flex-row justify-content-between align-items-center" @click="goalInTimeframe.allCollapsed = !goalInTimeframe.allCollapsed">
                <h1>Goal Mapped to Timeframe</h1>
                <IconButton v-if="!goalInTimeframe.allCollapsed" class="caret" src="/icon/icon-expanded.png" :width="24" :height="24"></IconButton>
                <IconButton v-if="goalInTimeframe.allCollapsed" class="caret" src="/icon/icon-collapsed.png" :width="24" :height="24" ></IconButton>
            </div> -->
             <ul v-show="!goalInTimeframe.allCollapsed">
                <li v-for="goal in goalsMappedToTimeframe" :key="goal.id" class="goal">
                    <div class="d-flex flex-column">
                        <!-- <div class="goal-item">{{ goal.text }}</div> -->
                        <h1>{{ goal.text }}</h1>
                        <ul>
                            <li v-for="todo in getTodoQueue(goal)" :key="todo.id" class="todo">
                                <TodoItem :todo="todo" :parentType="'goal'" :parent="goal" :size="'sm'"></TodoItem>
                            </li>
                        </ul>
                        <ul>
                            <li v-for="iteration in incompleteIterations(goal)" :key="iteration.id" class="todo">
                                <ListItem :iteration="iteration" :parentType="'goal'" :parent="goal" :size="'sm'"></ListItem>
                            </li>
                        </ul>
                        <!-- Complete (Goal In Timeframe) -->
                        <h2 @click="goalInTimeframe.completedCollapsed = !goalInTimeframe.completedCollapsed">Complete ({{ iterationsInTimeframe(goal).filter(_itera => _itera.attemptedAt).length }})</h2>
                        <ul v-show="!goalInTimeframe.completedCollapsed">
                            <li v-for="iteration in completeIterations(goal)" :key="iteration.id" class="todo">
                                <ListItem :iteration="iteration" :parentType="'goal'" :parent="goal" :size="'sm'"></ListItem>
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import ListItem from '../component/ListItem.vue';
import TodoItem from '../component/TodoItem.vue';
import TimeframeRadio from '../component/TimeframeRadio.vue';
import { firstDayOfWeek, lastDayOfWeek, firstDayOfMonth, firstDayOfYear, lastDayOfMonth, lastDayOfYear } from '../../../../../utility/timeUtility';
// import IconButton from '../../../controls/button/IconButton.vue';

export default {
    name: 'GoalPanelByCustom',
    components: { ListItem, TodoItem, TimeframeRadio },
    props: {
        selectedDate: Date
    },
    data: function() {
        return {
            goalStore: null,
            goals: [],
            timeframe: 'month',
            goalInTimeframe: {
                allCollapsed: false,
                completedCollapsed: true,
            },
            taskInTimeframe: {
                allCollapsed: false,
                completedCollapsed: true,
            },
            goalTimeCollapsed: false,
            taskTimeCollapsed: false
        }
    },
    created: async function() {
        let goalStore = await import(`@/store/goalStore`);
        this.goalStore = goalStore.useGoalStore();

        this.goals = await this.goalStore.getTimeframeItems(this.start, this.end);
    },
    computed: {
        start() { 
            if (this.timeframe == 'day')
                return this.selectedDate;
            else if (this.timeframe == 'week')
                return firstDayOfWeek(this.selectedDate);
            else if (this.timeframe == 'month')
                return firstDayOfMonth(this.selectedDate);
            else if (this.timeframe == 'year')
                return firstDayOfYear(this.selectedDate);
            else
                return null
        },
        end() { 
            if (this.timeframe == 'day')
                return this.selectedDate;
            else if (this.timeframe == 'week')
                return lastDayOfWeek(this.selectedDate);
            else if (this.timeframe == 'month')
                return lastDayOfMonth(this.selectedDate);
            else if (this.timeframe == 'year')
                return lastDayOfYear(this.selectedDate);
            else
                return null
        },
        // goals() {
        //     if (this.goalStore) {
        //         let goals = this.goalStore.getTimeframeItems(this.start, this.end);
        //         return goals;
        //     } else {
        //         return [];
        //     }
        // },
        /* Goals with a time-pair that is mapped to the selected timeframe */
        goalsMappedToTimeframe() {
            let _this = this;
            return this.goals.filter(_goal => {
                let StartisAfterStart = _timePair => _timePair.startTime && _this.start.getTime() >= (new Date(_timePair.startTime.dateTime)).getTime();
                let StartisBeforeEnd = _timePair => _timePair.startTime && _this.start.getTime() <= (new Date(_timePair.endTime.dateTime)).getTime();
                let EndisAfterStart = _timePair => _timePair.endTime && _this.end.getTime() >= (new Date(_timePair.startTime.dateTime)).getTime();
                let EndisBeforeEnd = _timePair => _timePair.endTime && _this.end.getTime() <= (new Date(_timePair.endTime.dateTime)).getTime();

                let isStartInTimeframe = _timePair => StartisAfterStart(_timePair) && StartisBeforeEnd(_timePair);
                let isEndInTimeframe = _timePair => EndisAfterStart(_timePair) && EndisBeforeEnd(_timePair);

                let timepairs = _goal.timePairs.filter(_timePair => isStartInTimeframe(_timePair) || isEndInTimeframe(_timePair));

                if (timepairs.length > 0) return true;
                else return false;
            });
        },
        // /* Goals with a time-pair that is mapped to the selected timeframe */
        // goalMappedToTimeframe() {
        //     return this.goals.filter(_goal => {
        //         let StartisAfterStart = _timePair => _timePair.startTime && (new Date(_timePair.startTime.dateTime)).getTime() > this.start.getTime();
        //         let StartisBeforeEnd = _timePair => _timePair.startTime && (new Date(_timePair.startTime.dateTime)).getTime() > this.end.getTime();
        //         let EndisAfterStart = _timePair => _timePair.endTime && (new Date(_timePair.endTime.dateTime)).getTime() > this.start.getTime();
        //         let EndisBeforeEnd = _timePair => _timePair.endTime && (new Date(_timePair.endTime.dateTime)).getTime() > this.end.getTime();

        //         let isStartInTimeframe = _timePair => StartisAfterStart(_timePair) && StartisBeforeEnd(_timePair);
        //         let isEndInTimeframe = _timePair => EndisAfterStart(_timePair) && EndisBeforeEnd(_timePair);

        //         let timepairs = _goal.timePairs.filter(_timePair => isStartInTimeframe(_timePair) || isEndInTimeframe(_timePair));

        //         if (timepairs.length > 0) return true;
        //         else return false;
        //     });
        // },
        // _itera.text == "Treat weeds in lawn"
        /* Goals with an iteration that is mapped to the selected timeframe */
        goalsWithIterationMappedToTimeframe() {
            let ids = this.goalsMappedToTimeframe.map(_goal => _goal.id);
            return this.goals.filter(_goal => !ids.includes(_goal.id));
        },
        
        iterationsMappedToTimeframe() {
            return this.goals.filter(_goal => {
                let StartisAfterStart = _itera => _itera.startAt && (new Date(_itera.startAt)).getTime() > this.start.getTime();
                let StartisBeforeEnd = _itera => _itera.startAt && (new Date(_itera.startAt)).getTime() > this.end.getTime();
                let EndisAfterStart = _itera => _itera.endAt && (new Date(_itera.endAt)).getTime() > this.start.getTime();
                let EndisBeforeEnd = _itera => _itera.endAt && (new Date(_itera.endAt)).getTime() > this.end.getTime();

                let isStartInTimeframe = _itera => StartisAfterStart(_itera) && StartisBeforeEnd(_itera);
                let isEndInTimeframe = _itera => EndisAfterStart(_itera) && EndisBeforeEnd(_itera);

                let iterations = _goal.todos.flat().flatMap(_todo => _todo.iterations);
                iterations = iterations.filter(_itera => isStartInTimeframe(_itera) || isEndInTimeframe(_itera));

                if (iterations.length > 0) return true;
                else return false;
            });
        },
    },
    methods: {
        incompleteIterations(goal) {
            let iterations = [];
            goal.todos.forEach(_todo => {
                let _iterations = _todo.iterations.filter(_iter => !_iter.attemptedAt);
                iterations = iterations.concat(_iterations);
            });
            return iterations;
        },
        completeIterations(goal) {
            let iterations = [];
            goal.todos.forEach(_todo => {
                let _iterations = _todo.iterations.filter(_iter => _iter.attemptedAt);
                iterations = iterations.concat(_iterations);
            });
            return iterations;
        },
        iterationsInTimeframe(goal) {
            let _this = this;

            let StartisAfterStart = _itera => _itera.startAt && (new Date(_itera.startAt)).getTime() >= _this.start.getTime();
            let StartisBeforeEnd = _itera => _itera.startAt && (new Date(_itera.startAt)).getTime() <= _this.end.getTime();
            let EndisAfterStart = _itera => _itera.endAt && (new Date(_itera.endAt)).getTime() >= _this.start.getTime();
            let EndisBeforeEnd = _itera =>_itera.endAt && (new Date(_itera.endAt)).getTime() <= _this.end.getTime();

            let isStartInTimeframe = _itera => StartisAfterStart(_itera) && StartisBeforeEnd(_itera);
            let isEndInTimeframe = _itera => EndisAfterStart(_itera) && EndisBeforeEnd(_itera);

            let iterations = goal.todos.flat().flatMap(_todo => _todo.iterations);
            iterations = iterations.filter(_itera => isStartInTimeframe(_itera) || isEndInTimeframe(_itera))
                // .filter(_iter => !_iter.attemptedAt);

            return iterations;
        },
        getTodoQueue(goal) {
            let _this = this;
            let todos = [];
            goal.todos.forEach(todo => {
                let children = _this.getTodoChildren(todo);
                todos = todos.concat(children);
                todos.push(todo);
            });
            return todos;
        },
        getTodoChildren(todo) {
            let _this = this;
            let todos = [];
            todo.children.forEach(child => {
                let children = _this.getTodoChildren(child);
                todos = todos.concat(children);
                todos.push(child);
            });
            return todos;
        }
    },
    watch: {
        async timeframe() {
            this.goals = await this.goalStore.getTimeframeItems(this.start, this.end);
        },
        async selectedDate() {
            this.goals = await this.goalStore.getTimeframeItems(this.start, this.end);
        },
    }
}


</script>

<style scoped>
h1, h2 {
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    margin-left: 20px;
    margin-bottom: 0px;
    text-transform: capitalize;
    user-select: none;
    color: #3B99FC;
}

h2 {
    font-size: 12px;
    color: #565656
}

.caret {
    margin-right: 20px;
}

ul {
    list-style: none;
    padding: 0px;
    margin: 0px;
    text-align: start;
}

li.goal { 
    /* min-height: 32px; */
    color: #565656;
    vertical-align: middle;
    padding: 2px 0px;
    /* font-weight: 300; */
}

.goal-item {
    padding:  4px 8px 4px 20px;
    font-size: 15px;
    font-weight: 400;
    line-height: 19px;
}

li.todo { 
    padding-left: 12px;
    font-weight: 300;
}
</style>