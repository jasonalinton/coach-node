<template>
    <select class="form-select panel-select" aria-label="select" @change="onSortChange" v-model="sortBy">
        <option v-for="sortItem in sortItems" v-bind:key="sortItem.id" :value="sortItem.text">{{sortItem.text}}</option> 
    </select>
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
.panel-select {
    /* padding-top: 4px;
    padding-bottom: 4px;
    padding-left: 8px;
    padding-right: 14px; */
    /* margin-left: -6px; */
    font-size: 14px;
    line-height: 16px;
    border: none;
    color: #747474;
}
</style>