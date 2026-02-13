<template>
    <div class="row g-0 h-100">
        <div class="col h-100">
            <!-- Header -->
            <ItemPanelHeader v-show="showHead" 
                             :title="'events'" 
                             :sort="sort" 
                             @onSortChange="onSortChange" />
            <template v-if="!iteration_Form">
                <!-- Body -->
                <EventTodoPanel v-if="type == EVENTTYPE.TODO" 
                                :_event="eventt" 
                                @editIteration="iteration => iteration_Form = iteration"/>
                <EventRoutinePanel v-if="type == EVENTTYPE.ROUTINE"
                                   :_event="eventt" 
                                   @editIteration="iteration => iteration_Form = iteration"/>
            </template>
            <IterationForm v-if="iteration_Form" 
                           :iteration="iteration_Form"
                           @closeForm="iteration_Form = null">
            </IterationForm>
        </div>
    </div>
</template>

<script>
import { useAppStore } from '@/store/appStore'
import { EVENTTYPE } from '../../../../model/constants';
import ItemPanelHeader from '../component/ItemPanelHeader.vue';
// import EventPanelByDate from './EventPanelByDate.vue';
import EventTodoPanel from './EventTodoPanel.vue';
import EventRoutinePanel from './EventRoutinePanel.vue';
import IterationForm from '../component/form/IterationForm.vue';

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
    components: { 
        ItemPanelHeader, 
        EventTodoPanel, 
        EventRoutinePanel, 
        IterationForm },
    props: {
        props: Object,
        showHead: {
            type: Boolean,
            default: true
        }
    },
    data: function () {
        return {
            appStore: undefined,
            EVENTTYPE: { ...EVENTTYPE },
            activeType: 'SortBy',
            sort: {
                by: 'Date',
                items: sortItems
            },
            iteration_Form: null,
        }
    },
    created: function() {
        this.appStore = useAppStore();
        let eventPanelSortBy_Store = localStorage.getItem(`event-panel-sort-by`);
        if (eventPanelSortBy_Store) {
            this.sort.by = eventPanelSortBy_Store;
        } else {
            localStorage.setItem(`event-panel-sort-by`, this.sort.by);
        }
    },
    computed: {
        type() { 
            return (this.appStore) ? this.appStore.itemPanel.event.type : undefined; 
        },
        eventt() { 
            return (this.appStore) ? this.appStore.itemPanel.event.event : undefined; 
        },
    },
    methods: {
        onSortChange
    }
}

function onSortChange(sortBy) {
    this.sort.by = sortBy;
    localStorage.setItem(`event-panel-sort-by`, sortBy);
}
</script>

<style scoped>

</style>