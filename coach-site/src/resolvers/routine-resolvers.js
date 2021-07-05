import METRICS from '../graphql/query/QueryMetrics.gql'
import GOALS from '../graphql/query/QueryGoals.gql'
import TODOS from '../graphql/query/QueryTodos.gql'
import ROUTINES from '../graphql/query/QueryRoutines.gql'

import ADD_ROUITNE from '../graphql/mutation/routine/AddRoutine.gql'
import DELETE_ROUITNE from '../graphql/mutation/routine/DeleteRoutine.gql'
import UPDATE_ROUITNE from '../graphql/mutation/routine/UpdateRoutine.gql'

import {
    addItemToCache, addPropertyToCache,
    updateItemInCache, updatePropertyInCache,
    deleteItemInCache, deletePropertyInCache
} from './resolve'

export function addRoutine(routine, apollo) {
    apollo.mutate({
        mutation: ADD_ROUITNE,
        variables: { routine },
        // update: (cache, { data }) => {
        //     addItemToCache(cache, ROUTINES, 'routines', data.addRoutine);
        //     onRoutineAdded(cache, data.addRoutine)
        // }
    });
}

export function updateRoutine(routine, apollo) {
    apollo.mutate({
        mutation: UPDATE_ROUITNE,
        variables: { routine },
        // update: (cache, { data: { updateRoutine } }) => {
        //     updateItemInCache(cache, ROUTINES, 'routines', updateRoutine);
        //     onRoutineUpdated(cache, updateRoutine);
        // }
    });
}

export function deleteRoutine(routine, apollo) {
    apollo.mutate({
        mutation: DELETE_ROUITNE,
        variables: { id: routine.id },
        // update: (cache, { data: { deleteRoutine } }) => {
        //     deleteItemInCache(cache, ROUTINES, 'routines', deleteRoutine);
        //     onRoutineDeleted(cache, deleteRoutine);
        // }
    });
}

export function onRoutineAdded(cache, addedRoutine) {
    addItemToCache(cache, ROUTINES, 'routines', addedRoutine);
    addPropertyToCache(cache, METRICS, 'metrics', 'routines', addedRoutine);
    addPropertyToCache(cache, GOALS, 'goals', 'routines', addedRoutine);
    addPropertyToCache(cache, TODOS, 'todos', 'routines', addedRoutine);
}

export function onRoutineUpdated(cache, updatedRoutine) {
    updateItemInCache(cache, ROUTINES, 'routines', updatedRoutine);
    updatePropertyInCache(cache, METRICS, 'metrics', 'routines', updatedRoutine);
    updatePropertyInCache(cache, GOALS, 'goals', 'routines', updatedRoutine);
    updatePropertyInCache(cache, TODOS, 'todos', 'routines', updatedRoutine);
}

export function onRoutineDeleted(cache, deletedRoutine) {
    deleteItemInCache(cache, ROUTINES, 'routines', deletedRoutine);
    deletePropertyInCache(cache, METRICS, 'metrics', 'routines', deletedRoutine);
    deletePropertyInCache(cache, GOALS, 'goals', 'routines', deletedRoutine);
    deletePropertyInCache(cache, TODOS, 'todos', 'routines', deletedRoutine);
}