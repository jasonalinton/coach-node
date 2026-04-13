<template>
    <div>
        <div class="d-flex flex-row">
            <span></span>
        </div>
        <div class="d-flex flex-column">
            <span></span>
        </div>
        <!-- Button -->
        <button type="button" class="btn btn-primary mb-2" @click="logAllSets">Log All Sets</button>
        
        <!-- Textbox -->
        <input class="textbox text" type="text" placeholder="Title"
               v-model.lazy.trim="newPost.title" 
               v-on:keyup.enter="addTask(false)"
               v-on:keyup.esc="newTaskText = undefined"
               spellcheck="true"/>

        <!-- Date-Time -->
        <input class="mb-2" type="datetime-local" :value="newPost.datetime" @change="onChange"/>
        
        <!-- Text Area -->
        <textarea class="textarea" 
                v-model.lazy.trim="description.value"
                placeholder="Click to add Description"
                spellcheck="true"></textarea>

        <!-- Header -->
        <div class="top d-flex flex-column sticky-top">
            <div class="label d-flex flex-row mb-2">
                <img class="icon-button mb-2"
                        src='/icon/previous.png' width="20" height="20"
                        @click.prevent="back"/>
                <span>Exercises</span>
                <img class="icon-button" src="/icon/add-button.png" :width="20" :height="20" 
                    @click="selectExercises" />
            </div>
            <input id="name" class="textbox mb-2" type="text" ref="text"  placeholder="Workout Name"
                    v-model.lazy.trim="name.value" 
                    spellcheck="true"/>
        </div>

        <!-- Radio -->
        <div class="app-pills d-flex flex-row justify-content-between mt-1 gap-1">
            <span v-for="timeframe in timeframes.slice(0,3)" v-bind:key="timeframe.id" 
                    class="app-pill flex-grow-1" :class="{ 'selected': isTimeframeSelected(timeframe.id)}"
                    @click="toggleTimeframe(timeframe.id)">
                {{ timeframe.text }}
            </span>
        </div>
    </div>
</template>

<script>
import { firstDayOfWeek, firstDayOfMonth, firstDayOfYear, lastDayOfWeek, lastDayOfMonth, lastDayOfYear } from '../../../../../utility/timeUtility';

export default {
    name: 'TemplateComonents',
    components: {  },
    props: {
        
    },
    data: function () {
        return {
            appStore: undefined,
            plannerStore: undefined,
            iterationStore: undefined,
            todoStore: undefined,
            goalStore: undefined,
        }
    },
    created: async function() {
        let appStore = await import(`@/store/appStore`);
        this.appStore = appStore.useAppStore();

        let plannerStore = await import(`@/store/plannerStore`);
        this.plannerStore = plannerStore.usePlannerStore();

        let iterationStore = await import(`@/store/iterationStore`);
        this.iterationStore = iterationStore.useIterationStore();

        let todoStore = await import(`@/store/todoStore`);
        this.todoStore = todoStore.useTodoStore();

        let goalStore = await import(`@/store/goalStore`);
        this.goalStore = goalStore.useGoalStore();
    },
    computed: {
        selectedDate() {
            return (this.plannerStore) ? this.plannerStore.selectedDate : today();
        },
        start() {
            if (this.idTimeframe == TIMEFRAME.WEEK) {
                return firstDayOfWeek(this.selectedDate);
            } else if (this.idTimeframe == TIMEFRAME.MONTH) {
                return firstDayOfMonth(this.selectedDate);
            } else if (this.idTimeframe == TIMEFRAME.YEAR) {
                return firstDayOfYear(this.selectedDate);
            }
            return this.selectedDate;
        },
        end() {
            if (this.idTimeframe == TIMEFRAME.WEEK) {
                return lastDayOfWeek(this.selectedDate);
            } else if (this.idTimeframe == TIMEFRAME.MONTH) {
                return lastDayOfMonth(this.selectedDate);
            } else if (this.idTimeframe == TIMEFRAME.YEAR) {
                return lastDayOfYear(this.selectedDate);
            }
            return this.selectedDate;
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
        }
    },
    methods: {
        
    },
}


function getDateTimeString() {
    let date = new Date(this.time.dateTime);
    let dateTimeJSON = date.toJSON();

    if (this.time.idMoment == 87) { // Date
        let dateTimeArray = dateTimeJSON.split("T");
        let dateArray = dateTimeArray[0].split("-");
        return `${dateArray[0]}-${dateArray[1]}-${dateArray[2]}`;
    } else if (this.time.idMoment == 88) { // Time
        let dateTimeArray = dateTimeJSON.split("T");
        let timeArray = dateTimeArray[1].split(":");
        return `${timeArray[0]}:${timeArray[1]}`;
    } else if (this.time.idMoment == 89) { // Date-Time
        let dateTimeArray = dateTimeJSON.split("T");
        let dateArray = dateTimeArray[0].split("-");
        let timeArray = dateTimeArray[1].split(":");
        return `${dateArray[0]}-${dateArray[1]}-${dateArray[2]} ${timeArray[0]}:${timeArray[1]}`;
    }
} 

</script>

<style>
.pill {
    cursor: pointer;
    padding: 4px 0px;
    line-height: 14px;
    font-size: 14px;
    background-color: var(--pill-default);
    border-radius: 4px;
    border: transparent solid 1px;
}
.pill:hover {
    border: var(--pill-border-hover) solid 1px;
}
.pill.selected {
    border: var(--pill-border-hover) solid 1px;
    background-color: var(--pill-background-selected);
}
.pill:active {
    background-color: var(--pill-background-selected);
}
</style>