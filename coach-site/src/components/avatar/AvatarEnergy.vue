<template>
    <div class="avatar-energy w-100">
        <span v-if="energyLevel">{{ energyLevel }}</span>
        <img :src="`/avatar/${imageSource}`" height="416"/>
        <div class="d-flex flex-column">
            <LogItemView v-if="energyLogItem" :logItemID="energyLogItem.id" />
        </div>
    </div>
</template>

<script>
import LogItemView from '../planner/item-panel/inventory/LogItemView.vue';
import { LOG_ITEMS } from '../../model/constants';
import { subtractMinutes } from '../../../utility/timeUtility';

export default {
    name: 'AvatarEnergy',
    components: { LogItemView },
    props: {
        
    },
    data: function () {
        return {
            metricStore: undefined,
            clearMinutes: 60
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
        },
        energyLevel() {
            if (this.energyLogItem && this.energyLogItem.entries) {
                let lastEntry = this.energyLogItem.entries[this.energyLogItem.entries.length-1];
                if (lastEntry) {
                    let levelField = this.energyLogItem.fields.find(x => x.name.toLowerCase() == 'level');
                    if (+lastEntry.dateTime.toDate() > +subtractMinutes(this.clearMinutes)) {
                        let fieldValue = lastEntry.fieldValues.find(x => x.logItemFieldID == levelField.id);
                        return fieldValue.value;
                    }
                }
            }
            return undefined;
        },
        imageSource() {
            if (this.energyLevel) {
                if (this.energyLevel <= 2) {
                    return "energy/2.jpg";
                } else if (this.energyLevel > 2 && this.energyLevel <= 4) {
                    return "energy/4.jpg";
                } else if (this.energyLevel > 4 && this.energyLevel <= 6) {
                    return "energy/6.jpg";
                } else if (this.energyLevel > 6 && this.energyLevel <= 8) {
                    return "energy/8.jpg";
                } else if (this.energyLevel > 8 && this.energyLevel <= 10) {
                    return "energy/10.jpg";
                }
            } else {
                return "Avatar (Blue Underwear).jpg";
            }
        }
    },
    methods: {
        
    },
}

</script>

<style scoped>

</style>