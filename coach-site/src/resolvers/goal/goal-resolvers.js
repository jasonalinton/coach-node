import GOALS from '../../graphql/query/QueryGoals.gql'
import METRICS from '../../graphql/query/QueryMetrics.gql'
import ADD_GOAL from '../../graphql/mutation/AddGoal.gql'
import DELETE_GOAL from '../../graphql/mutation/DeleteGoal.gql'
import UPDATE_GOAL from '../../graphql/mutation/UpdateGoal.gql'
import {
    addItemToCache, addPropertyToCache,
    updateItemInCache, updatePropertyInCache,
    deleteItemInCache, deletePropertyInCache
} from '../resolve'

export function addGoal(goal, apollo) {
    apollo.mutate({
        mutation: ADD_GOAL,
        variables: { goal },
        update: (cache, { data }) => {
            onGoalAdded(cache, data.addGoal)
        }
    });
}

export function updateGoal(goal, apollo) {
    apollo.mutate({
        mutation: UPDATE_GOAL,
        variables: { goal },
        update: (cache, { data: { updateGoal } }) => {
            onGoalUpdated(cache, updateGoal);
        }
    });
}

export function deleteGoal(goal, apollo) {
    apollo.mutate({
        mutation: DELETE_GOAL,
        variables: { id: goal.id },
        update: (cache, { data: { deleteGoal } }) => {
            onGoalDeleted(cache, deleteGoal);
        }
    });
}

export function onGoalAdded(cache, addedGoal) {
    addItemToCache(cache, GOALS, 'goals', addedGoal);
    addPropertyToCache(cache, METRICS, 'metrics', 'goals', addedGoal);
}

export function onGoalUpdated(cache, updatedGoal) {
    updateItemInCache(cache, GOALS, 'goals', updatedGoal);
    updatePropertyInCache(cache, METRICS, 'metrics', 'goals', updatedGoal);
}

export function onGoalDeleted(cache, deletedGoal) {
    deleteItemInCache(cache, GOALS, 'goals', deletedGoal);
    deletePropertyInCache(cache, METRICS, 'metrics', 'goals', deletedGoal);
}