import ADD_ROUITNE from '../graphql/mutation/routine/AddRoutine.gql'
import DELETE_ROUITNE from '../graphql/mutation/routine/DeleteRoutine.gql'
import UPDATE_ROUITNE from '../graphql/mutation/routine/UpdateRoutine.gql'

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