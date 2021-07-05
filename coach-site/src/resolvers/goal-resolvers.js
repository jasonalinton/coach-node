import METRICS from '../graphql/query/QueryMetrics.gql'
import GOALS from '../graphql/query/QueryGoals.gql'
import TODOS from '../graphql/query/QueryTodos.gql'
import ROUTINES from '../graphql/query/QueryRoutines.gql'

import ADD_GOAL from '../graphql/mutation/goal/AddGoal.gql'
import DELETE_GOAL from '../graphql/mutation/goal/DeleteGoal.gql'
import UPDATE_GOAL from '../graphql/mutation/goal/UpdateGoal.gql'

import {
    addItemToCache, addPropertyToCache,
    updateItemInCache, updatePropertyInCache,
    deleteItemInCache, deletePropertyInCache
} from './resolve'

export function addGoal(goal, apollo) {
    apollo.mutate({
        mutation: ADD_GOAL,
        variables: { goal },
        // update: (cache, { data }) => {
        //     // addItemToCache(cache, GOALS, 'goals', data.addGoal);
        //     // onGoalAdded(cache, data.addGoal)
        // }
    });
}

export function updateGoal(goal, apollo) {
    apollo.mutate({
        mutation: UPDATE_GOAL,
        variables: { goal },
        // update: (cache, { data: { updateGoal } }) => {
        //     // updateItemInCache(cache, GOALS, 'goals', updateGoal);
        //     // onGoalUpdated(cache, updateGoal);
        // }
    });
}

export function deleteGoal(goal, apollo) {
    apollo.mutate({
        mutation: DELETE_GOAL,
        variables: { id: goal.id },
        // update: (cache, { data: { deleteGoal } }) => {
        //     // deleteItemInCache(cache, GOALS, 'goals', deleteGoal);
        //     // onGoalDeleted(cache, deleteGoal);
        // }
    });
}

export function onGoalAdded(cache, addedGoal) {
    addItemToCache(cache, GOALS, 'goals', addedGoal);
    addPropertyToCache(cache, METRICS, 'metrics', 'goals', addedGoal);
    addPropertyToCache(cache, TODOS, 'todos', 'goals', addedGoal);
    addPropertyToCache(cache, ROUTINES, 'routines', 'goals', addedGoal);
}

export function onGoalUpdated(cache, updatedGoal) {
    updateItemInCache(cache, GOALS, 'goals', updatedGoal);
    updatePropertyInCache(cache, METRICS, 'metrics', 'goals', updatedGoal);
    updatePropertyInCache(cache, TODOS, 'todos', 'goals', updatedGoal);
    updatePropertyInCache(cache, ROUTINES, 'routines', 'goals', updatedGoal);
}

export function onGoalDeleted(cache, deletedGoal) {
    deleteItemInCache(cache, GOALS, 'goals', deletedGoal);
    deletePropertyInCache(cache, METRICS, 'metrics', 'goals', deletedGoal);
    deletePropertyInCache(cache, TODOS, 'todos', 'goals', deletedGoal);
    deletePropertyInCache(cache, ROUTINES, 'routines', 'goals', deletedGoal);
}