<template>
    <div class="avatar-energy w-100">
        <img src="/avatar/Avatar (Blue Underwear).jpg" width="140"/>
        <div class="d-flex flex-column">
            <LogItemView v-if="energyLogItem" :logItemID="energyLogItem.id" />
        </div>
    </div>
</template>

<script>
import LogItemView from '../planner/item-panel/inventory/LogItemView.vue';
import { LOG_ITEMS } from '../../model/constants';

export default {
    name: 'AvatarEnergy',
    components: { LogItemView },
    props: {
        
    },
    data: function () {
        return {
            metricStore: undefined
        }
    },
    created: async function() {
        let metricStore = await import(`@/store/metricStore`);
        this.metricStore = metricStore.useMetricStore();
    },
    computed: {
        energyLogItem() {
            if (this.metricStore) {
                let logItem = this.metricStore.getLogItem(LOG_ITEMS.PHYSICAL_ENERGY);
                console.log(logItem);
                return logItem;
            }
            return undefined;
        }
    },
    methods: {
        
    },
}

</script>

<style scoped>

</style>