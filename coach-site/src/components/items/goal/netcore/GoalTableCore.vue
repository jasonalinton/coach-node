<template>
  <div v-if="selectedColumns" class="w-100">
    <GoalTableByNone v-if="sortBy == 'None'"
                     :level="0"
                     :selectedColumns="selectedColumns"
                     :parent="parent"
                     :isParent="isParent"
                     :isChild="isChild"></GoalTableByNone>
  </div>
</template>

<script>
import GoalTableByNone from '../netcore/table/GoalTableByNone.vue'
import { goalProperties } from '../../../../model/item/GoalModel'

export default {
    components: { GoalTableByNone },
    name: 'GoalTableCore',
    props: {
        sortBy: {
          type: String,
          default: "None"
        },
        selectedColumns: {
          type: Array,
          default: goalProperties.map(x => x.text)
        },
        parent: Object,
        isParent: Boolean, // Is item a parent of parent item
        isChild: Boolean // Is item a child of parent item
    },
}
</script>

<style>

</style>