<template>
    <div class="row g-0 h-100">
        <div class="col h-100 d-flex flex-column flex-grow-1 overflow-hidden">
            <!-- Header -->
            <ItemPanelHeader :title="'todos'" :sort="sort" :selectedDate="selectedDate"
                             @onSortChange="onSortChange">
                <div class="d-flex flex-row justify-content-end pe-2 mt-auto">
                    <img class="header-button me-1" :class="{ active: showRepeat }"
                        src='/icon/repeat.png' width="16" height="16"
                        @click.prevent="showRepeat = !showRepeat"/>
                    <img class="header-button me-1" :class="{ active: showTimeline }"
                        src='/icon/timeline.png' width="16" height="16"
                        @click.prevent="showTimeline = !showTimeline"/>
                    <img class="header-button me-1" :class="{ active: showRecommended }"
                        src='/icon/thumbs-up.png' width="16" height="16"
                        @click.prevent="showRecommended = !showRecommended"/>
                    <img class="header-button me-1" :class="{ active: showHierarchy }"
                        src='/icon/hierarchy.png' width="16" height="16"
                        @click.prevent="showHierarchy = !showHierarchy"/>
                </div>
            </ItemPanelHeader>
            <template v-if="!iteration_Form">
                <TodoPanelByMetric v-if="sort.by=='Metric'" 
                                   :selectedDate="selectedDate"
                                   @editIteration="iteration => iteration_Form = iteration">
                </TodoPanelByMetric>
                <TodoPanelByDate v-if="sort.by=='Date'" 
                                 :selectedDate="selectedDate"
                                 @editIteration="iteration => iteration_Form = iteration">
                </TodoPanelByDate>
                <TodoPanelByRepetition v-if="sort.by=='Repetition'" 
                                       :selectedDate="selectedDate"
                                       @editIteration="iteration => iteration_Form = iteration">
                </TodoPanelByRepetition>
                <TodoPanelByCustom v-if="sort.by=='Custom'" 
                                   :selectedDate="selectedDate"
                                   @editIteration="iteration => iteration_Form = iteration">
                </TodoPanelByCustom>
                <TodoPanelDefault v-if="sort.by=='Default'" 
                                    :selectedDate="selectedDate"
                                    :showRepeat="showRepeat"
                                    :showTimeline="showTimeline"
                                    :showRecommended="showRecommended"
                                    :showHierarchy="showHierarchy"
                                    @editIteration="iteration => iteration_Form = iteration">
                </TodoPanelDefault>
            </template>
            <IterationForm v-if="iteration_Form" 
                           :iteration="iteration_Form"
                           @closeForm="iteration_Form = null">
            </IterationForm>
        </div>
    </div>
</template>

<script>
import ItemPanelHeader from '../component/ItemPanelHeader.vue';
import TodoPanelByDate from './TodoPanelByDate.vue';
import TodoPanelByMetric from './TodoPanelByMetric.vue';
import TodoPanelByRepetition from './TodoPanelByRepetition.vue';
import TodoPanelByCustom from './TodoPanelByCustom.vue';
import TodoPanelDefault from './TodoPanelDefault.vue';
import IterationForm from '../component/form/IterationForm.vue';

var sortItems = [
    { id: 1, text: "Metric" },
    { id: 2, text: "Date" },
    { id: 3, text: "Repetition" },
    { id: 4, text: "Custom" },
    { id: 5, text: "Default" },
];

export default {
    name: 'TodoPanel',
    components: { ItemPanelHeader, TodoPanelByMetric, TodoPanelByDate, TodoPanelByRepetition,
        TodoPanelByCustom, TodoPanelDefault, IterationForm, },
    props: {
        selectedDate: Date
    },
    data: function () {
        return {
            sort: {
                by: 'Default',
                items: sortItems,
            },
            iteration_Form: null,
            showRepeat: true,
            showTimeline: false,
            showRecommended: true,
            showHierarchy: true
        }
    },
    created: function() {
        let todoPanelSortBy_Store = localStorage.getItem(`todo-panel-sort-by`);
        if (todoPanelSortBy_Store) {
            this.sort.by = todoPanelSortBy_Store;
        } else {
            localStorage.setItem(`todo-panel-sort-by`, this.sort.by);
        }
    },
    methods: {
        onSortChange
    },
}

function onSortChange(sortBy) {
    this.sort.by = sortBy;
    localStorage.setItem(`todo-panel-sort-by`, sortBy);
}
</script>

<style scoped>

.header-button {
    border-radius: 8px;
}

.header-button:hover {
    background-color: rgba(60, 64, 67, .08);
}

.header-button.active {
    background-color: rgba(60, 64, 67, .2);
}

</style>