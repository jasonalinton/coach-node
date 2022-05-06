import ADD_GOAL from '../graphql/mutation/goal/AddGoal.gql'
import DELETE_GOAL from '../graphql/mutation/goal/DeleteGoal.gql'
import UPDATE_GOAL from '../graphql/mutation/goal/UpdateGoal.gql'
import SAVE_GOAL_POSITIONS from '../graphql/mutation/goal/SaveGoalPositions.gql'

export function addGoal(goal, apollo) {
    apollo.mutate({
        mutation: ADD_GOAL,
        variables: { goal },
    });
}

export function updateGoal(goal, apollo) {
    apollo.mutate({
        mutation: UPDATE_GOAL,
        variables: { goal },
    });
}

export function deleteGoal(goal, apollo) {
    apollo.mutate({
        mutation: DELETE_GOAL,
        variables: { id: goal.id },
    });
}

export function saveGoalPositions(goalPositions, apollo) {
    apollo.mutate({
        mutation: SAVE_GOAL_POSITIONS,
        variables: { goalPositions },
    });
}