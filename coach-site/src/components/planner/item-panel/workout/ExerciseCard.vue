<template>
    <div class="exercise-card"
         @click="$emit('selectExercise', exercise.idWorkoutExercise)">
        <div class="d-flex flex-row flex-grow-1 justify-content-between position-relative">
            <div class="d-flex flex-row overflow-hidden">
                <span class="image flex-shrink-0"></span>
                <div class="label d-flex flex-column">
                    <span class="name">{{ exercise.name }}</span>
                    <div class="d-flex flex-row">
                        <span class="set-count">
                              {{ setCount }} Sets
                        </span>
                    </div>
                </div>
            </div>
            <button class="btn btn-sm me-4" type="button"
                    @click.prevent.stop="setActive">Set</button>
            <div class="button-group d-flex flex-column">
                <img class="icon-button" 
                     src='/icon/delete-button.png' width="16" height="16"
                        @click.stop="removeExercise"/>
            </div>
        </div>
    </div>
</template>

<script>
import { useAppStore } from '@/store/appStore';
import { useWorkoutStore } from '@/store/workoutStore';

export default {
    name: '',
    components: {  },
    props: {
        exercise: Object
    },
    data: function () {
        return {
            appStore: undefined,
            workoutStore: null,
        }
    },
    created: function() {
        this.appStore = useAppStore();
        this.workoutStore = useWorkoutStore();
    },
    computed: {
        setCount() {
            let setCount = this.exercise.sets.length;
            let compledCount = this.exercise.sets.filter(x => x.iteration && x.iteration.completedAt).length;
            return `${compledCount}/${setCount}`;
        },
    },
    methods: {
        setActive() {
            this.appStore.setActiveExercise(this.exercise.idWorkoutExercise);
        },
        removeExercise() {
            this.workoutStore.removeExerciseFromWorkout(this.exercise.idWorkoutExercise);
        }
    },
}

</script>

<style scoped>
.exercise-card {
    /* background-color: #D8D8D8; */
    min-height: 60px;
    padding: 8px 12px;
    /* padding-right: 0px; */
    cursor: default;
}

.exercise-card:hover {
    background-color: #F5F5F5;
}

.exercise-card.complete {
    opacity: .6;
}

.image {
    width: 40px;
    height: 40px;
    background-color: #E25555;
}

.label {
    margin: auto 0 auto 6px;
    text-align: start;
    overflow: hidden;
}

.name {
    font-size: 14px;
    line-height: 22px;
    white-space: nowrap;
    text-overflow: ellipsis;
    /* width: 203px; */
}

.set-count {
    font-size: 12px;
    line-height: 14px;
}

.button-group {
    width: 16px;
    z-index: 5;
    position: absolute;
    right: 0px;
    background-color: #D8D8D8;
    margin-top: 4px;
    visibility: hidden;
}

.exercise-card:hover .button-group {
    visibility: visible;
}
</style>