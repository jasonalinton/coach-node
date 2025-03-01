<template>
    <input class="form-control form-control-md" type="text" :ref="ref" 
                v-model.lazy.trim="text" 
                v-on:keyup.enter="save(item)"
                spellcheck="true"/>
</template>

<script>
export default {
    name: 'TextBox',
    props: {
        ref: String,
        text: String
    },
    // data: function() {
    //     return {
    //         text
    //     }
    // },
    methods: {
        onChange
    }
}
</script>

<style scoped>

</style>