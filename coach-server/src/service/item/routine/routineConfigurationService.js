const { clone } = require("../../../../utility");
const { configureMapObject, configureMappedObject } = require("../itemConfigurationService");
const timePairService = require("../../time/timePairService");
const repeatService = require("../../time/repeatService");

function configureRoutine(routine, configurationType) {
    let configuredRoutine = {};
    // if (routine.id) configurRoutine.id = routine.id;

    configureText(routine, configuredRoutine);
    // configureType(routine, configuredRoutine, configurationType);
    configureFamily(routine, configuredRoutine);
    configureMappedItems(routine, configuredRoutine);
    configureTimePairs(routine, configuredRoutine);
    configureRepeats(routine, configuredRoutine);

    return configuredRoutine;
}

function configureText(routine, configuredRoutine) {
    configuredRoutine.text = routine.text;
    configuredRoutine.description = routine.description;
}

// function configureType(routine, configuredRoutine, configurationType) {
//     configureMapObject(routine, 'type', configuredRoutine, configurationType);
// }

/* Connect and/or create and/or disconnect family items */
function configureFamily(routine, configuredRoutine) {
    try {
        configureMappedObject(routine, 'parents', configuredRoutine);
        configureMappedObject(routine, 'children', configuredRoutine);

        return configuredRoutine;
    } catch (ex) {
        console.log(`Error configuring family for routine`);
        console.log(ex);
    }
}

/* Connect and/or create and/or disconnect mapped items */
function configureMappedItems(routine, configuredRoutine) {
    try {
        configureMappedObject(routine, 'metrics', configuredRoutine);
        configureMappedObject(routine, 'goals', configuredRoutine);
        
        configureTodoRepeats(routine, configuredRoutine);
        configureUnMappedTodos(routine, configuredRoutine);
        //configureMappedObject(routine, 'todos', configuredRoutine);

        return configuredRoutine;
    } catch (ex) {
        console.log(`Error configuring mapped items for routine`);
        console.log(ex);
    }
}

function configureTimePairs(routine, configuredRoutine) {
    try {
        if (routine.timePairs) {
            let _routine = { timePairs: clone(routine.timePairs) };
            timePairService.configureTimePairs(_routine);
            configuredRoutine.timePairs = _routine.timePairs;
        }
    } catch (ex) {
        console.log("Error configuring time pairs for routine");
        console.log(ex);
    }
}

function configureRepeats(routine, configuredRoutine) {
    try {
        let _routine = clone(routine);

        if ((_routine.repeats && _routine.repeats.length > 0) || 
            (_routine.unmappedIDs && _routine.unmappedIDs.repeats && _routine.unmappedIDs.repeats.length > 0 )) {
                _routine = { 
                    repeats: _routine.repeats, 
                    unmappedIDs: _routine.unmappedIDs
                };
                repeatService.configureRepeats(_routine);
        } else {
            _routine.repeats = undefined;
        }
            
        configuredRoutine.repeats = _routine.repeats;
    } catch (ex) {
        console.log("Error configuring repeats for routine");
        console.log(ex);
    }
}

/* 
Routines have the ability to create new todos with new repeats.
The repeats for those new todos will need to be configured.
These are first created on the front-end, instead of the back, to allow for them to automatically be edited if needed
*/
function configureTodoRepeats(routine, configuredRoutine) {
    try {
        if (routine.todos) {
            configuredRoutine.todos = []; 

            routine.todos.forEach(_todo => {
                let todo = clone(_todo);
                todo.repeats = (todo.repeats) ? todo.repeats : [];
                repeatService.configureRepeats(todo, "todo");
                configuredRoutine.todos.push(todo);
            });
        }
    } catch (ex) {
        console.log("Error configuring todo repeats for routine");
        console.log(ex);
    }
}

function configureUnMappedTodos(routine, configuredRoutine) {
    try {
        if (routine.unmappedIDs.todos) {
            configuredRoutine.unmappedIDs = { todos: routine.unmappedIDs.todos };
        }
    } catch (ex) {
        console.log("Error configuring unmapped todos for routine");
        console.log(ex);
    }
}



module.exports = {
    configureRoutine
}