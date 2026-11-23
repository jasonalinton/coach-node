import { defineStore } from 'pinia'
import { markRaw } from 'vue'
import { getGoals, getGoalsWithTimeframe, getGoalKanban as fetchGoalKanban } from '../api/goalAPI'
import { capitalize, replaceOrAddItem, sortAsc, sum, indexByID, pickByID, getByID } from '../../utility';
import { getSocketConnection, deferUpdate, withUpdatedItems } from './socket'
import { useMetricStore } from '@/store/metricStore'
import { useTodoStore } from '@/store/todoStore'
import { useRoutineStore } from '@/store/routineStore'
import { useIterationStore } from '@/store/iterationStore'
import { usePlannerStore } from '@/store/plannerStore'
import { GOAL_TYPE, ITEMTYPES, KANBAN_COLUMN, INHERITANCE } from '../model/constants';
import { postEndpoint } from '../api/api';

        

let initialized = false;

export const useGoalStore = defineStore('goal', {
    state: () => ({
        goals: [],
        draggedKanbanTask: null
    }),
    getters: {
        // id -> [index, item]; rebuilt only when the list changes
        goalIndex: (state) => indexByID(state.goals),
        fitnessGoals: (state) => {
            let fitnessGoals = state.goals.filter(goal => {
                let isFitness = goal.types.some(type => type.id == GOAL_TYPE.FITNESS);
                return isFitness;
            });
            return fitnessGoals;
        },
        getDraggedKanbanTask: (state) => {
            return state.draggedKanbanTask;
        }
    },
    actions: {
        async initialize() {
            let promise = this.fill();
            this.connectSocket();
            initialized = true;
            return promise;
        },
        async refresh() {
            let promise = this.fill();
            return promise;
        },
        async fill() {
            let promise = getGoals().then(res => this.goals = res);
            return promise;
        },
        initializeItems(goals, allGoals, updates) {
            let metricStore = useMetricStore();
            let todoStore = useTodoStore();
            let routineStore = useRoutineStore();

            allGoals = allGoals || this.goals;
            goals = goals || allGoals;
            // The other stores apply socket updates in a deferred tick, so their indexes don't have
            // items created in this same update yet - layer the incoming items over them
            let goalIndex    = indexByID(allGoals);
            let metricIndex  = withUpdatedItems(metricStore.metrics, metricStore.metricIndex, updates?.metrics);
            let todoIndex    = withUpdatedItems(todoStore.todos, todoStore.todoIndex, updates?.todos);
            let routineIndex = withUpdatedItems(routineStore.routines, routineStore.routineIndex, updates?.routines);
            goals.forEach(goal => {
                goal.parents  = markRaw(pickByID(goal.parentIDs, goalIndex));
                goal.children = markRaw(pickByID(goal.childIDs, goalIndex));
                goal.metrics  = markRaw(pickByID(goal.metricIDs, metricIndex));
                goal.todos    = markRaw(pickByID(goal.todoIDs, todoIndex));
                goal.routines = markRaw(pickByID(goal.routineIDs, routineIndex));
            })
        },
        getItems() {
            return this.goals;
        },
        getItem(id) {
            return getByID(id, this.goalIndex);
        },
        getItemsByID(ids) {
            return pickByID(ids, this.goalIndex);
        },
        getTimeframeItems(start, end) {
            return getGoalsWithTimeframe(start, end)
                .then(goals => {
                    let allGoals = [...this.goals];
                    goals.forEach(goal => replaceOrAddItem(goal, allGoals));
                    this.initializeItems(goals, allGoals);
                    this.goals = sortAsc(allGoals);
                    return goals;
                });
        },
        getGoalsInTimeframe(timeFrameID, datetime) {
            var goals = this.goals.filter(goal => {
                var index = goal.timePairs.findIndex(timePair => {
                    if (timePair.idTimeframe != timeFrameID) {
                        return false;
                    }

                    let start = (timePair.startTime) ? new Date(timePair.startTime.dateTime) : undefined
                    let end = (timePair.endTime) ? new Date(timePair.endTime.dateTime) : undefined
                    if ((start && +start <= +datetime) && ((end && +end >= +datetime) || end == undefined)) {
                        return true;
                    }
                    return false;
                });
                return index > -1;
            });
            return goals;
        },
        getActiveGoals(datetime) {
            var goals = this.goals.filter(goal => {
                var index = goal.timePairs.findIndex(timePair => {
                    let start = (timePair.startTime) ? new Date(timePair.startTime.dateTime) : undefined
                    let end = (timePair.endTime) ? new Date(timePair.endTime.dateTime) : undefined
                    if ((start && +start <= +datetime) && (end && +end >= +datetime)) {
                        return true;
                    }
                    return false;
                });
                return index > -1;
            });
            return goals;
        },
        getFitnessGoals() {
            let fitnessGoals = this.goals.filter(goal => {
                let isFitness = goal.types.some(type => type.id == GOAL_TYPE.FITNESS);
                return isFitness;
            });
            return fitnessGoals;
        },
        getPoints(goalID) {
            let iterationIDs = this.getIterationIDs(goalID);
            let iterationStore = useIterationStore();
            let iterations = iterationStore.getLoadedIterationsWithIDs(iterationIDs);
            let iterations_Attempted = iterations.filter(task => task.completedAt || task.attemptedAt);
            let iterations_WithPoints = iterations_Attempted.filter(x => x.points);
            let points = sum(iterations_WithPoints, 'points');
            return points;
        },
        getIterationIDs(goalID) {
            let idsChecked = { goals: [], todos: [], iterations: [] };
            this.getDescendantIterationsFromGoal(goalID, idsChecked);
            return idsChecked.iterations;
        },
        getDescendantTodoIDs(goalID) {
            let idsChecked = { goals: [], todos: [], iterations: [] };
            this.getDescendantIterationsFromGoal(goalID, idsChecked);
            return idsChecked.todos;
        },
        /** Everything under goalID - descendant goals (excluding goalID itself), their todos (and
         * those todos' sub-todos), and every iteration scheduled from any of those todos. */
        getDescendantIDs(goalID) {
            let idsChecked = { goals: [], todos: [], iterations: [] };
            this.getDescendantIterationsFromGoal(goalID, idsChecked);
            return {
                goalIDs: idsChecked.goals.filter(id => id != goalID),
                todoIDs: idsChecked.todos,
                iterationIDs: idsChecked.iterations
            };
        },
        getDescendantIterationsFromGoal(goalID, idsChecked) {
            if (!idsChecked.goals.includes(goalID)) {
                idsChecked.goals.push(goalID);
                let goal = this.getItem(goalID);
                if (!goal) return; // Not loaded yet (or deleted)
                
                /* Loop through todos */
                goal.todoIDs.forEach(todoID => {
                    this.getDescendantIterationsFromTodo(todoID, idsChecked);
                })
                /* Loop through goals */
                goal.childIDs.forEach(goalID => {
                    this.getDescendantIterationsFromGoal(goalID, idsChecked);
                })
            }
        },
        getDescendantIterationsFromTodo(todoID, idsChecked) {
            if (!idsChecked.todos.includes(todoID)) {
                idsChecked.todos.push(todoID);
                
                /* Loop through todo's children */
                let todoStore = useTodoStore();
                let todo = todoStore.getItem(todoID);
                // The todo may not be loaded yet (or was deleted); its iterations are still recorded below
                (todo?.childIDs || []).forEach(childID => {
                    this.getDescendantIterationsFromTodo(childID, idsChecked);
                })
                
                /* Record iteration ids */
                let iterationStore = useIterationStore();
                let iterations = iterationStore.getIterationsForTodo(todoID); 
                let iterationIDs = iterations.map(x => x.id);
                idsChecked.iterations = idsChecked.iterations.concat(iterationIDs);
            }
        },
        saveGoal(model) {
            return postEndpoint("Goal", "SaveGoal", model)
            .then(response => response.result);
        },
        repositionItem(parentType, itemType, parentID, itemID, newPosition) {
            var data = { newPosition };
            data[`${parentType}ID`] = parentID;
            data.itemID = itemID;
        
            itemType = capitalize(itemType);
            parentType = capitalize(parentType);

            return postEndpoint(parentType, `Reposition${itemType}In${parentType}`, data);
        },
        createAndMapItem(goalID, itemType, itemText) {
            let data = { goalID, itemType, itemText };
            return postEndpoint("Goal", "CreateAndMapItemToGoal", data)
            .then(response => response.result);
        },
        mapItems(goalID, itemType, addedIDs, removedIDs) {
            let data = { goalID, itemType, addedIDs, removedIDs };
            return postEndpoint("Goal", "MapItemsToGoal", data)
            .then(response => response.result);
        },
        /** Saves a goal repeat. Its points are the goal's completion target for the repeat's timeframe.
         * The updated goal arrives through the socket (runUpdates), which re-links parents/children. */
        saveRepeat(repeat) {
            return postEndpoint("Goal", "SaveGoalRepeat", { repeat })
            .then(response => response.result);
        },
        deleteTimePair(goalTimePairID) {
            return postEndpoint("Goal", "DeleteGoalTimePair", { goalTimePairID })
            .then(response => response.result);
        },
        unmapTodoFromGoalTimePair(goalTimePairTodoID) {
            return postEndpoint("Goal", "UnmapTodoFromGoalTimePair", { goalTimePairTodoID })
            .then(response => response.result);
        },
        saveDescription(goalID, description) {
            let model = {
                id: goalID,
                description: {
                    value: description
                }
            };
            this.saveGoal(model);
        },
        saveMetrics(goalID, addedIDs, removedIDs) {
            let model = {
                id: goalID,
                metrics: {
                    addedIDs,
                    removedIDs
                }
            };
            this.saveGoal(model);
        },
        createIteration(idGoal, text, datetime) {
            return postEndpoint("Goal", "CreateIterationForGoal", { idGoal, text, datetime })
            .then(response => response.result);
        },
        saveTimePair(timePair) {
            return postEndpoint("Goal", "SaveGoalTimePair", { timePair })
            .then(response => response.result);
        },
        addReason(id, datetime, text) {
            return postEndpoint("Goal", "AddReason", { id, datetime, text })
            .then(response => response.result);
        },
        addBlurb(idGoal, blurb) {
            let data = { 
                ...blurb,
                idGoal, 
                idBlurbType: blurb.idType,
            }
            return postEndpoint("Goal", "AddBlurbToGoal", data)
            .then(response => response.result);
        },
        updateBlurb(blurb) {
            let data = {
                ...blurb,
                idBlurb: blurb.id,
                idBlurbType: blurb.idType,
            }
            return postEndpoint("Goal", "UpdateBlurbInGoal", data)
            .then(response => response.result);
        },
        setDraggedKanbanTask(item) {
            this.draggedKanbanTask = item;
        },
        clearDraggedKanbanTask() {
            this.draggedKanbanTask = null;
        },
        getGoalKanban(idGoal) {
            return fetchGoalKanban(idGoal);
        },
        setKanbanTask(idParent, idDescendant, idTodo, idIteration, idColumn, idTimeframe, positionDescendant, date, dateAdded, dateRemoved) {
            let data = { idParent, idDescendant, idTodo, idIteration, idColumn, idTimeframe, positionDescendant, date, dateAdded, dateRemoved };
            return postEndpoint("Goal", "SetGoalKanbanTask", data)
            .then(response => response.result);
        },
        removeKanbanTask(id, dateRemoved) {
            return postEndpoint("Goal", "RemoveGoalKanbanTask", { id, dateRemoved })
            .then(response => response.result);
        },
        /* ---- Priority goals (Primary/Secondary/Tertiary) ----
         * A goal is in a priority lane when its newest kanban row under that priority goal is open,
         * Active, and in the lane's timeframe. `rows` is that priority goal's GetGoalKanban result. */
        /** Makes goals Active in a priority lane, mapping them under the priority goal if they aren't descendants yet */
        async addPriorityGoals(idPriority, idTimeframe, goalIDs, rows) {
            let descendantIDs = this.getDescendantIDs(idPriority).goalIDs;
            let unmappedIDs = goalIDs.filter(id => !descendantIDs.includes(id));
            if (unmappedIDs.length > 0) {
                await this.mapItems(idPriority, 'child', unmappedIDs, []);
            }
            let position = nextKanbanPosition(rows, idTimeframe);
            let now = new Date();
            await Promise.all(goalIDs.map(id =>
                this.setKanbanTask(idPriority, id, null, null, KANBAN_COLUMN.ACTIVE, idTimeframe, position++, null, now, null)));
        },
        /** Moves a lane node (with its in-lane descendants) to another priority, or to a new spot in the same one.
         * beforeItemID is the item it's dropped above; null drops it at the end. */
        async movePriorityGoal(node, fromPriority, toPriority, idTimeframe, fromRows, toRows, beforeItemID) {
            let movedItems = flattenNode(node);
            let movedIDs = movedItems.map(x => x.item.id);
            let now = new Date();

            if (fromPriority != toPriority) {
                let current = currentKanbanRows(fromRows);
                await Promise.all(movedIDs
                    .filter(id => current[id] && !current[id].dateRemoved)
                    .map(id => this.removeKanbanTask(current[id].id, now)));

                if (node.idType == ITEMTYPES.GOAL && !this.getDescendantIDs(toPriority).goalIDs.includes(node.item.id)) {
                    await this.mapItems(toPriority, 'child', [node.item.id], []);
                }
            }

            // Renumber the target lane with the moved items inserted, writing only rows that change
            let laneRows = Object.values(currentKanbanRows(toRows))
                .filter(row => !row.dateRemoved && row.idTimeframe == idTimeframe && !movedIDs.includes(row.idItem))
                .sort((a, b) => a.positionDescendant - b.positionDescendant);
            let ordered = laneRows.map(row => ({ id: row.idItem, idType: row.idType, position: row.positionDescendant }));
            let insertAt = ordered.findIndex(x => x.id == beforeItemID);
            if (insertAt < 0) insertAt = ordered.length;
            ordered.splice(insertAt, 0, ...movedItems.map(x => ({ id: x.item.id, idType: x.idType, isMoved: true })));

            await Promise.all(ordered.map((x, index) => {
                let position = index + 1;
                if (!x.isMoved && x.position == position) return null;
                let isTodo = (x.idType == ITEMTYPES.TODO);
                return this.setKanbanTask(toPriority, isTodo ? null : x.id, isTodo ? x.id : null, null,
                    KANBAN_COLUMN.ACTIVE, idTimeframe, position, null, now, null);
            }));
        },
        /** Reorders sub-goals under one parent. The siblings trade places in the lane's position order, so
         * nothing else in the lane moves; the lane is renumbered 1..n and only changed rows are written. */
        async reorderPrioritySiblings(idPriority, idTimeframe, rows, siblingIDs) {
            let laneRows = Object.values(currentKanbanRows(rows))
                .filter(row => !row.dateRemoved && row.idTimeframe == idTimeframe)
                .sort((a, b) => a.positionDescendant - b.positionDescendant);
            let ordered = laneRows.slice();
            let slots = ordered.map((row, index) => siblingIDs.includes(row.idItem) ? index : -1).filter(index => index >= 0);
            let byID = Object.fromEntries(laneRows.map(row => [row.idItem, row]));
            slots.forEach((slot, i) => ordered[slot] = byID[siblingIDs[i]]);

            let now = new Date();
            await Promise.all(ordered.map((row, index) => {
                let position = index + 1;
                if (row.positionDescendant == position) return null;
                let isTodo = (row.idType == ITEMTYPES.TODO);
                return this.setKanbanTask(idPriority, isTodo ? null : row.idItem, isTodo ? row.idItem : null, null,
                    KANBAN_COLUMN.ACTIVE, idTimeframe, position, null, now, null);
            }));
        },
        /** Takes a lane node (and its in-lane descendants) out of the priority. Mappings are left as they are. */
        removePriorityGoal(node, rows) {
            let current = currentKanbanRows(rows);
            let now = new Date();
            return Promise.all(flattenNode(node)
                .map(x => current[x.item.id])
                .filter(row => row && !row.dateRemoved)
                .map(row => this.removeKanbanTask(row.id, now)));
        },
        /** Sets the goal's points target for a day/week by saving them on its repeat for that timeframe,
         * creating a plain repeat (every 1 day/week) when it has none */
        setPriorityGoalPoints(goal, repeatTimeframeID, points) {
            let existing = (goal.repeats || [])
                .filter(repeat => repeat.idTimeframe == repeatTimeframeID)
                .sort((a, b) => b.id - a.id)[0];
            let base = existing || { ...usePlannerStore().createRepeat(), id: -1, idInheritance: INHERITANCE.SELF, idTodoMappingType: null };
            let repeat = {
                id: base.id,
                idInheritance: base.idInheritance,
                idTodoMappingType: base.idTodoMappingType,
                isOwner: true,
                itemID: goal.id,
                itemType: 'goal',
                idTimeframe: repeatTimeframeID,
                idType: base.idType,
                points: points || null,
                interval: base.interval || 1,
                frequency: base.frequency || 1,
                dayIndecies: base.dayIndecies || [],
                startDate: base.startDate,
                endDate: base.endDate,
                startTime: base.startTime,
                endTime: base.endTime,
                isBlock: base.isBlock,
                isEventVisible: base.isEventVisible,
                isRecommended: base.isRecommended,
            };
            return this.saveRepeat(repeat);
        },
        /** Adds a sub-goal under a goal already in a lane: maps an existing goal (goalID) or creates one (text) */
        async addPrioritySubGoal(parentGoalID, idPriority, idTimeframe, rows, { goalID, text }) {
            if (goalID == null) {
                goalID = (await this.createGoalUnder(parentGoalID, text))?.id;
                if (goalID == null) return;
            } else {
                await this.mapItems(parentGoalID, 'child', [goalID], []);
            }
            let now = new Date();
            return this.setKanbanTask(idPriority, goalID, null, null, KANBAN_COLUMN.ACTIVE, idTimeframe,
                nextKanbanPosition(rows, idTimeframe), null, now, null);
        },
        /** Creates a new goal under the priority goal and makes it Active in the lane */
        async createPriorityGoal(idPriority, idTimeframe, rows, text) {
            let goal = await this.createGoalUnder(idPriority, text);
            if (!goal) return;
            let now = new Date();
            return this.setKanbanTask(idPriority, goal.id, null, null, KANBAN_COLUMN.ACTIVE, idTimeframe,
                nextKanbanPosition(rows, idTimeframe), null, now, null);
        },
        // CreateAndMapItemToGoal doesn't return the new goal, so wait for it to arrive over the socket.
        // The known ids are captured before the request, in case the update lands before it resolves.
        async createGoalUnder(parentGoalID, text, timeout = 5000) {
            let existingIDs = new Set(this.goals.map(goal => goal.id));
            await this.createAndMapItem(parentGoalID, 'child', text);
            let deadline = Date.now() + timeout;
            while (Date.now() < deadline) {
                let goal = this.goals.find(g => !existingIDs.has(g.id) && g.text == text);
                if (goal) return goal;
                await new Promise(resolve => setTimeout(resolve, 150));
            }
            return null;
        },
        runUpdates(updates) {
            const hasGoals = updates.goals?.length > 0;
            const hasRemovals = updates.goalIDsRemoved?.length > 0;
            if (!hasGoals && !hasRemovals) return;

            // Copy the list inside the deferred fn, so updates queued in the same tick build on each other
            // instead of each overwriting the list with its own stale copy
            deferUpdate(() => {
                let goals = [...this.goals];
                if (hasGoals) {
                    updates.goals.forEach(goal => replaceOrAddItem(goal, goals));
                    this.initializeItems(updates.goals, goals, updates);
                }
                if (hasRemovals) {
                    updates.goalIDsRemoved.forEach(id => removeItemByID(id, goals));
                }
                this.goals = sortAsc(goals);
            });
        },
        connectSocket() {
            if (!initialized) {
                let coachConnection = getSocketConnection("coachHub");
                coachConnection.on("SendUpdates", updateModel => {
                    this.runUpdates(updateModel);
                });
            }
        }
    },
})

// Newest kanban row per item (by dateAdded), keyed by item id
function currentKanbanRows(rows) {
    let latest = {};
    (rows || []).forEach(row => {
        let existing = latest[row.idItem];
        if (!existing || new Date(row.dateAdded) > new Date(existing.dateAdded)) {
            latest[row.idItem] = row;
        }
    });
    return latest;
}

// Position after the last open row in the timeframe
function nextKanbanPosition(rows, idTimeframe) {
    let positions = Object.values(currentKanbanRows(rows))
        .filter(row => !row.dateRemoved && row.idTimeframe == idTimeframe)
        .map(row => row.positionDescendant || 0);
    return (positions.length > 0) ? Math.max(...positions) + 1 : 1;
}

// A lane node and all its in-lane descendants, parent first
function flattenNode(node) {
    return [node, ...(node.children || []).flatMap(flattenNode)];
}
