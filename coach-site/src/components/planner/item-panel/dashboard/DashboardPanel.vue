<template>
    <div class="row g-0 h-100">
        <div class="col h-100 d-flex flex-column">
            <div class="dashboard d-flex flex-column flex-grow-1 overflow-hidden">
                <div class="head align-content-center">
                    <span class="label">Dashboard</span>
                    <div class="d-flex flex-row justify-content-start ps-2">
                        <img class="icon-button"
                             src='/icon/previous.png' width="20" height="20"/>
                    </div>
                </div>
                <div class="body d-flex flex-column flex-grow-1">
                    <DashboardView/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import DashboardView from '../../../dashboard/DashboardView.vue';
import { today } from '../../../../../utility/timeUtility';

export default {
    name: 'DashboardPanel',
    components: { DashboardView },
    props: {
        
    },
    data: function () {
        return {
            plannerStore: undefined,
        }
    },
    created: async function() {
        let plannerStore = await import(`@/store/plannerStore`);
        this.plannerStore = plannerStore.usePlannerStore();
    },
    computed: {
        selectedDate() {
            if (this.plannerStore) {
                return this.plannerStore.selectedDate;
            }
            return today;
        },
    },
    methods: {
        
    },
}

</script>

<style scoped>
.head {
    min-height: 64px;
    border-bottom: 1px solid black;
}

.head .label {
    margin: auto;
}

</style>