import { defineStore } from 'pinia'
import { getWorkoutInfo, getWorkout, getWorkouts, getExercises, getWorkoutIDFromEvent, getExerciseHistory } from '../api/workoutAPI'
import { replaceOrAddItem, removeItemByID, sortAsc, sortNumAsc } from '../../utility';
import { getSocketConnection } from './socket'
import { postEndpoint } from '../api/api';

let initialized = false;

export const useWorkoutStore = defineStore('workout', {
    state: () => ({
        workouts: [],
        exercises: [],
        sets: [],
        variations: [],
        muscleGroups: [],
        muscles: [],
        exerciseHistory: [],
        displaySettings: [],
        dragged: {
            exerciseID: undefined,
        },
        selectedWorkoutID: undefined
    }),
    getters: {
        getDragged() {
            return this.dragged;
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
            let promise = getWorkoutInfo().then(res => {
                this.workouts = res.workouts;
                this.exercises = res.exercises;
                this.variations = res.variations;
                this.muscleGroups = res.muscleGroups;
                this.muscles = res.muscles;
            });
            return promise;
        },
        // NOTE: This is not neccesary yet. 
        //       You don't need all the exercise details in the workout object
        initializeItems() {
            let _this = this;
            this.workouts.forEach(w => {
                w.exercises.forEach(e => {
                    let exercise = _this.exercises.find(x => x.id == e.exercise.id);
                    if (exercise) {
                        e.exercise = exercise;
                    }
                });
            });
        },
        setDraggedProps(exerciseID) {
            this.dragged.exerciseID = exerciseID;
        },
        clearDraggedProps() {
            this.dragged.exerciseID = undefined;
        },
        selectWorkout(id) {
            this.selectedWorkoutID = id;
        },
        getDisplaySettings(workoutID) {
            var settings = this.displaySettings.find(x => x.workoutID == workoutID);
            if (settings) {
                return settings;
            } else {
                settings = {
                    workoutID,
                    sections: []
                };
                var workout = this.getWorkout(workoutID);
                workout.sections.forEach(section => {
                    settings.sections.push({
                        id: section.id,
                        isOpen: true
                    });
                });
                this.displaySettings.push(settings);
                return settings;
            }
        },
        async getWorkoutIDFromEvent(eventID) {
            var id = await getWorkoutIDFromEvent(eventID);
            var workout = getWorkout(id);
            if (!workout) {
                workout = await getWorkout(id)
                .then(workout => {
                    replaceOrAddItem(workout, _this.workouts);
                    return workout;
                });
            }
            return id;
        },
        getWorkout(id) {
            const _this = this;
            var workout = this.workouts.find(x => x.id == id);
            if (!workout) {
                getWorkout(id)
                .then(workout => {
                    replaceOrAddItem(workout, _this.workouts);
                })
                return undefined;
            }
            return workout;
        },
        getWorkouts(shouldRequestServer) {
            const _this = this;
            if (shouldRequestServer) {
                getWorkouts()
                .then(workouts => {
                    workouts.forEach(workout => {
                        replaceOrAddItem(workout, _this.workouts);
                    });
                    return workouts;
                })
            }
            return this.workouts;
        },
        getActiveWorkouts() {
            let workouts = this.workouts.filter(workout => {
                if (workout.iteration) {
                    return (!workout.iteration.completedAt);
                } else {
                    return false;
                }
            });
            return workouts;
        },
        getWorkoutsInDate(date) {
            let workouts = this.workouts.filter(workout => {
                if (workout.iteration && +workout.iteration.startAt.startOfDay() == +date) {
                    return true;
                } else {
                    return false;
                }
            });
            return workouts;
        },
        getExercise(id) {
            return this.exercises.find(x => x.id == id);
        },
        getExercises(shouldRequestServer) {
            const _this = this;
            if (shouldRequestServer) {
                getExercises()
                .then(exercises => {
                    exercises.forEach(exercise => {
                        replaceOrAddItem(exercise, _this.exercises);
                    });
                    return exercises;
                })
            }
            return this.exercises;
        },
        getWorkoutExercise(idWorkoutExercise, idWorkout) {
            let exercise;
            let workout = this.workouts.find(x => x.id == idWorkout);
            if (workout) {
                for (let i = 0; i < workout.sections.length; i++) {
                    exercise = workout.sections[i].exercises.find(x => x.idWorkoutExercise == idWorkoutExercise);
                    if (exercise) {
                        break;
                    }
                }
            }
            return exercise;
        },
        getVariation(id) {
            return this.variations.find(x => x.id == id);
        },
        getVariations() {
            return this.variations;
        },
        getExerciseHistory(idExercise, variationIDs) {
            let _this = this;
            variationIDs = variationIDs || [];
            let variationIDString = sortNumAsc(variationIDs).toString();

            getExerciseHistory(idExercise, variationIDs)
            .then(result => {
                let index = this.exerciseHistory.findIndex(x => {
                    let xVariationString = sortNumAsc(x.variationIDs).toString();
                    return (x.idExercise == idExercise) && variationIDString == xVariationString;
                });
                let history = {
                    idExercise,
                    variationIDs,
                    history: result
                };
                if (index == -1) {
                    _this.exerciseHistory.push(history);
                } 
                // else {
                //     _this.exerciseHistory.splice(index, 1, history);
                // }
            });
            let history = this.exerciseHistory.find(x => {
                let xVariationString = sortNumAsc(x.variationIDs).toString();
                return (x.idExercise == idExercise) && variationIDString == xVariationString;
            });

            return (history) ? history.history : [];
        },
        getSetsForIterations(iterationIDs) {
            let sets = this.sets.filter(set => {
                return set.idIteration && iterationIDs.includes(set.id);
            });
            return sets;
        },
        getExerciseIDOfTodo(idTodo) {
            var exercise = this.exercises.find(x => x.idTodo == idTodo);
            return (exercise) ? exercise.id : undefined;
        },
        getExerciseForTodo(idTodo) {
            var exercise = this.exercises.find(x => x.idTodo == idTodo);
            return exercise;
        },
        addVariation(name, typeID, typeName) {
            let variation_existing = this.variations.find(v => v.name == name && v.type.id == typeID);
            if (!variation_existing) {
                let variation_new = {
                    name,
                    description: undefined,
                    type: {
                        id: typeID,
                        text: typeName
                    }
                }
                this.variations.splice(0, 0, variation_new);
            }

        },
        addExercisesToSection(idWorkout, idWorkoutSection, exerciseIDs, position) {
            let workout = this.workouts.find(x => x.id == idWorkout);
            let section = workout.sections.find(x => x.id == idWorkoutSection);
            
            // let idWorkoutExercise = getNextNewID(section.exercises, 'idWorkoutSection');

            if (position == undefined) {
                let exercisesWithPosition = section.exercises.filter(x => x.position != undefined);
                position = (exercisesWithPosition.length > 0) ? exercisesWithPosition.at(-1).position + 1 : 1;
            }

            // This must come before the next section or the saved position will be wrong
            let data = { exerciseIDs, idWorkout, idWorkoutSection, position };
            return postEndpoint("Physical", "AddExercisesToWorkout", data)
                .then(this.onResponse);

        },
        getActiveExercise(idWorkout) {
            let exercise;
            let workout = this.workouts.find(x => x.id == idWorkout);
            if (workout) {
                let exercises = workout.sections.flatMap(x => x.exercises);
                for (let i = 0; i < exercises.length; i++) {
                    let isPending = false;
                    exercise = exercises[i];
                    exercise.sets.forEach(set => {
                        if (set.iteration == undefined) {
                            isPending = true;
                        }
                    });
                    if (isPending) {
                        break;
                    }
                }
            }
            return exercise;
        },
        getNextWorkoutExercise(idWorkout, idWorkoutExercise) {
            let nextExercise;
            let workout = this.workouts.find(x => x.id == idWorkout);
            if (workout) {
                let exercises = workout.sections.flatMap(x => x.exercises);
                let index = exercises.findIndex(x => x.id == idWorkoutExercise);
                if (index < exercises.length - 1) {
                    let exercise = exercises[index + 1];
                    return exercise;
                }
            }
            return nextExercise;
        },
        getPreviouseExercise(idWorkout, idWorkoutExercise) {
            
        },
        getMuscleGroup(id) {
            return this.muscleGroups.find(x => x.id == id);
        },
        getMuscleGroups() {
            return this.muscleGroups;
        },
        async saveExercise(model) {
            return postEndpoint("Physical", "SaveExercise", model)
                .then(this.onResponse);
        },
        async saveWorkout(model) {
            return postEndpoint("Physical", "SaveWorkout", model)
                .then(this.onResponse);
        },
        async copyAndStartWorkout(workoutID, startAt) {
            let data = { workoutID, startAt };
            return postEndpoint("Physical", "CopyAndStartWorkout", data)
                .then(this.onResponse);
        },
        async saveSet(model) {
            return postEndpoint("Physical", "SaveSet", model)
                .then(this.onResponse);
        },
        async logSet(setID, completedAt) {
            return postEndpoint("Physical", "LogSet", { setID, completedAt })
                .then(this.onResponse);
        },
        async logAllSets(idWorkoutExercise) {
            return postEndpoint("Physical", "LogAllSets", { idWorkoutExercise})
                .then(this.onResponse);
        },
        async completeWorkout(workoutID, startAt, endAt, createEvent) {
            let data = { workoutID, startAt, endAt, createEvent };
            return postEndpoint("Physical", "CompleteWorkout", data)
                .then(this.onResponse);
        },
        async repositionExercise(exerciseID, sectionID, position) {
            let data = { exerciseID, sectionID, position };
            return postEndpoint("Physical", "RepositionExercise", data)
                .then(this.onResponse);
        },
        async removeExerciseFromWorkout(idWorkoutExercise) {
            return postEndpoint("Physical", "RemoveExerciseFromWorkout", { idWorkoutExercise})
                .then(this.onResponse);
        },
        async createFitnessGoal(idGoalTimePairTodo, frequency, sets, reps, weight, time) {
            let model = { idGoalTimePairTodo, frequency, sets, reps, weight, time};
            postEndpoint("Physical", "CreateFitnessGoal", model)
                .then(this.onResponse);
        },
        async saveFitnessGoal(idFitnessGoal, frequency, sets, reps, weight, time) {
            let model = { idFitnessGoal, frequency, sets, reps, weight, time};
            postEndpoint("Physical", "SaveFitnessGoal", model)
                .then(this.onResponse);
        },
        onResponse(response) {
            if (response.updates)
                this.runUpdates(response.updates);
                return response.result;
        },
        runUpdates(updates) {
            let _this = this;
            if (updates.workouts && updates.workouts.length > 0) {
                updates.workouts.forEach(workout => {
                    replaceOrAddItem(workout, _this.workouts);
                })
                sortAsc(_this.workouts);
            }
            if (updates.workoutIDsRemoved && updates.workoutIDsRemoved.length > 0) {
                updates.workoutIDsRemoved.forEach(workoutID => {
                    removeItemByID(workoutID, _this.workouts);
                })
                sortAsc(_this.workouts);
            }
            if (updates.exercises && updates.exercises.length > 0) {
                updates.exercises.forEach(exercise => {
                    replaceOrAddItem(exercise, _this.exercises);
                })
                sortAsc(_this.exercises);
            }
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