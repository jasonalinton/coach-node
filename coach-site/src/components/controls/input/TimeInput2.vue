<template>
    <div>
        <input v-if="moment == 'Date'" class="date-picker" :class="{ 'invalid': !isValid}" type="date" :value="time" @change="onChange" />
        <input v-if="moment == 'Time'" class="date-picker" :class="{ 'invalid': !isValid}" type="time" :value="time" @change="onChange" />
        <input v-if="moment == 'DateTime'" class="date-picker" :class="{ 'invalid': !isValid}" type="datetime-local" :value="time" @change="onChange" />
    </div>
</template>

<script>
var momentTypes = [
    { id: 87, text: "Date" },
    { id: 88, text: "Time" },
    { id: 89, text: "DateTime" },
]

export default {
    name: 'TimeInput2',
    props: {
        time: String,
        momentID: Number,
        canRemove: {
            type: Boolean,
            default: true
        },
        isValid: {
            type: Boolean,
            default: true
        }
    },
    data: function () {
        return {
            momentTypes,
        }
    },
    computed: {
        moment() { return momentTypes.find(x => x.id == this.momentID).text; }
    },
    methods: {
        onChange
    },
}

function onChange(value) {
    value = value.currentTarget.value;
    let time = value;
    if (value == "") {
        if (this.canRemove) {
            this.$emit("removeTime");
        }
    } else {
        if (this.moment == "DateTime") {
            let date = new Date(value);
            time = date.toJSON();
        }
        
        this.$emit("setTime", time);
    }
}
</script>

<style scoped>
.datetime-picker .input-wrapper {
    border-radius: 0px;
}

.vue-input {
    color: #212529;
    height: 26px !important;
    padding-top: 1px !important;
}

.datetime-picker .input-wrapper:not(.accissible) {
    outline-style: none;
    -webkit-appearance: none;
    border: 1px solid rgba(0, 0, 0, .08);
    resize: none;
}

.datetime-picker .input-wrapper:not(.accissible):hover:not(:focus-within) {
    border: 1px solid rgba(0, 0, 0, .2);
}

.datetime-picker .input-wrapper:focus-within, .datetime-picker .input-wrapper:focus-within:hover  {
    border: 1px solid #039BE5;
    transition-property: border-color;
    transition-duration: 0.15s;
    transition-timing-function: ease-in-out;
    transition-delay: 0s;
    resize: vertical;
}

.input-wrapper .suffix {
    visibility: hidden;
}

input.invalid {
    color: red;
}
</style>