<template>
    <div class="btn-group w-100" role="group" :aria-label="`moment`">
        <template v-for="(option, index) in options">
            <input  :key="index + 1" type="radio" class="btn-check" :id="option" v-model="selected" :value="option" />
            <label  :key="(index + 1) * -1" class="btn btn-outline-primary" :for="option">{{ option }}</label>
        </template>
    </div>
</template>

<script>
export default {
    name: 'RadioButton',
    props: {
        options: Array,
        initiallySelected: String
    },
    data: function() {
        return {
            initialized: false,
            selected: undefined
         }
    },
    created: function() {
        this.selected = this.initiallySelected
        this.initialized = true;
    },
    watch: {
        selected() {
            if (this.initialized) {
                this.$emit('selectOption', this.selected);
            }
        }
    }
}
</script>

<style scoped>
.btn-group {
    height: 24px;
}

.btn-group label {
    font-size: 14px;
    line-height: 24px;
    padding: 0px 4px;
    height: 22px;
    border: none;
    border-radius: initial;
    color: #565656;
}

.btn, .btn:focus {
    outline-style: none;
    box-shadow: none !important;
}

.btn-check:checked + .btn-outline-primary {
    color: #0D6EFD;
    background-color: #DEECF9;
}

.btn:hover {
    color: #343434;
    background-color: rgba(60, 64, 67, .08);
}
</style>