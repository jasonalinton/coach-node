<template>
  <div v-if="selectedColumns" class="w-100">
    <TodoTableByNone v-if="sortBy == 'None'"
                     :selectedColumns="selectedColumns"></TodoTableByNone>
  </div>
</template>

<script>
import TodoTableByNone from '../table/TodoTableByNone.vue'
import { todoProperties } from '../../../../model/item/TodoModel'

export default {
    components: { TodoTableByNone },
    name: 'TodoTableCore',
    props: {
        sortBy: {
          type: String,
          default: "None"
        },
        selectedColumns: {
          type: Array,
          default: todoProperties.map(x => x.text)
        }
    },
}
</script>

<style>

</style>