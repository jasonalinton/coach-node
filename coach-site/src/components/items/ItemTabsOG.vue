<template>
    <div id="items" ref="itemContainer">
        <nav id="nav-tab">
            <div class="nav nav-tabs justify-content-between" role="tablist">
                <button id="item-metric-tab" class="nav-link flex-fill" :class="[{ active: selectedTab == 'metric' }]" 
                        data-bs-toggle="tab" data-bs-target="#nav-metric" type="button" role="tab" aria-controls="nav-home" aria-selected="true" @click="selectedTab = 'metric'">Metrics</button>
                <button id="item-goal-tab" class="nav-link flex-fill" :class="[{ active: selectedTab == 'goal' }]"
                        data-bs-toggle="tab" data-bs-target="#nav-goal" type="button" role="tab" aria-controls="nav-goal" aria-selected="false" @click="selectedTab = 'goal'">Goals</button>
                <button id="item-todo-tab" class="nav-link flex-fill" :class="[{ active: selectedTab == 'todo' }]"
                        data-bs-toggle="tab" data-bs-target="#nav-todo" type="button" role="tab" aria-controls="nav-todo" aria-selected="false" @click="selectedTab = 'todo'">Todos</button>
                <button id="item-routine-tab" class="nav-link flex-fill" :class="[{ active: selectedTab == 'routine' }]"
                        data-bs-toggle="tab" data-bs-target="#nav-routine" type="button" role="tab" aria-controls="nav-routine" aria-selected="false" @click="selectedTab = 'routine'">Routines</button>
            </div>
        </nav>
        <ItemTab v-show="selectedTab == 'metric'" 
                  id="nav-metric" class="tab-pane fade" 
                  :class="[{ active: selectedTab == 'metric', show: selectedTab == 'metric' }]"
                  :config="metricConfig"
                  role="tabpanel" aria-labelledby="item-metric-tab"></ItemTab>
        <ItemTab v-show="selectedTab == 'goal'" 
                  id="nav-goal" class="tab-pane fade" 
                  :class="[{ active: selectedTab == 'goal', show: selectedTab == 'goal' }]"
                  :config="goalConfig"
                  role="tabpanel" aria-labelledby="item-goal-tab"></ItemTab>
        <ItemTab v-show="selectedTab == 'todo'"
                  id="nav-todo" class="tab-pane fade" 
                  :class="[{ active: selectedTab == 'todo', show: selectedTab == 'todo' }]" 
                  :config="todoConfig"
                  role="tabpanel" aria-labelledby="item-todo-tab">
        </ItemTab>
        <ItemTab v-show="selectedTab == 'routine'" 
                  id="nav-routine" class="tab-pane fade" 
                  :class="[{ active: selectedTab == 'routine', show: selectedTab == 'routine' }]"
                  :config="routineConfig"
                  role="tabpanel" aria-labelledby="item-routine-tab"></ItemTab>
    </div>
</template>

<script>
import MetricConfig from '../../config/items/metric-config'
import GoalConfig from '../../config/items/goal-config'
import TodoConfig from '../../config/items/todo-config'
import RoutineConfig from '../../config/items/routine-config'
import ItemConfigModel from '../../config/items/item-config'
import ItemTab from './ItemTabOG.vue'

export default {
  name: 'ItemTabs',
  components: { ItemTab },
  data: function() {
    return {
      selectedTab: null,
      metricConfig: null,
      goalConfig: null,
      todoConfig: null,
      routineConfig: null,
      itemTableStore: undefined,
    }
  },
  created: function() {
    this.metricConfig = new ItemConfigModel(MetricConfig);
    this.goalConfig = new ItemConfigModel(GoalConfig);
    this.todoConfig = new ItemConfigModel(TodoConfig);
    this.routineConfig = new ItemConfigModel(RoutineConfig);

    let selectedTab_Store = localStorage.getItem(`selected-item-tab`);
    if (selectedTab_Store) {
        this.selectedTab = selectedTab_Store;
    } else {
        localStorage.setItem(`selected-item-tab`, this.selectedTab);
        this.selectedTab = 'goal';
    }
  },
  async mounted() {
    let itemTableStore = await import(`@/store/itemTableStore`);
    this.itemTableStore = itemTableStore.useItemTableStore();
    let _this = this;
    this.itemTableStore.setContainerWidth(_this.$refs.itemContainer.clientWidth)
    window.addEventListener('resize', function() {
      if (_this.$refs.itemContainer.clientWidth) {
        _this.itemTableStore.setContainerWidth(_this.$refs.itemContainer.clientWidth)
      }
    });
  },
  watch: {
      selectedTab(value) {
          localStorage.setItem(`selected-item-tab`, value);
      }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}

.table {
    text-align: start;
    margin-bottom: 0px;
    /* display: block; */
    overflow: scroll;
}

.nav-tabs {
  border-top: none;
}

.nav-tabs .nav-link.active {
  border-radius: 0px;
  border-bottom: 1px rgb(222, 226, 230) solid;
  background-color: #DEECF9;
}
</style>
