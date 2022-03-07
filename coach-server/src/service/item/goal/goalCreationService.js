const { configureMappedObject } = require("../itemConfigurationService");
const timePairService = require("../../time/timePairService");
const { clone } = require("../../../../utility");
const repeatService = require("../../time/repeatService");

function configureNewGoal(goal) {
    let configuredGoal = {};

    configureText(goal, configuredGoal);
    configureFamily(goal, configuredGoal);
    configureTimePairs(goal, configuredGoal);
    configureRepeats(goal, configuredGoal);

    return configuredGoal;
}

function configureText(goal, configuredGoal) {
    configuredGoal.text = goal.text;
    configuredGoal.description = goal.description;
}

/* Connect and/or create family items */
function configureFamily(goal, configuredGoal) {
    try {
        configureMappedObject(goal, 'metrics', configuredGoal);
        configureMappedObject(goal, 'parents', configuredGoal);
        configureMappedObject(goal, 'children', configuredGoal);
        configureMappedObject(goal, 'todos', configuredGoal);
        configureMappedObject(goal, 'routines', configuredGoal);

        return configuredGoal;
    } catch (ex) {
        console.log(`Error configuring family for goal`);
        console.log(ex);
    }
}

function configureTimePairs(goal, configuredGoal) {
    try {
        if (goal.timePairs) {
            let _goal = { timePairs: clone(goal.timePairs) };
            timePairService.configureTimePairs(goal);
            configuredGoal.timePairs = _goal.timePairs;
        }
    } catch (ex) {
        console.log("Error configuring time pairs for goal");
        console.log(ex);
    }
}

function configureRepeats(goal, configuredGoal) {
    try {
        let _goal = clone(goal);

        if ((_goal.repeats && _goal.repeats.length > 0) || 
            (_goal.unmappedIDs && _goal.unmappedIDs.repeats && _goal.unmappedIDs.repeats.length > 0 )) {
                _goal = { 
                    repeats: _goal.repeats, 
                    unmappedIDs: _goal.unmappedIDs
                };
                repeatService.configureRepeats(_goal);
            }
            
        if (_goal.repeats)
            configuredGoal.repeats = _goal.repeats;
    } catch (ex) {
        console.log("Error configuring repeats for goal");
        console.log(ex);
    }
}

module.exports = {
    configureNewGoal
}