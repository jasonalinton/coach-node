import { defineStore } from 'pinia'
import { getWorkoutInfo, getWorkout, getWorkouts, getExercises, getWorkoutIDFromEvent, getExerciseHistory,
    saveExercise, addExercisesToWorkout, removeExerciseFromWorkout, saveWorkout, copyAndStartWorkout, 
    saveSet, logSet, logAllSets, completeWorkout, repositionExercise } from '../api/workoutAPI'
import { replaceOrAddItem, removeItemByID, sortAsc, sortNumAsc, getNextNewID } from '../../utility';
import { getSocketConnection } from './socket'

let initialized = false;

export const useWorkoutStore = defineStore('workout', {
    state: () => ({
        workouts: [],
        exercises: [],
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
            let variationIDString = sortNumAsc(variationIDs).toString();

            getExerciseHistory(idExercise, variationIDs)
            .then(result => {
                let history = this.exerciseHistory.find(x => {
                    let xVariationString = sortNumAsc(x.variationIDs).toString();
                    return (x.idExercise == idExercise) && variationIDString == xVariationString;
                });
                if (!history) {
                    _this.exerciseHistory.push({
                        idExercise,
                        variationIDs,
                        history: result
                    });
                }
            });
            let history = this.exerciseHistory.find(x => {
                let xVariationString = sortNumAsc(x.variationIDs).toString();
                return (x.idExercise == idExercise) && variationIDString == xVariationString;
            });

            return (history) ? history.history : [];
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
        addExercisesToSection(idWorkout, idSection, exerciseIDs, position) {
            let workout = this.workouts.find(x => x.id == idWorkout);
            let section = workout.sections.find(x => x.id == idSection);
            
            // let idWorkoutExercise = getNextNewID(section.exercises, 'idWorkoutSection');

            if (position == undefined) {
                let exercisesWithPosition = section.exercises.filter(x => x.position != undefined);
                position = (exercisesWithPosition.length > 0) ? exercisesWithPosition.at(-1).position + 1 : 1;
            }

            // This must come before the next section or the saved position will be wrong
            addExercisesToWorkout(exerciseIDs, idWorkout, idSection, position);

            // exerciseIDs.forEach(id => {
            //     let workoutExercise = {
            //         id,
            //         idExercise: id,
            //         idWorkoutExercise,
            //         idWorkoutSection: idSection,
            //         position: position++,
            //         sets: [],
            //         isPending: true
            //     };
            //     section.exercises.push(workoutExercise);
            // })
            // section.exercises = sortAsc(section.exercises, 'position');

        },
        removeExerciseFromWorkout(idWorkoutExercise) {
            removeExerciseFromWorkout(idWorkoutExercise);
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
            return saveExercise(model);
        },
        async saveWorkout(model) {
            return saveWorkout(model);
        },
        async copyAndStartWorkout(workoutID, startAt) {
            let _this = this;
            return copyAndStartWorkout(workoutID, startAt)
                .then(workout => {
                    replaceOrAddItem(workout, _this.workouts);
                    return workout;
                });
        },
        async saveSet(model) {
            return saveSet(model);
        },
        async logSet(setID, completedAt) {
            return logSet(setID, completedAt);
        },
        async logAllSets(idWorkoutExercise) {
            return logAllSets(idWorkoutExercise);
        },
        async completeWorkout(workoutID, startAt, endAt, createEvent) {
            return completeWorkout(workoutID, startAt, endAt, createEvent);
        },
        async repositionExercise(exerciseID, sectionID, position) {
            repositionExercise(exerciseID, sectionID, position);
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
        connectSocket() {
            if (!initialized) {
                let connection = getSocketConnection("metricHub");

                let _this = this;
                connection.on("UpdateWorkouts", workouts => {
                    workouts.forEach(workout => {
                        replaceOrAddItem(workout, _this.workouts);
                    })
                    sortAsc(_this.workouts);
                });
                connection.on("RemoveWorkouts", workoutIDs => {
                    workoutIDs.forEach(workoutID => {
                        removeItemByID(workoutID, _this.workouts);
                    })
                    sortAsc(_this.events);
                });
                connection.on("UpdateExercises", exercises => {
                    exercises.forEach(exercise => {
                        replaceOrAddItem(exercise, _this.exercises);
                    })
                    sortAsc(_this.exercises);
                });
            }
        }
    },
})