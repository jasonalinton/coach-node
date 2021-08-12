<template>
    <select class="form-select form-select-sm" multiple :size="count" aria-label="multiple select" v-model="ids"> 
        <option v-for="item in items" v-bind:key="item.id" :value="item.id">{{item.text}}</option> 
    </select>
</template>

<script>
export default {
    name: 'SelectItem',
    props: {
        items: Array,
        selectedItems: Array
    },
    data: function() {
        return {
            count: 10,
            originalSelection: new Array(...this.selectedItems)
        }
    },
    computed: {
        ids: {
            get() {
                return this.selectedItems.map(item => item.id);
            },
            set(value) {
                let selected = this.items.filter(item => value.includes(item.id));

                selected.forEach(routine => this.$emit('mapRoutine', routine))

                this.selectedItems.splice(0, this.selectedItems.length);
                this.selectedItems.push(...selected);
            }
        }
    }
}
</script>
