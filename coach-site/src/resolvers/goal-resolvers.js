import ADD_GOAL from '../graphql/mutation/goal/AddGoal.gql'
import DELETE_GOAL from '../graphql/mutation/goal/DeleteGoal.gql'
import UPDATE_GOAL from '../graphql/mutation/goal/UpdateGoal.gql'

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