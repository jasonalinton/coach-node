import MAP_ITERATION_TO_EVENT from '../graphql/mutation/event/MapIterationToEvent.gql'
import UNMAP_TASK_FROM_ROUTINEEVENT from '../graphql/mutation/event/UnmapTaskFromRoutineEvent.gql'
import SCHEDULE_TODO from '../graphql/mutation/todo/ScheduleTodo.gql'
import MAP_TODO_TO_EVENT from '../graphql/mutation/todo/MapTodoToEvent.gql'

export function mapIterationToEvent(iterationID, eventID, apollo) {
    apollo.mutate({
        mutation: MAP_ITERATION_TO_EVENT,
        variables: { iterationID, eventID }
    });
}

export function unmapTaskFromRoutineEvent(iterationID, eventID, startAt = null, endAt = null, newEventID = null, apollo) {
    apollo.mutate({
        mutation: UNMAP_TASK_FROM_ROUTINEEVENT,
        variables: { iterationID, eventID, startAt, endAt, newEventID }
    });
}

export function scheduleTodo(idTodo, startAt = null, endAt = null, apollo) {
    apollo.mutate({
        mutation: SCHEDULE_TODO,
        variables: { idTodo, startAt, endAt }
    });
}

export function mapTodoToEvent(idTodo, idEvent, apollo) {
    apollo.mutate({
        mutation: MAP_TODO_TO_EVENT,
        variables: { idTodo, idEvent }
    });
}