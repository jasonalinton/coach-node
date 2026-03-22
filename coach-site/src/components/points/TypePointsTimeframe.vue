<template>
    <div class="d-flex flex-column">
        <span v-if="item.showPoints" class="points">{{ points }}</span>
    </div>
</template>

<script>
import { firstDayOfWeek, lastDayOfWeek, firstDayOfMonth, lastDayOfMonth, firstDayOfYear, lastDayOfYear } from '../../../utility/timeUtility';
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
            if (this.idTimeframe == TIMEFRAME.WEEK) {
                return firstDayOfWeek(this.date);
            } else if (this.idTimeframe == TIMEFRAME.MONTH) {
                return firstDayOfMonth(this.date);
            } else if (this.idTimeframe == TIMEFRAME.YEAR) {
                return firstDayOfYear(this.date);
            }
            return this.date;
        },
        end() {
            if (this.idTimeframe == TIMEFRAME.WEEK) {
                return lastDayOfWeek(this.date);
            } else if (this.idTimeframe == TIMEFRAME.MONTH) {
                return lastDayOfMonth(this.date);
            } else if (this.idTimeframe == TIMEFRAME.YEAR) {
                return lastDayOfYear(this.date);
            }
            return this.date;
        },
        iterations() {
            let iterations = [];
            if (this.iterationStore) {
                iterations = this.iterationStore.iterations;
                iterations = iterations.filter(iteration => {
                    return +(new Date(iteration.startAt)) >= +this.start && 
                           +(new Date(iteration.endAt)) <= +this.end
                });
            }
            return iterations;
        },
        points() {
            if (this.todoStore == undefined || this.goalStore == undefined || this.iterationStore == undefined) {
                return 0;
            }

            let iterations = this.iterationStore.iterations;
            iterations = iterations.filter(iteration => {
                return +(new Date(iteration.startAt)) >= +this.start && 
                        +(new Date(iteration.endAt)) <= +this.end
            });

            if (this.item.type == 'iteration') {
                iterations = this.iterations.filter(x => x.attemptedAt != null || x.completedAt != null);
                let points = iterations.filter(x => x.points != null)
                .reduce((accumulator, currentValue) => accumulator + currentValue.points, 0,);
                return points;
            } else if (['type', 'goal', 'metric'].includes(this.item.type)) {
                let _this = this;
                var matchingIterations = [];
                this.iterations.filter(x => x.attemptedAt != null || x.completedAt != null)
                .forEach(task => {
                    if (task.todoID) {
                        _this.isTodoOfType(task, task.todoID, matchingIterations);
                    }
                });
                let points = matchingIterations.filter(x => x.points != null)
                .reduce((accumulator, currentValue) => accumulator + currentValue.points, 0,);
                return points;
            }
            return 10;
        }
    },
    methods: {
        isTodoOfType(iteration, todoID, matchingIterations) {
            let _this = this;
            if (todoID) {
                var todo = this.todoStore.getItem(todoID);
                if (todo) {
                    var typeIDs = todo[`${_this.item.type}s`].map(y => y.id);
                    let isType = false;
                    if (this.item.id) {
                        isType = typeIDs.includes(this.item.id);
                    } else if (this.item.ids) {
                        for (let i = 0; i < this.item.ids.length && !isType; i++) {
                            isType = typeIDs.includes(this.item.ids[i]);
                        }
                    }
                    if (isType) {
                        var id = matchingIterations.findIndex(x => x.id == iteration.id);
                        if (id == -1) {
                            matchingIterations.push(iteration);
                        }
                        return;
                    } else {
                        todo.parents.forEach(todo => {
                            _this.isTodoOfType(iteration, todo.id, matchingIterations)
                        });
                        if (_this.item.type == "goal" || _this.item.type == "metric") {
                            todo.goals.forEach(goal => {
                                _this.isGoalOfType(iteration, goal.id, matchingIterations)
                            });
                        }
                    }
                }
            }
        },
        isGoalOfType(iteration, goalID, matchingIterations) {
            let _this = this;
            if (goalID) {
                var goal = this.goalStore.getItem(goalID);
                if (goal) {
                    var typeIDs = [];
                    if (_this.item.type == "goal") {
                        typeIDs = goal.parents.map(y => y.id);
                    } else if (_this.item.type == "metric") {
                        typeIDs = goal.metrics.map(y => y.id);
                    }
                    let isType = false;
                    if (this.item.id) {
                        isType = typeIDs.includes(this.item.id);
                    } else if (this.item.ids) {
                        for (let i = 0; i < this.item.ids.length && !isType; i++) {
                            isType = typeIDs.includes(this.item.ids[i]);
                        }
                    }
                    if (isType) {
                        var id = matchingIterations.findIndex(x => x.id == iteration.id);
                        if (id == -1) {
                            matchingIterations.push(iteration);
                        }
                        return;
                    } else {
                        goal.parents.forEach(goal => {
                            _this.isGoalOfType(iteration, goal.id, matchingIterations)
                        });
                    }
                }
            }
        },
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