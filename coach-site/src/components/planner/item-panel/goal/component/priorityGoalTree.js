// Tree and points logic for the Priority goals panel: turns a priority goal's kanban rows into
// nested goal/todo nodes and works out each node's points for a day or week.
import { ITEMTYPES, KANBAN_TO_REPEAT_TIMEFRAME } from '../../../../../model/constants';

// Dedup by idItem (keep latest dateAdded), filter to this timeframe, resolve idItem/idType
// to real Goal/Todo objects, then nest each item under the nearest in-set ancestor so the
// topmost ancestor present in the set acts as the group's label.
export function resolveCardTree(rows, timeframeID, goalStore, todoStore) {
    if (!goalStore || !todoStore) {
        return [];
    }

    let latestByItem = {};
    (rows || []).forEach(row => {
        let existing = latestByItem[row.idItem];
        if (!existing || new Date(row.dateAdded) > new Date(existing.dateAdded)) {
            latestByItem[row.idItem] = row;
        }
    });

    let filteredRows = Object.values(latestByItem)
        .filter(row => row.idTimeframe == timeframeID && !row.dateRemoved)
        .sort((a, b) => a.positionDescendant - b.positionDescendant);

    let resolvedItems = filteredRows
        .map(row => {
            let item = (row.idType == ITEMTYPES.GOAL)
                ? goalStore.getItem(row.idItem)
                : todoStore.getItem(row.idItem);
            return (item) ? { item, idType: row.idType } : null;
        })
        .filter(x => x);

    let byID = new Map(resolvedItems.map(x => [x.item.id, x]));
    let childrenOf = new Map();
    let topLevel = [];

    resolvedItems.forEach(node => {
        let ancestor = findNearestAncestorInSet(node, byID);
        if (ancestor) {
            if (!childrenOf.has(ancestor.item.id)) {
                childrenOf.set(ancestor.item.id, []);
            }
            childrenOf.get(ancestor.item.id).push(node);
        } else {
            topLevel.push(node);
        }
    });

    let attach = (node) => ({
        item: node.item,
        idType: node.idType,
        children: (childrenOf.get(node.item.id) || []).map(attach)
    });

    return topLevel.map(attach);
}

// Walks a node's ancestor chain (todo: parents then goals; goal: parents) looking for the
// nearest ancestor that is also present in this card's resolved item set.
function findNearestAncestorInSet(node, byID, visited) {
    visited = visited || new Set();
    if (visited.has(node.item.id)) {
        return null;
    }
    visited.add(node.item.id);

    let candidateParents = (node.idType == ITEMTYPES.TODO)
        ? [...(node.item.parents || []), ...(node.item.goals || [])]
        : [...(node.item.parents || [])];

    for (let parent of candidateParents) {
        if (byID.has(parent.id)) {
            return byID.get(parent.id);
        }
    }
    for (let parent of candidateParents) {
        let parentType = (parent.goalIDs !== undefined) ? ITEMTYPES.TODO : ITEMTYPES.GOAL;
        let found = findNearestAncestorInSet({ item: parent, idType: parentType }, byID, visited);
        if (found) {
            return found;
        }
    }
    return null;
}

// Points are earned by iterations in the period with completedAt or attemptedAt set
// (matches goalStore.getPoints's "attempted" semantics).
// Goals: the target is the points of the goal's most recent repeat in this timeframe
// (complete when earned >= target, partial when some earned). With no repeat, the goal is
// complete as soon as any todo under it has a completed iteration in the period.
// Todos: complete if they have a completed iteration in the period.
export function computeNodePoints(node, iterationStore, goalStore, start, end, timeframeID) {
    let hasChildren = node.children && node.children.length > 0;
    let children = (hasChildren)
        ? node.children.map(child => computeNodePoints(child, iterationStore, goalStore, start, end, timeframeID))
        : [];

    let inRange, attempted;
    if (hasChildren) {
        inRange = [];
        attempted = [];
    } else {
        let iterations = (node.idType == ITEMTYPES.TODO)
            ? iterationStore.getIterationsForTodo(node.item.id)
            : getGoalIterations(node.item.id, iterationStore, goalStore);
        inRange = iterations.filter(it => isInRange(it.startAt, start, end));
        attempted = inRange.filter(it => it.completedAt || it.attemptedAt);
    }

    let scheduledPoints = (hasChildren)
        ? children.reduce((total, c) => total + c.scheduledPoints, 0)
        : (inRange.length > 0)
            ? inRange.reduce((total, it) => total + (it.points || 0), 0)
            : (node.item.points || 0);
    let completedPoints = (hasChildren)
        ? children.reduce((total, c) => total + c.completedPoints, 0)
        : attempted.reduce((total, it) => total + (it.points || 0), 0);
    let hasCompletedTodo = (hasChildren)
        ? children.some(c => c.hasCompletedTodo)
        : attempted.length > 0;

    let targetRepeat = (node.idType == ITEMTYPES.GOAL)
        ? getTargetRepeat(node.item, KANBAN_TO_REPEAT_TIMEFRAME[timeframeID] ?? timeframeID, start, end)
        : null;

    let potentialPoints, status;
    if (targetRepeat) {
        potentialPoints = targetRepeat.points;
        status = (completedPoints >= potentialPoints) ? 'complete'
            : (completedPoints > 0) ? 'partial'
            : 'incomplete';
    } else if (node.idType == ITEMTYPES.GOAL) {
        potentialPoints = scheduledPoints;
        status = (hasCompletedTodo) ? 'complete' : 'incomplete';
    } else if (hasChildren) {
        potentialPoints = scheduledPoints;
        let statuses = children.map(c => c.status);
        status = statuses.every(st => st === 'complete') ? 'complete'
            : statuses.every(st => st === 'incomplete') ? 'incomplete'
            : 'partial';
    } else {
        potentialPoints = scheduledPoints;
        status = (hasCompletedTodo) ? 'complete' : 'incomplete';
    }

    return {
        item: node.item,
        idType: node.idType,
        children,
        potentialPoints,
        completedPoints,
        scheduledPoints,
        hasCompletedTodo,
        targetRepeat,
        status
    };
}

// The goal's most recent repeat (latest startDate, then highest id) in the given timeframe
// that is active during [start, end] and has points set. timeframeID is a REPETITION id.
export function getTargetRepeat(goal, timeframeID, start, end) {
    let repeats = (goal && goal.repeats) || [];
    let candidates = repeats.filter(repeat => {
        if (repeat.idTimeframe != timeframeID || !repeat.points) {
            return false;
        }
        let repeatStart = parseDateOnly(repeat.startDate);
        let repeatEnd = parseDateOnly(repeat.endDate);
        if (repeatStart && +repeatStart > +end) {
            return false;
        }
        if (repeatEnd && +endOfDateOnly(repeatEnd) < +start) {
            return false;
        }
        return true;
    });

    candidates.sort((a, b) => {
        let aStart = +(parseDateOnly(a.startDate) || 0);
        let bStart = +(parseDateOnly(b.startDate) || 0);
        return (bStart - aStart) || (b.id - a.id);
    });
    return candidates[0] || null;
}

function isInRange(startAt, start, end) {
    if (!startAt) {
        return false;
    }
    let time = +((typeof startAt.toDate === 'function') ? startAt.toDate() : new Date(startAt));
    return time >= +start && time <= +end;
}

// DateOnly values arrive as "YYYY-MM-DD"; parse them as local dates, not UTC
function parseDateOnly(value) {
    if (!value) {
        return null;
    }
    if (value instanceof Date) {
        return value;
    }
    let [year, month, day] = String(value).substring(0, 10).split('-').map(Number);
    return new Date(year, month - 1, day);
}

function endOfDateOnly(date) {
    let end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return end;
}

function getGoalIterations(goalID, iterationStore, goalStore) {
    let iterationIDs = goalStore.getIterationIDs(goalID);
    return iterationStore.getLoadedIterationsWithIDs(iterationIDs);
}
