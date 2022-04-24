<template>
    <form :id="`iteration-form`" class="pb-2" v-on:submit.prevent>
        <!-- Header -->
        <div class="d-flex flew-row justify-content-between mt-4">
            <!-- Back Button -->
            <div class="form-group d-flex justify-content-start">
                <img class="icon-button" 
                     src='/icon/previous.png' width="16" height="16"
                        @click.prevent="close"/>
            </div>
        </div>
        <!-- Title/Text -->
        <div class="form-group mt-1">
            <input class="title textbox" type="text" ref="text"  placeholder="Title"
                    v-model.lazy.trim="iteration.text" 
                    v-on:keyup.enter="save(iteration)"
                    spellcheck/>
        </div>
        <!-- Time -->
        <div class="form-group mt-1">
        <!-- <Datepicker :value="startDateTimeString" :dayStr="daysOfWeek" :btnStr="btnStr"
                        @input="setDateTime($event, 'startAt')">
        </Datepicker> -->
            <DateSelector :date="iteration.startAt" @onChange="iteration.startAt = $event"></DateSelector>
            
        </div>
        <div class="d-flex flew-row justify-content-between mt-4">
            <!-- Buttons -->
            <div class="form-group d-flex justify-content-end">
                <button class="btn btn-primary me-2" type="button" @click.prevent="save(iteration)">Save</button>
                <button class="btn btn-warning" type="button" @click.prevent="close">Cancel</button>
            </div>
        </div>
    </form>
</template>

<script>
// import { Datepicker } from '@livelybone/vue-datepicker';
// import { toDateString, toTimezoneOffset } from '../../../../../../utility';

import DateSelector from "../../../../controls/select/DateSelector.vue"

export default {
    components: { DateSelector },
    // components: { Datepicker },
    props: {
        iteration: Object
    },
    data: function () {
        return {
            daysOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            btnStr: "Done",
        }
    },
    // computed: {
    //     startDateTimeString() { 
    //         return (this.iteration.startAt) ? this.toDateString(this.iteration.startAt) : null; 
    //     }
    // },
    methods: {
        save,
        close,
        // setDateTime,
        // saveIteration,
        // toDateString,
        // toTimezoneOffset
    },
}

// function setDateTime(value, prop) {
//     let timezoneOffset = this.toTimezoneOffset(new Date(value).toJSON());
//     this.iteration[prop] = value + "T00:00:00" + timezoneOffset;
// }

function save(iteration) {
    var title = iteration.text.trim();
    if (title == "") return;

    this.saveIteration(iteration, this.$apollo);

    this.close();
}

function close() {
    this.$emit('closeForm');
}
</script>

<style>
/* @import '../../../../../../node_modules/@livelybone/vue-datepicker/lib/css/index.css'; */

form {
    padding-left: 12px;
    padding-right: 12px;
    height: calc(100vh - 64px - 42px);
    overflow: scroll;
}

.title {
    padding-top: 10px;
}

</style>