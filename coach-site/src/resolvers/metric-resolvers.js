import METRICS from '../graphql/query/QueryMetrics.gql'
import GOALS from '../graphql/query/QueryGoals.gql'
import TODOS from '../graphql/query/QueryTodos.gql'
import ROUTINES from '../graphql/query/QueryRoutines.gql'

import UPDATE_METRIC from '../graphql/mutation/metric/UpdateMetric.gql'

import {
    updateItemInCache, updatePropertyInCache,
} from './resolve'

export function updateMetric(metric, apollo) {
    apollo.mutate({
        mutation: UPDATE_METRIC,
        variables: { metric },
        // update: (cache, { data: { updateMetric } }) => {
        //     updateItemInCache(cache, METRICS, 'metrics', updateMetric);
        //     onMetricUpdated(cache, updateMetric);
        // }
    });
}

export function onMetricUpdated(cache, updatedMetric) {
    updateItemInCache(cache, METRICS, 'metrics', updatedMetric);
    updatePropertyInCache(cache, GOALS, 'goals', 'metrics', updatedMetric);
    updatePropertyInCache(cache, TODOS, 'todos', 'metrics', updatedMetric);
    updatePropertyInCache(cache, ROUTINES, 'routines', 'metrics', updatedMetric);
}