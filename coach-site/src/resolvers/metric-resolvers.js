import UPDATE_METRIC from '../graphql/mutation/metric/UpdateMetric.gql'

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