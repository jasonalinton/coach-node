<template>
    <div class="row g-0 h-100">
        <div class="col h-100 d-flex flex-column flex-grow-1 overflow-hidden">
            <!-- Header -->
            <ItemPanelNavbar v-if="showHead" />
            <template v-if="!iteration_Form">
                <TodoPanelByMetric v-if="sortBy=='Metric'" 
                                   :selectedDate="selectedDate"
                                   @editIteration="iteration => iteration_Form = iteration">
                </TodoPanelByMetric>
                <TodoPanelBacklog v-if="sortBy=='Backlog'" 
                                 :selectedDate="selectedDate"
                                 @editIteration="iteration => iteration_Form = iteration">
                </TodoPanelBacklog>
                <TodoPanelByRepetition v-if="sortBy=='Repetition'" 
                                       :selectedDate="selectedDate"
                                       @editIteration="iteration => iteration_Form = iteration">
                </TodoPanelByRepetition>
                <TodoPanelByCustom v-if="sortBy=='Custom'" 
                                   :selectedDate="selectedDate"
                                   @editIteration="iteration => iteration_Form = iteration">
                </TodoPanelByCustom>
                <TodoPanelDefault v-if="sortBy=='Default'" 
                                    :selectedDate="selectedDate"
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
import ItemPanelNavbar from '../../../mobile/navbar/ItemPanelNavbar.vue';
import TodoPanelByMetric from './TodoPanelByMetric.vue';
import TodoPanelBacklog from './TodoPanelBacklog.vue';
import TodoPanelByRepetition from './TodoPanelByRepetition.vue';
import TodoPanelByCustom from './TodoPanelByCustom.vue';
import TodoPanelDefault from './TodoPanelDefault.vue';
import IterationForm from '../component/form/IterationForm.vue';
import { today } from '../../../../../utility/timeUtility';

export default {
    name: 'TodoPanel',
    components: { ItemPanelNavbar, TodoPanelByMetric, TodoPanelBacklog, TodoPanelByRepetition,
        TodoPanelByCustom, TodoPanelDefault, IterationForm, },
    props: {
        showHead: {
            type: Boolean,
            default: true
        }
    },
    data: function () {
        return {
            appStore: undefined,
            plannerStore: undefined,
            iteration_Form: null,
        }
    },
    created: async function() {
        let appStore = await import(`@/store/appStore`);
        this.appStore = appStore.useAppStore();

        let plannerStore = await import(`@/store/plannerStore`);
        this.plannerStore = plannerStore.usePlannerStore();
    },
    computed: {
        selectedDate() {
            if (this.plannerStore) {
                return this.plannerStore.selectedDate;
            }
            return today();
        },
        sortBy() {
            if (this.appStore) {
                return this.appStore.itemPanel.todo.sort.by;
            }
            return undefined;
        }
    },
    methods: {
        
    },
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