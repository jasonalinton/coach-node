import METRICS from '../graphql/query/QueryMetrics.gql'
import TODOS from '../graphql/query/QueryTodos.gql'
import GOALS from '../graphql/query/QueryGoals.gql'
import ROUTINES from '../graphql/query/QueryRoutines.gql'

import ADD_TODO from '../graphql/mutation/todo/AddTodo.gql'
import DELETE_TODO from '../graphql/mutation/todo/DeleteTodo.gql'
import UPDATE_TODO from '../graphql/mutation/todo/UpdateTodo.gql'

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

export function onTodoAdded(cache, addedTodo) {
    addItemToCache(cache, TODOS, 'todos', addedTodo);
    addPropertyToCache(cache, METRICS, 'metrics', 'todos', addedTodo);
    addPropertyToCache(cache, GOALS, 'goals', 'todos', addedTodo);
    addPropertyToCache(cache, ROUTINES, 'routines', 'todos', addedTodo);
}

export function onTodoUpdated(cache, updatedTodo) {
    updateItemInCache(cache, TODOS, 'todos', updatedTodo);
    updatePropertyInCache(cache, METRICS, 'metrics', 'todos', updatedTodo);
    updatePropertyInCache(cache, GOALS, 'goals', 'todos', updatedTodo);
    updatePropertyInCache(cache, ROUTINES, 'routines', 'todos', updatedTodo);
}

export function onTodoDeleted(cache, deletedTodo) {
    deleteItemInCache(cache, TODOS, 'todos', deletedTodo);
    deletePropertyInCache(cache, METRICS, 'metrics', 'todos', deletedTodo);
    deletePropertyInCache(cache, GOALS, 'goals', 'todos', deletedTodo);
    deletePropertyInCache(cache, ROUTINES, 'routines', 'todos', deletedTodo);
}