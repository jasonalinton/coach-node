<template>
    <div class="d-flex flex-column" @click.prevent.stop="item.isExpanded = !item.isExpanded">
        <div class="d-flex flex-row flex-grow-1">
            <span class="label" :style="{ 'padding-left': `${level * 10}px`}">{{ item.label }}</span>
            <div v-if="item.showPoints" class="d-flex flex-row justify-content-between flex-grow-1 pe-2">
                <span class="dot" :style="{ 'background-color': item.color || 'gray' }"></span>
                <span class="dot" :style="{ 'background-color': item.color || 'gray' }"></span>
            </div>
            <span v-if="item.showPoints" class="points">{{ points }}</span>
        </div>
        <div v-if="item.isExpanded" class="d-flex flex-column">
            <TypePoints v-for="(child, index) in item.items" :key="index" 
                        :item="child" :level="level + 1" :iterations="iterations" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'TypePoints',
    props: {
        item: Object,
        level: Number,
        iterations: Array
    },
    data: function () {
        return {
            todoStore: undefined,
        }
    },
    created: async function() {
        let todoStore = await import(`@/store/todoStore`);
        this.todoStore = todoStore.useTodoStore();
    },
    computed: {
        points() {
            if (this.todoStore == undefined) {
                return 0;
            }
            if (this.item.type == 'iteration') {
                let iterations = this.iterations.filter(x => x.attemptedAt != null || x.completedAt != null);
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
                        matchingIterations.push(iteration);
                        return;
                    } else {
                        todo.parents.forEach(todo => {
                            _this.isTodoOfType(iteration, todo.id, matchingIterations)
                        })
                    }
                }
            }
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
    text-align: start;
}
</style>