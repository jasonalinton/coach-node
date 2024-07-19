import { defineStore } from 'pinia'
import { getWorkoutInfo, getWorkouts, getExercises, 
    saveExercise, saveWorkout, copyAndStartWorkout, logSet, completeWorkout, repositionExercise } from '../api/workoutAPI'
import { replaceOrAddItem, removeItemByID, sortAsc } from '../../utility';
import { getSocketConnection } from './socket'

let initialized = false;

export const useWorkoutStore = defineStore('workout', {
    state: () => ({
        workouts: [],
        exercises: [],
        variations: [],
        muscleGroups: [],
        muscles: [],
        dragged: {
            exerciseID: undefined,
        },
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
        getWorkout(id) {
            return this.workouts.find(x => x.id == id);
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
        getVariation(id) {
            return this.variations.find(x => x.id == id);
        },
        getVariations() {
            return this.variations;
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
        async copyAndStartWorkout(workoutID) {
            let _this = this;
            return copyAndStartWorkout(workoutID)
                .then(workout => {
                    replaceOrAddItem(workout, _this.workouts);
                    return workout;
                });
        },
        async logSet(setID, completedAt) {
            return logSet(setID, completedAt);
        },
        async completeWorkout(workoutID, startAt, endAt, createEvent) {
            return completeWorkout(workoutID, startAt, endAt, createEvent);
        },
        async repositionExercise(workoutID, exerciseID, position) {
            repositionExercise(workoutID, exerciseID, position);
        },
        setDraggedProps(exerciseID) {
            this.dragged.exerciseID = exerciseID;
        },
        clearDraggedProps() {
            this.dragged.exerciseID = undefined;
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