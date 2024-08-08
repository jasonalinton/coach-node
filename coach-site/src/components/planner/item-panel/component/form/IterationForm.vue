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
                    spellcheck/>
        </div>
        <!-- Points -->
        <div class="points d-flex flex-row align-items-center mt-1">
            <span class="me-1">Points</span>
            <input class="form-control form-control-sm me-1" type="number" min="1" v-model="iteration_updated.points"
                    :style="{'width': '41px'}" required/>
        </div>
        <!-- Time -->
        <div class="form-group mt-1">
            <DateSelector class="date-selector mt-1" :class="{ 'invalid': !isValid }"
                          :date="iteration_updated.startAt" @onChange="iteration_updated.startAt = $event"></DateSelector>
            <!-- <span v-if="!iteration.startAt" class="error float-start mb-2">Iteration must have start</span> -->
            <DateSelector class="date-selector mt-3" :class="{ 'invalid': !isValid }"
                          :date="iteration_updated.endAt" @onChange="iteration_updated.endAt = $event"></DateSelector>
        </div>
        <div class="d-flex flew-row justify-content-end mt-3">
            <!-- Buttons -->
            <div class="form-group d-flex justify-content-end">
                <button class="btn-sm btn-primary me-2" :class="{ 'btn-primary': isValid, 'btn-danger': !isValid }" type="button"
                        :disabled="!isValid"
                        @click.prevent="save">Save</button>
                <button class="btn-sm btn-warning" type="button" @click.prevent="close">Cancel</button>
            </div>
        </div>
    </form>
</template>

<script>
import DateSelector from "../../../../controls/select/DateSelector.vue"

export default {
    name: "IterationForm",
    components: { DateSelector },
    props: {
        iteration: Object
    },
    data: function() {
        return {
            iterationStore: undefined,
            iteration_updated: undefined,
            isValid: true
        }
    },
    created: async function() {
        let iterationStore = await import(`@/store/iterationStore`);
        this.iterationStore = iterationStore.useIterationStore();

        this.initUpdatedIteration();
    },
    methods: {
        initUpdatedIteration,
        validateTimes,
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

function save() {
    var title = this.iteration_updated.text.trim();
    if (title == "") return;

    this.iterationStore.updateIteration(this.iteration_updated.id, this.iteration_updated.text, this.iteration_updated.points, 
        this.iteration_updated.startAt, this.iteration_updated.endAt);

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
</style>