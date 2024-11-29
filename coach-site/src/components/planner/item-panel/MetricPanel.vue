<template>
    <div>
        
    </div>
</template>

<script>
import { today } from '../../../../utility/timeUtility';

export default {
    name: 'MetricPanel',
    props: {
        showHead: {
            type: Boolean,
            default: true
        }
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
}
</script>

<style>

</style>