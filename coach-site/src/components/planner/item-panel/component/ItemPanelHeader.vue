<template>
    <div>
        <div class="header d-flex flex-row justify-content-between">
            <div class="d-flex flex-row">
                <NavbarMenuButton v-if="isExtraSmall" class="float-left" />
                <div class="labels d-flex flex-column justify-content-center">
                    <h1>{{ title }}</h1>
                    <select v-if="sort" class="form-select panel-select" aria-label="select" @change="onSortChange" v-model="sortBy">
                        <option v-for="sortItem in sortItems" v-bind:key="sortItem.id" :value="sortItem.text">{{sortItem.text}}</option> 
                    </select>
                </div>
    
            </div>
            <div class="d-flex flex-row">
                <slot></slot>
                <NavbarCalendarButton v-if="isExtraSmall" />
            </div>
        </div>
    </div>
</template>

<script>
import { useAppStore } from '@/store/appStore'
import NavbarMenuButton from '../../../mobile/navbar/component/NavbarMenuButton.vue';
import NavbarCalendarButton from '../../../mobile/navbar/component/NavbarCalendarButton.vue';

export default {
    components: { NavbarMenuButton, NavbarCalendarButton },
    name: 'ItemPanelHeader',
    props: {
        title: String,
        sort: Object,
        nextPages: Array
    },
    data: function () {
        return {
            appStore: undefined,
            sortBy: (this.sort) ? this.sort.by : undefined,
            sortItems: (this.sort) ? this.sort.items : undefined
        }
    },
    created: function() {
        this.appStore = useAppStore();
    },
    computed: {
        isExtraSmall() {
            if (this.appStore) {
                return this.appStore.isExtraSmall;
            }
            return true;
        },
    },
    methods: {
        onSortChange,
    },
    watch: {
        sort(value) {
            this.sortBy = (value) ? value.by : undefined;
            this.sortItems = (value) ? value.items : undefined;
        }
    }
}

function onSortChange() {
    this.$emit('onSortChange', this.sortBy);
}
</script>

<style scoped>
.header {
    padding-top: 8px;
    padding-bottom: 7px;
    padding-bottom: 7px;
    border-bottom: 1px solid rgba(220, 220, 220, .5);
    min-height: 64px;
}

.labels {
    margin-top: 4px;
}

.menu-button {
    margin-left: 8px;
    margin-right: 12px;
}

h1 {
    text-transform: uppercase;
    text-align: start;
    margin-left: 12px;
    font-size: 16px;
    line-height: 16px;
    margin-bottom: 0px;
    color: #565656;
}

.panel-select {
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