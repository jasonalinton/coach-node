<template>
    <div class="d-flex flex-column flex-grow-1 overflow-scroll"
         ref="scrollContainer" @scroll="onScroll">
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
                <div v-if="loadingMore" class="d-flex justify-content-center py-2">
                    <SpinningLoader />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useAppStore } from '@/store/appStore'
import WorkoutItem from './WorkoutItem.vue';
import WorkoutForm from './WorkoutForm.vue';
import WorkoutActive from './WorkoutActive.vue';
import SpinningLoader from '@/components/loader/SpinningLoader.vue';
import { sortDesc, sortAsc } from '../../../../../utility.js';

export default {
    name: 'WorkoutList',
    components: { WorkoutItem, WorkoutForm, WorkoutActive, SpinningLoader },
    data: function () {
        return {
            appStore: undefined,
            workoutStore: undefined,
            selectedPanel: "list",
            selectedWorkoutID: undefined,
            loadingMore: false,
            hasMoreRecents: true,
            recentsBatchSize: 10,
            scrollThreshold: 200
        };
    },
    created: async function () {
        this.appStore = useAppStore();
        let workoutStore = await import(`@/store/workoutStore`);
        this.workoutStore = workoutStore.useWorkoutStore();
        this.$nextTick(() => this.maybeLoadMore());
    },
    mounted: function () {
        this.$nextTick(() => this.maybeLoadMore());
    },
    watch: {
        'recents.length'() {
            this.$nextTick(() => this.maybeLoadMore());
        }
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
            let templates = this.workouts.filter(x => x.isTemplate);
            let sorted = sortAsc(sortDesc(templates), 'position');
            return sorted;
        },
        recents() {
            let recents = this.workouts.filter(x => x.iteration && x.iteration.startAt);
            recents.sort((a, b) => new Date(b.iteration.startAt) - new Date(a.iteration.startAt)); // sort desc
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
            this.appStore.selectWorkoutView("workoutForm");
        },
        selectWorkout(id) {
            this.appStore.selectWorkout(id);
        },
        back() {
            this.appStore.onBackWorkoutPanel();
        },
        onScroll() {
            let el = this.$refs.scrollContainer;
            if (!el) return;
            if (el.scrollTop + el.clientHeight >= el.scrollHeight - this.scrollThreshold) {
                this.loadMoreRecents();
            }
        },
        async loadMoreRecents() {
            if (this.loadingMore || !this.hasMoreRecents) return;
            if (!this.workoutStore) return; // created() still awaiting the store import

            let before = this.workoutStore.loadedRange.startAt;
            if (!before) return; // fill() hasn't seeded loadedRange yet

            this.loadingMore = true;
            try {
                let count = this.recentsBatchSize;
                let batch = await this.workoutStore.getWorkoutsCount(before, count);
                let after = this.workoutStore.loadedRange.startAt;
                // Stop on a short/empty page, or if the cursor didn't move (loop guard).
                if (!batch || batch.length < count || +after === +before) {
                    this.hasMoreRecents = false;
                }
            } finally {
                this.loadingMore = false;
            }

            this.$nextTick(() => this.maybeLoadMore());
        },
        maybeLoadMore() {
            let el = this.$refs.scrollContainer;
            if (!el || el.offsetParent === null) return; // unmounted or display:none
            if (!this.hasMoreRecents || this.loadingMore) return;
            if (el.scrollHeight <= el.clientHeight + this.scrollThreshold) {
                this.loadMoreRecents();
            }
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