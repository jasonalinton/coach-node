<template>
    <div ref="tableContainer">
        <div v-if="selectedColumns" class="w-100">
            <ItemTableByNone v-if="sortBy == 'None'"
                             :itemType="itemType"
                             :selectedColumns="selectedColumns"
                             :width="width"/>
        </div>
    </div>
</template>

<script>
import ItemTableByNone from './sort-by/ItemTableByNone.vue'

export default {
    components: { ItemTableByNone },
    name: 'ItemTable',
    props: {
        itemType: String,
        selectedColumns: Array,
        sortBy: {
          type: String,
          default: "None"
        },
        level: {
          type: Number,
          default: 0
        },
        parentItem: Object,
        isParent: Boolean, // Is item a parent of parent row
        isChild: Boolean // Is item a child of parent row
    },
    provide() {
        return {
            level: this.level,
            levelPadding: this.levelPadding,
            parentItem: this.parentItem,
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
        if (_this.$refs.tableContainer.clientWidth) {
            _this.width = _this.$refs.tableContainer.clientWidth;
        } 
        // else {
        //     console.log("hi")
        // }
      });
    }
}
</script>