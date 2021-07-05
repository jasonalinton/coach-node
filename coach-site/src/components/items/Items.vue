<template>
    <div id="items" >
        <nav id="nav-tab">
            <div class="nav nav-tabs justify-content-between" role="tablist">
                <button id="item-metric-tab" class="nav-link flex-fill" :class="[{ active: selectedTab == 'metric' }]" 
                        data-bs-toggle="tab" data-bs-target="#nav-metric" type="button" role="tab" aria-controls="nav-home" aria-selected="true" @click="selectedTab = 'metric'">Metric</button>
                <button id="item-goal-tab" class="nav-link flex-fill" :class="[{ active: selectedTab == 'goal' }]"
                        data-bs-toggle="tab" data-bs-target="#nav-goal" type="button" role="tab" aria-controls="nav-goal" aria-selected="false" @click="selectedTab = 'goal'">Goal</button>
                <button id="item-todo-tab" class="nav-link flex-fill" :class="[{ active: selectedTab == 'todo' }]"
                        data-bs-toggle="tab" data-bs-target="#nav-todo" type="button" role="tab" aria-controls="nav-todo" aria-selected="false" @click="selectedTab = 'todo'">Todo</button>
                <button id="item-routine-tab" class="nav-link flex-fill" :class="[{ active: selectedTab == 'routine' }]"
                        data-bs-toggle="tab" data-bs-target="#nav-routine" type="button" role="tab" aria-controls="nav-routine" aria-selected="false" @click="selectedTab = 'routine'">Routine</button>
            </div>
        </nav>
        <Item v-show="selectedTab == 'metric'" 
        id="nav-metric" class="tab-pane fade" 
        :class="[{ active: selectedTab == 'metric', show: selectedTab == 'metric' }]"
        :config="metricConfig"
        role="tabpanel" aria-labelledby="item-metric-tab"></Item>
        <Item v-show="selectedTab == 'goal'" 
        id="nav-goal" class="tab-pane fade" 
        :class="[{ active: selectedTab == 'goal', show: selectedTab == 'goal' }]"
        :config="goalConfig"
        role="tabpanel" aria-labelledby="item-goal-tab"></Item>
        <!-- <MetricItem v-if="selectedTab == 'metric'" id="nav-metric" class="tab-pane fade" :class="[{ active: selectedTab == 'metric', show: selectedTab == 'metric' }]" 
                    role="tabpanel" aria-labelledby="item-metric-tab"></MetricItem> -->
        <!-- <GoalItem v-if="selectedTab == 'goal'" id="nav-goal" class="tab-pane fade" :class="[{ active: selectedTab == 'goal', show: selectedTab == 'goal' }]" 
                  role="tabpanel" aria-labelledby="item-goal-tab"></GoalItem> -->
        <TodoItem v-show="selectedTab == 'todo'" id="nav-todo" class="tab-pane fade" :class="[{ active: selectedTab == 'todo', show: selectedTab == 'todo' }]" 
                  role="tabpanel" aria-labelledby="item-todo-tab"></TodoItem>
        <RoutineItem v-show="selectedTab == 'routine'" id="nav-routine" class="tab-pane fade" :class="[{ active: selectedTab == 'routine', show: selectedTab == 'routine' }]" 
                     role="tabpanel" aria-labelledby="item-routine-tab"></RoutineItem>
    </div>
</template>

<script>
// import MetricItem from '../items/metric/MetricItem.vue'
// import GoalItem from '../items/goal/GoalItem.vue'
import TodoItem from './todo/TodoItem.vue'
import RoutineItem from '../items/RoutineItem.vue'
import Item from './Item.vue'

import MetricConfig from '../../config/items/metric-config'
import GoalConfig from '../../config/items/goal-config'
import ItemConfigModel from '../../config/items/item-config'

export default {
  name: 'Items',
  components: { TodoItem, RoutineItem, Item },
  // components: { MetricItem, GoalItem, TodoItem, RoutineItem, Item },
  data: function() {
    return {
      selectedTab: "metric",
      metricConfig: MetricConfig,
      goalConfig: null
    }
  },
  created: function() {
    // this.metricConfig = new ItemConfigModel('metric', MetricConfig.props, MetricConfig.query);
    this.goalConfig = new ItemConfigModel(GoalConfig);
    console.log(this.goalConfig.query)
    console.log(this.metricConfig.query);
    // this.$apollo.addSmartSubscription('goalupdated', {
    //         query: require('../../graphql/subscription/GoalUpdated.gql'),
    //         result({ data }) {
    //         let goal = data.goalUpdated;
    //         let id = goal.id;

    //         goal.metrics.forEach(_metric => {
    //             let metric = this.metrics.find(metric => metric.id == _metric.id);
    //             let existingGoal = metric.goals.find(_metric => _metric.id == id)
    //             if (existingGoal) {
    //                 replaceItem(goal, metric.goals)
    //             } else {
    //                 metric.goals.push(goal);
    //             }
    //         })
    //     },
    //     });
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
    /* overflow: scroll; */
}
</style>
