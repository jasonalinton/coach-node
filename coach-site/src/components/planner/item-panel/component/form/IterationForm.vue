<template>
    <form v-if="iteration_updated"
          :id="`iteration-form`" class="pb-2" v-on:submit.prevent>
        <!-- Header -->
        <div class="d-flex flew-row justify-content-between mt-2">
            <!-- Back Button -->
            <div class="form-group d-flex justify-content-start">
                <img class="icon-button"
                     src='/icon/previous.png' width="16" height="16"
                        @click.prevent="close"/>
            </div>
        </div>
        <!-- ID -->
        <span class="mt-1 float-start">{{ iteration.id }}</span>
        <!-- Title/Text -->
        <div class="form-group mt-3">
            <input class="title textbox" type="text" ref="text" placeholder="Title"
                    v-model.lazy.trim="iteration_updated.text"
                    v-on:keyup.enter="save"
                    spellcheck="true"/>
        </div>
        <!-- Points -->
         <div class="points d-flex flex-column">
             <div class="d-flex flex-row align-items-center mt-1">
                 <span class="me-1">Points</span>
                 <input class="form-control form-control-sm me-1" type="number" min="1" v-model="iteration_updated.points"
                         :style="{'width': '41px'}" required/>
             </div>
            <div class="app-pills d-flex flex-row justify-content-between mt-1 gap-1">
                <span v-for="point in [0,1,3,5,8]" :key="point" class="app-pill flex-grow-1"
                      @click="addPoints(point)">{{ point }}</span>
            </div>
         </div>
        <!-- Time -->
        <div class="form-group mt-2">
            <div class="d-flex flex-column">
                <DateTimeSelector class="date-selector mt-1" :class="{ 'invalid': !isValid }"
                              :dateTime="iteration_updated.startAt" @onChange="iteration_updated.startAt = $event"></DateTimeSelector>
                <div class="app-pills d-flex flex-row flex-wrap justify-content-between mt-1 gap-1">
                    <span v-for="time in startSuggestions" :key="time" class="app-pill flex-grow-1"
                        @click="setTime(time.object, 'start')">{{ time.string }}</span>
                </div>
            </div>
            <div class="d-flex flex-column mt-3">
                <div class="app-pills d-flex flex-row flex-wrap justify-content-between mt-1 gap-1">
                    <span v-for="minutes in [5,10,15,30,60]" :key="time" class="app-pill flex-grow-1"
                        @click="addTime(minutes)">{{ minutes }}</span>
                </div>
                <DateTimeSelector class="date-selector mt-1" :class="{ 'invalid': !isValid }"
                              :dateTime="iteration_updated.endAt" @onChange="iteration_updated.endAt = $event"></DateTimeSelector>
            </div>
        </div>
        <!-- Blurb -->
        <div class="form-group mt-1">
            <textarea class="textarea" 
                v-model.lazy.trim="iteration_updated.blurb"
                placeholder="Click to add blurb"
                spellcheck="true">
            </textarea>
        </div>
        <div class="d-flex flex-column justify-content-end mt-3">
            <!-- Buttons -->
            <div class="d-flex flex-column">
                <!-- Delete -->
                <button v-if="!confimDelete" type="button" class="btn btn-danger mb-2" @click="confimDelete = true">Delete</button>
                <!-- Delete Confirmation -->
                <div v-if="confimDelete" class="d-flex flex-row mb-2 align-items-center">
                    <span>Are you sure?</span>
                    <button type="button" class="btn btn-warning ms-2" @click="confimDelete = false">Cancel</button>
                    <button type="button" class="btn btn-danger ms-2" @click="deleteTask">Delete</button>
                </div>
                <button class="btn-sm btn-secondary mb-2" type="button"
                        @click.prevent="isAllDay">Is All Day</button>
                <button class="btn-sm btn-secondary mb-2" type="button"
                        @click.prevent="toNextDay">To Next Day</button>
                <button class="btn-sm btn-secondary mb-2" type="button"
                        @click.prevent="markAttempted">Attempt</button>
                <button v-if="!isComplete" class="btn-sm btn-secondary mb-2" type="button"
                        @click.prevent="markComplete">Complete</button>
                <button v-if="isComplete" class="btn-sm btn-secondary mb-2" type="button"
                        @click.prevent="markIncomplete">Incomplete</button>
            </div>
            <div class="form-group d-flex justify-content-end">
                <!-- Save Button -->
                <button class="btn-sm btn-primary me-2" :class="{ 'btn-primary': isValid, 'btn-danger': !isValid }" type="button"
                        :disabled="!isValid"
                        @click.prevent="save">Save</button>
                <!-- Cancel Button -->
                <button class="btn-sm btn-warning" type="button" @click.prevent="close">Cancel</button>
            </div>
        </div>
    </form>
</template>

<script>
import { addDay, addMinutes, startOfDay, getShortTimeString } from "../../../../../../utility/timeUtility";
import DateTimeSelector from "../../../../controls/select/DateTimeSelector.vue"

export default {
    name: "IterationForm",
    components: { DateTimeSelector },
    props: {
        iteration: Object
    },
    data: function() {
        return {
            iterationStore: undefined,
            universalStore: undefined,
            iteration_updated: undefined,
            isValid: true,
            confimDelete: false
        }
    },
    created: async function() {
        let iterationStore = await import(`@/store/iterationStore`);
        this.iterationStore = iterationStore.useIterationStore();

        let universalStore = await import(`@/store/universalStore`);
        this.universalStore = universalStore.useUniversalStore();

        this.initUpdatedIteration();
    },
    computed: {
        // blurb() {
        //     if (this.universalStore && this.iteration.blurbIds.length > 0) {
        //         let blurb = this.universalStore.getBlurb(this.iteration.blurbIds[0]);
        //         return blurb;
        //     }
        //     return undefined;
        // },
        isComplete() {
            if (this.iteration.attemptedAt) {
                return true;
            } else {
                return false
            }
        },
        startSuggestions() {
            let suggestions = [];
            if (this.iteration_updated.startAt) {
                let start = new Date();
                const currentMinutes = start.getMinutes();
                const minutesToAdd = 15 - (currentMinutes % 15);
                start.setMinutes(currentMinutes + minutesToAdd);
                start.setSeconds(0);
                start.setMilliseconds(0);

                let minutes = [105, 90, 75, 60, 45, 30, 15];
                minutes.forEach(minutes => {
                    let date = addMinutes(-minutes, start);
                    suggestions.push({
                        object: date,
                        string: getShortTimeString(date)
                    })
                });
                suggestions.push({
                    object: start,
                    string: getShortTimeString(start)
                })
            }
            return suggestions;
        }
    },
    methods: {
        initUpdatedIteration,
        validateTimes,
        addPoints,
        setTime,
        addTime,
        isAllDay,
        toNextDay,
        markAttempted,
        markComplete,
        markIncomplete,
        deleteTask,
        save,
        close,
    },
    watch: {
        iteration() {
            this.initUpdatedIteration();
        },
        'iteration_updated.startAt'() {
            this.validateTimes();
        },
        'iteration_updated.endAt'() {
            this.validateTimes();
        }
    }
}

function initUpdatedIteration() {
    this.iteration_updated = {
        id: this.iteration.id,
        text: this.iteration.text,
        points: this.iteration.points,
        startAt: this.iteration.startAt,
        endAt: this.iteration.endAt
    };
    if (this.iteration.blurbIds.length > 0) {
        let blurb = this.universalStore.getBlurb(this.iteration.blurbIds[0]);
        if (blurb) {
            this.iteration_updated.blurb = blurb.text;
        }
    }
}

function validateTimes() {
    if (this.iteration_updated.startAt && this.iteration_updated.endAt) {
        if (+new Date(this.iteration_updated.startAt) > +new Date(this.iteration_updated.endAt)) {
            this.isValid = false;
        } else if (+new Date(this.iteration_updated.startAt) <= +new Date(this.iteration_updated.endAt)) {
            this.isValid = true;
        }
    } else {
        this.isValid = true;
    }
}

function addPoints(points) {
    if (points == 0) {
        this.iteration_updated.points = null;
        return;
    }
    if (this.iteration_updated.points == null) {
        this.iteration_updated.points = points;
    } else {
        this.iteration_updated.points += points;
    }
}

function setTime(time) {
    this.iteration_updated.startAt = time;
    this.iteration_updated.endAt = time;
}

function addTime(minutes) {
    this.iteration_updated.endAt = addMinutes(minutes, this.iteration_updated.endAt);
}

function isAllDay() {
    this.iteration_updated.startAt = startOfDay(new Date(this.iteration_updated.startAt));
    this.iteration_updated.endAt = startOfDay(new Date(this.iteration_updated.startAt));

    this.save();
}

function toNextDay() {
    let nextDay = addDay(this.iteration_updated.startAt.toDate());
    this.iterationStore.rescheduleIteration(this.iteration_updated.id, nextDay, nextDay);

    this.close();
}

function markAttempted() {
    this.iterationStore.attemptIteration(this.iteration_updated.id, this.iteration_updated.startAt.toDate());

    this.close();
}

function markComplete() {
    let now = new Date();
    this.iteration_updated.attemptedAt = now;
    this.iteration_updated.completedAt = now;

    this.iterationStore.toggleCompletion(this.iteration_updated.id, this.iteration_updated.attemptedAt, this.iteration_updated.completedAt);

    this.close();
}

function markIncomplete() {
    this.iteration_updated.attemptedAt = null;
    this.iteration_updated.completedAt = null;

    this.iterationStore.toggleCompletion(this.iteration_updated.id, this.iteration_updated.attemptedAt, this.iteration_updated.completedAt);

    this.close();
}

function deleteTask() {
    this.iterationStore.deleteIteration(this.iteration_updated.id);

    this.close();
}

function save() {
    var title = this.iteration_updated.text.trim();
    if (title == "") return;

    this.iterationStore.updateIteration(this.iteration_updated.id, this.iteration_updated.text, this.iteration_updated.blurb, 
    this.iteration_updated.points, this.iteration_updated.startAt, this.iteration_updated.endAt);

    this.close();
}

function close() {
    this.$emit('closeForm');
}
</script>

<style scoped>
form {
    padding-left: 12px;
    padding-right: 12px;
    height: calc(100vh - 64px - 42px);
    overflow: scroll;
}

input {
    background-color: white;
}

/* .title {
    padding-top: 10px;
} */

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}

.error {
    color: red;
    font-size: 12px;
    border-color: red
    /* outline-style: none; */
    /* -webkit-appearance: none; */
}

.date-selector.invalid {
    border: solid 1px red;
}

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