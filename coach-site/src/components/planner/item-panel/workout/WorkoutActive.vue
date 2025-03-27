<template>
    <div class="workout-active d-flex flex-column">
        <div class="d-flex flex-column">
            <WorkoutSection v-for="section in sections" :key="section.id" :section="section"/>
        </div>
    </div>
</template>

<script>
import { useWorkoutStore } from '../../../../store/workoutStore';
import { clone } from '../../../../../utility';
import WorkoutSection from './WorkoutSection.vue';

export default {
    name: 'WorkoutActive',
    components: { WorkoutSection },
    props: {
        id: Number
    },
    data: function () {
        return {
            workoutStore: null,
        }
    },
    created: function() {
        this.workoutStore = useWorkoutStore();
    },
    computed: {
        workout() {
            if (this.workoutStore) {
                let workout = this.workoutStore.getWorkout(this.id);
                return clone(workout);
            }
            return undefined;
        },
        sections() {
            if (this.workout) {
                return this.workout.sections;
            }
            return [];
        }
        // sections() {
        //     if (this.workout) {
        //         let sections = [];
        //         this.workout.exercises.forEach(exercise => {
        //             let section = undefined;
        //             let index = sections.findIndex(x => x.id == exercise.idWorkoutSection);
        //             if (index == -1) {
        //                 section 
        //             }
        //         });
        //     }

        //     var sections = new List<WorkoutSection>();
        //     foreach (var exercise in exercises)
        //     {
        //         var section = sections.FirstOrDefault(x => x.ID == exercise.IdWorkoutSection);
        //         if (section == null)
        //         {
        //             section = new WorkoutSection(exercise.IdWorkoutSection);
        //             sections.Add(section);
        //         }
        //         section.Exercises.Add(exercise);
        //     }
        //     return sections;
        // }
    },
    methods: {
        
    },
}

</script>

<style scoped>

</style>