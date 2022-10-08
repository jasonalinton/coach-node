<template>
  <div ref="tableContainer">
    <div v-if="selectedColumns" class="w-100">
      <GoalTableByNone v-if="sortBy == 'None'"
                      :selectedColumns="selectedColumns"
                      :width="width"></GoalTableByNone>
    </div>
  </div>
</template>

<script>
import GoalTableByNone from '../netcore/table/GoalTableByNone.vue'
import { goalProperties } from '../../../../model/item/GoalModel'

export default {
    components: { GoalTableByNone },
    name: 'GoalTableCore',
    props: {
        level: {
          type: Number,
          default: 0
        },
        sortBy: {
          type: String,
          default: "None"
        },
        selectedColumns: {
          type: Array,
          default: goalProperties.map(x => x.text)
        },
        parentRow: Object,
        isParent: Boolean, // Is item a parent of parent row
        isChild: Boolean // Is item a child of parent row
    },
    provide() {
        return {
            level: this.level,
            levelPadding: this.levelPadding,
            parentRow: this.parentRow,
            isParent: this.isParent,
            isChild: this.isChild,
        }
    },
    data: function() {
        return {
            levelPadding: 18, // amount of left-padding added to of each child row
            width: 0
        }
    },
    mounted() {
      let _this = this;
      this.width = this.$refs.tableContainer.clientWidth;
      window.addEventListener('resize', function() {
        _this.width = _this.$refs.tableContainer.clientWidth;
      });
    }
}
</script>

<style>

</style>