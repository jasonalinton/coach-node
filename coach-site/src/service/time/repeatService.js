import { clone } from '../../../utility';

export function getRoutineRepeatIDsAssociatedWithTodo(todo, routine) {
    let repeatIDs_Routine = routine.repeats.map(_repeat => _repeat.id);
    let repeatIDs_Todo = []; // ID's of repeats already associated with routine

    if (todo.repeats) {
        let repeats = todo.repeats.filter(_repeat => !_repeat.endRepeat || new Date(_repeat.endRepeat.dateTime).getTime() > (new Date()).getTime())
        repeats.forEach(_repeat => {
            if (_repeat.routineRepeat && repeatIDs_Routine.includes(_repeat.routineRepeat.id)) {
                repeatIDs_Todo.push(_repeat.routineRepeat.id);
            }
        })
    }

    return repeatIDs_Todo;
}

export function createTodoRepeatFromRoutineRepeat(repeat) {
    let repeat_New = clone(repeat);

    // Remove ID so new objects are created
    if (repeat_New.startRepeat) delete repeat_New.startRepeat.id;
    if (repeat_New.endRepeat) delete repeat_New.endRepeat.id;
    if (repeat_New.startIteration) delete repeat_New.startIteration.id;
    if (repeat_New.endIteration) delete repeat_New.endIteration.id;

    repeat_New.isEventVisible = false;

    repeat_New.routineRepeat = { id: repeat.id };

    delete repeat_New.id;

    return repeat_New;
}