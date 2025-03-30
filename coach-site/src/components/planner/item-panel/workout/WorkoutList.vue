<template>
    <div class="d-flex flex-column flex-grow-1 overflow-scroll">
        <div class="workout-list d-flex flex-column flex-grow-1" :class="{ hide: selectedPanel != 'list'}">
            <div class="label d-flex flex-row mb-2">
                <img class="icon-button"
                        src='/icon/previous.png' width="20" height="20"
                        @click.prevent="back"/>
                <span>Workouts</span>
                <img class="icon-button" src="/icon/add-button.png" :width="20" :height="20" @click="createWorkout" />
            </div>
            <div v-if="actives.length > 0" class="d-flex flex-column">
                <span class="text-start mt-1">Active</span>
                <div class="d-flex flex-column">
                    <WorkoutItem v-for="workout in actives" :key="workout.id"
                                 :workout="workout"
                                 class="mb-2"
                                 @selectWorkout="selectWorkout($event.id)"></WorkoutItem>
                </div>
            </div>
            <span class="text-start mt-1">Templates</span>
            <div class="d-flex flex-column">
                <WorkoutItem v-for="workout in templates" :key="workout.id"
                             :workout="workout"
                             class="mb-2"
                             @selectWorkout="selectWorkout($event.id)"></WorkoutItem>
            </div>
            <span class="text-start mt-1">Recent</span>
            <div class="d-flex flex-column">
                <WorkoutItem v-for="workout in recents" :key="workout.id"
                             :workout="workout"
                             class="mb-2"
                             @selectWorkout="selectWorkout($event.id)"></WorkoutItem>
            </div>
        </div>
    </div>
</template>

<script>
import { useAppStore } from '@/store/appStore'
import WorkoutItem from './WorkoutItem.vue';
import WorkoutForm from './WorkoutForm.vue';
import WorkoutActive from './WorkoutActive.vue';

export default {
    name: 'WorkoutList',
    components: { WorkoutItem, WorkoutForm, WorkoutActive },
    data: function () {
        return {
            appStore: undefined,
            workoutStore: undefined,
            selectedPanel: "list",
            selectedWorkoutID: undefined
        };
    },
    created: async function () {
        this.appStore = useAppStore();
        let workoutStore = await import(`@/store/workoutStore`);
        this.workoutStore = workoutStore.useWorkoutStore();
    },
    computed: {
        workouts() {
            if (this.workoutStore) {
                let workouts = this.workoutStore.getWorkouts();
                return workouts;
            } else {
                return [];
            }
        },
        templates() {
            return this.workouts.filter(x => x.isTemplate);
        },
        recents() {
            let recents = this.workouts.filter(x => x.iteration && x.iteration.completedAt);
            recents.sort((a, b) => new Date(b.iteration.completedAt) - new Date(a.iteration.completedAt)); // sort desc
            return recents;
        },
        actives() {
            let actives = this.workouts.filter(x => x.iteration && x.iteration.startAt && !x.iteration.endAt);
            actives.sort((a, b) => new Date(b.iteration.startAt) - new Date(a.iteration.startAt)); // sort desc
            return actives;
        }
    },
    methods: {
        createWorkout() {
            this.selectedWorkoutID = -1;
            this.selectedPanel = "workoutForm";
        },
        selectWorkout(id) {
            this.appStore.selectWorkout(id);
        },
        back() {
            this.appStore.onBackWorkoutPanel();
        }
    }
}

</script>

<style scoped>
.workout-list {
    padding: 12px;
}

.hide {
    display: none !important;
}

.label {
    font-size: 14px;
}
</style>