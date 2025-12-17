<template>
    <div class="selector">
        <select class="selector form-select form-select-sm panel-select" aria-label="select" v-model="model[`${valueProp}`]"
                @click.stop> 
            <option :value="'Gram'">None</option> 
            <option v-for="(unit, index) in item.units" :key="index" :value="unit.unit">{{unit.unit}}</option> 
        </select>
    </div>
</template>

<script>

export default {
    name: 'Selector',
    components: {  },
    props: {
        valueString: String,
        valueInt: Number,
        model: Object,
        valueProp: String,
        optionsProop: String
    },
    data: function () {
        return {
            value: undefined
        }
    },
    created: function() {
        if (this.valueString) {
        
        }
    },
    computed: {
        theValue: {
            get() {
                return this.value;
            },
            set(value) {
                this.value = value;
            }
        }
    },
    methods: {
        
    },
}

</script>

<style scoped>

</style>