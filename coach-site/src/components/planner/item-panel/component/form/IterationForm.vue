<template>
    <form :id="`iteration-form`" class="pb-2" v-on:submit.prevent>
        <!-- Header -->
        <div class="d-flex flew-row justify-content-between mt-2">
            <!-- Back Button -->
            <div class="form-group d-flex justify-content-start">
                <img class="icon-button"
                     src='/icon/previous.png' width="16" height="16"
                        @click.prevent="close"/>
            </div>
        </div>
        <!-- Title/Text -->
        <div class="form-group mt-3">
            <input class="title textbox" type="text" ref="text" placeholder="Title"
                    v-model.lazy.trim="iteration.text"
                    v-on:keyup.enter="save(iteration)"
                    spellcheck/>
        </div>
        <!-- Time -->
        <div class="form-group mt-1">
            <DateSelector class="mt-3" :date="iteration.startAt" @onChange="iteration.startAt = $event"></DateSelector>
            <span v-if="!iteration.startAt" class="error float-start mb-2">Iteration must have start</span>
            <DateSelector class="mt-3" :date="iteration.endAt" @onChange="iteration.endAt = $event"></DateSelector>
        </div>
        <div class="d-flex flew-row justify-content-end mt-3">
            <!-- Buttons -->
            <div class="form-group d-flex justify-content-end">
                <button class="btn-sm btn-primary me-2" type="button" @click.prevent="save(iteration)">Save</button>
                <button class="btn-sm btn-warning" type="button" @click.prevent="close">Cancel</button>
            </div>
        </div>
    </form>
</template>

<script>
import DateSelector from "../../../../controls/select/DateSelector.vue"
import { updateIteration } from '../../../../../resolvers/planner-resolvers';

export default {
    components: { DateSelector },
    props: {
        iteration: Object
    },
    data: function () {
        return {
            daysOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            btnStr: "Done",
        }
    },
    methods: {
        save,
        close,
        updateIteration
    },
}

function save(iteration) {
    var title = iteration.text.trim();
    if (title == "") return;
    if (!iteration.startAt) return;

    this.updateIteration(iteration, this.$apollo);

    this.close();
}

function close() {
    this.$emit('closeForm');
}
</script>

<style>
form {
    padding-left: 12px;
    padding-right: 12px;
    height: calc(100vh - 64px - 42px);
    overflow: scroll;
}

input {
    background-color: white;
}

.title {
    padding-top: 10px;
}

.error {
    color: red;
    font-size: 12px;
    border-color: red
    /* outline-style: none; */
    /* -webkit-appearance: none; */
}
</style>