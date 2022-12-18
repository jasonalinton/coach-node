import ADD_TODO from '../graphql/mutation/todo/AddTodo.gql'
import DELETE_TODO from '../graphql/mutation/todo/DeleteTodo.gql'
import UPDATE_TODO from '../graphql/mutation/todo/UpdateTodo.gql'

import CREATE_DEFAULT_TASK from '../graphql/mutation/todo/CreateDefaultTask.gql'
import TOGGLE_COMPLETION from '../graphql/mutation/todo/ToggleCompletion.gql'
import RESCHEDULE_ITERATION from '../graphql/mutation/todo/RescheduleIteration.gql'
import ATTEMPT_ITERATION from '../graphql/mutation/todo/AttemptIteration.gql'
import DELETE_ITERATION from '../graphql/mutation/todo/DeleteIteration.gql'
import REFRESH_REPETITIVE_TODO from '../graphql/mutation/todo/RefreshRepetitiveTodo.gql'

import { refreshItemPositions } from '../api/itemAPI'

export function addTodo(todo, apollo) {
    apollo.mutate({
        mutation: ADD_TODO,
        variables: { todo },
        update: () => {
            console.log("Todo added");
            refreshItemPositions();
        }
    });
}

export function updateTodo(todo, apollo) {
    apollo.mutate({
        mutation: UPDATE_TODO,
        variables: { todo },
        update: () => {
            console.log("Todo updated");
            refreshItemPositions();
        }
    });
}

export function deleteTodo(todo, apollo) {
    apollo.mutate({
        mutation: DELETE_TODO,
        variables: { id: todo.id },
        // update: (cache, { data: { deleteTodo } }) => {
        //     deleteItemInCache(cache, TODOS, 'todos', deleteTodo);
        //     // onTodoDeleted(cache, deleteTodo);
        // }
    });
}

export function createDefaultTask(iteration, apollo) {
    apollo.mutate({
        mutation: CREATE_DEFAULT_TASK,
        variables: { iteration },
    });
}

export function toggleCompletion(iteration, apollo) {
    apollo.mutate({
        mutation: TOGGLE_COMPLETION,
        variables: { 
            idIteration: iteration.id,
            attemptedAt: iteration.attemptedAt,
            completedAt: iteration.completedAt
        },
    });
}

export function rescheduleIteration(id, startAt, endAt, apollo) {
    apollo.mutate({
        mutation: RESCHEDULE_ITERATION,
        variables: { id, startAt, endAt },
    });
}

export function attemptIteration(id, attemptedAt, apollo) {
    apollo.mutate({
        mutation: ATTEMPT_ITERATION,
        variables: { id, attemptedAt },
    });
}

export function deleteIteration(id, apollo) {
    apollo.mutate({
        mutation: DELETE_ITERATION,
        variables: { id },
    });
}

export function refreshRepetitiveTodo(idTodo, apollo) {
    apollo.mutate({
        mutation: REFRESH_REPETITIVE_TODO,
        variables: { idTodo },
    });
}