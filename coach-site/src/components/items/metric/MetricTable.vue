<template>
  <ApolloQuery :query="require('../../../graphql/query/QueryMetrics.gql')" @result="(res)=>metrics=res.data.metrics">
    <template slot-scope="{ result: { error, data }, isLoading }">
      <!-- Loading -->
      <div v-if="isLoading" class="loading apollo">Loading...</div>
      <!-- Error -->
      <div v-else-if="error" class="error apollo">An error occurred</div>
      <div v-else-if="data"  class="row g-0">
        <div class="col">
          <table class="table table-striped table-hover">
            <thead class="thead-light">
              <tr>
                <th>ID</th>
                <th>Text</th>
                <th>Description</th>
                <th>Goals</th>
                <th>Routines</th>
                <th>Todos</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="metric in data.metrics" :key="metric.id" @click.prevent="$emit('metricSelected', metric)">
                <td>{{ metric.id }}</td>
                <td>{{ metric.text }}</td>
                <td>{{ metric.description }}</td>
                <td class="d-none d-lg-table-cell">
                  {{ listToString(metric.goals, "text") }}
                </td>
                <td class="d-none d-lg-table-cell">
                  {{ listToString(metric.routines, "text") }}
                </td>
                <td class="d-none d-lg-table-cell">
                  {{ listToString(metric.todos, "text") }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- No result -->
      <div v-else class="no-result apollo">No result :(</div>
    </template>
    <ApolloSubscribeToMore 
      :document="require('../../../graphql/subscription/GoalDeleted.gql')"
      :updateQuery="unmapGoal">
    </ApolloSubscribeToMore>
      <ApolloSubscribeToMore 
          :document="require('../../../graphql/subscription/GoalUpdated.gql')"
          :updateQuery="onGoalUpdated">
      </ApolloSubscribeToMore>
  </ApolloQuery>
</template>

<script>
import { listToString, removeItem, replaceItem } from "../../../../utility";

export default {
  name: "MetricTable",
  data: function() {
    return {
      metrics: [],
      goals: [],
      temp: require('../../../../src/model/component/item/MetricComponentModel.js')
    };
  },
  apollo: {
    $subscribe: {
      goalDeleted: {
        query: require('../../../graphql/subscription/GoalDeleted.gql'),
        result({ data }) {
          console.log(data.goalDeleted);
        },
      },
      goalupdated: {
        query: require('../../../graphql/subscription/GoalUpdated.gql'),
        result({ data }) {
          let goal = data.goalUpdated;
          let id = goal.id;

          // console.log(this)

          goal.metrics.forEach(_metric => {
              let metric = this.metrics.find(metric => metric.id == _metric.id);
              let existingGoal = metric.goals.find(_metric => _metric.id == id)
              if (existingGoal) {
                  replaceItem(goal, metric.goals)
              } else {
                metric.goals.push(goal);
              }
          })
      },
      },
    },
  },
  // apollo: {
  //   goals: {
  //       query: require('../../../graphql/query/QueryGoals.gql'),
  //       // variables() {
  //       //   return {
  //       //     symbol: this.asset.symbol,
  //       //     interval: this.config.interval,
  //       //     periods: this.config.periods
  //       //   }
  //       // },
  //       // update: function(data) {
  //       //   this.bars = data.bars;
  //       //   this.initChart(this);
  //       //   return data.bars;
  //       // },
  //       fetchPolicy: 'network-only',
  //       subscribeToMore: {
  //         document: require('../../../graphql/subscription/GoalDeleted.gql'),
  //         updateQuery: function() {

  //           console.log("hello");
  //         },
            
  //       }
  //   }
  // },
  methods: {
    listToString,
    unmapGoal,
    onGoalUpdated
  },
};

function unmapGoal(previousResult, { subscriptionData }) {

  let id = subscriptionData.data.goalDeleted.id

  console.log(this.$options)
  
  this.metrics.forEach(metric => {
    let goal = metric.goals.find(goal => goal.id == id);
    if (goal != undefined) {
      removeItem(goal, metric.goals);
    }
  })
  
}

function onGoalUpdated(reviousResult, { subscriptionData }) {
    let goal = subscriptionData.data.goalUpdated;
    let id = goal.id;

    goal.metrics.forEach(_metric => {
        let metric = this.metrics.find(metric => metric.id == _metric.id);
        let existingGoal = metric.goals.find(_metric => _metric.id == id)
        if (existingGoal) {
            replaceItem(goal, metric.goals)
        } else {
          metric.goals.push(goal);
        }
    })
}
</script>

<style scoped>
    td {
        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>
