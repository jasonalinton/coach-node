<template>
    <div class="row g-0">
        <div class="col">
            <div class="header d-flex flex-row justify-content-between">
                <div class="d-flex flex-column">
                    <h1>{{ title }}</h1>
                    <select class="form-select panel-select" aria-label="select" @change="onSortChange" v-model="sortBy">
                        <option v-for="sortItem in sortItems" v-bind:key="sortItem.id" :value="sortItem.text">{{sortItem.text}}</option> 
                    </select>
                </div>
                <!-- <IconButton src="/icon/hierarchy-icon.png" :width="40" :height="40"></IconButton> -->
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
// import IconButton from '../../../controls/button/IconButton.vue';

export default {
    components: {  },
    name: 'ItemPanelHeader',
    props: {
        title: String,
        sort: Object,
        nextPages: Array
    },
    data: function () {
        return {
            sortBy: this.sort.by,
            sortItems: this.sort.items
        }
    },
    methods: {
        onSortChange,
    },
}

function onSortChange() {
    this.$emit('onSortChange', this.sortBy);
}
</script>

<style scoped>
.header {
    /* padding: 12px 8px; */
    padding-top: 12px;
    /* padding-left: 16px; */
    padding-right: 8px;
    padding-bottom: 7px;
    padding-bottom: 7px;
    border-bottom: 1px solid rgba(220, 220, 220, .5);
}

h1 {
    text-transform: uppercase;
    text-align: start;
    padding-left: 8px;
    margin-left: 8px;
    font-size: 16px;
    line-height: 16px;
    margin-bottom: 0px;
    color: #565656;
}

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

#hierarchy-icon {
    width: 80px;
    height: 80px;
}
</style>