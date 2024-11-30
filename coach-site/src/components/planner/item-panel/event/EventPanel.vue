<template>
    <div class="row g-0 h-100">
        <div class="col h-100">
            <!-- Header -->
            <ItemPanelHeader v-show="showHead" 
                             :title="'events'" 
                             :sort="sort" 
                             @onSortChange="onSortChange" />
            <!-- Body -->
            <EventPanelByDate v-if="activeType.toLowerCase() == 'sortby' && sort.by=='Metric'"></EventPanelByDate>
            <EventTodoPanel v-if="activeType.toLowerCase() == 'todo'" :_event="selectedEvent" />
            <EventRoutinePanel v-if="activeType.toLowerCase() == 'routine'" :_event="selectedEvent" />
        </div>
    </div>
</template>

<script>
import ItemPanelHeader from '../component/ItemPanelHeader.vue';
import EventPanelByDate from './EventPanelByDate.vue';
import EventTodoPanel from './EventTodoPanel.vue';
import EventRoutinePanel from './EventRoutinePanel.vue';

var sortItems = [
    { id: 1, text: "Metric" },
    { id: 2, text: "Date" },
    { id: 3, text: "Type" },
];

// Types of panels to display
// var activeTypes = [
//     { id: 1, text: "SortBy" },
//     { id: 2, text: "Todo" },
//     { id: 3, text: "Routine" },
// ];

export default {
    name: 'EventPanel',
    components: { ItemPanelHeader, EventPanelByDate, EventTodoPanel, EventRoutinePanel },
    props: {
        props: Object,
        showHead: {
            type: Boolean,
            default: true
        }
    },
    data: function () {
        return {
            activeType: 'SortBy',
            sort: {
                by: 'Date',
                items: sortItems
            },
            selectedEvent: undefined
        }
    },
    created: function() {
        let eventPanelSortBy_Store = localStorage.getItem(`event-panel-sort-by`);
        if (eventPanelSortBy_Store) {
            this.sort.by = eventPanelSortBy_Store;
        } else {
            localStorage.setItem(`event-panel-sort-by`, this.sort.by);
        }
    },
    computed: {
        selectedItem() {
            return (this.appStore) ? this.appStore.calendarMobile.type : undefined;
        }
    },
    methods: {
        onSortChange
    },
    watch: {
        props(value) {
            if (value._event && value._event.type && value._event.type.text.toLowerCase() == 'todo') {
                this.activeType = 'todo'
                this.selectedEvent = this.props._event;
            } else if (value._event && value._event.type && value._event.type.text.toLowerCase() == 'routine') {
                this.activeType = 'routine'
                this.selectedEvent = this.props._event;
            } else if (!value) {
                this.activeType = 'sortby';
                this.selectedEvent = undefined;
            }
        }
    }
}

function onSortChange(sortBy) {
    this.sort.by = sortBy;
    localStorage.setItem(`event-panel-sort-by`, sortBy);
}
</script>

<style scoped>

</style>