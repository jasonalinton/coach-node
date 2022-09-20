<template>
  <div v-if="selectedColumns" class="w-100">
    <GoalTableByNone v-if="sortBy == 'None'"
                     :selectedColumns="selectedColumns"
                     :parent="parent"></GoalTableByNone>
  </div>
</template>

<script>
import GoalTableByNone from '../table/GoalTableByNone.vue'
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
        parent: Object
    },
}
</script>

<style>

</style>