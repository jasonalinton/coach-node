import METRICS from '../graphql/query/QueryMetrics.gql'
import TODOS from '../graphql/query/todo/QueryTodos.gql'
import GOALS from '../graphql/query/QueryGoals.gql'
import ROUTINES from '../graphql/query/routine/QueryRoutines.gql'

import ADD_TODO from '../graphql/mutation/todo/AddTodo.gql'
import DELETE_TODO from '../graphql/mutation/todo/DeleteTodo.gql'
import UPDATE_TODO from '../graphql/mutation/todo/UpdateTodo.gql'

import CREATE_DEFAULT_TASK from '../graphql/mutation/todo/CreateDefaultTask.gql'
import TOGGLE_COMPLETION from '../graphql/mutation/todo/ToggleCompletion.gql'
import RESCHEDULE_ITERATION from '../graphql/mutation/todo/RescheduleIteration.gql'
import ATTEMPT_ITERATION from '../graphql/mutation/todo/AttemptIteration.gql'
import DELETE_ITERATION from '../graphql/mutation/todo/DeleteIteration.gql'

import {
    addItemToCache, addPropertyToCache,
    updateItemInCache, updatePropertyInCache,
    deleteItemInCache, deletePropertyInCache
} from './resolve'

export function addTodo(todo, apollo) {
    apollo.mutate({
        mutation: ADD_TODO,
        variables: { todo },
        // update: (cache, { data }) => {
        //     addItemToCache(cache, TODOS, 'todos', data.addTodo);
        //     // onTodoAdded(cache, data.addTodo)
        // }
    });
}

export function updateTodo(todo, apollo) {
    apollo.mutate({
        mutation: UPDATE_TODO,
        variables: { todo },
        // update: (cache, { data: { updateTodo } }) => {
        //     updateItemInCache(cache, TODOS, 'todos', updateTodo);
        //     // onTodoUpdated(cache, updateTodo);
        // }
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
        variables: { iteration },
    });
}

export function rescheduleIteration(id, startAt, apollo) {
    apollo.mutate({
        mutation: RESCHEDULE_ITERATION,
        variables: { id, startAt },
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

export function onTodoAdded(cache, addedTodo) {
    addItemToCache(cache, TODOS, 'todos', addedTodo);
    // addPropertyToCache(cache, TODOS, 'parents', 'todos', addedTodo);
    // addPropertyToCache(cache, TODOS, 'children', 'todos', addedTodo);
    addPropertyToCache(cache, METRICS, 'metrics', 'todos', addedTodo);
    addPropertyToCache(cache, GOALS, 'goals', 'todos', addedTodo);
    addPropertyToCache(cache, ROUTINES, 'routines', 'todos', addedTodo);
}

export function onTodoUpdated(cache, updatedTodo) {
    updateItemInCache(cache, TODOS, 'todos', updatedTodo);
    // updatePropertyInCache(cache, TODOS, 'parents', 'todos', updatedTodo);
    // updatePropertyInCache(cache, TODOS, 'children', 'todos', updatedTodo);
    updatePropertyInCache(cache, METRICS, 'metrics', 'todos', updatedTodo);
    updatePropertyInCache(cache, GOALS, 'goals', 'todos', updatedTodo);
    updatePropertyInCache(cache, ROUTINES, 'routines', 'todos', updatedTodo);
}

export function onTodoDeleted(cache, deletedTodo) {
    deleteItemInCache(cache, TODOS, 'todos', deletedTodo);
    // deletePropertyInCache(cache, TODOS, 'parents', 'todos', deletedTodo);
    // deletePropertyInCache(cache, TODOS, 'children', 'todos', deletedTodo);
    deletePropertyInCache(cache, METRICS, 'metrics', 'todos', deletedTodo);
    deletePropertyInCache(cache, GOALS, 'goals', 'todos', deletedTodo);
    deletePropertyInCache(cache, ROUTINES, 'routines', 'todos', deletedTodo);
}