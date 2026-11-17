<template>
    <div class="d-flex flex-column">
        <span v-if="item.showPoints" class="points">{{ points }}</span>
    </div>
</template>

<script>
import { getTimeframeEndpoints } from '../../../utility/timeUtility';
import { getPoints } from '../../../utility/pointsUtility';
import { TIMEFRAME } from '../../model/constants';

export default {
    name: 'TypePointsTimeframe',
    props: {
        idTimeframe: {
            type: Number,
            default: () => TIMEFRAME.WEEK 
        },
        date: Date,
        item: Object,
    },
    data: function () {
        return {
            iterationStore: undefined,
            todoStore: undefined,
            goalStore: undefined,
        }
    },
    created: async function() {
        let todoStore = await import(`@/store/todoStore`);
        this.todoStore = todoStore.useTodoStore();

        let goalStore = await import(`@/store/goalStore`);
        this.goalStore = goalStore.useGoalStore();

        let iterationStore = await import(`@/store/iterationStore`);
        this.iterationStore = iterationStore.useIterationStore();
    },
    computed: {
        start() {
            return ([TIMEFRAME.WEEK, TIMEFRAME.MONTH, TIMEFRAME.YEAR].includes(this.idTimeframe))
                ? getTimeframeEndpoints(this.idTimeframe, this.date).start : this.date;
        },
        end() {
            return ([TIMEFRAME.WEEK, TIMEFRAME.MONTH, TIMEFRAME.YEAR].includes(this.idTimeframe))
                ? getTimeframeEndpoints(this.idTimeframe, this.date).end : this.date;
        },
        points() {
            let stores = { iterationStore: this.iterationStore, todoStore: this.todoStore, goalStore: this.goalStore };
            return getPoints(stores, this.item, this.start, this.end);
        }
    },
}

</script>

<style scoped>
.label {
    text-align: start;
    padding-right: 10px;
}

.dot {
    width: 5px;
    height: 5px;
    border-radius: 2.5px;
    margin: auto 0;
}

.points {
    width: 30px;
    text-align: end;
}
</style>