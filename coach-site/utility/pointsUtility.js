/*
 * Points earned between two dates, for an iteration, type, goal or metric item.
 * Extracted from TypePointsTimeframe.vue so the briefing panel can compute points
 * for arbitrary ranges (period history, pace vs. previous period).
 *
 * item: { type: 'iteration' | 'type' | 'goal' | 'metric', id?, ids? }
 * stores: { iterationStore, todoStore, goalStore }
 */
export function getPoints(stores, item, start, end) {
    let { iterationStore, todoStore, goalStore } = stores;
    if (!iterationStore || !todoStore || !goalStore || !item) {
        return 0;
    }

    let iterations = iterationStore.iterations.filter(iteration => {
        return +(new Date(iteration.startAt)) >= +start &&
               +(new Date(iteration.endAt)) <= +end;
    });
    let done = iterations.filter(x => x.attemptedAt != null || x.completedAt != null);

    let matchingIterations = [];
    if (item.type == 'iteration') {
        matchingIterations = done;
    } else if (['type', 'goal', 'metric'].includes(item.type)) {
        done.forEach(iteration => {
            if (iteration.todoID) {
                isTodoOfType(stores, item, iteration, iteration.todoID, matchingIterations);
            }
        });
    } else {
        // Pre-existing placeholder for unsupported item types (kept from TypePointsTimeframe)
        return 10;
    }

    return matchingIterations.filter(x => x.points != null)
        .reduce((total, iteration) => total + iteration.points, 0);
}

function matchesItem(item, typeIDs) {
    if (item.id) {
        return typeIDs.includes(item.id);
    } else if (item.ids) {
        return item.ids.some(id => typeIDs.includes(id));
    }
    return false;
}

function addMatch(iteration, matchingIterations) {
    if (matchingIterations.findIndex(x => x.id == iteration.id) == -1) {
        matchingIterations.push(iteration);
    }
}

function isTodoOfType(stores, item, iteration, todoID, matchingIterations) {
    if (!todoID) return;
    let todo = stores.todoStore.getItem(todoID);
    if (!todo) return;

    let typeIDs = todo[`${item.type}s`].map(y => y.id);
    if (matchesItem(item, typeIDs)) {
        addMatch(iteration, matchingIterations);
        return;
    }

    todo.parents.forEach(parent => {
        isTodoOfType(stores, item, iteration, parent.id, matchingIterations);
    });
    if (item.type == "goal" || item.type == "metric") {
        todo.goals.forEach(goal => {
            isGoalOfType(stores, item, iteration, goal.id, matchingIterations);
        });
    }
}

function isGoalOfType(stores, item, iteration, goalID, matchingIterations) {
    if (!goalID) return;
    let goal = stores.goalStore.getItem(goalID);
    if (!goal) return;

    let typeIDs = [];
    if (item.type == "goal") {
        typeIDs = goal.parents.map(y => y.id);
    } else if (item.type == "metric") {
        typeIDs = goal.metrics.map(y => y.id);
    }

    if (matchesItem(item, typeIDs)) {
        addMatch(iteration, matchingIterations);
        return;
    }

    goal.parents.forEach(parent => {
        isGoalOfType(stores, item, iteration, parent.id, matchingIterations);
    });
}
