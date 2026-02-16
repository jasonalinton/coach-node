<template>
    <div v-if="todo" class="todo-memorization-item d-flex flex-column">
        <div class="top d-flex flex-column sticky-top pt-2">
            <div class="label d-flex flex-row mb-2">
                <img class="icon-button"
                        src='/icon/previous.png' width="20" height="20"
                        @click.prevent="$emit('back')"/>
                <div class="text-start mb-2">{{ todo.text }}</div>
            </div>
            <!-- <TodoMemorizationTimeline :idTodo="idTodo" /> -->
            <div class="d-flex justify-content-evenly mb-3">
                <span v-for="data in timeline" 
                      class="dot" 
                      :class="{ 'complete': isComplete(data), 'selected': data == selected, 'incomplete': isInComplete(data), 'is-active': data.isActive }"
                      @click="selectData(data)">
                </span>
            </div>
        </div>
        <div v-if="!selected && lastBlurb"
             class="blurb text-start">
             {{ lastBlurb }}
        </div>
        <div v-if="selected" class="blurb flex-grow-1 form-group mt-1">
            <textarea class="textarea" 
                v-model.lazy.trim="selected.iteration.blurb"
                placeholder="Click to add blurb"
                spellcheck="true">
            </textarea>
        </div>
        <div class="d-flex flex-column sticky-bottom">
            <button class="btn" type="button"
                    @click="markComplete">
                Mark Complete
            </button>
        </div>
    </div>
</template>

<script>
import { clone, sortDateAsc } from '../../../../../../utility';
import { startOfDay } from '../../../../../../utility/timeUtility';
import { addSecond, addDay } from '../../../../../../utility/timeUtility';
import TodoMemorizationTimeline from './TodoMemorizationTimeline.vue';


export default {
    name: 'TodoMemorizationItem',
    components: { TodoMemorizationTimeline },
    props: {
        idTodo: Number
    },
    data: function () {
        return {
            todoStore: undefined,
            iterationStore: undefined,
            universalStore: undefined,
            timeline: undefined,
            selected: undefined
        }
    },
    created: async function() {
        let todoStore = await import(`@/store/todoStore`);
        this.todoStore = todoStore.useTodoStore();

        let iterationStore = await import(`@/store/iterationStore`);
        this.iterationStore = iterationStore.useIterationStore();

        let universalStore = await import(`@/store/universalStore`);
        this.universalStore = universalStore.useUniversalStore();

        this.refreshTimeline();
    },
    computed: {
        todo() {
            if (this.todoStore) {
                let todo = this.todoStore.getItem(this.idTodo);
                return todo;
            }
            return undefined;
        },
        iterations() {
            if (this.iterationStore && this.universalStore) {
                let iterations = this.iterationStore.iterations.filter(task => task.todoID == this.idTodo);
                iterations = clone(iterations);
                return sortDateAsc(iterations, 'startAt');
            }
            return [];
        },
        lastBlurb() {
            for (let i = this.iterations.length - 1; i > -1; i--) {
                if (this.iterations[i].blurbIds.length > 0) {
                    let blurb = this.universalStore.getBlurb(this.iterations[i].blurbIds[0]);
                    if (blurb) {
                        return blurb.text;
                    }
                }
            }
        }
    },
    methods: {
        refreshTimeline,
        initTimeline,
        loopIterations,
        isComplete,
        isInComplete,
        selectData,
        markComplete
    },
    watch: {
        iterations() {
            this.refreshTimeline();
            if (this.iterations.length > 0) {
                this.initTimeline();
            }
        }
    }
}

function refreshTimeline() {
    this.timeline = {
        d0: {
            day: "D0",
            nextDay: "D1",
            daysToComplete: 1,
            daysTillNext: 1,
            iteration: undefined
        },
        d1: {
            day: "D1",
            nextDay: "D3",
            daysToComplete: 1,
            daysTillNext: 2,
            iteration: undefined
        },
        d3: {
            day: "D3",
            nextDay: "D7",
            daysToComplete: 1,
            daysTillNext: 4,
            iteration: undefined
        },
        d7: {
            day: "D7",
            nextDay: "D16",
            daysToComplete: 2,
            daysTillNext: 9,
            iteration: undefined
        },
        d16: {
            day: "D16",
            nextDay: "D30",
            daysToComplete: 2,
            daysTillNext: 14,
            iteration: undefined
        },
        d30: {
            day: "D30",
            nextDay: undefined,
            daysToComplete: 2,
            daysTillNext: undefined,
            iteration: undefined
        },
    }
}

function initTimeline() {
    let index = 0;
    let succes;
    
    do {
        succes = this.loopIterations(index);
        if (!succes && index < this.iterations.length - 1) {
            index++;
            this.refreshTimeline();
        } else {
            index = -1;
        }
    } while (index > 0)
}

function loopIterations(index) {
    let nextStart;
    let nextEnd;
    let now = new Date();

    for (let i = index, d = 0; i < this.iterations.length; i++) {
        /* Set iteration */
        let data = this.timeline[`d${d}`];
        let start = this.iterations[i].startAt.toDate();
        if (i > index) {
            if (+start < +nextStart || +start > nextEnd) {
                return false;
            } else {
                if (+now >= +nextStart && +now <= nextEnd) {
                    data.isActive = true;
                }
            }
        } else {
            if (+startOfDay(start) == +startOfDay(now)) {
                data.isActive = true;
            }
        }
        data.iteration = this.iterations[i];

        /* Set blurb */
        if (this.iterations[i].blurbIds.length > 0) {
            let blurb = this.universalStore.getBlurb(this.iterations[i].blurbIds[0]);
            if (blurb) {
                this.iterations[i].blurb = blurb.text;
            }
        } else {
            this.iterations[i].blurb = undefined;
        }

        if (d == 0) {
            d = 1;
        } else {
            d = d + data.daysTillNext;
        }
        nextStart = addDay(start, data.daysTillNext);
        nextEnd = addSecond(addDay(nextStart, data.daysToComplete), -1);
    }

    return true;
}

function isComplete(data) {
    if (data.iteration) {
        return data.iteration.attemptedAt != undefined;
    } else {
        return false;
    }
}

function isInComplete(data) {
    if (data.iteration) {
        return data.iteration.attemptedAt == undefined;
    } else {
        return undefined;
    }
}

function selectData(data) {
    this.selected = (this.selected != data) ? data : undefined;
}

function markComplete() {
    let now = new Date();
    if (this.selected.nextDay) {
        let text = this.selected.iteration.text.replace(this.selected.day, this.selected.nextDay);
        let newStart = addDay(this.selected.iteration.startAt.toDate(), this.selected.daysTillNext);
        
        this.iterationStore.completeAndCreatSibling(this.selected.iteration.id, now, text, newStart, newStart);
    } else {
        this.iterationStore.toggleCompletion(this.selected.iteration.id, now, now)
    }

}

</script>

<style scoped>
.top {
    background-color: var(--background-color);
}

.dot {
    width: 16px;
    height: 16px;
    border-radius: 8px;
    border: solid 1px beige;
    background-color: lightgrey;
}

.dot.complete {
    background-color: indianred;
}

.dot.incomplete {
    background-color: orange
}

.dot.is-active.incomplete {
    background-color: cornflowerblue;
}

.dot.selected {
    border: solid 1px black;
}

.blurb {
    font-size: 14px;
    white-space: pre-wrap;
}

.blurb textarea {
    height: 100%;
}

.sticky-bottom {
    position: -webkit-sticky;
    position: sticky;
    bottom: 0;
    z-index: 1020;
    background-color: white;
}
</style>